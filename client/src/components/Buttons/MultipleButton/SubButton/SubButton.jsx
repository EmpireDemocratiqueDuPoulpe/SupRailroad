import PropTypes from "prop-types";
import useButtonsManager from "../useButtonManager.js";
import { eventOnElement } from "../../../../helpers/accessibility.js";
import "./SubButton.css";

function SubButton({ label, value }) {
	/* ---- Context --------------------------------- */
	const buttonsManager = useButtonsManager();

	/* ---- Functions ------------------------------- */
	const handleClick = () => { buttonsManager.toggle(value); };

	/* ---- Page content ---------------------------- */
	return (
		<div className={`sub-button ${buttonsManager.has(value) ? "enabled" : "disabled"}`} {...eventOnElement(handleClick)}>
			{label ?? value}
		</div>
	);
}
SubButton.propTypes = {
	label: PropTypes.string,
	value: PropTypes.string.isRequired
};

export default SubButton;