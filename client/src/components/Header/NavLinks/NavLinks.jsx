import { Link } from "react-router-dom";
import "./NavLinks.css";

function NavLinks() {
	/* ---- Page content ---------------------------- */
	return (
		<div className="nav-links">
			<Link to="/travel">Acheter un ticket</Link>
			<Link to="/market">Cartes de r&eacute;duction</Link>
			<Link to="/admin">Administration</Link>
		</div>
	);
}

export default NavLinks;
