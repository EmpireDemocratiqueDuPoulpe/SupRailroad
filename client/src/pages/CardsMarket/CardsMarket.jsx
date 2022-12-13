import Web3 from "web3";
import { useEth } from "../../contexts/EthContext";
import useCardsMarket from "../../hooks/market/useCardsMarket.js";
import Loader from "../../components/Loader/Loader.jsx";
import { MarketCard } from "../../components/Cards";

function CardsMarket() {
	/* ---- Contexts -------------------------------- */
	const { state: { account } } = useEth();
	const cardsMarket = useCardsMarket();

	/* ---- Page content ---------------------------- */
	return (
		<div className="Page Marker-page">
			{!cardsMarket.sellableCards ? <Loader/> : (
				<>
					<div>
						<h2>Vente de cartes de r&eacute;duction</h2>
						{!cardsMarket.sellableCards?.length ? <p>Aucune carte en vente actuellement.</p> : (
							<div>
								{cardsMarket.sellableCards.map((card, idx) => (
									<MarketCard key={`approved-card-${account}-${idx}`}
										id={card.cardId}
										name={card.name}
										description={card.description}
										price={Web3.utils.fromWei(card.price, "ether")}
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
