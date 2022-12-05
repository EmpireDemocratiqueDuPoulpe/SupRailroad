import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import EditButtons from "../EditButtons/EditButtons.jsx";

function NumberInput({ label, postLabel, step, defaultValue, onChange, disabled, ...rest }) {
	/* ---- States ---------------------------------- */
	const [value, setValue] = useState(/** @type {string} */ defaultValue || "");
	const [previousValue, setPreviousValue] = useState(/** @type {string} */ value);
	const [editing, setEditing] = useState(/** @type {boolean} */ false);

	/* ---- Functions ------------------------------- */
	const startEditing = () => {
		setPreviousValue(value);
		setEditing(true);
	};

	const stopSaveEditing = () => {
		setEditing(false);
		sendChange();
	};

	const stopEraseEditing = () => {
		setEditing(false);
		setValue(previousValue);
	};

	const handleChange = event => { setValue(event.target.value); };
	const sendChange = () => { if (onChange) onChange(value); };

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		if (!value && defaultValue) {
			setValue(defaultValue);
		}
	}, [value, defaultValue]);

	/* ---- Page content ---------------------------- */
	return (
		<label className={`input number-input${editing ? " editing" : ""}`}>
			{label}
			<input {...rest} type="number" step={step} value={value} onChange={handleChange} disabled={disabled} readOnly={!editing}/>
			{postLabel}

			<EditButtons editing={editing} onEdit={startEditing} onCloseSave={stopSaveEditing} onCloseErase={stopEraseEditing}/>
		</label>
	);
}
NumberInput.propTypes = {
	label: PropTypes.string.isRequired,
	postLabel: PropTypes.string,
	step: PropTypes.number,
	defaultValue: PropTypes.string,
	onChange: PropTypes.func,
	disabled: PropTypes.bool
};
NumberInput.defaultProps = { step: 1, defaultValue: "", disabled: false };

export default NumberInput;
