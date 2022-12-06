import { useEffect } from "react";
import PropTypes from "prop-types";
import "./CRT.css";

const CRT_MODE_CLASS = "crt-mode";

function CRT({ enabled, children }) {
	useEffect(() => {
		if (enabled) {
			document.body.classList.add(CRT_MODE_CLASS);
		} else {
			document.body.classList.remove(CRT_MODE_CLASS);
		}
	}, [enabled]);

	return (
		<div className={`crt ${enabled ? "enabled" : "disabled"} expand-all`}>
			{children}
		</div>
	);
}
CRT.propTypes = {
	enabled: PropTypes.bool,
	children: PropTypes.node
};

export default CRT;
