import { useFolderContext } from "@/store/Context";
import { folderData } from "@/types/types";
import { useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { object, setBreadcrumbs } = useFolderContext();
  const nav = useNavigate();
  const location = useLocation();
  const [condition, setCondition] = useState(["/dashboard"]);
  const [flattedFolders, setFlattedFolders] = useState<folderData[]>([]);

  useEffect(() => {
    const reArrangeItems = () => {
      const folders = object.map((item) => item.data);
      const flattedFolders = folders.flat();
      const clonedData = [...flattedFolders];
      const conditions = clonedData.map((item) => item.parentFolder);

      for (const data of conditions) {
        const selectedFolders = clonedData.filter(
          (item) => item.parentFolder === data
        );
        const parentId = clonedData.findIndex(
          (item) => "/" + item.name === data
        );
        const parent = clonedData[parentId];
        if (parent !== undefined) {
          parent.nestedItems = selectedFolders.length;
        }

        selectedFolders.forEach((selectedFolder, index) => {
          const idx = clonedData.indexOf(selectedFolder);
          clonedData.splice(idx, 1);
          clonedData.splice(parentId + index + 1, 0, selectedFolder);
        });
      }

      setFlattedFolders(clonedData);
    };

    reArrangeItems();
  }, [object]);

  const calculateDepth = (
    folderName: string | undefined,
    currentDepth = 0
  ): number => {
    const folder = flattedFolders.find((item) => item.name === folderName);

    if (!folder) return 0;
    if (folder.parentFolder === "/dashboard") return currentDepth;

    const parentFolderName = folder.parentFolder.split("/").pop();
    return calculateDepth(parentFolderName, currentDepth + 1);
  };

  const calculatePadding = (data: folderData) => {
    const calculatedDepth = calculateDepth(data.name);
    const padding = calculatedDepth * 10 + 16;

    return padding;
  };

  return (
    <div className=" min-h-[100vh] border  bg-gray-100 shadow-lg py-4">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-lg font-bold text-gray-800">Navigation Bar</h2>
      </div>

      {flattedFolders.flat().map(
        (item: folderData, index: number) =>
          condition.includes(item.parentFolder) && (
            <div key={index}>
              <div
                className={` flex items-center justify-between px-4 py-2 cursor-pointer transition duration-300 ${
                  item.type === "folder"
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
                style={{ paddingLeft: calculatePadding(item) }}
                onClick={() => {
                  if (
                    item.type === "file" ||
                    location.pathname === `/${item.name}`
                  )
                    return;
                  nav(`/dashboard/${item.name}`);
                  const clonedData = [...condition];
                  const selectedItemIndex = clonedData.indexOf(`/${item.name}`);

                  if (selectedItemIndex !== -1) {
                    const updatedCondition = clonedData.slice(
                      0,
                      selectedItemIndex
                    );
                    setCondition(updatedCondition);
                  } else {
                    setCondition([...clonedData, `/${item.name}`]);
                  }
                  setBreadcrumbs([item.name]);
                }}
              >
                <p>{item.name}</p>
                {(item.nestedItems || 0) > 0 && (
                  <>
                    {!condition.includes(`/${item.name}`) ? (
                      <FaAngleDown />
                    ) : (
                      <FaAngleUp />
                    )}
                  </>
                )}
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default Sidebar;
