import {useEffect, useMemo} from 'react';
import Tree, {type TreeProps} from 'rc-tree';
import type {DataNode} from 'rc-tree/es/interface';
import 'rc-tree/assets/index.css';
import * as React from "react";
import './DeviceTreePanel.scss';
import type {DeviceNodeType} from "../../types/nodeType.ts";
import type {ContextMenuState} from "../../types/ContextMenuState.ts";


interface DeviceTreePanelProps {
  treeData: DeviceNodeType[];
  handleSelect: TreeProps['onSelect'];
  handleRightClick: TreeProps['onRightClick'];
  contextMenu: ContextMenuState;
  setContextMenu: React.Dispatch<React.SetStateAction<ContextMenuState>>;
}

const DeviceTreePanel: React.FC<DeviceTreePanelProps> = ({treeData, handleSelect, handleRightClick, contextMenu, setContextMenu}) => {
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

  const handleMenuAction = (action: string) => {
    console.log(`Выбрано действие "${action}" для узла:`, contextMenu.node);
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  return (
    <>
      <Tree
        treeData={nestedTreeData}
        showLine={true}
        selectable
        defaultExpandAll
        onSelect={handleSelect}
        onRightClick={handleRightClick}
      />

      {/* Контекстное меню */}
      {contextMenu.visible && (
        <ul
          style={{
            position: 'absolute',
            top: contextMenu.y,
            left: contextMenu.x,
            listStyle: 'none',
            padding: '5px 0',
            margin: 0,
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: 4,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
            width: 150,
          }}
        >
          <li
            onClick={() => handleMenuAction('Просмотр')}
            style={{ padding: '6px 12px', cursor: 'pointer' }}
          >
            🔍 Просмотр
          </li>
          <li
            onClick={() => handleMenuAction('Редактировать')}
            style={{ padding: '6px 12px', cursor: 'pointer' }}
          >
            ✏️ Редактировать
          </li>
          <li
            onClick={() => handleMenuAction('Удалить')}
            style={{ padding: '6px 12px', cursor: 'pointer', color: 'red' }}
          >
            🗑️ Удалить
          </li>
        </ul>
      )}
    </>
  );
};

export default DeviceTreePanel;