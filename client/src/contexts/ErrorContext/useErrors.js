import { useContext } from "react";
import ErrorContext from "./ErrorContext.js";

const useErrors = () => useContext(ErrorContext);
export default useErrors;
