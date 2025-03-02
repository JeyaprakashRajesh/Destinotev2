import { BrowserRouter , Routes , Route } from "react-router-dom"
import Auth from "./pages/Auth/Auth"
import Home from "./pages/Home/Home"

function App() {
  return(
    <BrowserRouter>
        <Routes>
          <Route element={<Auth />} path="/auth" />
          <Route element={<Home />} path="/home" />
        </Routes>
    </BrowserRouter>
  )
}

export default App
