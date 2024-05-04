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
      path: "/",
      data: [
        {
          name: "Repos",
          type: "folder",
        },
        {
          name: "Music",
          type: "folder",
        },
        {
          name: "Docs",
          type: "folder",
        },
        {
          name: "file.jpg",
          type: "file",
          IpfsHash: "QmNUpjc43kJ9QzEV2e7XjX7iUMk7DMjf5xaKnAVgpD291A",
          // IpfsHash: "QmVUq2DugrobJ928EnbsNzHGGFNDVZaLoW5BdEpXYXMCz2",
        },
      ],
    },
    {
      path: "/Repos",
      data: [
        {
          name: "Sub-folder-repo",
          type: "folder",
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
