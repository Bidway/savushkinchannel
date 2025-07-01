import axios from 'axios';



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