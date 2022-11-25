import { useEth } from "../../contexts/EthContext";

function UserAccount() {
	/* ---- Contexts -------------------------------- */
	const { state: { account, balance } } = useEth();

	/* ---- Page content ---------------------------- */
	return (
		<div className="user-account">
			{!account ? <p>Sélectionnez un compte ETH pour continuer</p> : (
				<p>Connecté avec [{account}]. Balance : {balance} ETH</p>
			)}
		</div>
	);
}

export default UserAccount;
