import { useState } from "react";
import { useCRT } from "../../../contexts/CRTContext";
import { ReactComponent as Logo } from "../../../assets/images/logo.svg";
import { ReactComponent as LogoCRT } from "../../../assets/images/logo-crt.svg";
import { eventOnElement } from "../../../helpers/accessibility.js";
import "./AppLogo.css";

function AppLogo() {
	/* ---- Contexts -------------------------------- */
	const crt = useCRT();

	/* ---- States ---------------------------------- */
	const [hover, setHover] = useState(/** @type {boolean} */ false);

	/* ---- Functions ------------------------------- */
	const handleClick = () => crt.toggle();

	/* ---- Page content ---------------------------- */
	return (
		<div className="app-logo" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} {...eventOnElement(handleClick)}>
			{(crt.isEnabled || hover) ? <LogoCRT/> : <Logo/>}
		</div>
	);
}

export default AppLogo;
