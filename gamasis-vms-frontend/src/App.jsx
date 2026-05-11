import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Modulos from './pages/Modulos';
import Versiones from './pages/Versiones';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import Proyectos from './pages/Proyectos';
import Documentacion from './pages/Documentacion';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rutas Protegidas — envueltas por DashboardLayout */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/modulos" element={<Modulos />} />
          <Route path="/versiones" element={<Versiones />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/docs" element={<Documentacion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
