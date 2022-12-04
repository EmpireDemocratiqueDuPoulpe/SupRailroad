import { useState } from "react";
import PropTypes from "prop-types";

function NumberInput({ label, postLabel, step, value, onChange, disabled, ...rest }) {
	/* ---- States ---------------------------------- */
	const [editing] = useState(/** @type {boolean} */ false);

	/* ---- Functions ------------------------------- */
	const handleChange = event => { if (onChange) onChange(event.target.value); };

	/* ---- Page content ---------------------------- */
	return (
		<label className={`input number-input ${editing}`}>
			{label}
			<input {...rest} type="number" step={step} value={value} onChange={handleChange} disabled={disabled} readOnly={!editing}/>
			{postLabel}
		</label>
	);
}
NumberInput.propTypes = {
	label: PropTypes.string.isRequired,
	postLabel: PropTypes.string,
	step: PropTypes.number,
	value: PropTypes.string,
	onChange: PropTypes.func,
	disabled: PropTypes.bool
};
NumberInput.defaultProps = { step: 1, disabled: false };

export default NumberInput;
