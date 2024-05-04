export type fileType = "folder" | "file";

export type folderData = {
  name: string;
  type: fileType;
  IpfsHash?: string;
  PinSize?: number;
  Timestamp?: string;
};

export interface FolderItem {
  path: string;
  data: folderData[];
}
