import { useReducer, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import Web3 from "web3";
import EthContext from "./EthContext.js";
import { reducer, actions, initialState } from "./state.js";

function EthProvider({ children }) {
	const [state, dispatch] = useReducer(reducer, initialState, undefined);

	const init = useCallback(
		async artifact => {
			if (artifact) {
				const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
				const account = (await web3.eth.requestAccounts())[0];
				const balance = Web3.utils.fromWei((await web3.eth.getBalance(account)), "ether");
				const networkID = await web3.eth.net.getId();
				const { abi } = artifact;
				let address, contract;

				try {
					address = artifact.networks[networkID].address;
					contract = new web3.eth.Contract(abi, address);
				} catch (err) {
					console.error(err);
				}

				dispatch({
					type: actions.init,
					data: { artifact, web3, account, balance, networkID, contract }
				});
			}
		}, []);

	useEffect(() => {
		const tryInit = async () => {
			import("../../contracts/TicketFactory.json").then(init).catch(console.error);
		};

		tryInit().catch(console.error);
	}, [init]);

	useEffect(() => {
		const events = ["chainChanged", "accountsChanged"];
		const handleChange = () => {
			init(state.artifact).catch(console.error);
		};

		events.forEach(e => window.ethereum.on(e, handleChange));
		return () => {
			events.forEach(e => window.ethereum.removeListener(e, handleChange));
		};
	}, [init, state.artifact]);

	return (
		<EthContext.Provider value={{
			state,
			dispatch
		}}>
			{children}
		</EthContext.Provider>
	);
}
EthProvider.propTypes = { children: PropTypes.node };

export default EthProvider;
