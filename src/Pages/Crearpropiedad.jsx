import { useState } from 'react'
import { supabase } from '../SupabaseCliente'
import { useNavigate } from 'react-router-dom'
import Header from '../Pages/Header.jsx'
import '../Estilos/CrearPropiedad.css'

const CATEGORIAS = ['alcoba', 'baño', 'sala', 'comedor', 'cocina']

function Crearpropiedad() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [location, setLocation] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState(null)

  const [description, setDescription] = useState('')
  const [bedrooms, setBedrooms] = useState(1)
  const [bathrooms, setBathrooms] = useState(1)
  const [area, setArea] = useState('')

  const [imagenesInteriores, setImagenesInteriores] = useState([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [step, setStep] = useState(1)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleAddInterior = (e) => {
    const files = Array.from(e.target.files)
    const nuevas = files.map((file, i) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      descripcion: '',
      orden: imagenesInteriores.length + i + 1
    }))
    setImagenesInteriores(prev => [...prev, ...nuevas])
    e.target.value = null
  }

  const handleDescripcionChange = (index, valor) => {
    setImagenesInteriores(prev =>
      prev.map((img, i) => i === index ? { ...img, descripcion: valor } : img)
    )
  }

  const handleRemoveInterior = (index) => {
    setImagenesInteriores(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let imageUrl = null
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`
        const { error: uploadError } = await supabase.storage
          .from('imagenes')
          .upload(fileName, imageFile)

        if (uploadError) throw new Error('Error al subir la imagen principal: ' + uploadError.message)

        const { data: urlData } = supabase.storage
          .from('imagenes')
          .getPublicUrl(fileName)

        imageUrl = urlData.publicUrl
      }

      const { data: listado, error: listadoError } = await supabase
        .from('listados')
        .insert([{ title, price: parseFloat(price), location, image: imageUrl }])
        .select()
        .single()

      if (listadoError) throw new Error('Error al crear la propiedad: ' + listadoError.message)

      const { error: detalleError } = await supabase
        .from('listados_detalles')
        .insert([{
          listado_id: listado.id,
          description,
          bedrooms: parseInt(bedrooms),
          bathrooms: parseInt(bathrooms),
          area: parseFloat(area) || null
        }])

      if (detalleError) throw new Error('Error al guardar los detalles: ' + detalleError.message)

      for (let i = 0; i < imagenesInteriores.length; i++) {
        const img = imagenesInteriores[i]
        const fileName = `interior-${Date.now()}-${i}-${img.file.name}`

        const { error: uploadError } = await supabase.storage
          .from('imagenes')
          .upload(fileName, img.file)

        if (uploadError) throw new Error(`Error al subir imagen interior ${i + 1}`)

        const { data: urlData } = supabase.storage
          .from('imagenes')
          .getPublicUrl(fileName)

        const { error: interiorError } = await supabase
          .from('imagenes_interior')
          .insert([{
            listado_id: listado.id,
            url: urlData.publicUrl,
            descripcion: img.descripcion || null,
            orden: img.orden
          }])

        if (interiorError) throw new Error(`Error al guardar imagen interior ${i + 1}`)
      }

      alert('¡Propiedad creada exitosamente! 🎉')
      navigate('/')

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="crear-wrapper">
      <Header />

      <div className="crear-container">
        <div className="crear-header">
          <h1 className="crear-titulo">Publicar propiedad</h1>
          <p className="crear-subtitulo">Completa la información para listar tu alojamiento</p>

          {/* STEPS */}
          <div className="steps-bar">
            <div className={`step ${step >= 1 ? 'step--active' : ''}`}>
              <span className="step-num">1</span>
              <span className="step-label">Información básica</span>
            </div>
            <div className="step-line" />
            <div className={`step ${step >= 2 ? 'step--active' : ''}`}>
              <span className="step-num">2</span>
              <span className="step-label">Detalles</span>
            </div>
            <div className="step-line" />
            <div className={`step ${step >= 3 ? 'step--active' : ''}`}>
              <span className="step-num">3</span>
              <span className="step-label">Galería</span>
            </div>
          </div>
        </div>

        <form className="crear-form" onSubmit={handleSubmit}>

          {step === 1 && (
            <div className="form-step">
              <div className="field-group">
                <label className="field-label">Foto principal</label>
                <div
                  className={`upload-area ${preview ? 'upload-area--filled' : ''}`}
                  onClick={() => document.getElementById('img-input').click()}
                >
                  {preview ? (
                    <img src={preview} alt="preview" className="upload-preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <span className="upload-icon">📷</span>
                      <p>Haz clic para subir una foto</p>
                      <small>JPG, PNG o WEBP · Máx 5 MB</small>
                    </div>
                  )}
                </div>
                <input id="img-input" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </div>

              <div className="field-group">
                <label className="field-label">Título del alojamiento</label>
                <input className="field-input" type="text" placeholder="Ej: Apartamento con vista al mar en El Rodadero" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div className="field-group">
                <label className="field-label">Ubicación</label>
                <input className="field-input" type="text" placeholder="Ej: Santa Marta, Colombia" value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>

              <div className="field-group">
                <label className="field-label">Precio por noche (COP)</label>
                <div className="input-precio">
                  <span className="precio-prefix">$</span>
                  <input className="field-input field-input--precio" type="number" placeholder="150000" value={price} onChange={(e) => setPrice(e.target.value)} required min="1" />
                </div>
              </div>

              {error && <p className="form-error">⚠️ {error}</p>}

              <button type="button" className="btn-siguiente" onClick={() => {
                if (!title || !location || !price) { setError('Completa todos los campos antes de continuar'); return }
                setError(null); setStep(2)
              }}>
                Siguiente →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <div className="field-group">
                <label className="field-label">Descripción</label>
                <textarea className="field-textarea" placeholder="Describe tu propiedad: qué la hace especial, qué incluye, reglas de la casa..." value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label className="field-label">Alcobas</label>
                  <div className="counter">
                    <button type="button" onClick={() => setBedrooms(b => Math.max(1, b - 1))}>−</button>
                    <span>{bedrooms}</span>
                    <button type="button" onClick={() => setBedrooms(b => Math.min(20, b + 1))}>+</button>
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label">Baños</label>
                  <div className="counter">
                    <button type="button" onClick={() => setBathrooms(b => Math.max(1, b - 1))}>−</button>
                    <span>{bathrooms}</span>
                    <button type="button" onClick={() => setBathrooms(b => Math.min(20, b + 1))}>+</button>
                  </div>
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Área (m²) <span className="opcional">opcional</span></label>
                <input className="field-input" type="number" placeholder="Ej: 80" value={area} onChange={(e) => setArea(e.target.value)} min="1" />
              </div>

              <div className="btn-row">
                <button type="button" className="btn-volver" onClick={() => setStep(1)}>← Volver</button>
                <button type="button" className="btn-siguiente" style={{ flex: 2 }} onClick={() => { setError(null); setStep(3) }}>
                  Siguiente →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <div className="field-group">
                <label className="field-label">
                  Imágenes interiores <span className="opcional">opcional</span>
                </label>
                <p className="field-hint">Sube fotos de alcobas, baños, sala, cocina, etc. Estas aparecen en la galería del detalle.</p>

                <div
                  className="upload-area upload-area--small"
                  onClick={() => document.getElementById('interior-input').click()}
                >
                  <div className="upload-placeholder">
                    <span className="upload-icon">🖼️</span>
                    <p>Agregar fotos interiores</p>
                    <small>Puedes seleccionar varias a la vez</small>
                  </div>
                </div>
                <input
                  id="interior-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAddInterior}
                  style={{ display: 'none' }}
                />
              </div>

              {imagenesInteriores.length > 0 && (
                <div className="interiores-lista">
                  {imagenesInteriores.map((img, index) => (
                    <div className="interior-item" key={index}>
                      <img src={img.previewUrl} alt={`interior-${index}`} className="interior-thumb" />
                      <div className="interior-info">
                        <label className="field-label" style={{ fontSize: '0.75rem' }}>Categoría</label>
                        <select
                          className="field-input"
                          value={img.descripcion}
                          onChange={(e) => handleDescripcionChange(index, e.target.value)}
                        >
                          <option value="">Selecciona una categoría</option>
                          {CATEGORIAS.map(cat => (
                            <option key={cat} value={cat}>
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        className="interior-remove"
                        onClick={() => handleRemoveInterior(index)}
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="resumen-preview">
                <h3>Resumen final</h3>
                <div className="resumen-grid">
                  {preview && <img src={preview} alt="preview" className="resumen-img" />}
                  <div>
                    <p className="resumen-title">{title}</p>
                    <p className="resumen-loc">📍 {location}</p>
                    <p className="resumen-price">${parseFloat(price || 0).toLocaleString()} / noche</p>
                    <p className="resumen-stats">🛏 {bedrooms} alcobas · 🚿 {bathrooms} baños{area ? ` · 📐 ${area} m²` : ''}</p>
                    <p className="resumen-stats">🖼️ {imagenesInteriores.length} fotos interiores</p>
                  </div>
                </div>
              </div>

              {error && <p className="form-error">⚠️ {error}</p>}

              <div className="btn-row">
                <button type="button" className="btn-volver" onClick={() => setStep(2)}>← Volver</button>
                <button type="submit" className="btn-publicar" disabled={loading}>
                  {loading ? 'Publicando...' : '🚀 Publicar propiedad'}
                </button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  )
}

export default Crearpropiedad
