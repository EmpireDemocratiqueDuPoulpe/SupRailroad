import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { useEth } from "../../contexts/EthContext";

function useContractBalance(contract) {
	/* ---- Contexts -------------------------------- */
	const { state: { account } } = useEth();

	/* ---- States ---------------------------------- */
	const [loaded, setLoaded] = useState(/** @type {boolean} */ false);
	const [balance, setBalance] = useState(/** @type {number} */ null);

	/* ---- Functions ------------------------------- */
	const getBalance = useCallback(async () => {
		if (contract) {
			setLoaded(false);
			return await contract.methods.getBalance().call({ from: account });
		}
	}, [contract, account]);

	const updateBalance = useCallback(async () => {
		const currBalance = await getBalance();

		if (currBalance) {
			setBalance(parseFloat(Web3.utils.fromWei(`${currBalance}`, "ether")));
		}

		setLoaded(true);
	}, [getBalance]);

	const transferBalance = async (address) => {
		if (contract) {
			return await contract.methods.transfer(address).send({ from: account })
				.then(updateBalance);
		}
	};

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		updateBalance().catch(console.error);
	}, [updateBalance]);

	/* ---- Expose hook ----------------------------- */
	return { loaded, balance, transfert: transferBalance };
}

export default useContractBalance;
