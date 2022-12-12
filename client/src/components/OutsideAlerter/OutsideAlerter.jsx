import { useRef, useEffect } from "react";
import PropTypes from "prop-types";

function OutsideAlerter({ onOutsideClick, children }) {
	/* ---- States ---------------------------------- */
	const containerRef = useRef();

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		const handleOutsideClick = event => {
			if (containerRef.current && !containerRef.current.contains(event.target)) {
				if (onOutsideClick) {
					onOutsideClick(event);
				}
			}
		};

		document.addEventListener("click", handleOutsideClick);
		return () => { document.removeEventListener("click", handleOutsideClick); };
	}, [onOutsideClick]);

	/* ---- Page content ---------------------------- */
	return (
		<div ref={containerRef} className="outside-alerter">
			{children}
		</div>
	);
}
OutsideAlerter.propTypes = {
	onOutsideClick: PropTypes.func,
	children: PropTypes.node
};

export default OutsideAlerter;
