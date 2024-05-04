import { Button } from "@/components/ui/button";
import { useWalletContext } from "@/store/WalletContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { connectWallet, currentAccount } = useWalletContext();

  return (
    <div>
      {currentAccount === "" ? (
        <Button
          onClick={() => {
            connectWallet();
          }}
        >
          Login
        </Button>
      ) : (
        <p
          onClick={() => {
            navigator.clipboard.writeText(currentAccount);
            toast.success("Copied to clipboard");
          }}
        >
          {currentAccount}
        </p>
      )}
    </div>
  );
};

export default Navbar;
