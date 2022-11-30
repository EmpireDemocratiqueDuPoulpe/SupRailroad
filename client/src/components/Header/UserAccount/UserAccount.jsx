import { useEth } from "../../../contexts/EthContext";
import { Jazzicon } from "@ukstv/jazzicon-react";
import "./UserAccount.css";

function UserAccount() {
	/* ---- Contexts -------------------------------- */
	const { state: { account, balance } } = useEth();
    
	/* ---- Page content ---------------------------- */
	return (
		<div className="user-account">
			<div className="user-account-pic">
				{account ? <Jazzicon className="jazzicon" address={account}/> : <span className="user-account-no-pic"/>}
			</div>


			<div className="user-account-info">
				<span className="user-account-status">{account ? "Connecté" : "Déconnecté"} <span className={`connected-dot ${account ? "connected" : "disconnected"}`}/></span>
				<span className="user-account-balance">{account ? `${balance} ETH` : ""}</span>
			</div>
		</div>
	);
}

export default UserAccount;