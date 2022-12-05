import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { useErrors } from "../../contexts/ErrorContext";
import { useEth } from "../../contexts/EthContext";

function useContractBalance(contract) {
	/* ---- Contexts -------------------------------- */
	const errors = useErrors();
	const { state: { account } } = useEth();

	/* ---- States ---------------------------------- */
	const [loaded, setLoaded] = useState(/** @type {boolean} */ false);
	const [balance, setBalance] = useState(/** @type {number} */ null);

	/* ---- Functions ------------------------------- */
	const getBalance = useCallback(async () => {
		try {
			if (contract) {
				setLoaded(false);
				return await contract.methods.getBalance().call({ from: account });
			}
		} catch (err) { errors.add(err, true); }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [contract, account]);

	const updateBalance = useCallback(async () => {
		const currBalance = await getBalance();

		if (currBalance) {
			setBalance(parseFloat(Web3.utils.fromWei(`${currBalance}`, "ether")));
		}

		setLoaded(true);
	}, [getBalance]);

	const transferBalance = async (address) => {
		try {
			if (contract) {
				return await contract.methods.transfer(address).send({ from: account }).then(updateBalance);
			}
		} catch (err) { errors.add(err, true); }
	};

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		updateBalance().catch(console.error);
	}, [updateBalance]);

	/* ---- Expose hook ----------------------------- */
	return { loaded, balance, transfert: transferBalance };
}

export default useContractBalance;
