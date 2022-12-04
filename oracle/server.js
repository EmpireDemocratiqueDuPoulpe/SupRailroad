/**
 * The oracle of SupRailroad.
 * @module server
 * @author Alexis L. <alexis.lecomte@supinfo.com>
 */

import * as dotenv from "dotenv";
dotenv.config({ override: true, debug: false });

import "colors";
import Web3 from "web3";
import constants from "./lib/constants.js";
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
	// noinspection JSUnresolvedFunction
	ticketContract.events.TicketPriceRequested((err, event) => {
		if (err) console.error(`An error occurred during an event: ${err}`.red);
		else queue.addRequest(event);
	});

	// Listen for received price calculation
	// noinspection JSUnresolvedFunction
	ticketContract.events.TicketPriceCalculated((err/*, event*/) => {
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
 * @param {boolean} [forced = false] - Force close the oracle?
 * @return {Promise<void>}
 */
async function onClose(queue, ticketContract, forced = false) {
	queue.stop();
	const retired = await retireOracle(ticketContract, forced);

	if (retired) {
		console.log("The Oracle is no more. Oedipus would be happy.".grey);
		process.exit(0);
	}
}

/**
 * Triggerred when the process **must** be closed. This function should only be called when a fatal error occurs.
 * @function
 * @async
 *
 * @param {Queue} queue - The Queue instance.
 * @param {Contract} ticketContract - Ticket contract.
 * @param {Error} [err] - The error that cause the Oracle to stop working.
 * @return {Promise<void>}
 */
async function onForcedClose(queue, ticketContract, err) {
	console.error((err ? `${err}` : "The Oracle has been forced closed!").red);
	await onClose(queue, ticketContract, true);
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
	// Calculate the ticket price.
	// noinspection JSUnresolvedFunction
	const standardPrice = await ticketContract.methods.getStandardPrice().call({ from: request.caller });
	const { distance, price } = calculatePrice(request.data.points, standardPrice);

	try {
		// noinspection JSUnresolvedFunction
		await sendWithEstimatedGas(
			ticketContract.methods.setCalculatedPrice(request.requestId, request.caller, standardPrice, (distance * constants.FLOAT_FACTOR).toFixed(), `${price}`),
			{ from: process.env.ACCOUNT }
		);
		console.log(`Price calculated ${`(caller: "${request.caller}", requestId: ${request.requestId})`.grey}`);
	} catch (err) {
		console.error(`An error occurred during a request processing: ${err}`.red);
	}
}

/*** Functions - Misc. ************************************************************************************************/
/**
 * Estimates the gas price of a contract method.
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

/**
 * Estimates the gas price of a contract method and call it immediately.
 * @function
 * @async
 *
 * @example
 * try {
 *   await sendWithEstimatedGas(myContract.methods.expensiveMethod(arg1, arg2), { from: account });
 * } catch (err) {
 *   console.error(err);
 * }
 *
 *
 * @param {*} method - The contract method. See the example for more information.
 * @param {{ from: string, [gas]: number, [value]: number}} options - Send option. See `methods.myMethod.send` from the
 * web3 docs for more information.
 */
async function sendWithEstimatedGas(method, options) {
	const gasPrice = await estimateGas(method);
	await method.send({ ...options, gas: gasPrice });
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
		// noinspection JSUnresolvedFunction
		await sendWithEstimatedGas(ticketContract.methods.addOracle(process.env.ACCOUNT), { from: process.env.ACCOUNT });
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
 * @param {boolean} [forced = false] - Force close the oracle?
 */
async function retireOracle(ticketContract, forced = false) {
	try {
		// noinspection JSUnresolvedFunction
		await ticketContract.methods.removeOracle(process.env.ACCOUNT, forced).send({ from: process.env.ACCOUNT });
		console.log("Retire done: this oracle is now free.".green);
		return true;
	} catch (err) {
		console.error(`An error occurred during the oracle retirement: ${err}`.red);

		if (forced) process.exit(1);
		else return false;
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
	queue.start(ticketContract).catch(err => onForcedClose(queue, ticketContract, err));
}

startOracle().catch(err => console.error(`${err}`.red));
