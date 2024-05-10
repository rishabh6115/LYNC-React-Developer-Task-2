import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useFolderContext } from "@/store/Context";
import { useEffect } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";

const Breadcrumbs = () => {
  const { breadcrumbs, setBreadcrumbs } = useFolderContext();
  const location = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      setBreadcrumbs([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div className="flex gap-3 items-center">
      <div
        onClick={() => {
          nav(-1);
          const clonedBreadcrumbs = [...breadcrumbs];
          setBreadcrumbs(clonedBreadcrumbs.slice(0, breadcrumbs.length - 1));
        }}
        className="cursor-pointer"
      >
        <IoMdArrowRoundBack className="text-2xl" />
      </div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => {
                nav("/dashboard");
              }}
              className="cursor-pointer"
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {breadcrumbs.flat().map((item, index) => {
            return (
              <BreadcrumbItem key={index}>
                <BreadcrumbLink
                  onClick={() => {
                    if (location.pathname === `/${item}`) return;
                    nav(`/dashboard/${item}`);
                    const clonedBreadcrumbs = [...breadcrumbs];
                    setBreadcrumbs(clonedBreadcrumbs.slice(0, index + 1));
                  }}
                  className={`cursor-pointer ${
                    location.pathname !== `/${item}`
                      ? " "
                      : " text-blue-500 font-bold hover:text-blue-500"
                  }`}
                >
                  {item}
                </BreadcrumbLink>
                <BreadcrumbSeparator />
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default Breadcrumbs;
