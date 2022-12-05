import PropTypes from "prop-types";
import { eventOnElement } from "../../../helpers/accessibility.js";
import "./ErrorBox.css";

function ErrorBox({ id, code, message, onClose }) {
	/* ---- Functions ------------------------------- */
	const handleClose = () => { if (onClose) onClose(); };

	/* ---- Page content ---------------------------- */
	return (
		<div className="error-box" data-id={id}>
			<span className="error-message">{message}</span>

			<div className="error-bottom">
				{code && <span className="error-code">Erreur n°{code.toString()}</span>}
				<span className="error-close" {...eventOnElement(handleClose)}>Fermer</span>
			</div>
		</div>
	);
}
ErrorBox.propTypes = {
	id: PropTypes.number.isRequired,
	code: PropTypes.number,
	message: PropTypes.string.isRequired,
	onClose: PropTypes.func
};

export default ErrorBox;
