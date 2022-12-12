import PropTypes from "prop-types";
import "./IconButton.css";

function IconButton({ type, children, ...rest }) {
	/* ---- Page content ---------------------------- */
	return (
		<div {...rest} className={`icon-button ${type}`}>
			{children}
		</div>
	);
}
IconButton.propTypes = {
	type: PropTypes.oneOf(["positive", "negative"]),
	children: PropTypes.node
};
IconButton.defaultProps = { type: "positive" };

export default IconButton;
