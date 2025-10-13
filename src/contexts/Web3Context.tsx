import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BrowserProvider, Contract, Signer } from "ethers";
import { toast } from "sonner";
import KYCArtifact from "../contracts/KYC.json";
import contractAddress from "../contracts/contract-address.json";

interface Web3ContextType {
  provider: BrowserProvider | null;
  signer: Signer | null;
  contract: Contract | null;
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchAccount: (address: string) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within Web3Provider");
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const initializeProvider = async (selectedAccount?: string) => {
    if (typeof window.ethereum === "undefined") {
      toast.error("Please install MetaMask to use this dApp");
      return;
    }

    try {
      const web3Provider = new BrowserProvider(window.ethereum);
      const network = await web3Provider.getNetwork();
      const web3Signer = await web3Provider.getSigner(selectedAccount);
      const address = await web3Signer.getAddress();

      const kycContract = new Contract(
        contractAddress.KYC,
        KYCArtifact.abi,
        web3Signer
      );

      setProvider(web3Provider);
      setSigner(web3Signer);
      setContract(kycContract);
      setAccount(address);
      setChainId(Number(network.chainId));
      setIsConnected(true);

      return address;
    } catch (error: any) {
      console.error("Error initializing provider:", error);
      toast.error("Failed to connect to wallet");
      throw error;
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      toast.error("Please install MetaMask");
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = await initializeProvider();
      toast.success(`Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}`);
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setAccount(null);
    setChainId(null);
    setIsConnected(false);
    toast.info("Wallet disconnected");
  };

  const switchAccount = async (address: string) => {
    try {
      await initializeProvider(address);
      toast.success(`Switched to: ${address.slice(0, 6)}...${address.slice(-4)}`);
    } catch (error) {
      console.error("Error switching account:", error);
      toast.error("Failed to switch account");
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      // Handle account changes
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          initializeProvider(accounts[0]);
        }
      });

      // Handle chain changes
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }

    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeAllListeners("accountsChanged");
        window.ethereum.removeAllListeners("chainChanged");
      }
    };
  }, []);

  const value = {
    provider,
    signer,
    contract,
    account,
    chainId,
    isConnected,
    connectWallet,
    disconnectWallet,
    switchAccount,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
