import { useState, useRef, useEffect } from 'react'
import { Menu, User, MessageCircle, Globe, Settings, Plane } from 'lucide-react'
import { supabase } from '../../SupabaseCliente'
import { Link } from 'react-router-dom'
import Favoritos from './Favoritos'

function UserMenu({ user }) { 
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <Menu size={20} />
      </div>

      <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>

        <Favoritos user={user} />

        <a href="#"><Plane /> Viajes</a>
        <a href="#"><MessageCircle /> Mensajes</a>
        <a href="#"><User /> Perfil</a>
        <a href="#"><Settings /> Configuración</a>
        <a href="#"><Globe /> Idiomas</a>
        <Link to="/crear">Hazte Anfitrión</Link>

        <a href="#" onClick={handleLogout}>
          <User /> Cerrar sesión
        </a>
      </div>
    </div>
  )
}

export default UserMenu