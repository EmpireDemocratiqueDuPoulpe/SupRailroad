import { EthProvider } from "../../contexts/EthContext";
import UserAccount from "../../components/UserAccount/UserAccount.jsx";
import "./App.css";

function App() {
	return (
		<EthProvider>
			<div id="App" >
				<h1>Yo</h1>
				<UserAccount/>
			</div>
		</EthProvider>
	);
}

export default App;
