import axios from 'axios';

export type DeviceNode = {
  key: string;
  title: string;
  isLeaf: boolean;
  parentKey?: string;
};

export type DeviceParams = {
  key: number | string;
  parentKey: string;
  name: string;
  type: string;
  value?: string | string[];
  checked?: boolean;
}

export const fetchDevices = async (parentKey?: string): Promise<DeviceNode[]> => {
  const response = await axios.get<DeviceNode[]>('http://localhost:3001/devices', {
    params: parentKey ? { parentKey } : {}
  });
  return response.data;
};

export const fetchParams = async (parentKey: string): Promise<DeviceParams[]> => {
  const response = await axios.get<DeviceParams[]>('http://localhost:3001/params', {
    params: {parentKey}
  });
  return response.data;
};