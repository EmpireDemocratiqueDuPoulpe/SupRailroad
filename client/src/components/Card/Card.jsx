import { useState } from "react";
import PropTypes from "prop-types";
import { eventOnElement } from "../../helpers/accessibility.js";
import "./Card.css";

function Card({ id, name, description, discount, price, imageURI, forSale }) {
	/* ---- States ---------------------------------- */
	const [flipped, setFlipped] = useState(/** @type {boolean} */ false);

	/* ---- Functions ------------------------------- */
	const showFront = () => setFlipped(false);
	const showBack = () => setFlipped(true);
	const flip = () => flipped ? showFront() : showBack();

	const killEvent = event => event.stopPropagation();

	return (
		<div className={`card${flipped ? " flipped" : ""}`} {...eventOnElement(flip)}>
			<div className="card-inner">
				<div className="card-front">
					<div className="card-front-content">
						<div className="card-info">
							<p className="card-id card-info-line no-event" {...eventOnElement(killEvent)}>id: {id}</p>
							<p className="card-name card-info-line no-event" {...eventOnElement(killEvent)}>name: {name}</p>
							<p className="card-description card-info-line no-event" {...eventOnElement(killEvent)}>desc.: {description}</p>
							<p className="card-discount card-info-line no-event" {...eventOnElement(killEvent)}>discount: {discount}</p>
							<p className="card-price card-info-line no-event" {...eventOnElement(killEvent)}>price: {price}</p>
							<p className="card-imageURI card-info-line no-event" {...eventOnElement(killEvent)}>image: {imageURI}</p>
							<p className="card-forSale card-info-line no-event" {...eventOnElement(killEvent)}>for sale?: {forSale ? "true" : "false"}</p>
						</div>
					</div>

					<div className="card-bottom"/>
				</div>

				<div className="card-back">
					<div className="card-back-content">
					</div>

					<div className="card-bottom"/>
				</div>
			</div>
		</div>
	);
}
Card.propTypes = {
	id: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
	description: PropTypes.string,
	discount: PropTypes.number.isRequired,
	price: PropTypes.number.isRequired,
	imageURI: PropTypes.string,
	forSale: PropTypes.bool
};

export default Card;
