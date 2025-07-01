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
import {applyChangesParams} from "./utils/applyChangesParams.ts";

function App() {
  const [isDirty, setIsDirty] = useState(false);
  const [visibleTree, setVisibleTree] = useState<boolean>(false);
  const [visibleDeviceParams, setVisibleDeviceParams] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [initialDeviceParams, setInitialDeviceParams] = useState<DeviceParamsType[]>([]);
  const [deviceParams, setDeviceParams] = useState<DeviceParamsType[]>([]);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    node: null
  });
  const [selectedDeviceKey, setSelectedDeviceKey] = useState<string | null>(null);


  const handleSelect: TreeProps['onSelect'] = async (selectedKeys) => {
    const newKey = selectedKeys[0] as string;

    if (!newKey || newKey === selectedDeviceKey) return;

    if (isDirty) {
      const confirm = window.confirm("Сохранить изменения?");
      if (confirm) {
        const form = document.querySelector<HTMLFormElement>('form.params');
        if (form) {
          await applyChangesParams(form, deviceParams, setIsDirty);
        }
        setSelectedDeviceKey(newKey);
        setIsDirty(false);
      } else {
        setIsDirty(false);
        setSelectedDeviceKey(newKey);
      }
    }

    setDeviceParams(initialDeviceParams.filter(param => param.parentKey === selectedKeys[0]));
    setVisibleDeviceParams(true);
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
            {visibleDeviceParams && <DeviceParams isDirty={isDirty} setIsDirty={setIsDirty} deviceParams={deviceParams}/>}
          </MainLayout>}
    </>
  )
}

export default App
