import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
// Import other pages when created
// import ProductDetail from "./pages/ProductDetail";
// import CreateListing from "./pages/CreateListing";
// import LoginPage from "./pages/LoginPage";
// import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Add more routes as we create components */}
          {/* <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/create" element={<CreateListing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
