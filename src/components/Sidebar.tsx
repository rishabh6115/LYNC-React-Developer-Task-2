import { useFolderContext } from "@/store/Context";
import { useState } from "react";
import { FaCompress, FaExpand } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { object, breadcrumbs, setBreadcrumbs } = useFolderContext();
  const nav = useNavigate();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="min-w-[200px] border rounded-lg">
      <div className="text-center my-2 flex justify-center items-center gap-2">
        <h2>Navigation Bar </h2>
        {
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="cursor-pointer"
          >
            {!isExpanded ? <FaExpand /> : <FaCompress />}
          </div>
        }
      </div>
      {object.map((folder, index) => (
        <div key={index}>
          <div>
            {folder.data.map((item, itemIndex) => (
              <div key={itemIndex}>
                <p
                  className={`px-2 py-1 my-1 cursor-pointer ${
                    item.type === "folder"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => {
                    if (
                      item.type === "file" ||
                      location.pathname === `/${item.name}`
                    )
                      return;
                    nav(`/${item.name}`);
                    const foundIndex = breadcrumbs.indexOf(item.name);
                    if (foundIndex !== -1)
                      setBreadcrumbs(breadcrumbs.slice(0, foundIndex + 1));
                    else {
                      setBreadcrumbs([...breadcrumbs, item.name]);
                    }
                  }}
                >
                  {item.name}
                </p>

                {isExpanded && item.type === "folder" && (
                  <div className="ml-2">
                    {object
                      .find((subFolder) => subFolder.path === `/${item.name}`)
                      ?.data?.map((subItem, subItemIndex) => (
                        <div
                          key={subItemIndex}
                          className="px-2 py-1 my-1 bg-gray-200 cursor-pointer"
                          onClick={() => {
                            if (
                              subItem.type === "file" ||
                              location.pathname === `/${subItem.name}`
                            )
                              return;
                            nav(`/${subItem.name}`);
                            const foundIndex = breadcrumbs.indexOf(
                              subItem.name
                            );

                            if (foundIndex !== -1)
                              setBreadcrumbs(
                                breadcrumbs.slice(0, foundIndex + 1)
                              );
                            else {
                              setBreadcrumbs([...breadcrumbs, subItem.name]);
                            }
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
        </div>
      ))}
    </div>
  );
};

export default Sidebar;