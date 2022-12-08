import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ButtonManagerContext from "./ButtonManagerContext.js";
import "./MultipleButton.css";

function MultipleButton({ onChange, children }) {
	/* ---- States ---------------------------------- */
	const [value, setValue] = useState(/** @type {Array<string>} */ []);

	const toggleValue = val => hasValue(val) ? delValue(val) : addValue(val);
	const addValue = val => setValue(prevState => [...prevState, val]);
	const delValue = val => setValue(prevState => prevState.filter(v => v !== val));
	const hasValue = val => value.some(v => v === val);

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		if (onChange) {
			onChange(value);
		}
	}, [onChange, value]);

	/* ---- Page content ---------------------------- */
	return (
		<div className="button multiple-button" style={{ "--count": (children?.length ?? 0) }}>
			<ButtonManagerContext.Provider value={{ toggle: toggleValue, add: addValue, delete: delValue, has: hasValue }}>
				{children}
			</ButtonManagerContext.Provider>
		</div>
	);
}
MultipleButton.propTypes = {
	onChange: PropTypes.func,
	children: PropTypes.node
};

export default MultipleButton;