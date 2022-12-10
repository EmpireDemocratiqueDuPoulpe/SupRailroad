import { Link } from "react-router-dom";
import { useCRT } from "../../../contexts/CRTContext";
import { ReactComponent as Logo } from "../../../assets/images/logo.svg";
import { ReactComponent as LogoCRT } from "../../../assets/images/logo-crt.svg";
import "./AppLogo.css";

function AppLogo() {
	/* ---- Contexts -------------------------------- */
	const crt = useCRT();

	/* ---- Page content ---------------------------- */
	return (
		<Link className="app-logo" to="/">
			{crt.isEnabled ? <LogoCRT/> : <Logo/>}
		</Link>
	);
}

export default AppLogo;
