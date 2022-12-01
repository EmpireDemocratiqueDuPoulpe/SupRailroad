import { Link } from "react-router-dom";

function NavLinks() {
	/* ---- Page content ---------------------------- */
	return (
		<div className="nav-links">
			<Link className="link" to="/travel">Acheter un ticket</Link>
			<Link className="link" to="/admin">Administration</Link>
		</div>
	);
}

export default NavLinks;
