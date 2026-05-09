import React, { useState, useEffect } from 'react'
import { Trash2, CalendarDays, Users, DollarSign, BedDouble } from 'lucide-react'
import { supabase } from '../SupabaseCliente'
import '../Estilos/Reservas.css'


function ReservasSesion() {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelandoId, setCancelandoId] = useState(null)

  useEffect(() => {
    getReservas()
  }, [])

  async function getReservas() {
    setLoading(true)
 
    // 1. Obtener el usuario actualmente logueado
    const { data: { user } } = await supabase.auth.getUser()
 
    if (!user) {
      setLoading(false)
      return
    }
 
    // 2. Filtrar reservas por user_id del usuario logueado
    const { data } = await supabase
      .from('reservas')
      .select(`
        id,
        start_date,
        end_date,
        personas,
        total,
        listados ( title, image, location )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
 
    if (data) setReservas(data)
    setLoading(false)
  }

  async function cancelarReserva(id) {
    setCancelandoId(id)
    const { error } = await supabase
      .from('reservas')
      .delete()
      .eq('id', id)

    if (!error) {
      setReservas(prev => prev.filter(r => r.id !== id))
    } else {
      console.error('Error al cancelar reserva:', error)
    }
    setCancelandoId(null)
  }

  return (
    <div className="reservas-sesion">
      <div className="reservas-sesion-header">
        <h1>Mis Reservas</h1>
        {!loading && (
          <span className="reservas-count">
            {reservas.length} {reservas.length === 1 ? 'reserva' : 'reservas'}
          </span>
        )}
      </div>

      {loading ? (
        <div className="reservas-sesion-loading">
          <div className="spinner" />
          <p>Cargando reservas...</p>
        </div>
      ) : reservas.length === 0 ? (
        <div className="reservas-sesion-empty">
          <BedDouble size={48} color="#ccc" />
          <p>Aún no tienes reservas</p>
          <span>Explora alojamientos y haz tu primera reserva</span>
        </div>
      ) : (
        <div className="reservas-sesion-list">
          {reservas.map(r => (
            <div className="reservas-sesion-card" key={r.id}>
              <img
                src={r.listados?.image}
                alt={r.listados?.title}
                className="reservas-sesion-img"
              />
              <div className="reservas-sesion-info">
                <h2 className="reservas-sesion-title">{r.listados?.title}</h2>
                {r.listados?.location && (
                  <p className="reservas-sesion-location">📍 {r.listados.location}</p>
                )}
                <div className="reservas-sesion-meta">
                  <span><CalendarDays size={14} /> {r.start_date} → {r.end_date}</span>
                  <span><Users size={14} /> {r.personas} personas</span>
                  <span className="reservas-sesion-total">
                    <DollarSign size={14} /> ${r.total?.toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                className="btn-cancelar-reserva"
                onClick={() => cancelarReserva(r.id)}
                disabled={cancelandoId === r.id}
              >
                <Trash2 size={14} />
                {cancelandoId === r.id ? 'Cancelando...' : 'Cancelar reserva'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReservasSesion