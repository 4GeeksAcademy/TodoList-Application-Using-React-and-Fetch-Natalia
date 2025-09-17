import React from "react";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import Footer from "./components/Footer.jsx";

const App = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ flexGrow: 1 }}>
        <Home />
      </div>
      <Footer />
    </div>
  );
};

export default App;
