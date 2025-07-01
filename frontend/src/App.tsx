import './App.css';
import DeviceTreePanel from "./components/DeviceTreePanel/DeviceTreePanel.tsx";
import MainLayout from "./layout/MainLayout/MainLayout.tsx";
import HeaderBar from "./components/HeaderBar/HeaderBar.tsx";
import StartMenu from "./components/StartMenu/StartMenu.tsx";
import type {DataNode} from 'rc-tree/es/interface';
import {useState} from "react";
import type {TreeProps} from "rc-tree";
import DeviceParams from "./components/DeviceParams/DeviceParams.tsx";
import type {DeviceParamsType} from "./types/nodeType.ts";
import type {ContextMenuState} from "./types/ContextMenuState.ts";

function App() {
  const [visibleTree, setVisibleTree] = useState<boolean>(true);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [initialDeviceParams, setInitialDeviceParams] = useState<DeviceParamsType[]>([]);
  const [deviceParams, setDeviceParams] = useState<DeviceParamsType[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    node: null
  });

  const handleSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    setDeviceParams(initialDeviceParams.filter(param => param.parentKey === selectedKeys[0]));
  };

  const handleRightClick = (info) => {
    setContextMenu({
      visible: true,
      x: info.event.clientX,
      y: info.event.clientY,
      node: info.node,
    });
  }

  return (
    <>
      <HeaderBar />
      <StartMenu
        setTreeData={setTreeData}
        setInitialDeviceParams={setInitialDeviceParams}
        setVisibleTree={setVisibleTree}
      />

      {visibleTree &&
          <MainLayout>
            <DeviceTreePanel
                treeData={treeData}
                handleSelect={handleSelect}
                handleRightClick={handleRightClick}
                contextMenu={contextMenu}
                setContextMenu={setContextMenu}
            />
              <DeviceParams deviceParams={deviceParams} />
          </MainLayout>}
    </>
  )
}

export default App
