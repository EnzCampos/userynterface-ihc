import { Routes, Route } from "react-router";
import Home from "./pages/home/home";
import FormPage from "./pages/form/form";
import UserProfile from "./pages/user-profile/user-profile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/form" element={<FormPage />} />
      <Route path="/profile" element={<UserProfile />} />
    </Routes>
  );
}
