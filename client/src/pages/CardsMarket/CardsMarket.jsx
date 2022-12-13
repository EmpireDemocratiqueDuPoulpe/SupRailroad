import { useEth } from "../../contexts/EthContext";
import useCardsMarket from "../../hooks/market/useCardsMarket.js";
import Loader from "../../components/Loader/Loader.jsx";
import { MarketCard } from "../../components/Cards";
import "./CardsMarket.css";

function CardsMarket() {
	/* ---- Contexts -------------------------------- */
	const { state: { account } } = useEth();
	const cardsMarket = useCardsMarket();

	/* ---- Page content ---------------------------- */
	return (
		<div className="Page CardsMarket-page">
			{!cardsMarket.sellableCards ? <Loader/> : (
				<>
					<div className="market-section">
						<h2 className="market-section-title">Cartes de r&eacute;duction</h2>
						{!cardsMarket.sellableCards?.length ? <p className="market-section-no-item">Aucune carte en vente actuellement.</p> : (
							<div className="market-section-items">
								{cardsMarket.sellableCards.map((card, idx) => (
									<MarketCard key={`approved-card-${account}-${idx}`}
										id={card.cardId}
										name={card.name}
										description={card.description}
										price={card.price}
										imageURI={card.imagePath}
										from={card.owner}
										discount={card.discountPercent}/>
								))}
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}

export default CardsMarket;
