import PropTypes from "prop-types";
import "./Loader.css";

function Loader({ centered }) {
	/* ---- Page content ---------------------------- */
	return (
		<div className={`loader${centered ? " centered" : ""}`}>
			<div className="loader-track"/>
			<div className="loader-train"/>
		</div>
	);
}
Loader.propTypes = { centered: PropTypes.bool };
Loader.defaultProps = { centered: true };

export default Loader;
