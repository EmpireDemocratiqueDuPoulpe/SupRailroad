import PropTypes from "prop-types";
import useCardMarket from "../../hooks/market/useCardMarket.js";
import "./MarketCard.css";

// eslint-disable-next-line no-unused-vars
function MarketCard({ id, name, description, discount, price, imageURI }) {
	/* ---- States ---------------------------------- */
	const cardMarket = useCardMarket();
	const buyCard = () => { cardMarket.buy(price, id).catch(console.error); };

	/* ---- Functions ------------------------------- */


	return (
		<div className="market-card">
			<div className="market-card-info">
				<div className="market-card-text">
					<p className="market-card-name market-card-info-line">{name} - {id}</p>
					<p className="market-card-description market-card-info-line">{description}</p>
				</div>
				<div className="market-card-img-container" style={{backgroundImage: `url(${imageURI})`}}>
					<p className="market-card-discount market-card-info-line">{discount}%</p>
				</div>
			</div>
			<button className="market-card-buyButton market-card-info-line" onClick={buyCard}>Acheter: {price} ETH</button>
		</div>
	);
}
MarketCard.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	description: PropTypes.string,
	discount: PropTypes.string.isRequired,
	price: PropTypes.string.isRequired,
	imageURI: PropTypes.string
};

export default MarketCard;
