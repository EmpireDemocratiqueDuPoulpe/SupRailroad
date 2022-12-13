import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MessageProvider } from "./contexts/MessageContext";
import { CRTProvider } from "./contexts/CRTContext";
import { EthProvider } from "./contexts/EthContext";
import InterfaceChecker from "./components/InterfaceChecker/InterfaceChecker.jsx";
import Root from "./pages/Root/Root.jsx";
import Error, { Error403, UnexpectedError } from "./pages/Errors";
import TravelPlanner from "./pages/TravelPlanner/TravelPlanner.jsx";
import Wallet from "./pages/Wallet/Wallet.jsx";
import CardsMarket from "./pages/CardsMarket/CardsMarket.jsx";
import AdminCorner from "./pages/AdminCorner/AdminCorner.jsx";
import "normalize.css";
import "./index.css";

const router = createBrowserRouter([
	{ path: "/", element: <Root/>, errorElement: <UnexpectedError/>, children: [
		{ path: "/travel", element: <TravelPlanner/> },
		{ path: "/wallet", element: <Wallet/> },
		{ path: "/market", element: <CardsMarket/> },
		{ path: "/admin", element: <AdminCorner/> },
	]},
	{ path: "/error", element: <Error/>, errorElement: <UnexpectedError/>, children: [
		{ path: "/error/403", element: <Error403/> },
	]}
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<MessageProvider>
			<CRTProvider enabled={false}>
				<InterfaceChecker>
					<EthProvider>
						<RouterProvider router={router}/>
					</EthProvider>
				</InterfaceChecker>
			</CRTProvider>
		</MessageProvider>
	</React.StrictMode>
);
