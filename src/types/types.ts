export type fileType = "folder" | "file";

export type folderData = {
  name: string;
  type: fileType;
  IpfsHash?: string;
  PinSize?: number;
  Timestamp?: string;
  parentFolder: string;
  nestedItems?: number;
};

export interface FolderItem {
  path: string;
  data: folderData[];
}
