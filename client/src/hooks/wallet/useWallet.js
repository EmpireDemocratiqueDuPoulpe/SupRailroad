import { useState, useEffect } from "react";
import { useEth } from "../../contexts/EthContext";
import { getRPCError } from "../../helpers/errorHandling.js";

function useWallet() {
	/* ---- Contexts -------------------------------- */
	const { state: { account, contract } } = useEth();

	/* ---- States ---------------------------------- */
	const [wallet, setWallet] = useState(null);

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		const update = async () => {
			let wallet = null;

			if (contract) {
				try {
					wallet = await contract.methods.getWallet().call({ from: account });
				} catch (err) {
					const rpcErr = getRPCError(err);
					console.error(rpcErr.message);
				}
			}

			setWallet(wallet);
		};

		update().catch(console.error);
	}, [account, contract]);

	/* ---- Expose hook ----------------------------- */
	return wallet;
}

export default useWallet;
