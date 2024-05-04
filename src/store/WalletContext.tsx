import { createContext, useContext, useEffect } from "react";
import { useState } from "react";

interface WalletContextType {
  connectWallet: () => Promise<void>;
  currentAccount: string;
}

interface ProviderProps {
  children: React.ReactNode;
}

export const WalletContext = createContext<WalletContextType | undefined>(
  undefined
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { ethereum } = window as any;

export const WalletContextProvider: React.FC<ProviderProps> = ({
  children,
}) => {
  const [currentAccount, setCurrentAccount] = useState<string>("");

  const checkWalletConnection = async () => {
    try {
      if (!ethereum) {
        alert("Make sure you have MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        const account = accounts[0];
        setCurrentAccount(account);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        alert("Make sure you have MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setCurrentAccount("");
    } else {
      setCurrentAccount(accounts[0]);
    }
  };

  useEffect(() => {
    checkWalletConnection();

    ethereum.on("accountsChanged", handleAccountsChanged);

    ethereum.on("disconnect", () => {
      setCurrentAccount("");
    });

    return () => {
      ethereum.removeAllListeners("accountsChanged");
      ethereum.removeAllListeners("disconnect");
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        connectWallet,
        currentAccount,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error(
      "useWalletContext must be used within a WalletContextProvider"
    );
  }
  return context;
};
