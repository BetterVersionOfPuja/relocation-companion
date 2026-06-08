import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import ChangePassword from "./pages/ChangePassword";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import SavedMoves from "./pages/SavedMoves";

function App() {
  return (
    <BrowserRouter>
      <main className="app-shell">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-moves"
            element={
              <ProtectedRoute>
                <SavedMoves />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
