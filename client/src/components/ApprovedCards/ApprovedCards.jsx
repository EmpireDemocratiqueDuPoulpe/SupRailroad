import PropTypes from "prop-types";
import "./ApprovedCards.css";

function ApprovedCards({ children }) {
	return (
		<div className="approved-cards">
			{children}
		</div>
	);
}
ApprovedCards.propTypes = {
	children: PropTypes.node
};

export { default as ApprovedCard } from "./ApprovedCard/ApprovedCard.jsx";
export default ApprovedCards;
