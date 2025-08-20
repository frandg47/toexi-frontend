import { useEffect, useState } from "react";
import { getProducts } from "../services/products";
import { io } from "socket.io-client";
import { Search } from "lucide-react";

const socket = io("http://localhost:3000");

export default function TablaStock() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchData = async () => {
    try {
      const prodData = await getProducts();
      setProducts(prodData);
    } catch (e) {
      console.error("Error fetching products:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    socket.on("products.updated", fetchData);
    return () => socket.off("products.updated", fetchData);
  }, []);

  const formatCurrency = (value, currency = "ARS") =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency }).format(value);

  // Obtenemos marcas y categorías únicas
  const brands = [...new Set(products.map((p) => p.brand))];
  const categories = [...new Set(products.map((p) => p.category))];

  // Filtramos resultados
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (selectedBrand === "" || p.brand === selectedBrand) &&
    (selectedCategory === "" || p.category === selectedCategory)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      {/* <h1 className="text-2xl font-bold mb-4">Productos</h1> */}

      {/* Barra de búsqueda + filtros */}
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Search bar */}
        <div className="flex items-center flex-1 bg-gray-100 px-3 py-2 rounded-lg">
          <Search size={18} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent outline-none"
          />
        </div>

        {/* Filtro Marca */}
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Todas las marcas</option>
          {brands.map((b, idx) => (
            <option key={idx} value={b}>
              {b}
            </option>
          ))}
        </select>

        {/* Filtro Categoría */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c, idx) => (
            <option key={idx} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Portada</th>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-center">Stock</th>
              <th className="px-4 py-2 text-left">Marca</th>
              <th className="px-4 py-2 text-left">Categoría</th>
              <th className="px-4 py-2 text-center">USD</th>
              <th className="px-4 py-2 text-center">ARS</th>
              {products[0]?.pricesByMethod?.map((pm, idx) => (
                <th key={idx} className="px-4 py-2 text-center">{pm.method}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="border-t hover:bg-gray-50 transition"
              >
                {/* Portada */}
                <td className="px-4 py-2">
                  <img
                    src={p.image || "https://via.placeholder.com/80"}
                    alt={p.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2">{p.name}</td>
                <td
                  className={`px-4 py-2 text-center font-semibold ${
                    p.stock < 2 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {p.stock}
                </td>
                <td className="px-4 py-2">{p.brand}</td>
                <td className="px-4 py-2">{p.category}</td>
                <td className="px-4 py-2 text-center">{formatCurrency(p.usd, "USD")}</td>
                <td className="px-4 py-2 text-center">{formatCurrency(p.ars)}</td>
                {p.pricesByMethod?.map((pm, idx) => (
                  <td key={idx} className="px-4 py-2 text-center">{formatCurrency(pm.price)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
