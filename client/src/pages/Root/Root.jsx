import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./Root.css";

function Root() {
	/* ---- Page content ---------------------------- */
	return (
		<div className="App-root expand-all">
			<Header/>

			<div className="App-body">
				<Outlet/>
			</div>

			<Footer/>
		</div>
	);
}

export default Root;
