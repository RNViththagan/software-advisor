import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { useState } from "react";

function App() {
  const [hasSearched, setHasSearched] = useState(false);
  // Function to reset the search state
  const resetSearch = () => {
    setHasSearched(false); // Reset the state when the logo is clicked
  };
  return (
    <Router basename="/software-advisor">
      <div className="min-h-screen bg-gray-50">
        <Header onLogoClick={resetSearch} />
        <Routes>
          <Route
            path="/"
            element={
              <Home hasSearched={hasSearched} setHasSearched={setHasSearched} />
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
