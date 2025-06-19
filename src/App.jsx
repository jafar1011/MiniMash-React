import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Home.jsx';
import About from './Pages/About.jsx';
import Games from './Pages/Games.jsx';
import { useEffect } from 'react';
function App() {
  useEffect(() => {
    document.title = "Mini Mash - home";
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/games" element={<Games />} />
      </Routes>
    </Router>
  );
}
export default App
