import Breadcrumbs from "@/components/Breadcrumbs";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

const Wrapper = () => {
  return (
    <div className="font-bold max-w-7xl m-auto mt-10 ">
      <Navbar />
      <div className="flex mt-4 gap-4">
        <Sidebar />
        <div className="flex flex-col gap-2">
          <Breadcrumbs />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Wrapper;
