/**
 * Functions related to the geographic coordinate system (GCS).
 * @module lib/geoStuff
 * @author Alexis L. <alexis.lecomte@supinfo.com>
 */

/*** Typedefs *********************************************************************************************************/
/**
 * @typedef {Object} GCSPoint
 * @property {number} lat - Latitude (before conversion)
 * @property {number} long - Longitude (before conversion)
 */

/**
 * @typedef {Object} FittedGCSPoint
 * @property {number} lat - Latitude (after conversion)
 * @property {number} long - Longitude (after conversion)
 */

/*** Functions ********************************************************************************************************/
/**
 * Calculates the ticket price using the distance between two GCS points. This function use the Haversine formula, which
 * is not perfect. It can induce small calculation error but stays pretty good to be used in this context. The distance
 * doesn't take into account roads, railroads, airports, ...
 * @function
 *
 * @param {GCSPoint} origin - Origin of the trip.
 * @param {GCSPoint} destination - Destination of the trip.
 * @param {number} standardPrice - Price per km.
 * @return {number} - The calculated price.
 */
export function calculatePrice(origin, destination, standardPrice) {
	const ptA = convertPosition(origin);
	const ptB = convertPosition(destination);

	// Distance calculation
	const R = 6371; // Earth radius in km
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

/**
 * Convert a `GCSPoint` to a `FittedGCSPoint`. Since Solidity cannot handle floats, the latitude and longitude are stored
 * as integers.
 * @function
 *
 * @param {GCSPoint} position - The GCS point to convert.
 * @return {FittedGCSPoint} - The converted GCS point.
 */
function convertPosition(position) {
	return { // The `position` object is read-only.
		lat: position.lat / 1_000_000,
		long: position.long / 1_000_000,
	};
}

/**
 * Converts degrees to radians.
 * @function
 *
 * @param {number} deg - Degrees.
 * @return {number} - Radians.
 */
function deg2rad(deg) {
	return deg * (Math.PI / 180);
}
