import { useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { eventOnElement } from "../../../helpers/accessibility.js";
import "./MessageBox.css";

function MessageBox({ id, code, message, type, ttl, onClose }) {
	/* ---- Functions ------------------------------- */
	const handleClose = useCallback(() => { if (onClose) onClose(); }, [onClose]);

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		let timeout;
		if (ttl) {
			timeout = setTimeout(() => handleClose(), ttl);
		}

		return () => {
			if (timeout) {
				clearTimeout(timeout);
			}
		};
	}, [handleClose, ttl]);

	/* ---- Page content ---------------------------- */
	return (
		<div className={`message-box ${type}`} data-id={id}>
			<span className="message-content">{message}</span>

			<div className="message-box-bottom">
				{code && <span className="message-code">Code n°{code.toString()}</span>}
				<span className="message-close" {...eventOnElement(handleClose)}>Fermer</span>
			</div>
		</div>
	);
}
MessageBox.propTypes = {
	id: PropTypes.number.isRequired,
	code: PropTypes.number,
	message: PropTypes.string.isRequired,
	type: PropTypes.oneOf(["error", "warn", "info", "success"]).isRequired,
	ttl: PropTypes.number,
	onClose: PropTypes.func
};

export default MessageBox;
