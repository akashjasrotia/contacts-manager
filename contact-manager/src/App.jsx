import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddContact from "./pages/Add";
import Signup from "./pages/signup";
import Login from "./pages/login";
import UserIndicator from "./components/User";
import LogoutPage from "./pages/logout";
function App() {
  return (
    <div>
      <UserIndicator />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddContact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<LogoutPage/>}/>
      </Routes>
    </div>
  );
}

export default App;
