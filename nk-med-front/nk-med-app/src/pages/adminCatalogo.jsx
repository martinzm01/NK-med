import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; 
import { Search, Plus, Package, Edit, Trash2, X, Upload,ChevronRight, ChevronLeft } from "lucide-react";

// Constantes para los selectores
const CATEGORIAS = ["Ambos", "Chaquetas", "Pantalones"];
const GENEROS = ["Hombre", "Mujer", "Unisex"];

export default function PanelCatalogo() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [generoFiltro, setGeneroFiltro] = useState("Todos");

  const [currentImgIndex, setCurrentImgIndex] = useState(0);//para el carrusel
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    precio: 0,
    categoria: "Ambos",
    genero: "Unisex",
    color: "",
    stock: 0,
    imagenes: [], 
    caracteristicas: [],
  });

const moverImagen = (direccion) => {
  const nuevasImgs = [...formData.imagenes];
  const indexActual = currentImgIndex;
  const nuevoIndex = direccion === 'izq' ? indexActual - 1 : indexActual + 1;

  // Verificar que el movimiento sea posible
  if (nuevoIndex < 0 || nuevoIndex >= nuevasImgs.length) return;

  // Intercambiar posiciones
  [nuevasImgs[indexActual], nuevasImgs[nuevoIndex]] = [nuevasImgs[nuevoIndex], nuevasImgs[indexActual]];

  setFormData(prev => ({ ...prev, imagenes: nuevasImgs }));
  setCurrentImgIndex(nuevoIndex); // Seguir a la imagen movida
};

  useEffect(() => {
    fetchProductos();
  }, []);

  async function fetchProductos() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProductos(data || []);
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  }

  // --- LÓGICA DE IMAGEN ---
  async function uploadImage(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('catalogo-img') // Asegúrate de que este bucket exista
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('catalogo-img')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "precio" || name === "stock" ? parseFloat(value) || 0 : value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, imagenes: [...prev.imagenes, ...files] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Procesar imágenes: si son Files, subirlos; si son strings, mantenerlos
      const imageUrls = await Promise.all(
        formData.imagenes.map(async (img) => {
          if (img instanceof File) return await uploadImage(img);
          return img;
        })
      );

      const productData = {
        nombre: formData.nombre,
        precio: formData.precio,
        categoria: formData.categoria,
        genero: formData.genero,
        color: formData.color,
        stock: formData.stock,
        imagenes: imageUrls,
        descripcion: formData.descripcion,
        caracteristicas: formData.caracteristicas,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("productos")
          .update(productData)
          .eq("id", editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("productos")
          .insert([productData]);
        if (error) throw error;
      }

      handleCloseModal();
      fetchProductos();
    } catch (error) {
      alert("Error al guardar: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({ ...product, caracteristicas: product.caracteristicas || []}); // Evita que sea null 
    setCurrentImgIndex(0); // Empezar siempre desde la primera imagen
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este producto?")) {
      await supabase.from("productos").delete().eq("id", id);
      fetchProductos();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setCurrentImgIndex(0);
    setFormData({ nombre: "", precio: 0, categoria: "Ambos", genero: "Unisex", color: "", stock: 0, imagenes: [], descripcion: "", caracteristicas: [] 
  });
  };
  //logica de filtrado
const filteredProducts = productos.filter(p => {
  // 1. Coincidencia por búsqueda (nombre)
  const cumpleBusqueda = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
  
  // 2. Coincidencia por categoría
  const cumpleCategoria = categoriaFiltro === "Todos" || p.categoria === categoriaFiltro;

  // 3. Coincidencia por género
  const cumpleGenero = generoFiltro === "Todos" || p.genero === generoFiltro;

  return cumpleBusqueda && cumpleCategoria && cumpleGenero;
});
return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 pt-20 md:pt-25">
      <div className="max-w-7xl mx-auto">
        
        {/* Header con estética del catálogo */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-[0.2em] uppercase mt-4 md:mt-10">Administración</h1>
          </div>
          
          <div className="flex flex-col md:flex-row w-full md:w-auto items-center gap-4">
            <div className="relative flex w-full md:w-64 md:mt-10">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="BUSCAR PRODUCTO..." 
                className="w-full pl-10 pr-4 py-2 border-b border-[#CEE3E8] bg-transparent focus:outline-none focus:border-[#5A848D] transition-all text-xs tracking-widest"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto bg-[#5A848D] text-white px-6 py-2 md:mt-10 text-xs tracking-widest uppercase cursor-pointer hover:bg-[#405F64] transition-all flex items-center justify-center gap-2"
            >
              <Plus size={14} /> Nuevo
            </button>
          </div>
        </div>

        {/* CONTENEDOR DE FILTROS (Igual a la página de referencia) */}
        <div className="flex flex-col md:flex-row gap-6 border-b border-gray-100 pb-6 mb-8">
          
          {/* Filtro por Categoría */}
          <div className="flex flex-wrap gap-3 items-center md:pr-10">
            <span className="text-xs uppercase tracking-[0.2em] text-gray-700 w-full md:w-24 font-bold">Categoría:</span>
            <div className="flex flex-wrap gap-2">
              {["Todos", ...CATEGORIAS].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaFiltro(cat)}
                  className={`text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 transition-all border ${
                    categoriaFiltro === cat 
                      ? "bg-black text-white border-black font-bold shadow-sm" 
                      : "bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro por Género */}
          <div className="flex flex-wrap gap-3 items-center md:pl-10">
            <span className="text-xs uppercase tracking-[0.2em] text-gray-700 w-full md:w-24 font-bold md:pl-5">Género:</span>
            <div className="flex flex-wrap gap-2">
              {["Todos", ...GENEROS].map((gen) => (
                <button
                  key={gen}
                  onClick={() => setGeneroFiltro(gen)}
                  className={`text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 transition-all border ${
                    generoFiltro === gen 
                      ? "bg-teal-700 text-white border-teal-700 font-bold shadow-sm" 
                      : "bg-white text-gray-400 border-gray-100 hover:border-teal-700 hover:text-teal-700"
                  }`}
                >
                  {gen}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabla de Productos - Agregado scroll horizontal y responsividad */}
        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden rounded-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Imagen</th>
                  <th className="p-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Nombre</th>
                  <th className="hidden md:table-cell p-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Categoría</th>
                  <th className="hidden sm:table-cell p-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Género</th>
                  <th className="p-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Precio</th>
                  <th className="p-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Stock</th>
                  <th className="p-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 ">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <img src={p.imagenes?.[0]} alt="" className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-sm border border-gray-100" />
                    </td>
                    <td className="p-4">
                      <div className="text-xs font-medium uppercase tracking-wider">{p.nombre}</div>
                      <div className="md:hidden text-[9px] text-gray-400 uppercase mt-1">{p.categoria} | {p.genero}</div>
                    </td>
                    <td className="hidden md:table-cell p-4 text-[10px] text-gray-500 uppercase tracking-widest">{p.categoria}</td>
                    <td className="hidden sm:table-cell p-4 text-[10px] text-gray-500 uppercase tracking-widest">{p.genero}</td>
                    <td className="p-4 text-xs font-bold text-teal-900">${p.precio}</td>
                    <td className="p-4 text-xs  text-teal-900">{p.stock}</td>
                    <td className="p-4">
                      <div className="flex  gap-3">
                        <button onClick={() => handleEdit(p)} className="text-gray-400 hover:text-black transition-all">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-600 transition-all cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
{/* Modal de Gestión */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <div className="bg-white w-full max-w-5xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col lg:flex-row relative animate-in fade-in zoom-in duration-300">
              
              <button onClick={handleCloseModal} className="absolute top-4 right-4 z-[110] p-2 bg-white/80 hover:bg-black cursor-pointer hover:text-white transition-all rounded-full">
                <X size={20} />
              </button>

          {/* COLUMNA 1: IMÁGENES */}
          <div className="w-full lg:w-1/2 bg-slate-50 relative h-[60vh] lg:h-auto overflow-hidden flex items-center justify-center border-r border-slate-100 group">
            {/* El cambio está en: h-[60vh] en lugar de h-[300px] */}
            
            {formData.imagenes && formData.imagenes.length > 0 ? (
              <div className="w-full h-full relative">
                <img 
                  src={formData.imagenes[currentImgIndex] instanceof File ? URL.createObjectURL(formData.imagenes[currentImgIndex]) : formData.imagenes[currentImgIndex]} 
                  alt={`Preview ${currentImgIndex}`} 
                  className="w-full h-full object-contain animate-in fade-in duration-500"
                />

                    {formData.imagenes.length > 1 && (
                      <>
                        <div className="absolute inset-0 flex items-center justify-between px-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity pointer-events-none">
                          <button type="button" onClick={() => setCurrentImgIndex((prev) => (prev === 0 ? formData.imagenes.length - 1 : prev - 1))} className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-black/70 hover:text-white transition-all pointer-events-auto">
                            <ChevronLeft size={20} />
                          </button>
                          <button type="button" onClick={() => setCurrentImgIndex((prev) => (prev === formData.imagenes.length - 1 ? 0 : prev + 1))} className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-black/70 hover:text-white transition-all pointer-events-auto">
                            <ChevronRight size={20} />
                          </button>
                        </div>

                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {formData.imagenes.map((_, i) => (
                            <div key={i} className={`h-1 rounded-full transition-all ${i === currentImgIndex ? 'w-6 bg-teal-600' : 'w-2 bg-teal-200'}`} />
                          ))}
                        </div>
                      </>
                    )}

                    <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <div className="bg-white/90 backdrop-blur px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-teal-900 border border-teal-900/10 shadow-sm font-sans">
                          Imagen {currentImgIndex + 1} de {formData.imagenes.length}
                        </div>
                        <button type="button" onClick={() => {
                          const nuevasImgs = formData.imagenes.filter((_, i) => i !== currentImgIndex);
                          setFormData(prev => ({ ...prev, imagenes: nuevasImgs }));
                          setCurrentImgIndex(0);
                        }} className="bg-white/90 text-red-600 p-2 rounded-full cursor-pointer hover:bg-red-600 hover:text-white transition-all shadow-sm">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {formData.imagenes.length > 1 && (
                        <div className="flex gap-2">
                          <button type="button" disabled={currentImgIndex === 0} onClick={() => moverImagen('izq')} className="flex-1 bg-white/90 py-2 text-[9px] uppercase tracking-widest font-bold disabled:opacity-30 hover:bg-teal-600 hover:text-white transition-all shadow-sm border border-teal-900/10">← Definir como anterior</button>
                          <button type="button" disabled={currentImgIndex === formData.imagenes.length - 1} onClick={() => moverImagen('der')} className="flex-1 bg-white/90 py-2 text-[9px] uppercase tracking-widest font-bold disabled:opacity-30 hover:bg-teal-600 hover:text-white transition-all shadow-sm border border-teal-900/10">Definir como siguiente →</button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-300">
                    <Upload size={48} strokeWidth={1} />
                    <p className="mt-4 text-[10px] uppercase tracking-widest">Sin imágenes</p>
                  </div>
                )}
              </div>

              {/* COLUMNA 2: FORMULARIO */}
              <div className="lg:w-0.8 p-6 lg:p-8 flex flex-col bg-white overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-5 font-serif">
                  <header className="mb-2">
                    <span className="text-teal-600 text-[10px] uppercase tracking-[0.3em] font-bold mb-1 block font-sans">
                      {editingProduct ? "Editor de Catálogo" : "Nueva Pieza"}
                    </span>
                    <h2 className="text-2xl lg:text-3xl text-teal-950 uppercase tracking-tighter leading-tight">
                      {formData.nombre || "Nombre del Producto"}
                    </h2>
                  </header>

                  <div className="space-y-5 font-sans">
                    <div className="border-b border-slate-100 pb-1">
                      <label className="text-[9px] uppercase tracking-widest text-slate-400 block">Nombre de la prenda</label>
                      <input name="nombre" value={formData.nombre} onChange={handleInputChange} required className="w-full py-1 bg-transparent focus:outline-none text-teal-950 text-base" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="border-b border-slate-100 pb-1">
                        <label className="text-[9px] uppercase tracking-widest text-slate-600 block">Precio (USD)</label>
                        <input type="number" name="precio" value={formData.precio} onChange={handleInputChange} required className="w-full py-1 bg-transparent focus:outline-none text-teal-950 text-lg font-bold" />
                      </div>
                      <div className="border-b border-slate-100 pb-1">
                        <label className="text-[9px] uppercase tracking-widest text-slate-600 block">Stock</label>
                        <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required className="w-full py-1 bg-transparent focus:outline-none text-teal-950 text-lg font-bold" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="border-b border-slate-100 pb-1">
                        <label className="text-[9px] uppercase tracking-widest text-slate-600 block">Categoría</label>
                        <select name="categoria" value={formData.categoria} onChange={handleInputChange} className="w-full bg-transparent focus:outline-none text-teal-950 text-[10px] uppercase tracking-widest">
                          {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="border-b border-slate-100 pb-1">
                        <label className="text-[9px] uppercase tracking-widest text-slate-600 block">Género</label>
                        <select name="genero" value={formData.genero} onChange={handleInputChange} className="w-full py-1 bg-transparent focus:outline-none text-teal-900 text-[10px] uppercase tracking-widest">
                          {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="border-b border-[#CEE3E8] flex">
                      <div className="w-full">
                        <label className="text-[9px] uppercase tracking-widest text-slate-600 block mt-2">Variante de Color</label>
                        <div className="flex items-center gap-3">
                          <input type="text" name="color" value={formData.color || ""} onChange={handleInputChange} placeholder="Ej: Azul Aero..." className="w-full py-1 bg-transparent focus:outline-none text-teal-950 text-sm font-sans tracking-wide" />
                          <div className="w-2 h-2 rounded-full border border-slate-200 shrink-0" style={{ backgroundColor: formData.color?.toLowerCase() || 'transparent' }} />
                        </div>
                      </div>
                    </div>

                    <div className="border-b border-[#CEE3E8] pb-1">
                      <label className="text-[9px] uppercase tracking-widest text-slate-500 block">Descripción</label>
                      <textarea name="descripcion" value={formData.descripcion || ""} onChange={handleInputChange} rows={2} className="w-full py-1 bg-transparent focus:outline-none text-slate-600 font-serif italic text-sm leading-snug resize-none" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-slate-600 block">Características Técnicas</label>
                      <input type="text" className="w-full border-b border-[#CEE3E8] py-1 text-[11px] focus:outline-none bg-transparent" onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = e.target.value.trim();
                          if (val) {
                            setFormData(prev => ({...prev, caracteristicas: [...(prev.caracteristicas || []), val]}));
                            e.target.value = "";
                          }
                        }
                      }} />
                      <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                        {formData.caracteristicas?.map((item, index) => (
                          <span key={index} className="flex items-center gap-1 bg-teal-50 text-teal-900 px-2 py-1 rounded-sm text-[8px] uppercase tracking-widest border border-teal-100">
                            {item}
                            <button type="button" onClick={() => setFormData(prev => ({...prev, caracteristicas: prev.caracteristicas.filter((_, i) => i !== index)}))}>
                              <X size={8} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-3 cursor-pointer group bg-teal-50 p-3 rounded-sm border border-slate-100 hover:bg-teal-100 transition-all">
                        <Upload size={14} className="text-teal-600" />
                        <p className="text-[9px] font-bold uppercase tracking-widest text-teal-900">Agregar Imagen</p>
                        <input type='file' className="hidden" onChange={handleFileChange} accept="image/*" />
                      </label>
                    </div>
                  </div>

                  <button disabled={isSubmitting} className="w-full bg-[#5A848D] text-white py-4 px-8 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-teal-900 cursor-pointer transition-all shadow-lg disabled:bg-slate-300 mt-4">
                    {isSubmitting ? "GUARDANDO..." : (editingProduct ? "ACTUALIZAR" : "PUBLICAR")}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}