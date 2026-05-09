import React from 'react'

function GallerySection({imagenes,galeriaActiva,setGaleriaActiva,imgModal,setImgModal,}) {

    const categorias = ['todas', 'alcoba', 'baño', 'sala', 'comedor', 'cocina']

  const imagenesFiltradas = galeriaActiva === 'todas'
    ? imagenes
    : imagenes.filter(img => img.descripcion?.toLowerCase().includes(galeriaActiva))
    
  return (
    <section className="seccion">
            <h2 className="seccion-title">Galería</h2>

            <div className="galeria-filtros">
              {categorias.map(cat => (
                <button
                  key={cat}
                  className={`filtro-btn ${galeriaActiva === cat ? 'activo' : ''}`}
                  onClick={() => setGaleriaActiva(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {imagenesFiltradas.length > 0 ? (
              <div className="galeria-grid">
                {imagenesFiltradas.map((img, i) => (
                  <div
                    key={img.id}
                    className={`galeria-item ${i === 0 ? 'galeria-item--grande' : ''}`}
                    onClick={() => setImgModal(img.url)}
                  >
                    <img src={img.url} alt={img.descripcion} />
                    <div className="galeria-overlay">
                      <span>{img.descripcion}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="sin-imagenes">No hay imágenes en esta categoría.</p>
            )}
    </section>
  )
}

export default GallerySection