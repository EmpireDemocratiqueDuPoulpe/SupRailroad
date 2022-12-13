import { useState } from "react";
import PropTypes from "prop-types";
import useCardsMarket from "../../hooks/market/useCardsMarket.js";
import { eventOnElement } from "../../helpers/accessibility.js";
import "./Card.css";

function Card({ id, name, description, discountPercent, approvedTo, price, imageURI }) {
	/* ---- States ---------------------------------- */
	const cardsMarket = useCardsMarket();
	const [flipped, setFlipped] = useState(/** @type {boolean} */ false);
	const [approvedAddress, setApprovedAddress] = useState(/** @type {string} */ "");

	/* ---- Functions ------------------------------- */
	const showFront = () => setFlipped(false);
	const showBack = () => setFlipped(true);
	const flip = () => flipped ? showFront() : showBack();

	const killEvent = event => event.stopPropagation();

	const handleApprovedAddress = event => setApprovedAddress(event.target.value);
	const confirmApproval = event => {
		killEvent(event);
		cardsMarket.approve(approvedAddress, id).catch(console.error);
	};

	return (
		<div className={`card${flipped ? " flipped" : ""}`} {...eventOnElement(flip)}>
			<div className="card-inner">
				<div className="card-front">
					<div className="card-front-content">
						<div className="card-info">
							<p className="card-id card-info-line no-event" {...eventOnElement(killEvent)}>id: {id}</p>
							<p className="card-name card-info-line no-event" {...eventOnElement(killEvent)}>name: {name}</p>
							<p className="card-description card-info-line no-event" {...eventOnElement(killEvent)}>desc.: {description}</p>
							<p className="card-discount card-info-line no-event" {...eventOnElement(killEvent)}>discount: {discountPercent}</p>
							<p className="card-price card-info-line no-event" {...eventOnElement(killEvent)}>price: {price}</p>
							<p className="card-imageURI card-info-line no-event" {...eventOnElement(killEvent)}>image: {imageURI}</p>
						</div>
					</div>

					<div className="card-bottom"/>
				</div>

				<div className="card-back">
					<div className="card-back-content">
						<input type="text" placeholder="Adresse de destination" value={approvedAddress} onChange={handleApprovedAddress} {...eventOnElement(killEvent)}/>
						<button onClick={confirmApproval}>&gt;</button>
						<p className="card-approved-to card-info-line no-event" {...eventOnElement(killEvent)}>approvedTo: {approvedTo}</p>
					</div>

					<div className="card-bottom"/>
				</div>
			</div>
		</div>
	);
}
Card.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	description: PropTypes.string,
	discountPercent: PropTypes.string.isRequired,
	approvedTo: PropTypes.string,
	price: PropTypes.string.isRequired,
	imageURI: PropTypes.string,
};

export default Card;
