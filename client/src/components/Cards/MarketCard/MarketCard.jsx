import PropTypes from "prop-types";
import useCardsMarket from "../../../hooks/market/useCardsMarket.js";
import "./MarketCard.css";

// eslint-disable-next-line no-unused-vars
function MarketCard({ id, name, description, discount, price, imageURI }) {
	/* ---- States ---------------------------------- */
	const cardsMarket = useCardsMarket(false);

	/* ---- Functions ------------------------------- */
	const buyCard = () => cardsMarket.buy(id, price).catch(console.error);

	/* ---- Page content ---------------------------- */
	return (
		<div className={`market-card${imageURI ? " with-image" : ""}`}>
			{imageURI && <div className="market-card-image" style={{ backgroundImage: `url(${imageURI})` }}/>}

			<div className="market-card-info">
				<p className="market-card-name market-card-info-line">{name}</p>
				<p className="market-card-description market-card-info-line">{description}</p>
				<p className="market-card-discount market-card-info-line">{discount}%</p>
			</div>

			<button className="market-card-buy-btn" onClick={buyCard}>Acheter: {price} ETH</button>
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
