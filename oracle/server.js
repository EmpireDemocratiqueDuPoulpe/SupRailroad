/**
 * The oracle of SupRailroad.
 * @module server
 * @author Alexis L. <alexis.lecomte@supinfo.com>
 */

import * as dotenv from "dotenv";
dotenv.config({ override: true, debug: false });

import "colors";
import Web3 from "web3";
import Queue from "./lib/Queue.js";
import { calculatePrice } from "./lib/geoStuff.js";
import TicketFactoryBuild from "./contracts/TicketFactory.json" assert {type: "json"};

/*** Functions - Events ***********************************************************************************************/
/**
 * Listen contract events.
 * @function
 *
 * @param {Web3} web3 - The Web3 instance.
 * @param {Queue} queue - The Queue instance.
 * @param {Contract} ticketContract - Ticket contract.
 */
function listenEvents(web3, queue, ticketContract) {
	// Listen for requested price calculation
	ticketContract.events.TicketPriceRequested((err, event) => {
		if (err) console.error(`An error occurred during an event: ${err}`.red);
		else queue.addRequest(event);
	});

	// Listen for received price calculation
	// eslint-disable-next-line no-unused-vars
	ticketContract.events.TicketPriceCalculated((err, _) => {
		if (err) console.error(`An error occurred during an event: ${err}`.red);
	});
}

/**
 * Triggerred when the process is closed normally. It calls the contract to advertise its retirement.
 * @function
 * @async
 *
 * @param {Queue} queue - The Queue instance.
 * @param {Contract} ticketContract - Ticket contract.
 * @return {Promise<void>}
 */
async function onClose(queue, ticketContract) {
	queue.stop();
	const retired = await retireOracle(ticketContract);

	if (retired) {
		console.log("The Oracle is no more. Oedipus would be happy.".grey);
		process.exit(0);
	}
}

/*** Functions - Queue management *************************************************************************************/
/**
 * Process a price request.
 * @function
 * @async
 *
 * @param {Request} request - The request.
 * @param {Contract} ticketContract - Ticket contract.
 * @return {Promise<void>}
 */
async function processRequest(request, ticketContract) {
	const standardPrice = await ticketContract.methods.getStandardPrice().call({ from: request.caller });
	const calculatedPrice = calculatePrice(request.data.points, standardPrice);

	try {
		await ticketContract.methods.sendCalculatedPrice(request.caller, request.requestId, `${calculatedPrice}`).send({ from: process.env.ACCOUNT });
		console.log(`Price calculated ${`(caller: "${request.caller}", requestId: ${request.requestId})`.grey}`);
	} catch (err) {
		console.error(`An error occurred during a request processing: ${err}`.red);
	}
}

/*** Functions - Misc. ************************************************************************************************/
/**
 * Estimates the gas prices of a contract methods.
 * @function
 * @async
 *
 * @example
 * const gasPrice = await estimateGas(myContract.methods.expensiveMethod(arg1, arg2));
 * // -> 127000
 *
 * @param {*} method - The contract method. See the example for more information.
 * @return {Promise<number>} - The estimated gas price.
 */
async function estimateGas(method) {
	return await method.estimateGas({from: process.env.ACCOUNT});
}

/*** Functions - Initialization ***************************************************************************************/
/**
 * Check if the environnement is populated with the required parameters.
 * @function
 *
 * @throws {Error} - Something is wrong with the environment.
 */
function checkEnv() {
	if (!process.env.ACCOUNT) {
		throw new Error("Missing account address in `process.env`!");
	}
}

/**
 * Load a contract using its build file.
 * @function
 * @async
 *
 * @param {Web3} web3 - The Web3 instance.
 * @param {Object} buildFile - The JSON build file as an Object.
 * @return {Contract}
 */
async function getContract(web3, buildFile) {
	const networkId = await web3.eth.net.getId();
	return new web3.eth.Contract(buildFile.abi, buildFile.networks[networkId].address);
}

/**
 * Send a message to the contract to announce that a new oracle is connected.
 * @function
 * @async
 *
 * @param {Web3} web3 - The Web3 instance.
 * @param {Contract} ticketContract - Ticket contract.
 */
async function announceOracle(web3, ticketContract) {
	try {
		const gasPrice = await estimateGas(ticketContract.methods.addOracle(process.env.ACCOUNT));
		await ticketContract.methods.addOracle(process.env.ACCOUNT).send({ from: process.env.ACCOUNT, gas: gasPrice });
		console.log("Announce done: this oracle is ready to work.".green);
	} catch (err) {
		console.error(`An error occurred during the oracle announcement: ${err}`.red);
		process.exit(0);
	}
}

/**
 * Send a message to the contract to announce that an oracle is not connected anymore.
 * @function
 * @async
 *
 * @param {Contract} ticketContract - Ticket contract.
 */
async function retireOracle(ticketContract) {
	try {
		await ticketContract.methods.removeOracle(process.env.ACCOUNT).send({ from: process.env.ACCOUNT });
		console.log("Retire done: this oracle is now free.".green);
		return true;
	} catch (err) {
		console.error(`An error occurred during the oracle retirement: ${err}`.red);
		return false;
	}
}

/**
 * Start the oracle.
 * @function
 * @async
 */
async function startOracle() {
	checkEnv();

	// Initialize Web3
	const web3 = new Web3(Web3.givenProvider || "ws://127.0.0.1:8545");
	web3.eth.net.isListening()
		.then(() => console.log("Successfully connected to the blockchain!".green))
		.catch(err => {
			console.error(`Something went wrong: ${err}`.red);
			process.exit(1);
		});

	// Load contracts
	const ticketContract = await getContract(web3, TicketFactoryBuild);

	// Announce oracle
	await announceOracle(web3, ticketContract);
	const queue = new Queue(processRequest);

	// Listen events
	listenEvents(web3, queue, ticketContract);

	// Initialize oracle events
	["SIGTERM", "SIGINT", "SIGBREAK", "SIGHUP"].forEach(sig => {
		process.on(sig, async () => { await onClose(queue, ticketContract); });
	});

	// Listen for contract events
	queue.start(ticketContract).catch(err => console.error(`${err}`.red));
}

startOracle().catch(err => console.error(`${err}`.red));
