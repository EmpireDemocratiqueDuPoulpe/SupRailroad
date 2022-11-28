import Web3 from "web3";
import TicketFactoryBuild from "./contracts/TicketFactory.json" assert {type: "json"};

/*** Constants ********************************************************************************************************/
const SLEEP_INTERVAL = process.env.SLEEP_INTERVAL || 1000;
const CHUNK_SIZE = process.env.CHUNK_SIZE || 10;

/*** Functions - Queue management *************************************************************************************/
const queue = [];

function addRequest(event) {
	const { caller, requestId, origin, destination } = event.returnValues;
	queue.push({ caller, requestId, origin, destination });
}

async function processQueue(ticketContract) {
	for (let i = 0; (queue.length > 0) && (i < CHUNK_SIZE); i++) {
		const request = queue.shift();
		await processRequest(request, ticketContract);
	}
}

async function processRequest(request, ticketContract) {
	const standardPrice = await ticketContract.methods.getStandardPrice().call({ from: request.caller });
	const calculatedPrice = calculatePrice(request.origin, request.destination, standardPrice);

	try {
		// TODO: Change hard-coded address
		await ticketContract.methods.sendCalculatedPrice(request.caller, request.requestId, `${calculatedPrice}`).send({ from: "0x9cF106fea3E1d92Cc04b3F9C34DAb57a21F3828D" });
	} catch (err) {
		console.error(`An error occurred during a request processing: ${err}`);
	}
}


/*** Functions - Price calculation ************************************************************************************/
// Haversine formula
function calculatePrice(origin, destination, standardPrice) {
	const ptA = convertToFloat(origin);
	const ptB = convertToFloat(destination);

	// Distance calculation
	const R = 6371 // Earth radius in km
	const dLat = deg2rad(ptB.lat - ptA.lat);
	const dLong = deg2rad(ptB.long - ptA.long);

	const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(deg2rad(ptA.lat)) * Math.cos(deg2rad(ptB.lat)) *
			Math.sin(dLong / 2) * Math.sin(dLong / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c; // Distance in km

	// Price calculation
	return standardPrice * d;
}

function convertToFloat(position) {
	return { // The `position` object is read-only.
		lat: position.lat / 1_000_000,
		long: position.long / 1_000_000,
	};
}

function deg2rad(deg) {
	return deg * (Math.PI / 180);
}

/*** Functions - Initialization ***************************************************************************************/
async function getContract(web3, buildFile) {
	const networkId = await web3.eth.net.getId();
	return new web3.eth.Contract(buildFile.abi, buildFile.networks[networkId].address);
}

function listenEvents(web3, ticketContract) {
	// Listen for requested price calculation
	ticketContract.events.TicketPriceRequested((err, event) => {
		if (err) console.error(`An error occurred during an event: ${err}`);
		else addRequest(event);
	});

	// Listen for received price calculation
	ticketContract.events.TicketPriceCalculated((err, _) => {
		if (err) console.error(`An error occurred during an event: ${err}`);
	});
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function startOracle() {
	// Initialize Web3
	const web3 = new Web3(Web3.givenProvider || "ws://127.0.0.1:8545");
	web3.eth.net.isListening()
			.then(() => console.log("Successfully connected to the blockchain!"))
			.catch(err => {
				console.error(`Something went wrong: ${err}`);
				process.exit(1);
			});

	// Load contracts
	const ticketContract = await getContract(web3, TicketFactoryBuild);

	// Listen events
	listenEvents(web3, ticketContract);

	// Initialize oracle events
	process.on("SIGINT", () => {
		console.log("The Oracle is no more. Oedipus would be happy.");
		process.exit(0);
	});

	// Listen for contract events
	let running = true;
	while (running) {
		await processQueue(ticketContract);
		await delay(SLEEP_INTERVAL);
	}
}

startOracle().catch(console.error);
