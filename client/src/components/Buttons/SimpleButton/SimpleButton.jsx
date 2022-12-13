import PropTypes from "prop-types";
import "./SimpleButton.css";

function SimpleButton({ className, onClick, centered, children, ...rest }) {
	/* ---- Page content ---------------------------- */
	return (
		<button {...rest} className={`button${centered ? " centered" : ""}${className ? ` ${className}` : ""}`} onClick={onClick}>
			<span>{children}</span>
		</button>
	);
}
SimpleButton.propTypes = {
	className: PropTypes.string,
	onClick: PropTypes.func,
	centered: PropTypes.bool,
	children: PropTypes.node,
};

export default SimpleButton;
