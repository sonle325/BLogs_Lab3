import { createContext, useContext } from "react";

/**
 * AppContext – shared state across the whole application.
 *
 * topBarText     : string shown on the right side of the TopBar
 * setTopBarText  : setter for topBarText (called in UserDetail / UserPhotos)
 * advancedMode   : boolean – enables stepper view in UserPhotos
 * setAdvancedMode: setter toggled by the TopBar checkbox
 */
export const AppContext = createContext({
  topBarText: "",
  setTopBarText: () => {},
});

export const useAppContext = () => useContext(AppContext);
