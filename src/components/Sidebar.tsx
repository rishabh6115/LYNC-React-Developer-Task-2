import { useFolderContext } from "@/store/Context";
import { folderData } from "@/types/types";
import { useState } from "react";
import { FaCompress, FaExpand } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { object, setBreadcrumbs } = useFolderContext();
  const nav = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="min-w-[250px] border rounded-lg bg-gray-100 shadow-lg py-4">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-lg font-bold text-gray-800">Navigation Bar</h2>
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer text-blue-500 transition duration-300 hover:text-blue-700"
        >
          {isExpanded ? (
            <FaCompress className="text-xl" />
          ) : (
            <FaExpand className="text-xl" />
          )}
        </div>
      </div>
      {object.map((folder, index) => (
        <div key={index}>
          {folder.data.map((item: folderData, itemIndex: number) => (
            <div key={itemIndex}>
              <p
                className={`px-4 py-2 my-1 cursor-pointer rounded-md transition duration-300 ${
                  item.type === "folder"
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                onClick={() => {
                  if (
                    item.type === "file" ||
                    location.pathname === `/${item.name}`
                  )
                    return;
                  nav(`/${item.name}`);
                  setBreadcrumbs([item.name]);
                }}
              >
                {item.name}
              </p>

              {isExpanded && (
                <div className="ml-4">
                  {object
                    .find((subFolder) => subFolder.path === `/${item.name}`)
                    ?.data?.map((subItem: folderData, subItemIndex: number) => (
                      <div
                        key={subItemIndex}
                        className={`px-6 py-2 my-1 cursor-pointer rounded-md transition duration-300 ${
                          subItem.type === "folder"
                            ? "bg-blue-400 text-white hover:bg-blue-500"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                        onClick={() => {
                          if (
                            subItem.type === "file" ||
                            location.pathname === `/${subItem.name}`
                          )
                            return;
                          nav(`/${subItem.name}`);
                          setBreadcrumbs([item.name, subItem.name]);
                        }}
                      >
                        {subItem.name}
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
