import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProgressiveSections, ProgressiveSectionsProvider } from "../../contexts/ProgressiveSectionsContext";
import useTicketsMarket from "../../hooks/market/useTicketsMarket.js";
import useCardsWallet from "../../hooks/wallet/useCardsWallet.js";
import ProgressiveSection from "../../components/ProgressiveSection/ProgressiveSection.jsx";
import Buttons from "../../components/Buttons";
import Card from "../../components/Card/Card.jsx";
import Map from "../../components/Map/Map.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import "./TravelPlanner.css";

function DynamicSections() {
	/* ---- Contexts -------------------------------- */
	const progressiveSections = useProgressiveSections();
	const ticketsMarket = useTicketsMarket({ onTicketBought: progressiveSections.nextStep });
	const cardsWallet = useCardsWallet();
	const navigate = useNavigate();

	/* ---- States ---------------------------------- */
	const [travelTypes, setTravelTypes] = useState(/** @type {Array<string>} */ []);
	const [points, setPoints] = useState(/** @type {Array<Array<number>>} */ []);
	const [distance, setDistance] = useState(/** @type {string} */ "");
	const usedCard = useMemo(() => {
		if (cardsWallet?.cards) {
			return cardsWallet.cards.slice().sort((a, b) => b.discountPercent - a.discountPercent).shift() ?? null;
		} else return null;
	}, [cardsWallet]);

	/* ---- Functions ------------------------------- */
	const handleTypesChange = types => { setTravelTypes(types); };

	const handlePointsChange = (points, distance) => {
		setPoints(points.map(pt => ({ lat: Math.round(pt[1] * 1_000_000), long: Math.round(pt[0] * 1_000_000) })));
		setDistance(distance ?? "");
	};

	const calcTicketPrice = () => { ticketsMarket.requestPrice(travelTypes, points, (usedCard?.cardId ?? -1)).catch(console.error); };
	const buyTicket = () => { ticketsMarket.buy().catch(console.error); };

	/* ---- Page content ---------------------------- */
	return (
		<div className="travel-dynamic-sections">
			<ProgressiveSection idx={0} title="Sélectionnez votre moyen de transport :" inline>
				<Buttons.MultipleButton onChange={handleTypesChange}>
					<Buttons.SubButton label="Bus" value="bus"/>
					<Buttons.SubButton label="Métro" value="subway"/>
					<Buttons.SubButton label="Train" value="train"/>
				</Buttons.MultipleButton>

				<button onClick={progressiveSections.nextStep} disabled={!travelTypes.length}>
					<FontAwesomeIcon icon={solid("check")}/>
				</button>
			</ProgressiveSection>

			<ProgressiveSection idx={1} title="Tracez votre route (et marchez à l'ombre svp) :">
				<div className="travel-map">
					<Map onPointsChange={handlePointsChange}/>
				</div>

				<div className="travel-data">
					<h3>Votre voyage</h3>

					<div className="travel-data-content">
						<p>{points.length ? (<>&Eacute;tapes : {points.length}</>) : "Cliquez sur la carte afin d'ajouter une étape."}</p>
						<p>Distance : {distance}</p>
						{ usedCard && (
							<>
								<p>Carte de r&eacute;duction utilis&eacute;e :</p>
								<Card id={usedCard.cardId} {...usedCard}/>
							</>
						)}
					</div>

					<div className="travel-actions">
						<button onClick={calcTicketPrice} disabled={points.length < 2}>Calculer le prix</button>

						<div className={`travel-price ${ticketsMarket.currentPrice ? "shown" : "hidden"}`}>
							<p>Votre voyage est estim&eacute; &agrave; <span className="emphasis">{ticketsMarket.currentPrice} ETH</span>.</p>
							<button onClick={buyTicket} disabled={!ticketsMarket.currentPrice}>Acheter un ticket</button>
						</div>
					</div>
				</div>
			</ProgressiveSection>

			<ProgressiveSection idx={2} title="Faites vos valises !">
				<button onClick={() => navigate(0)}>Acheter un autre ticket</button>
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
