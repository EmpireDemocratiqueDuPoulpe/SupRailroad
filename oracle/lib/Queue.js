/**
 * Handles the queue system of the oracle.
 * @module lib/Queue
 * @author Alexis L. <alexis.lecomte@supinfo.com>
 */

import constants from "./constants.js";

/*** Request **********************************************************************************************************/
/** Wrapper for request data. */
export class Request {

	/**
	 * Create a request data wrapper.
	 *
	 * @param {string} caller - Address of the account who send this request.
	 * @param {number} requestId - ID of the request.
	 * @param {Object} data - Additional data.
	 */
	constructor(caller, requestId, data) {
		this.caller = caller;
		this.requestId = requestId;
		this.data = data;
	}
}

/*** Queue ************************************************************************************************************/
/** Handles the queue system of the oracle. */
export default class Queue {
	/**
	 * The queue.
	 * @type {Array<Request>}
	 * @private
	 */
	#q = [];

	/**
	 * Create a queue.
	 *
	 * @param {function} onRequest - Handler when a request is being processed.
	 */
	constructor(onRequest) {
		this.onRequest = onRequest;
		this.running = false;
	}

	/**
	 * Add a request to the queue.
	 * @function
	 *
	 * @param {Object} event - Event object emitted by the Web3 listener.
	 */
	addRequest(event) {
		const { caller, requestId, ...rest } = event.returnValues;
		this.#q.push(new Request(caller, requestId, rest));
	}

	/**
	 * Start the queue processing.
	 * @function
	 * @async
	 *
	 * @param {*} args - Additional args passed down to the request handler.
	 * @return {Promise<void>}
	 */
	async start(args) {
		this.running = true;
		while (this.running) {
			await this.#processQueue(args);
			await this.#delay(constants.SLEEP_INTERVAL);
		}
	}

	/**
	 * Stop the queue processing.
	 * @function
	 */
	stop() {
		this.running = false;
	}

	/**
	 * Process the queue.
	 * @function
	 * @async
	 * @private
	 *
	 * @param {*} args - Additional args passed down to the request handler.
	 * @return {Promise<void>}
	 */
	async #processQueue(args) {
		for (let i = 0; (this.#q.length > 0) && (i < constants.CHUNK_SIZE); i++) {
			const request = this.#q.shift();
			await this.#processRequest(request, args);
		}
	}

	/**
	 * Process a request.
	 * @function
	 * @async
	 * @private
	 *
	 * @param {Request} request - The request.
	 * @param {*} args - Additional args passed down to the request handler.
	 * @return {Promise<void>}
	 */
	async #processRequest(request, args) {
		try {
			await this.onRequest(request, args);
		} catch (err) {
			console.error(`An error occurred during a request processing: ${err}`.red);
		}
	}

	/**
	 * Promise-based delay.
	 * @function
	 * @private
	 *
	 * @param {number} ms - Delay in milliseconds.
	 * @return {Promise<void>}
	 */
	#delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
}
