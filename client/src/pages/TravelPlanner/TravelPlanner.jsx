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

	/* ---- Functions ------------------------------- */
	const handleTypesChange = types => { setTravelTypes(types); };

	const calcTicketPrice = async () => {
		tickets.requestPrice([{ lat: 48840056, long: 2361997 }, { lat: 49878677, long: 2280633 }, { lat: 50285914, long: 2785091 }]).catch(console.error);
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
				<Map/>
				<p>[&#123; lat: 48840056, long: 2361997 &#125;, &#123; lat: 49878677, long: 2280633 &#125;, &#123; lat: 50285914, long: 2785091 &#125;]</p>
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
