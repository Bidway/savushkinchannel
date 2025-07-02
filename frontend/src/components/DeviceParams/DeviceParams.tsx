import * as React from "react";
import type {DeviceParamsType} from "../../types/nodeType.ts";
import './DeviceParams.scss';
import {type FormEvent} from "react";
import {applyChangesParams} from "../../utils/applyChangesParams.ts";

interface DeviceParamsProps {
  deviceParams: DeviceParamsType[];
  isDirty: boolean;
  setIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeviceParams: React.FC<DeviceParamsProps> = ({deviceParams, isDirty, setIsDirty}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type } = e.target;

    let newValue: string | boolean;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      newValue = target.checked;
    } else {
      newValue = e.target.value;
    }

    const originalParam = deviceParams.find(param => {
      return (
        `input-${param.key}` === name ||
        `textarea-${param.key}` === name
      );
    });

    if (!originalParam) return;

    const originalValue = originalParam.value;

    if (newValue !== originalValue) {
      setIsDirty(true);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await applyChangesParams(e.currentTarget, deviceParams, setIsDirty);
  }

  return (
    <form onSubmit={handleSubmit} className={"params"}>
      {deviceParams.map(param => {
        switch (param.type) {
          case 'input':
            return (
              <div key={param.key} className={"textarea__container"}>
                <label htmlFor={`input-${param.key}`}>{param.name}</label>
                <input
                  id={`input-${param.key}`}
                  name={`input-${param.key}`}
                  key={param.key}
                  type={"text"}
                  onChange={handleChange}
                  defaultValue={param.value} />
              </div>
            )
          case 'checkbox':
            return (
              <div key={param.key}>
                <input
                  name={`input-${param.key}`}
                  id={`input-${param.key}`}
                  type="checkbox"
                  onChange={handleChange}
                  defaultChecked={Boolean(param.value)}
                />
                <label htmlFor={`input-${param.key}`}>{param.value}</label>
              </div>
            )
          case 'textarea':
            return (
              <div key={param.key} className={"textarea__container"}>
                <label htmlFor={`textarea-${param.key}`}>{param.name}</label>
                <textarea
                  name={`textarea-${param.key}`}
                  id={`textarea-${param.key}`}
                  onChange={handleChange}
                  defaultValue={param.value}
                >
                  </textarea>
              </div>
            )
          case 'span':
            return <span key={param.key}>{param.value}</span>
        }
      })}
      <button type="submit" disabled={!isDirty}>
        Применить
      </button>

    </form>
  )
}

export default DeviceParams;

