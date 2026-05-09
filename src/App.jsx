  import './App.css'
import Header from './Pages/Header.jsx'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './SupabaseCliente.js'
import SignIn from './components/InicioSesion.jsx'
import SignUp from './components/Resgistrarse.jsx'
import Home from './Pages/Home.jsx'
import Listadodetallado from './Pages/Listadodetallado.jsx'
import Crearpropiedad from './Pages/Crearpropiedad.jsx'
import Reservas from './components/Header/ReservasPanel.jsx'
import { FavoritosProvider } from './components/Header/FavoritosContexto.jsx'
import ReservasSesion from './components/ReservasSesion.jsx'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <p>Cargando...</p>

  return (
    <FavoritosProvider>
      <Routes>
        <Route path="/signin" element={!session ? <SignIn /> : <Navigate to="/" />} />
        <Route path="/signup" element={!session ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/" element={session ? <Home session={session} /> : <Navigate to="/signin" />} />
        <Route path="/listados/:id" element={session ? <Listadodetallado /> : <Navigate to="/signin" />} />
        <Route path='/crear' element={session ? <Crearpropiedad/> : <Navigate to="/signin"/>}/>
        <Route path='/reservas' element={session ? <ReservasSesion/> : <Navigate to="/signin"/>}/>

      </Routes>
    </FavoritosProvider>
  )
}

export default App