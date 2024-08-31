import { IVinceTextNode } from "../../type";

export type IMindLayout =
  | "LeftLogical"
  | "RightLogical"
  | "DownwardOrganizational"
  | "UpwardOrganizational";

export type IVinceMindNode = IVinceTextNode<{
  layout: `${IMindLayout}`;
  isRoot?: boolean;
  parentId?: string;
  fill: string;
}>;
