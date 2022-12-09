import PropTypes from "prop-types";
import { useProgressiveSections } from "../../contexts/ProgressiveSectionsContext";
import "./ProgressiveSection.css";

function ProgressiveSection({ className, idx, title, inline, children }) {
	/* ---- Contexts -------------------------------- */
	const progressiveSections = useProgressiveSections();

	/* ---- Page content ---------------------------- */
	return (
		<div className={`progressive-sections section${inline ? " inlined" : ""} ${!progressiveSections.isStep(idx) ? "hidden" : "shown"} ${className ?? ""}`}>
			<h2 className="section-title"><span className="section-index">{idx + 1}.</span> {title}</h2>

			<div className="section-body">
				{children}
			</div>
		</div>
	);
}
ProgressiveSection.propTypes = {
	className: PropTypes.string,
	idx: PropTypes.number.isRequired,
	title: PropTypes.string.isRequired,
	inline: PropTypes.bool,
	children: PropTypes.node
};

export default ProgressiveSection;
