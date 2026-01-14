import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/homepage.jsx";
import ChatPage from "./pages/chatpage.jsx";
import ResetPassword from "./pages/ResetPassword";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chats" element={<ChatPage />} />
        
        {/* 👇 THIS WAS MISSING. ADD IT NOW 👇 */}
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
        
      </Routes>
    </div>
  );
}

export default App;