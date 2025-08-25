// src/components/ProductForm.jsx
import { useEffect, useState } from "react";
import axios from "axios";

// Este componente servirá para crear y editar productos
export default function ProductForm({ productToEdit = null, onSaved }) {
  const [formData, setFormData] = useState({
    name: "",
    brand_id: "",
    category_id: "",
    usd_price: "",
    image: null, // Campo para la imagen
    commission_pct: "",
    commission_fixed: "",
    allow_backorder: false,
    lead_time_label: "",
    active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  // Cargar marcas y categorías al inicio
  useEffect(() => {
    async function loadCatalogs() {
      try {
        const [brandsRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:3000/admin/catalogs/brands"),
          axios.get("http://localhost:3000/admin/catalogs/categories"),
        ]);
        setBrands(brandsRes.data);
        setCategories(categoriesRes.data);
      } catch (e) {
        console.error("Error loading catalogs:", e);
      }
    }
    loadCatalogs();
  }, []);

  // Si se está editando, precargar el formulario con los datos del producto
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || "",
        brand_id: productToEdit.brand_id || "",
        category_id: productToEdit.category_id || "",
        usd_price: productToEdit.usd_price || "",
        image: null, // No precargamos la imagen, se subiría una nueva
        commission_pct: productToEdit.commission_pct || "",
        commission_fixed: productToEdit.commission_fixed || "",
        allow_backorder: !!productToEdit.allow_backorder,
        lead_time_label: productToEdit.lead_time_label || "",
        active: !!productToEdit.active,
      });
    }
  }, [productToEdit]);

  // Manejador para los cambios en los campos de texto y select
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  // Manejador del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const form = new FormData();
      for (const key in formData) {
        form.append(key, formData[key]);
      }

      if (productToEdit) {
        await axios.put(`http://localhost:3000/admin/products/${productToEdit.id}`, form);
      } else {
        await axios.post("http://localhost:3000/admin/products", form);
      }

      // Notificar al componente padre que se guardó correctamente
      onSaved();
    } catch (e) {
      console.error("Save product error:", e);
      setError("Error al guardar el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {productToEdit ? "Editar Producto" : "Crear Producto"}
      </h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Campo Nombre */}
        <div>
          <label className="block text-gray-700">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        {/* Campo Precio USD */}
        <div>
          <label className="block text-gray-700">Precio USD</label>
          <input
            type="number"
            name="usd_price"
            value={formData.usd_price}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
            step="0.01"
          />
        </div>

        {/* Campo Marca */}
        <div>
          <label className="block text-gray-700">Marca</label>
          <select
            name="brand_id"
            value={formData.brand_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">(Sin marca)</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Campo Categoría */}
        <div>
          <label className="block text-gray-700">Categoría</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          >
            <option value="">Seleccione una categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Seccion de Comisión */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Comisión (opcional)</h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-gray-700">Porcentaje (%)</label>
            <input
              type="number"
              name="commission_pct"
              value={formData.commission_pct}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              step="0.01"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700">Monto Fijo (ARS)</label>
            <input
              type="number"
              name="commission_fixed"
              value={formData.commission_fixed}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              step="0.01"
            />
          </div>
        </div>
      </div>

      {/* Seccion de Stock y Encargo */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Stock y Entrega</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="allow_backorder"
              checked={formData.allow_backorder}
              onChange={handleChange}
              className="rounded text-blue-600 shadow-sm"
            />
            <span className="ml-2 text-gray-700">Permitir encargo</span>
          </label>
          <div className="flex-1">
            <label className="block text-gray-700">
              Etiqueta de tiempo de entrega
            </label>
            <input
              type="text"
              name="lead_time_label"
              value={formData.lead_time_label}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Ej: 5 días hábiles"
            />
          </div>
        </div>
      </div>

      {/* Campo para subir la imagen */}
      <div className="mb-4">
        <label className="block text-gray-700">Imagen de Portada</label>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Botón de envío */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        disabled={loading}
      >
        {loading ? "Guardando..." : "Guardar Producto"}
      </button>
    </form>
  );
}