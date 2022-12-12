import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useEth } from "../../contexts/EthContext";
import { QRCodeSVG } from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";
import { eventOnElement } from "../../helpers/accessibility.js";
import "./Ticket.css";

function Ticket({ id, name, types: typesArr, distance }) {
	/* ---- Contexts -------------------------------- */
	const { state: { account } } = useEth();

	/* ---- States ---------------------------------- */
	const [flipped, setFlipped] = useState(/** @type {boolean} */ false);
	const types = useMemo(() => {
		// Check every type of transport
		const typesBool = { bus: typesArr.includes("bus"), train: typesArr.includes("train"), subway: typesArr.includes("subway") };

		// Translate to an alt string
		const translations = { bus: "bus", train: "train", subway: "metro" };
		let altText = Object.entries(translations).map(([k, v]) => typesBool[k] ? v : null).filter(Boolean);

		if (altText.length > 1) {
			const lastPiece = altText.pop();
			altText = altText.join(", ") + " et " + lastPiece;
		} else { altText = altText.join(", "); }

		altText = `${altText}`;
		altText = altText[0].toUpperCase() + altText.slice(1);

		return { ...typesBool, altText };
	}, [typesArr]);

	/* ---- Functions ------------------------------- */
	const showFront = () => setFlipped(false);
	const showBack = () => setFlipped(true);
	const flip = () => flipped ? showFront() : showBack();

	const killEvent = event => event.stopPropagation();

	/* ---- Page content ---------------------------- */
	return (
		<div className={`ticket${flipped ? " flipped" : ""}`} {...eventOnElement(flip)}>
			<div className="ticket-inner">
				<div className="ticket-front">
					<div className="ticket-front-content">
						<div className="ticket-info">
							<p className="ticket-name ticket-info-line no-event" {...eventOnElement(killEvent)}>{name}</p>
							<p className="ticket-distance ticket-info-line no-event" {...eventOnElement(killEvent)}>{(parseInt(distance, 10) / 1_000_000).toFixed(2)} km</p>
						</div>

						<div className="ticket-types" title={types.altText}>
							{types.bus && <span className="ticket-type-item"><FontAwesomeIcon icon={solid("bus")}/></span>}
							{types.train && <span className="ticket-type-item"><FontAwesomeIcon icon={solid("train")}/></span>}
							{types.subway && <span className="ticket-type-item"><FontAwesomeIcon icon={solid("train-subway")}/></span>}
						</div>
					</div>

					<div className="ticket-bottom"/>
				</div>

				<div className="ticket-back">
					<div className="ticket-back-content">
						<div className="qr-code-box">
							{account && <QRCodeSVG className="qr-code" value={`${account}-${id}`} bgColor="#2F3B3E" fgColor="#FFFFFF"/>}
						</div>
					</div>

					<div className="ticket-bottom"/>
				</div>
			</div>
		</div>
	);
}
Ticket.propTypes = {
	id: PropTypes.number.isRequired,
	name: PropTypes.string.isRequired,
	types: PropTypes.arrayOf(
		PropTypes.oneOf(["bus", "train", "subway"])
	).isRequired,
	distance: PropTypes.string.isRequired,
};

export default Ticket;
