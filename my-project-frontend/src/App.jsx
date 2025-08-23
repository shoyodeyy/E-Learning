import StudentRouter from "./routes/StudentRouter.jsx";
import {BrowserRouter} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
        <StudentRouter />
    </BrowserRouter>
  )
}

export default App