import * as React from "react";
import type {DeviceParamsType} from "../../types/nodeType.ts";
import './DeviceParams.scss';

interface DeviceParamsProps {
  deviceParams: DeviceParamsType[];
}

const DeviceParams: React.FC<DeviceParamsProps> = ({deviceParams}) => {
  return (
    <div className={"params"} style={{marginTop: "20px"}}>
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
                  defaultValue={param.value} />
              </div>
            )
          case 'checkbox':
            return (
              <div key={param.key}>
                <input name={`input-${param.key}`} id={`input-${param.key}`} type="checkbox" defaultChecked={param.checked} />
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
                  defaultValue={param.value}
                >
                  </textarea>
              </div>
            )
          case 'select':
            return (
              <div key={param.key} className={"textarea__container"}>
                <label htmlFor={`select-${param.key}`}>{param.name}</label>
                <select
                  name={`select-${param.key}`}
                  id={`select-${param.key}`}
                >
                  {(param.value as string[]).map((el, index) => (
                    <option key={`option-${index}`} defaultValue={el}>{el}</option>
                  ))}
                </select>
              </div>
            )
          case 'span':
            return <span key={param.key}>{param.value}</span>
        }
      })}
    </div>
  )
}

export default DeviceParams;

