import { BrowserRouter , Routes , Route } from "react-router-dom"
import Auth from "./pages/Auth/Auth"

function App() {
  return(
    <BrowserRouter>
        <Routes>
          <Route element={<Auth />} path="/login" />
        </Routes>
    </BrowserRouter>
  )
}

export default App
