import {useEffect, useMemo} from 'react';
import Tree, {type TreeProps} from 'rc-tree';
import type {DataNode} from 'rc-tree/es/interface';
import 'rc-tree/assets/index.css';
import * as React from "react";
import './DeviceTreePanel.scss';
import type {DeviceNodeType} from "../../types/nodeType.ts";
import type {ContextMenuState} from "../../types/ContextMenuState.ts";
import type {EventDataNode} from "rc-tree/lib/interface";
import {handleMenuAction} from "../../utils/handleMenuAction.ts";


interface DeviceTreePanelProps {
  treeData: DeviceNodeType[];
  handleSelect: TreeProps['onSelect'];
  handleRightClick: (info: { event: React.MouseEvent; node: EventDataNode<DataNode> }) => void;
  contextMenu: ContextMenuState;
  setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuState>>;
  setTreeData: React.Dispatch<React.SetStateAction<DeviceNodeType[]>>
}

const isSubtypeNode = (node: DeviceNodeType): boolean => {
  // по ключу или названию — настраивай под себя
  return node.key.startsWith('sub');
};


const DeviceTreePanel: React.FC<DeviceTreePanelProps> = ({treeData, handleSelect, handleRightClick, contextMenu, setContextMenu, setTreeData}) => {
  const nestedTreeData = useMemo(() => {
    const nodeMap = new Map<string, DataNode>();
    treeData.forEach((node) => {
      nodeMap.set(node.key, {
        key: node.key,
        title: node.title,
        isLeaf: node.isLeaf,
        children: [],
      });
    });

    const rootNodes: DataNode[] = [];

    treeData.forEach((node) => {
      if (node.parentKey) {
        const parent = nodeMap.get(node.parentKey);
        if (parent) {
          (parent.children ||= []).push(nodeMap.get(node.key)!);
        }
      } else {
        rootNodes.push(nodeMap.get(node.key)!);
      }
    });

    return rootNodes;
  }, [treeData]);

  // Закрытие контекстного меню при клике вне
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [contextMenu.visible]);


  return (
    <>
      <Tree
        treeData={nestedTreeData}
        showLine={true}
        selectable
        defaultExpandAll={false}
        onSelect={handleSelect}
        onRightClick={handleRightClick}
      />

      {/* Контекстное меню */}
      {contextMenu.visible && contextMenu.node && (
        <ul
          style={{
            position: 'absolute',
            top: contextMenu.y,
            left: contextMenu.x,
            listStyle: 'none',
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: 4,
            margin: 0,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 9999,
            width: 180,
          }}
        >
          {/* Удалить — всегда */}
          <li onClick={() => handleMenuAction('Удалить', contextMenu, setContextMenu, setTreeData)}>
            🗑️ Удалить
          </li>

          {/* Добавить подтип — если node может иметь детей */}
          {!contextMenu.node.isLeaf && !isSubtypeNode(contextMenu.node) && (
            <li onClick={() => handleMenuAction('Добавить подтип', contextMenu, setContextMenu, setTreeData)}>
              ➕ Добавить подтип
            </li>
          )}

          {/* Добавить канал — если node это подтип */}
          {isSubtypeNode(contextMenu.node) && (
            <li onClick={() => handleMenuAction('Добавить канал', contextMenu, setContextMenu, setTreeData)}>
              ➕ Добавить канал
            </li>
          )}
        </ul>
      )}
    </>
  );
};

export default DeviceTreePanel;