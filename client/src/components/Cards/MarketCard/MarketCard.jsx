import { useMemo } from "react";
import PropTypes from "prop-types";
import Web3 from "web3";
import useCardsMarket from "../../../hooks/market/useCardsMarket.js";
import { PayableButton } from "../../Buttons";

import "./MarketCard.css";

// eslint-disable-next-line no-unused-vars
function MarketCard({ id, name, description, discount, price, imageURI }) {
	/* ---- States ---------------------------------- */
	const cardsMarket = useCardsMarket(false);
	const weiToPrice = useMemo(() => Web3.utils.fromWei(price, "ether"), [price]);

	/* ---- Functions ------------------------------- */
	const buyCard = () => cardsMarket.buy(id, weiToPrice).catch(console.error);

	/* ---- Page content ---------------------------- */
	return (
		<div className={`market-card${imageURI ? " with-image" : ""}`}>
			{imageURI && <div className="market-card-image" style={{ backgroundImage: `url(${imageURI})` }}/>}

			<div className="market-card-info">
				<p className="market-card-name market-card-info-line">{name}</p>
				<p className="market-card-description market-card-info-line">{description}</p>
				<p className="market-card-discount market-card-info-line">{discount}%</p>
			</div>

			<PayableButton className="market-card-buy-btn" onClick={buyCard}>
				Acheter ({weiToPrice} ETH)
			</PayableButton>
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
