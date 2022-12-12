import { useReducer, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import Web3 from "web3";
import EthContext from "./EthContext.js";
import { reducer, actions, initialState } from "./state.js";
import { useMessages } from "../MessageContext";

/**
 * @typedef {Object} artifact
 * @property {string} name
 * @property {Object} abi
 */

function EthProvider({ children }) {
	/* ---- Contexts -------------------------------- */
	const messages = useMessages();

	/* ---- States ---------------------------------- */
	const [state, dispatch] = useReducer(reducer, initialState, undefined);

	/* ---- Functions ------------------------------- */
	const init = useCallback(
		async artifacts => {
			if (artifacts) {
				const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
				const account = (await web3.eth.requestAccounts())[0];
				const balance = Web3.utils.fromWei((await web3.eth.getBalance(account)), "ether");
				const networkID = await web3.eth.net.getId();
				const contracts = {};

				for (const artifact of artifacts) {
					const { name, build } = artifact;

					try {
						const address = build.networks[networkID].address;
						contracts[name] = new web3.eth.Contract(build.abi, address);
					} catch (err) { console.error(err); }
				}

				let isAdmin = false;
				if (Object.prototype.hasOwnProperty.call(contracts, "ticketMarket")) {
					// noinspection JSUnresolvedVariable
					isAdmin = await contracts.ticketMarket.methods.isAdmin().call({ from: account });
				} else { messages.addError(new Error("Cannot check if the user is an administrator!")); }

				// noinspection JSCheckFunctionSignatures
				dispatch({
					type: actions.init,
					data: { artifacts, web3, account, balance, isAdmin, networkID, contracts }
				});
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

	/* ---- Effects --------------------------------- */
	useEffect(() => {
		const tryInit = async () => {
			try {
				const ticketMarket = await import("../../contracts/TicketMarket.json");
				const cardMarket = await import("../../contracts/CardMarket.json");
				await init([ {name: "ticketMarket", build: ticketMarket}, {name: "cardMarket", build: cardMarket} ]);
			} catch (err) { console.error(err); }
		};

		tryInit().catch(console.error);
	}, [init]);

	useEffect(() => {
		const events = ["chainChanged", "accountsChanged"];
		const handleChange = () => {
			init(state.artifacts).catch(console.error);
		};

		// noinspection JSUnresolvedVariable
		events.forEach(e => window.ethereum.on(e, handleChange));
		return () => { // noinspection JSUnresolvedVariable
			events.forEach(e => window.ethereum.removeListener(e, handleChange)); };
	}, [init, state.artifacts]);

	/* ---- Page content ---------------------------- */
	return (
		<EthContext.Provider value={{ state, dispatch }}>
			{children}
		</EthContext.Provider>
	);
}
EthProvider.propTypes = { children: PropTypes.node };

export default EthProvider;
