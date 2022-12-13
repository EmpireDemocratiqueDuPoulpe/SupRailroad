import { useEth } from "../../../contexts/EthContext";
import { Link } from "react-router-dom";
import "./NavLinks.css";

function NavLinks() {
	/* ---- Contexts -------------------------------- */
	const { state: { isAdmin } } = useEth();

	/* ---- Page content ---------------------------- */
	return (
		<div className="nav-links">
			<Link to="/travel">Acheter un ticket</Link>
			<Link to="/market">March&eacute;</Link>
			{isAdmin && <Link to="/admin">Administration</Link>}
		</div>
	);
}

export default NavLinks;
