export interface nodeType {
  key: string;
  title: string;
  children?: nodeType[];
  isLeaf: boolean;
}

export type DeviceNodeType = {
  key: string;
  title: string;
  isLeaf: boolean;
  parentKey?: string;
};

export type DeviceParamsType = {
  key: number | string;
  parentKey: string;
  name: string;
  type: string;
  value?: string | string[];
  checked?: boolean;
}