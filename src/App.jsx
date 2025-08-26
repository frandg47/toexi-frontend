import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "./services/axiosInstance";

// Componentes
import PublicTable from "./pages/PublicTable";
import AdminTable from "./components/AdminTable";
import LoginPage from "./pages/LoginPage"; // Asumimos que tienes un componente de login


// Componente para proteger las rutas
function ProtectedRoute({ children, isAuthenticated }) {
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Verificar la autenticación al cargar la app
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axiosInstance.get("/auth/check"); // Un endpoint para validar el token
        setIsAuthenticated(true);
      } catch (err) {
        console.error("No autenticado", err);
        setIsAuthenticated(false);
      } finally {
        setLoadingAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (loadingAuth) {
    return <div>Cargando...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<PublicTable />} />

        {/* Rutas de Administración (Protegidas) */}
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/login"
          element={<LoginPage onLogin={() => setIsAuthenticated(true)} />}
        />

        {/* Ruta para capturar cualquier URL no definida */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
