import AppLogo from "./AppLogo/AppLogo.jsx";
import NavLinks from "./NavLinks/NavLinks.jsx";
import UserAccount from "./UserAccount/UserAccount.jsx";
import "./Header.css";

function Header() {
	/* ---- Page content ---------------------------- */
	return (
		<header>
			<div className="no-overflow">
				<AppLogo/>
				<NavLinks/>
			</div>

			<UserAccount/>
		</header>
	);
}

export default Header;
