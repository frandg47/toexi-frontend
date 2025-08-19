import { useEffect, useState } from "react";
import { getProducts } from "../services/products";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function TablaStockCompleta() {
  const [products, setProducts] = useState([]);

  const fetchData = async () => {
    try {
      const prodData = await getProducts();
      setProducts(prodData);
    } catch (e) {
      console.error("Error fetching products:", e);
    }
  };

  useEffect(() => {
    fetchData();

    socket.on("products.updated", fetchData);
    socket.on("fx.updated", fetchData);
    socket.on("payments.updated", fetchData);

    return () => {
      socket.off("products.updated", fetchData);
      socket.off("fx.updated", fetchData);
      socket.off("payments.updated", fetchData);
    };
  }, []);

  const formatCurrency = (value, currency = "ARS") =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency }).format(value);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Stock de Productos</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Marca</th>
              <th className="px-4 py-2 border">Categoría</th>
              <th className="px-4 py-2 border">USD</th>
              <th className="px-4 py-2 border">ARS</th>
              {products[0]?.paymentPrices?.map((pm, idx) => (
                <th key={idx} className="px-4 py-2 border">{pm.name}</th>
              ))}
              <th className="px-4 py-2 border">Stock</th>
              <th className="px-4 py-2 border">Backorder</th>
              <th className="px-4 py-2 border">Comisión</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className={p.stock < 5 ? "bg-red-50" : ""}>
                <td className="px-4 py-2 border">{p.id}</td>
                <td className="px-4 py-2 border">{p.name}</td>
                <td className="px-4 py-2 border">{p.brand}</td>
                <td className="px-4 py-2 border">{p.category}</td>
                <td className="px-4 py-2 border">{formatCurrency(p.usd_price, "USD")}</td>
                <td className="px-4 py-2 border">{formatCurrency(p.ars_price)}</td>
                {p.paymentPrices.map((pm, idx) => (
                  <td key={idx} className="px-4 py-2 border">{formatCurrency(pm.price)}</td>
                ))}
                <td className={`px-4 py-2 border font-semibold ${p.stock < 5 ? "text-red-600" : ""}`}>{p.stock}</td>
                <td className="px-4 py-2 border">{p.allow_backorder ? p.lead_time_label : "Disponible"}</td>
                <td className="px-4 py-2 border">
                  {p.commission_pct ? `${(p.commission_pct*100).toFixed(0)}%` : ""}
                  {p.commission_fixed ? ` $${p.commission_fixed.toFixed(2)}` : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
