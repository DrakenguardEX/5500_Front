import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Team from "./pages/Team";
import MyTasks from "./pages/MyTasks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/team" element={<Team />} />
        <Route path="/my-tasks" element={<MyTasks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
