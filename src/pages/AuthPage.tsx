import { useState } from "react";
import { useWalletContext } from "@/store/WalletContext";
import { Button } from "@/components/ui/button";

const AuthPage = () => {
  const { connectWallet } = useWalletContext();
  const [connecting, setConnecting] = useState(false);

  const handleConnectWallet = async () => {
    try {
      setConnecting(true);
      await connectWallet();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold mb-4 text-center">
          Connect Your Wallet
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Connect your Metamask wallet to continue.
        </p>
        <div className="flex justify-center">
          <Button
            onClick={handleConnectWallet}
            disabled={connecting}
            className={`px-6 py-3 rounded-md text-lg font-semibold ${
              connecting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {connecting ? "Connecting..." : "Connect with Metamask"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
