import { useState } from "react";
import PropTypes from "prop-types";
import Web3 from "web3";
import useCardsMarket from "../../../hooks/market/useCardsMarket.js";
import { eventOnElement } from "../../../helpers/accessibility.js";
import "./Card.css";

function Card({ id, name, description, discountPercent, approvedTo, price, imagePath }) {
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
							<p className="card-name card-info-line no-event" {...eventOnElement(killEvent)}>{name}</p>
							<p className="card-description card-info-line no-event" {...eventOnElement(killEvent)}>{description}</p>
							<p className="card-discount no-event" {...eventOnElement(killEvent)}>{discountPercent}%</p>
							<p className="card-price card-info-line no-event" {...eventOnElement(killEvent)}>Prix d&apos;achat : {Web3.utils.fromWei(price, "ether")} ETH</p>
						</div>

						{imagePath && <div className="card-image" style={{ backgroundImage: `url(${imagePath})` }}/>}
					</div>

					<div className="card-bottom"/>
				</div>

				<div className="card-back">
					<div className="card-back-content">
						{(approvedTo && !approvedTo.startsWith("0x0")) ? (
							<div className="card-approved-to">
								<p className="no-event" {...eventOnElement(killEvent)}>Carte approuv&eacute;e pour :</p>
								<p className="address no-event" {...eventOnElement(killEvent)}>{approvedTo}</p>
							</div>
						) : (
							<>
								<p className="card-approved-to-title no-event" {...eventOnElement(killEvent)}>Envoyer la carte à ...</p>

								<div className="card-approved-to-form">
									<input type="text" placeholder="Adresse de destination" value={approvedAddress} onChange={handleApprovedAddress} {...eventOnElement(killEvent)}/>
									<button onClick={confirmApproval} disabled={!approvedAddress}>&gt;</button>
								</div>
							</>
						)}
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
	imagePath: PropTypes.string,
};

export default Card;
