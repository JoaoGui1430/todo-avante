import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ListDetail from './pages/ListDetail';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
          <div className="max-w-5xl mx-auto">
            <a href="/" className="text-lg font-bold text-blue-600">
              Lista To-Do
            </a>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lists/:id" element={<ListDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}