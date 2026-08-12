import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventDetails from './pages/EventDetails';
import MyRegistrations from './pages/MyRegistrations';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import Scanner from './pages/Scanner';

function App() {
  const { loading } = useAuth();

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/my-registrations" element={<MyRegistrations />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/scan" element={<Scanner />} />
      </Routes>
    </div>
  );
}

export default App;