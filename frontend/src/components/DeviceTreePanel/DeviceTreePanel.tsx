import {useEffect, useState} from 'react';
import Tree from 'rc-tree';
import type {DataNode, EventDataNode} from 'rc-tree/es/interface';
import 'rc-tree/assets/index.css';
import {type DeviceNode, type DeviceParams, fetchDevices, fetchParams} from "../../utils/api.ts";
import * as React from "react";
import './DeviceTreePanel.scss';


interface MyNodeType {
  key: string;
  title: string;
  children?: MyNodeType[];
  isLeaf: boolean;
}

const convertToDataNode = (nodes: DeviceNode[]): DataNode[] => {
  return nodes.map((node) => ({
    title: node.title,
    key: node.key,
    isLeaf: node.isLeaf,
  }));
};


// Рекурсивно добавляет дочерние узлы
const addChildrenToTree = (
  tree: DataNode[],
  key: string,
  children: DataNode[]
): DataNode[] => {
  return tree.map((node) => {
    if (node.key === key) {
      return {...node, children};
    } else if (node.children) {
      return {...node, children: addChildrenToTree(node.children, key, children)};
    }
    return node;
  });
};

const DeviceTreePanel = () => {
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [deviceParams, setDeviceParams] = useState<DeviceParams[]>([]);

  // Загрузка корневых узлов при первом рендере
  useEffect(() => {
    fetchDevices().then((data) => {
      setTreeData(convertToDataNode(data));
    });
  }, []);

  // Динамическая подгрузка дочерних узлов
  const onLoadData = (treeNode: EventDataNode<MyNodeType>): Promise<void> => {
    return new Promise((resolve) => {
      if (treeNode.children) {
        resolve();
        return;
      }

      fetchDevices(treeNode.key).then((data) => {
        const children = convertToDataNode(data);
        setTreeData((prev) => addChildrenToTree(prev, treeNode.key as string, children));
        resolve();
      });
    });
  };

  const selectedNodeHandler = (selectedKeys: React.Key[]) => {
    const nodeKey = selectedKeys[0] as string;
    fetchParams(nodeKey).then((data) => {
      setDeviceParams(data);
    });
  };

  return (
    <>
      <Tree
        treeData={treeData}
        loadData={onLoadData}
        showLine={true}
        selectable
        defaultExpandAll={false}
        onSelect={selectedNodeHandler}
      />

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
    </>
  );
};

export default DeviceTreePanel;