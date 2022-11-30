import { Link } from "react-router-dom";

function NavLinks() {
	/* ---- Page content ---------------------------- */
	return (
		<div className="nav-links">
			<Link to="/travel">Acheter un ticket</Link>
			<Link to="/admin">Administration</Link>
		</div>
	);
}

export default NavLinks;
