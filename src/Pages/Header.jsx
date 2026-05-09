import { useState, useEffect } from 'react'
import '../Estilos/Header.css'
import { supabase } from '../SupabaseCliente'

import LogoSection from '../components/Header/LogoSesion'
import Reservas from '../components/Header/ReservasPanel'
import UserMenu from '../components/Header/MenuDesplegable'
import SearchSection from '../components/Header/SearchSesion'

import Experiencias from '../assets/Experiencias.png'
import Servicios from '../assets/Servicios.png'

function Header({ setBuscar }) {

  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return (
    <header className="header">
      <div className='header-inner'>
        <section>

          <LogoSection />

          <nav className="contain">
            <Reservas userInitial={user?.email?.charAt(0)} />

            <a><img src={Experiencias} alt="" /><span>Experiencias</span></a>
            <a><img src={Servicios} alt="" /><span>Servicios</span></a>
          </nav>

          <UserMenu user={user} />

        </section>

        <SearchSection setBuscar={setBuscar} />
      </div>
    </header>
  )
}

export default Header