import type {DeviceParamsType} from "../types/nodeType.ts";

export const applyChangesParams = async (
  form: HTMLFormElement,
  deviceParams: DeviceParamsType[],
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const formData = new FormData(form);
  const patchPayload: { key: string; value: string }[] = [];

  deviceParams.forEach(param => {
    const inputName = `input-${param.key}`;
    const textareaName = `textarea-${param.key}`;

    switch (param.type) {
      case 'input': {
        const currentValue = formData.get(inputName);
        if (currentValue !== param.value) {
          patchPayload.push({ key: param.key, value: currentValue });
        }
        break;
      }
      case 'textarea': {
        const currentValue = formData.get(textareaName);
        if (currentValue !== param.value) {
          patchPayload.push({ key: param.key, value: currentValue });
        }
        break;
      }
      case 'checkbox':
      case 'check': {
        const isChecked = formData.get(inputName) === 'on'; // true if checked
        if (isChecked !== param.value) {
          patchPayload.push({ key: param.key, value: isChecked });
        }
        break;
      }
    }
  });

  if (patchPayload.length === 0) {
    console.log('Нет изменений');
    return;
  }
  console.log(patchPayload)
  try {
    const response = await fetch('http://localhost:8080/api/device-params', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patchPayload),
    });

    if (!response.ok) throw new Error(`Ошибка: ${response.status}`);

    console.log('Изменения применены:', patchPayload);
    setIsDirty(false);
  } catch (err) {
    console.error('Ошибка при отправке PATCH:', err);
  }
};
