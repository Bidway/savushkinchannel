import type {DeviceParamsType} from "../types/nodeType.ts";

export const applyChangesParams = async (
  form: HTMLFormElement,
  deviceParams: DeviceParamsType[],
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const formData = new FormData(form);
  const patchPayload: Record<string, any> = {};

  deviceParams.forEach(param => {
    const key = `input-${param.key}`;
    const textareaKey = `textarea-${param.key}`;

    if (param.type === 'input') {
      const value = formData.get(key);
      if (value !== param.value) {
        patchPayload[param.key] = value;
      }
    }

    if (param.type === 'textarea') {
      const value = formData.get(textareaKey);
      if (value !== param.value) {
        patchPayload[param.key] = value;
      }
    }

    if (param.type === 'checkbox') {
      const checked = formData.get(key) === 'on';
      if (checked !== param.checked) {
        patchPayload[param.key] = checked;
      }
    }

  });

  if (Object.keys(patchPayload).length === 0) {
    console.log('Нет изменений');
    return;
  }

  try {
    const response = await fetch('/api/device-params', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patchPayload),
    });

    if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

    console.log('Изменения применены успешно');
    setIsDirty(false);
  } catch (err) {
    console.error('Ошибка при отправке PATCH:', err);
  }
};
