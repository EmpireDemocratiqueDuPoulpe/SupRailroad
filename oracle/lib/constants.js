/**
 * Constants, as the file name says. 🧠
 * @module lib/constants
 * @author Alexis L. <alexis.lecomte@supinfo.com>
 * @exports {Constants}
 */

/*** Typedefs *********************************************************************************************************/
/**
 * @typedef {Object} Constants
 * @property {number} SLEEP_INTERVAL - Interval between queue processing.
 * @property {number} CHUNK_SIZE - How many requests are addressed per queue processing.
 * @property {number} FLOAT_FACTOR - Factor used to convert number and float to an acceptable format for Solidity.
 */

/*** Export ***********************************************************************************************************/
export default Object.freeze({
	SLEEP_INTERVAL: process.env.SLEEP_INTERVAL ? parseInt(process.env.SLEEP_INTERVAL, 10) : 1000,
	CHUNK_SIZE: process.env.CHUNK_SIZE ? parseInt(process.env.CHUNK_SIZE, 10) : 10,
	FLOAT_FACTOR: 1_000_000,
});
