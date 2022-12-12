import PropTypes from "prop-types";

function Checkbox({ label, checked, readOnly, value, onChange, disabled, ...rest }) {
	/* ---- Functions ------------------------------- */
	const handleChange = event => { if (onChange) onChange(event.target.checked); };

	/* ---- Page content ---------------------------- */
	return (
		<label className="input checkbox-input">
			{label}
			<input {...rest} type="checkbox" checked={checked} readOnly={readOnly} value={value} onChange={handleChange} disabled={disabled}/>
		</label>
	);
}
Checkbox.propTypes = {
	label: PropTypes.string.isRequired,
	checked: PropTypes.bool,
	readOnly: PropTypes.bool,
	value: PropTypes.string,
	onChange: PropTypes.func,
	disabled: PropTypes.bool
};
Checkbox.defaultProps = { checked: false, readOnly: false, disabled: false };

export default Checkbox;
