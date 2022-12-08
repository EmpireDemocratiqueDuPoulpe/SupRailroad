import { useContext } from "react";
import ProgressiveSectionsContext from "./ProgressiveSectionsContext.js";

const useProgressiveSections = () => useContext(ProgressiveSectionsContext);
export default useProgressiveSections;
