import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useEth } from "../../../contexts/EthContext";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { eventOnElement } from "../../../helpers/accessibility.js";
import "./UserAccount.css";

// Constants
const JAZZICON_DIAMETER = 100;

// Component
function UserAccount() {
	/* ---- Contexts -------------------------------- */
	const { state: { account, balance } } = useEth();

	/* ---- States ---------------------------------- */
	const [showMenu, setShowMenu] = useState(/** @type {boolean} */ false);

	/* ---- Functions ------------------------------- */
	const onIconLoad = useCallback(el => {
		if (el) {
			const svg = el.querySelector("svg");

			if (svg) {
				svg.setAttribute("viewBox", `0 0 ${JAZZICON_DIAMETER} ${JAZZICON_DIAMETER}`);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [account]);

	const openMenu = () => setShowMenu(true);
	const closeMenu = () => setShowMenu(false);
	const toggleMenu = () => showMenu ? closeMenu() : openMenu();

	/* ---- Page content ---------------------------- */
	return (
		<div className="user-account">
			<div className="user-account-wrapper" {...eventOnElement(toggleMenu)}>
				<div className="user-account-pic" ref={onIconLoad}>
					{account ? (
						<Jazzicon diameter={JAZZICON_DIAMETER} seed={jsNumberForAddress(account)} paperStyles={{ width: "100%", height: "100%" }} svgStyles={{ width: "100%", height: "100%" }}/>
					) : <div className="user-account-no-pic"/>}
				</div>


				<div className="user-account-info">
					<span className="user-account-status">{account ? "Connecté" : "Déconnecté"} <span className={`connected-dot ${account ? "connected" : "disconnected"}`}/></span>
					<span className="user-account-balance">{account ? `${balance} ETH` : ""}</span>
				</div>
			</div>

			<div className={`user-account-menu ${showMenu ? "shown" : "hidden"}`}>
				<ul className="user-account-menu-list">
					<li className="user-account-menu-item"><Link className="link" to="/wallet">Mon porte-feuille</Link></li>
				</ul>
			</div>
		</div>
	);
}

export default UserAccount;
