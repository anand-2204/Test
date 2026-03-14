import Data from "./Pages/Data"
import WorkflowEditor from "./Pages/WorkflowEditor"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import GpsRecord from "./Pages/GpsRecord"



function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Data />} />
          <Route path="/workflow" element={<WorkflowEditor />} />
          <Route path="/gpsrecord" element={<GpsRecord />} />



        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
