// src/components/AdminTable.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle, Search, Trash, Pencil } from "lucide-react";
import ProductForm from "./ProductForm";

export default function AdminTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/admin/products");
      setProducts(response.data);
    } catch (e) {
      console.error("Error fetching admin products:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (product) => {
    setProductToEdit(product);
    setIsFormVisible(true);
  };

  const handleCreateClick = () => {
    setProductToEdit(null); // Limpia el estado para crear uno nuevo
    setIsFormVisible(true);
  };

  const handleDeleteClick = async (productId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      try {
        await axios.delete(`/api/admin/products/${productId}`);
        fetchData(); // Refresca la lista
      } catch (e) {
        console.error("Error deleting product:", e);
      }
    }
  };

  const handleFormSaved = () => {
    setIsFormVisible(false); // Oculta el formulario
    fetchData(); // Refresca la tabla para ver los cambios
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (isFormVisible) {
    return <ProductForm productToEdit={productToEdit} onSaved={handleFormSaved} />;
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Productos</h1>
        <button
          onClick={handleCreateClick}
          className="flex items-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition"
        >
          <PlusCircle size={20} />
          <span>Nuevo Producto</span>
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por nombre o marca..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Portada</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Precio USD</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-gray-100 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={p.image_url || "https://via.placeholder.com/60"}
                    alt={p.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.brand}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                  <span className={p.stock < 2 ? "text-red-600" : "text-green-600"}>{p.stock}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${p.usd_price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleEditClick(p)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(p.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Eliminar"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}