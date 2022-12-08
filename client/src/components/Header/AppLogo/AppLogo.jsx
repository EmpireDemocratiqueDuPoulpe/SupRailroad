import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../../../assets/images/logo.svg";
import "./AppLogo.css";

function AppLogo() {
	/* ---- Page content ---------------------------- */
	return (
		<Link className="app-logo" to="/">
			<Logo/>
		</Link>
	);
}

export default AppLogo;
