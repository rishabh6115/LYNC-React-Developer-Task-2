import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { FolderItem } from "@/types/types";

interface ContextValue {
  object: FolderItem[];
  setObject: Dispatch<SetStateAction<FolderItem[]>>;
  breadcrumbs: string[];
  setBreadcrumbs: Dispatch<SetStateAction<string[]>>;
}
interface ProviderProps {
  children: React.ReactNode;
}

const FolderContext = createContext<ContextValue | null>(null);

export const ContextProvider: React.FC<ProviderProps> = (props) => {
  const initialData: FolderItem[] = [
    {
      path: "/dashboard",
      data: [
        {
          name: "Repos",
          type: "folder",
          parentFolder: "/dashboard",
          nestedItems: 1,
        },
        {
          name: "Music",
          type: "folder",
          parentFolder: "/dashboard",
          nestedItems: 0,
        },
        {
          name: "Docs",
          type: "folder",
          parentFolder: "/dashboard",
          nestedItems: 0,
        },
        {
          name: "file.doc",
          type: "file",
          IpfsHash: "QmNUpjc43kJ9QzEV2e7XjX7iUMk7DMjf5xaKnAVgpD291A",
          parentFolder: "/dashboard",
        },
      ],
    },
    {
      path: "/dashboard/Repos",
      data: [
        {
          name: "Sub-folder-repo",
          type: "folder",
          parentFolder: "/Repos",
          nestedItems: 0,
        },
      ],
    },
  ];

  const [object, setObject] = useState<FolderItem[]>(initialData);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

  return (
    <FolderContext.Provider
      value={{
        object,
        setObject,
        breadcrumbs,
        setBreadcrumbs,
      }}
    >
      {props.children}
    </FolderContext.Provider>
  );
};

export const useFolderContext = () => {
  return useContext(FolderContext)!;
};
