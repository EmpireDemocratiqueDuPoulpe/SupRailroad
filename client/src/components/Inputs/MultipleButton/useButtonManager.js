import { useContext } from "react";
import ButtonManagerContext from "./ButtonManagerContext.js";

const useButtonsManager = () => useContext(ButtonManagerContext);
export default useButtonsManager;
