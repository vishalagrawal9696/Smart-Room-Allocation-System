import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Dashboard from "./pages/Dashboard";
import RoomsPage from "./pages/RoomsPage";
import AddRoomPage from "./pages/AddRoomPage";
import AllocatePage from "./pages/AllocatePage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/add-room" element={<AddRoomPage />} />
          <Route path="/allocate" element={<AllocatePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
