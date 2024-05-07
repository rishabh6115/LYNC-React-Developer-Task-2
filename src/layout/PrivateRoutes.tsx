import Breadcrumbs from "@/components/Breadcrumbs";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useWalletContext } from "@/store/WalletContext";
import { Navigate, Outlet } from "react-router-dom";

const Wrapper = () => {
  const { currentAccount } = useWalletContext();

  if (!currentAccount) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 ">
        <Sidebar />
      </div>

      <div className="flex flex-col  flex-1">
        <div className="flex  justify-between p-4 bg-gray-200">
          <Breadcrumbs />
          <Navbar />
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Wrapper;
