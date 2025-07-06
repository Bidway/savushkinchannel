import type {DeviceNodeType, DeviceParamsWithoutKey} from "../types/nodeType.ts";

// Добавление узла (подтип или канал)
export const addNode = async (node: DeviceNodeType): Promise<void> => {
  const response = await fetch('http://localhost:8080/api/devices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(node),
  });


  if (!response.ok) {
    throw new Error(`Ошибка добавления узла: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

// Удаление узла и его потомков
export const deleteNode = async (key: string): Promise<void> => {
  const response = await fetch(`http://localhost:8080/api/devices/${key}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Ошибка при удалении узла');
  }
};

export const addParam = async (param: DeviceParamsWithoutKey) => {
  const response = await fetch('http://localhost:8080/api/param', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(param),
  });
  if (!response.ok) {
    throw new Error(`Ошибка добавления параметра: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const deleteParam = async (key: string): Promise<void> => {
  const response = await fetch(`http://localhost:8080/api/params/${key}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Ошибка при удалении узла');
  }
};

export const patchParam = async (key: string, value: string) => {
  const response = await fetch(`http://localhost:8080/api/device-params/${key}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value }),
  });

  if (!response.ok) {
    throw new Error(`Ошибка при обновлении параметра: ${response.status}`);
  }

  return await response.json(); // если сервер что-то возвращает
};







