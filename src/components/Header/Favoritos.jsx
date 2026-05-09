import { useState, useRef, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { supabase } from '../../SupabaseCliente'
import { useFavoritos } from './FavoritosContexto'
import '../../Estilos/Header.css'

function Favoritos() {
  const { favIds, toggleFavorito, user } = useFavoritos()

  const [favoritos, setFavoritos] = useState([])
  const [favoritosOpen, setFavoritosOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setFavoritosOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function getFavoritos() {
    if (!user) return

    const { data, error } = await supabase
      .from('favoritos')
      .select(`
        id,
        listado_id,
        listados (
          id,
          title,
          image,
          price
        )
      `)
      .eq('user_id', user.id)

    if (!error) setFavoritos(data || [])
  }

  async function handleQuitar(f) {
    await toggleFavorito(f.listado_id)
    setFavoritos(prev => prev.filter(x => x.id !== f.id))
  }

  useEffect(() => {
    if (favoritosOpen) {
      setFavoritos(prev => prev.filter(f => favIds.has(f.listado_id)))
    }
  }, [favIds])

  return (
    <div ref={ref} style={{position:'relative'}}>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const opening = !favoritosOpen
          setFavoritosOpen(opening)
          if (opening) getFavoritos()
        }}
      >
        <Heart size={16} /> Favoritos
      </a>

      {favoritosOpen && (
        <div className="favoritos-panel">
          <h3>Mis favoritos</h3>

          {favoritos.length === 0 ? (
            <p>No tienes favoritos aún</p>
          ) : (
            favoritos.map(f => (
              <div key={f.id} className="reserva-item">
                <img src={f.listados?.image} alt="" />
                <div>
                  <p>{f.listados?.title}</p>
                  <p>${f.listados?.price?.toLocaleString()}</p>
                  <button onClick={() => handleQuitar(f)}>
                    Eliminar de Favoritos
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Favoritos