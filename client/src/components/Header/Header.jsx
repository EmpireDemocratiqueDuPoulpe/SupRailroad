import AppLogo from "./AppLogo/AppLogo.jsx";
import UserAccount from "./UserAccount/UserAccount.jsx";
import "./Header.css";

function Header() {
	/* ---- Page content ---------------------------- */
	return (
		<header>
			<AppLogo/>
			<UserAccount/>
		</header>
	);
}

export default Header;