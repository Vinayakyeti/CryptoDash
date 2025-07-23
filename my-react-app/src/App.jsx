import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import CryptoDashboard from "./CryptoDashboard";
import Login from "./Login";
import Signup from "./Signup";
import NotFound from "./NotFound";

const App = () => {
  const [search, setSearch] = useState("");
  const [currency, setCurrency] = useState("usd");

  return (
    <BrowserRouter>
      <Navbar setSearch={setSearch} currency={currency} setCurrency={setCurrency} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<CryptoDashboard search={search} currency={currency} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;