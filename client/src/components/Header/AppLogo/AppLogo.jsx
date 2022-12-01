import { Link } from "react-router-dom";
import Logo from "../../../assets/images/logo.jpg";
import "./AppLogo.css";

function AppLogo() {
	/* ---- Page content ---------------------------- */
	return (
		<Link className="app-logo" to="/">
			<img src={Logo} alt="Logo"/>
		</Link>
	);
}

export default AppLogo;
