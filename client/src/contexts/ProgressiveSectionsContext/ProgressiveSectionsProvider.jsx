import { useState } from "react";
import ProgressiveSectionsContext from "./ProgressiveSectionsContext.js";
import PropTypes from "prop-types";

function ProgressiveSectionsProvider({ children }) {
	/* ---- States ---------------------------------- */
	const [step, setStep] = useState(/** @type {number} */ 0);

	/* ---- Functions ------------------------------- */
	const prevStep = () => setStep(Math.max((step - 1), 0));
	const nextStep = () => setStep(step + 1);
	const isStep = stepId => step === stepId;

	/* ---- Page content ---------------------------- */
	return (
		<ProgressiveSectionsContext.Provider value={{ prevStep, nextStep, isStep }}>
			{children}
		</ProgressiveSectionsContext.Provider>
	);
}
ProgressiveSectionsProvider.propTypes = {
	children: PropTypes.node
};

export default ProgressiveSectionsProvider;