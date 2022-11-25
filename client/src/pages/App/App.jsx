import EthProvider from "../../contexts/EthContext/EthProvider.jsx";
import "./App.css";

function App() {
	return (
		<EthProvider>
			<div id="App" >
				<h1>Yo</h1>
			</div>
		</EthProvider>
	);
}

export default App;
