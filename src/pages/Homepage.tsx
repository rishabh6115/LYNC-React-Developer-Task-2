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
  console.log(object);

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
      const trimmedPath = location.pathname.replace(/^\//, "");

      if (foundName) {
        toast.error("Folder/file already exists in this directory");
        return;
      }
      if (trimmedPath === newFolderName) {
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
      }

      if (addType === "file" && selectedFile) {
        const returedData = await handleSubmission(newFolderName);

        foundFolder?.data.push({
          name: newFolderName,
          type: addType as fileType,
          IpfsHash: returedData.IpfsHash,
        });
      }
      if (addType === "folder") {
        foundFolder?.data.push({
          name: newFolderName,
          type: addType as fileType,
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
    <div className="">
      <h1 className="text-2xl">Online Drive</h1>
      <div className="flex mt-2 gap-4 flex-wrap">
        {foundFolder?.data?.map((item: folderData, i: number) => (
          <div
            key={i}
            className="flex flex-col items-center border px-6 p-2  border-gray-300 rounded-lg"
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
                nav(`/${item.name}`);
                setBreadcrumbs([...breadcrumbs, item.name]);
              }}
              className="flex flex-col items-center gap-1 cursor-pointer"
            >
              {item.type === "folder" ? (
                <FaFolder className="text-5xl" />
              ) : (
                <FaFile className="text-5xl" />
              )}
              <p>{item.name}</p>
            </div>
            <div className="flex gap-1 mt-2 cursor-pointer">
              <MdEdit
                className="text-green-400 text-2xl font-bold"
                onClick={() => handleEdit(i)}
              />
              <MdDelete
                className="text-red-500 text-2xl font-bold"
                onClick={() => handleDelete(i)}
              />
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-0.5 items-center justify-center border border-gray-500 border-dashed px-8 py-6 rounded-lg">
          <button
            onClick={() => {
              setIsDialogOpen(true);
              setAddType("folder");
            }}
          >
            <TiFolderAdd className="text-3xl" />
          </button>
          <button
            onClick={() => {
              setIsDialogOpen(true);
              setAddType("file");
            }}
          >
            <AiOutlineFileAdd className="text-3xl" />
          </button>
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
            <Button onClick={handleCreate}>Create</Button>
          </DialogContent>
        ) : (
          <DialogContent>Loading...</DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default Homepage;
