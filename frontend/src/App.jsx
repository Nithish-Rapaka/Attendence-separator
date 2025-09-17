import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import About from './pages/About'
import Home from './pages/Home'
import AOS from "aos";
import "aos/dist/aos.css";
import Login from './pages/Login';
import Register from './pages/Register';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard'
import PrivateRoute from './components/PrivateRoute'

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Register />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
