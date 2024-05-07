import React, { useEffect, useState } from "react";
import { FaFolder, FaFile } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate } from "react-router-dom";
import { useFolderContext } from "@/store/Context";
import { TiFolderAdd } from "react-icons/ti";
import { AiOutlineFileAdd } from "react-icons/ai";
import { MdDelete, MdEdit } from "react-icons/md";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { FolderItem, fileType, folderData } from "@/types/types";

const Homepage: React.FC = () => {
  const { object, setObject, breadcrumbs, setBreadcrumbs } = useFolderContext();
  const [addType, setAddType] = useState<string>("");
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const location = useLocation();
  const nav = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      setSelectedFile(event.target.files[0]);
    }
  };
  const [loading, setLoading] = useState<boolean>(false);

  const foundFolder = object.find(
    (item: FolderItem) => item.path === location.pathname
  );

  const handleSubmission = async (newFolderName: string) => {
    try {
      setLoading(true);
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      const metadata = JSON.stringify({
        name: newFolderName,
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
          },
          body: formData,
        }
      );
      const resData = await res.json();
      setLoading(false);

      return resData;
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (newFolderName.trim() !== "") {
      const obj = [...object];
      const foundFolder = obj.find((item) => item.path === location.pathname);
      const foundName = foundFolder?.data.find(
        (item: folderData) => item.name === newFolderName
      );
      const splittedPath = location.pathname.split("/");
      const parentFolderName = splittedPath.pop();

      if (foundName) {
        toast.error("Folder/file already exists in this directory");
        return;
      }
      if (parentFolderName === newFolderName) {
        toast.error(
          "Cannot create folder/file with the same name as the parent folder"
        );
        return;
      }

      if (addType === "file") {
        if (!selectedFile) {
          toast.error("Please select a file to upload");
          return;
        }
        const returedData = await handleSubmission(newFolderName);

        foundFolder?.data.push({
          name: newFolderName,
          type: addType as fileType,
          IpfsHash: returedData.IpfsHash,
          parentFolder: "/" + parentFolderName,
        });
      } else {
        foundFolder?.data.push({
          name: newFolderName,
          type: addType as fileType,
          parentFolder: "/" + parentFolderName,
          nestedItems: 0,
        });
      }
      setObject(obj);
      setNewFolderName("");
      setIsDialogOpen(false);
    }
  };

  useEffect(() => {
    const foundFolder = object.find(
      (item: FolderItem) => item.path === location.pathname
    );

    if (!foundFolder) {
      const obj = [...object];
      obj.push({
        path: location.pathname,
        data: [],
      });
      setObject(obj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleDelete = (index: number) => {
    const obj = [...object];
    const foundFolder = obj.find((item) => item.path === location.pathname);
    foundFolder?.data.splice(index, 1);
    setObject(obj);
  };

  const handleEdit = (index: number) => {
    const obj = [...object];
    const foundFolder = obj.find((item) => item.path === location.pathname);
    if (!foundFolder) return;
    const newName = prompt("Enter new name");
    if (newName) {
      foundFolder.data[index].name = newName;
      setObject(obj);
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {foundFolder?.data?.map((item: folderData, i: number) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between cursor-pointer transition duration-300 transform hover:scale-105"
          >
            <div
              onDoubleClick={() => {
                if (item.type === "file") {
                  if (!item.IpfsHash) return;
                  return handleDownload(
                    `${import.meta.env.VITE_GATEWAY_URL}/ipfs/${item.IpfsHash}`,
                    item.name
                  );
                }
                nav(`/dashboard/${item.name}`);
                setBreadcrumbs([...breadcrumbs, item.name]);
              }}
              className="flex items-center justify-center mb-4"
            >
              {item.type === "folder" ? (
                <FaFolder className="text-5xl text-blue-500" />
              ) : (
                <>
                  <img
                    src={`${import.meta.env.VITE_GATEWAY_URL}/ipfs/${
                      item.IpfsHash
                    }`}
                    alt="image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                  <FaFile className="text-5xl text-blue-500" />
                </>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium">{item.name}</p>
              <div className="flex gap-1">
                <MdEdit
                  className="text-green-400 text-2xl cursor-pointer"
                  onClick={() => handleEdit(i)}
                />
                <MdDelete
                  className="text-red-500 text-2xl cursor-pointer"
                  onClick={() => handleDelete(i)}
                />
              </div>
            </div>
          </div>
        ))}

        <div
          className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-center items-center cursor-pointer transition duration-300 transform hover:scale-105"
          onClick={() => {
            setIsDialogOpen(true);
            setAddType("folder");
          }}
        >
          <TiFolderAdd className="text-5xl text-blue-500" />
          <p className="text-lg font-medium mt-2">New Folder</p>
        </div>

        <div
          className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-center items-center cursor-pointer transition duration-300 transform hover:scale-105"
          onClick={() => {
            setIsDialogOpen(true);
            setAddType("file");
          }}
        >
          <AiOutlineFileAdd className="text-5xl text-blue-500" />
          <p className="text-lg font-medium mt-2">New File</p>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {!loading ? (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create {addType}</DialogTitle>
            </DialogHeader>
            <Input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder={`Enter ${addType} name`}
            />{" "}
            {addType === "file" && (
              <input type="file" onChange={changeHandler} />
            )}
            <Button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create
            </Button>
          </DialogContent>
        ) : (
          <DialogContent>Loading...</DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Homepage;
