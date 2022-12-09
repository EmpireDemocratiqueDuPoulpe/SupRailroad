import { useContext } from "react";
import MessageContext from "./MessageContext.js";

const useMessages = () => useContext(MessageContext);
export default useMessages;
