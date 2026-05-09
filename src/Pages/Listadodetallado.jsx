import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../SupabaseCliente'
import DetalleCard from '../components/DetalleCard'

function Listadodetallado() {
  const { id } = useParams()

  const [listados, setListados] = useState(null)
  const [imagenes, setImagenes] = useState([])
  const [user, setUser] = useState(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [personas, setPersonas] = useState(1)
  const [loading, setLoading] = useState(true)
  const [galeriaActiva, setGaleriaActiva] = useState('todas')
  const [imgModal, setImgModal] = useState(null)

  useEffect(() => {
    getListados()
    getUser()
  }, [])

  async function getListados() {
    const { data: listado, error: listadoError } = await supabase
      .from('listados')
      .select(`
        *,
        listados_detalles (*)
      `)
      .eq('id', id)
      .single()

    if (listadoError) {
      console.error('Error trayendo listado:', listadoError)
      setLoading(false)
      return
    }

    const { data: imagenesData, error: imagenesError } = await supabase
      .from('imagenes_interior')
      .select('*')
      .eq('listado_id', id)
      .order('orden', { ascending: true })

    if (imagenesError) {
      console.error('Error trayendo imágenes:', imagenesError)
    }

    setListados(listado)
    setImagenes(imagenesData ?? [])
    setLoading(false)
  }

  async function getUser() {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
  }

  const noches = startDate && endDate
    ? Math.max(0, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)))
    : 0

  async function handleBooking() {
    if (!user) { alert('Debes iniciar sesión'); return }
    if (!startDate || !endDate) { alert('Selecciona fechas'); return }

    const total = listados.price * noches

    const { error } = await supabase.from('reservas').insert([{
      user_id: user.id,
      listado_id: listados.id,
      start_date: startDate,
      end_date: endDate,
      personas,
      total
    }])

    error ? alert('Error al reservar') : alert('¡Reserva hecha! 🔥')
  }

  if (loading) return <div className="loading-screen"><span className="spinner" /> Cargando...</div>
  if (!listados) return <div className="loading-screen">No existe esta propiedad</div>

  return (
    <DetalleCard
      listados={listados}
      imagenes={imagenes}
      galeriaActiva={galeriaActiva}
      setGaleriaActiva={setGaleriaActiva}
      imgModal={imgModal}
      setImgModal={setImgModal}
      startDate={startDate}
      setStartDate={setStartDate}
      endDate={endDate}
      setEndDate={setEndDate}
      personas={personas}
      setPersonas={setPersonas}
      noches={noches}
      handleBooking={handleBooking}
    />
  )
}

export default Listadodetallado