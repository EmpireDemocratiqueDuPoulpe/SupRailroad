import { useState, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import ReactMap, { FullscreenControl, NavigationControl, ScaleControl, Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";

// eslint-disable-next-line no-undef
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_GL_KEY_MOVE_TO_DYNAMIC_PLACEHOLDER || null;

function Map() {
	/* ---- States ---------------------------------- */
	const mapRef = useRef(null);
	const [markers, setMarkers] = useState([]);

	/* ---- Functions ------------------------------- */
	const onMapLoad = useCallback(() => {
		// Change the map language
		mapRef.current.getMap().setLayoutProperty("country-label", "text-field", [
			"format",
			["get", "name"],
			{ "font-scale": 1.2 },
			"\n",
			{},
			["get", "name_en"],
			{ "font-scale": 0.8, "text-font": ["literal", ["DIN Offc Pro Italic", "Arial Unicode MS Regular"]] }
		]);
	}, []);

	const onMapClick = useCallback(event => {
		if (markers.length < 2) {
			setMarkers(prevState => [...prevState, { lat: event.lngLat.lat, long: event.lngLat.lng }]);
		}
	}, [markers]);

	const onMarkerClick = useCallback((event, id) => {
		setMarkers(prevState => prevState.map((marker, markerIdx) => ((markerIdx !== id) || marker.dragged) ? ({ ...marker, dragged: false }) : null).filter(Boolean));
		event.originalEvent.stopPropagation();
	}, []);

	const onMarkerDragEnd = useCallback((event, id) => {
		setMarkers(prevState => prevState.map((marker, markerIdx) => (markerIdx !== id) ? marker : ({ ...marker, lat: event.lngLat.lat, long: event.lngLat.lng, dragged: true })));
	}, []);

	/* ---- Page content ---------------------------- */
	return (
		<div className="map">
			{mapboxgl.accessToken ? (
				<>
					{mapboxgl.supported() ? (
						<ReactMap ref={mapRef} mapStyle="mapbox://styles/mapbox/streets-v12" onLoad={onMapLoad} onClick={onMapClick}>
							<FullscreenControl position="top-right"/>
							<NavigationControl position="top-right" showCompass={true} showZoom={true} visualizePitch={true}/>
							<ScaleControl position="bottom-left" unit="metric"/>

							{markers.map((marker, idx) => (
								<Marker key={`map-marker-${idx}`} latitude={marker.lat} longitude={marker.long} draggable={true} clickTolerance={0} onClick={e => onMarkerClick(e, idx)} onDragEnd={e => onMarkerDragEnd(e, idx)}/>
							))}
						</ReactMap>
					) : <p>La carte ne peut pas être affichée : votre navigateur n&apos;est pas compatible.</p>}
				</>
			) : <p>La carte ne peut pas être affichée : jeton manquant.</p>}
		</div>
	);
}

export default Map;
