import type {DeviceNodeType} from "../types/nodeType.ts";

// Добавление узла (подтип или канал)
export const addNode = async (node: DeviceNodeType): Promise<void> => {
  const response = await fetch('/api/devices', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(node),
  });

  if (!response.ok) {
    throw new Error('Ошибка при добавлении узла');
  }
};

// Удаление узла и его потомков
export const deleteNode = async (key: string): Promise<void> => {
  const response = await fetch(`/api/devices/${key}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Ошибка при удалении узла');
  }
};
