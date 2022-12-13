import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { brands } from "@fortawesome/fontawesome-svg-core/import.macro";
import "./PayableButton.css";

function PayableButton({ className, onClick, centered, children, ...rest }) {
	/* ---- Page content ---------------------------- */
	return (
		<button {...rest} className={`button button-payable${centered ? " centered" : ""}${className ? ` ${className}` : ""}`} onClick={onClick}>
			<span>{children}</span>

			<FontAwesomeIcon className="button-icon" icon={brands("ethereum")}/>
		</button>
	);
}
PayableButton.propTypes = {
	className: PropTypes.string,
	onClick: PropTypes.func,
	centered: PropTypes.bool,
	children: PropTypes.node,
};

export default PayableButton;
