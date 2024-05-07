import { useWalletContext } from "@/store/WalletContext";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoutes = () => {
  const { currentAccount } = useWalletContext();

  if (currentAccount) {
    return <Navigate to="/dashboard" />;
  }
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default PublicRoutes;
