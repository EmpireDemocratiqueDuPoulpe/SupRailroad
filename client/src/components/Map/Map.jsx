import { useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import * as turf from "@turf/turf";
import mapboxgl from "mapbox-gl";
import ReactMap, { FullscreenControl, NavigationControl, ScaleControl, Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";

/*****************************************************
 * Constants
 *****************************************************/

// eslint-disable-next-line no-undef
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_GL_KEY_MOVE_TO_DYNAMIC_PLACEHOLDER || null;

const initialView = { latitude: 47, longitude: 2, zoom: 4.5 };

const lineString = {
	type: "Feature",
	geometry: { type: "LineString", coordinates: [] }
};

/*****************************************************
 * Functions
 *****************************************************/

function lineDistance(line) {
	const format = distance => `${distance} km`;
	return line ? format(turf.length(line).toLocaleString()) : format(0);
}

/*****************************************************
 * Map
 *****************************************************/

function Map({ onPointsChange }) {
	/* ---- States ---------------------------------- */
	const mapRef = useRef(null);
	const [geoJSON, setGeoJSON] = useState({ type: "FeatureCollection", features: [] });

	/* ---- Functions ------------------------------- */
	const handlePointChange = useCallback((points, distance) => {
		if (onPointsChange) {
			onPointsChange(points, distance ?? lineDistance(null));
		}
	}, [onPointsChange]);

	const onMapLoad = useCallback(() => {
		const mapInstance = mapRef.current.getMap();

		// Change the map language
		mapInstance.setLayoutProperty("country-label", "text-field", [
			"format",
			[ "get", "name" ], { "font-scale": 1.2 },
			"\n", {},
			[ "get", "name_en" ], { "font-scale": 0.8, "text-font": ["literal", ["DIN Offc Pro Italic", "Arial Unicode MS Regular"]] }
		]);

		handlePointChange([], null);
	}, [handlePointChange]);

	const onMapClick = useCallback(event => {
		const mapInstance = mapRef.current.getMap();
		const features = mapInstance.queryRenderedFeatures(event.point, { layers: ["measure-points"] });
		const currentGeoJSON = turf.clone(geoJSON);

		// Remove the line to redraw it
		if (currentGeoJSON.features.length > 1) currentGeoJSON.features.pop();

		if (features.length) { // Remove a point if clicked
			const id = features[0].properties.id;
			currentGeoJSON.features = currentGeoJSON.features.filter(pt => pt.properties.id !== id);
		} else { // Otherwise, add a point
			currentGeoJSON.features.push({
				type: "Feature",
				geometry: { type: "Point", coordinates: [event.lngLat.lng, event.lngLat.lat] },
				properties: { id: String(new Date().getTime()) }
			});
		}

		// Draw the line if there's enough points
		let distance = null;
		if (currentGeoJSON.features.length > 1) {
			lineString.geometry.coordinates = currentGeoJSON.features.map(pt => pt.geometry.coordinates);
			currentGeoJSON.features.push(lineString);
			distance = lineDistance(lineString);
		}

		// Update the geoJSON
		setGeoJSON(prevState => ({ ...prevState, ...currentGeoJSON }));

		// Notify the listener
		if (onPointsChange) {
			const points = currentGeoJSON.features.filter(f => f.geometry.type === "Point").map(f => f.geometry.coordinates);
			handlePointChange(points, distance);
		}
	}, [geoJSON, onPointsChange, handlePointChange]);

	/* ---- Page content ---------------------------- */
	return (
		<div className="map">
			{mapboxgl.accessToken ? (
				<>
					{mapboxgl.supported() ? (
						<ReactMap ref={mapRef} initialViewState={initialView} mapStyle="mapbox://styles/mapbox/streets-v12" onLoad={onMapLoad} onClick={onMapClick}>
							<FullscreenControl position="top-right"/>
							<NavigationControl position="top-right" showCompass={true} showZoom={true} visualizePitch={true}/>
							<ScaleControl position="bottom-left" unit="metric"/>

							{geoJSON && (
								<Source type="geojson" data={geoJSON}>
									<Layer id="measure-lines" type="line" source="geojson" layout={{ "line-cap": "round", "line-join": "round" }} paint={{ "line-color": "#000000", "line-width": 2.5 }}/>
									<Layer id="measure-points" type="circle" source="geojson" paint={{ "circle-radius": 5, "circle-color": "#000000" }} filter={[ "in", "$type", "Point" ]}/>
								</Source>
							)}
						</ReactMap>
					) : <p>La carte ne peut pas être affichée : votre navigateur n&apos;est pas compatible.</p>}
				</>
			) : <p>La carte ne peut pas être affichée : jeton manquant.</p>}
		</div>
	);
}
Map.propTypes = {
	onPointsChange: PropTypes.func
};

export default Map;
