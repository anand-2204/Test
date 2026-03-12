import Data from "./Pages/Data"
import WorkflowEditor from "./components/WorkflowEditor/WorkflowEditor"
import { BrowserRouter, Routes, Route } from "react-router-dom"
function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Data />} />
          <Route path="/workflow" element={<WorkflowEditor />} />



        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
