import PropTypes from "prop-types";

function ApprovedCards({ children }) {
	/* ---- Page content ---------------------------- */
	return (
		<div className="approved-cards">
			{children}
		</div>
	);
}
ApprovedCards.propTypes = { children: PropTypes.node };

export { default as ApprovedCard } from "./ApprovedCard/ApprovedCard.jsx";
export default ApprovedCards;
