import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { EthProvider } from "./contexts/EthContext";
import InterfaceChecker from "./components/InterfaceChecker/InterfaceChecker.jsx";
import Root from "./pages/Root/Root.jsx";
import Error from "./pages/Error/Error.jsx";
import TravelPlanner from "./pages/TravelPlanner/TravelPlanner.jsx";
import Wallet from "./pages/Wallet/Wallet.jsx";
import AdminCorner from "./pages/AdminCorner/AdminCorner.jsx";
import "normalize.css";
import "./index.css";

const router = createBrowserRouter([
	{ path: "/", element: <Root/>, errorElement: <Error/>, children: [
		{ path: "/travel", element: <TravelPlanner/> },
		{ path: "/wallet", element: <Wallet/> },
		{ path: "/admin", element: <AdminCorner/> },
	]},
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<InterfaceChecker>
			<EthProvider>
				<RouterProvider router={router}/>
			</EthProvider>
		</InterfaceChecker>
	</React.StrictMode>
);
