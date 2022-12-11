import { useEth } from "../../contexts/EthContext";
import useMarket from "../../hooks/market/useMarket.js";
import Loader from "../../components/Loader/Loader.jsx";
import Card from "../../components/Card/Card.jsx";
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
								{cardMarket.onSaleCards.map((card, idx) => <Card key={`card-${account}-${idx}`} id={card.cardId} {...card}/>)}
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
}

export default Market;
