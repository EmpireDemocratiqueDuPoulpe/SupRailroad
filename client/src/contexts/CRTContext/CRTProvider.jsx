import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CRTContext from "./CRTContext.js";
import { CRT_MODE_CLASS } from "./state.js";
import "./CRTProvider.css";

function CRTProvider({ enabled: defaultEnabled, children }) {
	/* ---- States ---------------------------------- */
	const [isEnabled, setEnabled] = useState(/** @type {boolean} */ defaultEnabled);

	/* ---- Functions ------------------------------- */
	const enable = () => { setEnabled(true); };
	const disable = () => { setEnabled(false); };
	const toggle = () => { isEnabled ? disable() : enable(); };

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		if (isEnabled) {
			document.body.classList.add(CRT_MODE_CLASS);
		} else {
			document.body.classList.remove(CRT_MODE_CLASS);
		}
	}, [isEnabled]);

	/* ---- Page content ---------------------------- */
	return (
		<CRTContext.Provider value={{ isEnabled, enable, disable, toggle }}>
			<div className={`crt ${isEnabled ? "enabled" : "disabled"} expand-all`}>
				{children}
			</div>
		</CRTContext.Provider>
	);
}
CRTProvider.propTypes = {
	enabled: PropTypes.bool,
	children: PropTypes.node
};
CRTProvider.defaultProps = { enabled: false };

export default CRTProvider;
