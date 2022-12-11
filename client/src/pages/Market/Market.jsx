import Web3 from "web3";
import { useEth } from "../../contexts/EthContext";
import useMarket from "../../hooks/market/useMarket.js";
import Loader from "../../components/Loader/Loader.jsx";
import MarketCard from "../../components/MarketCard/MarketCard.jsx";
//import "./Market.css";

function Market() {
	/* ---- Contexts -------------------------------- */
	const { state: { account } } = useEth();
	const cardMarket = useMarket();

	/* ---- Page content ---------------------------- */
	return (
		<div className="Page Marker-page">
			{!cardMarket ? <Loader/> : (
				<>
					<div className="collection-box">
						<h2 className="collection-title">Vente de cartes de r&eacute;duction</h2>
						{!cardMarket.onSaleCards.length ? <p className="empty-collection">Aucune carte en vente actuellement.</p> : (
							<div>
								{cardMarket.onSaleCards.map((card, idx) => <MarketCard key={`approved-card-${account}-${idx}`}
									id={card.cardId}
									name={card.name}
									description={card.description}
									price={Web3.utils.fromWei(card.price, "ether")}
									imageURI={card.imagePath}
									from={card.owner}
									discount={card.discountPercent}/>)}
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}

export default Market;
