import { useCallback } from "react";
import { useEth } from "../../../contexts/EthContext";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import "./UserAccount.css";

// Constants
const JAZZICON_DIAMETER = 100;

// Component
function UserAccount() {
	/* ---- Contexts -------------------------------- */
	const { state: { account, balance } } = useEth();

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

	/* ---- Page content ---------------------------- */
	return (
		<div className="user-account">
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
	);
}

export default UserAccount;
