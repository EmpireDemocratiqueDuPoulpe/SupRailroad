import { EthProvider } from "../../contexts/EthContext";
import InterfaceChecker from "../../components/InterfaceChecker/InterfaceChecker.jsx";
import Header from "../../components/Header/Header.jsx";
import UserWallet from "../../components/UserWallet/UserWallet.jsx";
import TicketDispenser from "../../components/TicketDispenser/TicketDispenser.jsx";
import Separator from "../../components/Separator/Separator.jsx";
import "./App.css";

function App() {
	return (
		<InterfaceChecker>
			<EthProvider>
				<div id="App" >
					<Header/>

					<UserWallet/>
					<Separator/>
					<TicketDispenser/>
				</div>
			</EthProvider>
		</InterfaceChecker>
	);
}

export default App;
