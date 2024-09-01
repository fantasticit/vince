import { createContext } from "react";

import { ExtensionManager } from "./manager";
import { useContext } from "react";

const ExtensionManagerContext = createContext<ExtensionManager | null>(null);

export const ExtensionManagerProvider = ExtensionManagerContext.Provider;

export const useExtensionManager = () => {
  return useContext(ExtensionManagerContext)!;
};
