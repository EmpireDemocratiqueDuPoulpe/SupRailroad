/**
 * Functions related to the geographic coordinate system (GCS).
 * @module lib/geoStuff
 * @author Alexis L. <alexis.lecomte@supinfo.com>
 */

import * as turf from "@turf/turf";
import constants from "./constants.js";

/*** Typedefs *********************************************************************************************************/
/**
 * @typedef {Object} GCSPoint
 * @property {number} lat - Latitude (before conversion)
 * @property {number} long - Longitude (before conversion)
 */

/**
 * @typedef {Object} PriceCalculation
 * @property {number} distance - Calculated distance of the travel.
 * @property {number} price - Estimated ticket price (in Wei).
 */

/*** Functions ********************************************************************************************************/
/**
 * Calculates the ticket price using the distance between two GCS points. This function use the Haversine formula, which
 * is not perfect. It can induce small calculation error but stays pretty good to be used in this context. The distance
 * doesn't take into account roads, railroads, airports, ...
 * @function
 *
 * @param {Array<GCSPoint>} points - Points of the trip.
 * @param {number} standardPrice - Price per km.
 * @return {PriceCalculation} - The calculated distance and price.
 */
export function calculatePrice(points, standardPrice) {
	const convertedPoints = convertPoints(points); // noinspection JSCheckFunctionSignatures
	const distance = turf.length(convertedPoints);

	// Price calculation
	return { distance, price: (standardPrice * distance) };
}

/**
 * Convert a list of `GCSPoint` to a `LineString`.
 * @function
 * @see convertSinglePoint
 *
 * @param {Array<GCSPoint>} points - The list of GCS points to convert.
 * @return {turf~Feature<turf~LineString, turf~Properties>} - The line string.
 */
function convertPoints(points) {
	return turf.lineString(points.map(convertSinglePoint));
}

/**
 * Convert a `GCSPoint` to an array of longitude and latitude. Since Solidity cannot handle floats, the latitude and
 * longitude was stored as integers and are converted to float.
 * @function
 *
 * @param {GCSPoint} point - The GCS point to convert.
 * @return {Array<number>} - The converted point.
 */
function convertSinglePoint(point) {
	return [(point.long / constants.FLOAT_FACTOR), (point.lat / constants.FLOAT_FACTOR)];
}
