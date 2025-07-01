import './App.css'
import DeviceTreePanel from "./components/DeviceTreePanel/DeviceTreePanel.tsx";
import MainLayout from "./layout/MainLayout/MainLayout.tsx";
import HeaderBar from "./components/HeaderBar/HeaderBar.tsx";
import StartMenu from "./components/StartMenu/StartMenu.tsx";

function App() {
  return (
    <>
      <HeaderBar />
      <StartMenu />
      {/*<MainLayout>*/}
      {/*  <DeviceTreePanel />*/}
      {/*</MainLayout>*/}
    </>
  )
}

export default App
