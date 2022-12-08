import { useState } from "react";
import { useProgressiveSections, ProgressiveSectionsProvider } from "../../contexts/ProgressiveSectionsContext";
import useTickets from "../../hooks/tickets/useTickets.js";
import ProgressiveSection from "../../components/ProgressiveSection/ProgressiveSection.jsx";
import Inputs from "../../components/Inputs";
import Map from "../../components/Map/Map.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

function DynamicSections() {
	/* ---- Contexts -------------------------------- */
	const progressiveSections = useProgressiveSections();
	const tickets = useTickets();

	/* ---- States ---------------------------------- */
	const [travelTypes, setTravelTypes] = useState(/** @type {Array<string>} */ []);
	const [points, setPoints] = useState(/** @type {Array<Array<number>>} */ []);
	const [distance, setDistance] = useState(/** @type {string} */ "");

	/* ---- Functions ------------------------------- */
	const handleTypesChange = types => { setTravelTypes(types); };

	const handlePointsChange = (points, distance) => {
		setPoints(points.map(pt => ({ lat: Math.round(pt[1] * 1_000_000), long: Math.round(pt[0] * 1_000_000) })));
		setDistance(distance ?? "");
	};

	const calcTicketPrice = async () => {
		console.log(points);
		tickets.requestPrice(points).catch(console.error);
	};

	const buyTicket = async () => {
		tickets.buy().catch(console.error);
	};

	/* ---- Page content ---------------------------- */
	return (
		<div className="travel-dynamic-sections">
			<ProgressiveSection idx={0} title="Sélectionnez votre moyen de transport :" inline>
				<Inputs.MultipleButton onChange={handleTypesChange}>
					<Inputs.SubButton label="Bus" value="bus"/>
					<Inputs.SubButton label="Métro" value="subway"/>
					<Inputs.SubButton label="Train" value="train"/>
				</Inputs.MultipleButton>

				<button onClick={() => progressiveSections.nextStep()} disabled={!travelTypes.length}>
					<FontAwesomeIcon icon={solid("check")}/>
				</button>
			</ProgressiveSection>

			<ProgressiveSection idx={1} title="Tracez votre route (et marchez à l'ombre svp) :">
				<Map onPointsChange={handlePointsChange}/>

				<p>&Eacute;tapes : {points.length}</p>
				<p>Distance : {distance}</p>
				<button onClick={calcTicketPrice}>Calculer le prix</button>
				<button onClick={buyTicket} disabled={!tickets.currentPrice}>
					Acheter un ticket {tickets.currentPrice && <>({tickets.currentPrice} ETH)</>}
				</button>
			</ProgressiveSection>

			<ProgressiveSection idx={2} title="Faites vos valises !">
			</ProgressiveSection>
		</div>
	);
}

function TravelPlanner() {
	/* ---- Page content ---------------------------- */
	return (
		<div className="Page TravelPlanner-page">
			<ProgressiveSectionsProvider>
				<DynamicSections/>
			</ProgressiveSectionsProvider>
		</div>
	);
}

export default TravelPlanner;
