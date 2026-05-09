import { useState } from 'react'
import { supabase } from '../SupabaseCliente'
import { useNavigate, Link } from 'react-router-dom'
import '../Estilos/Singup.css'
function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
    } else {
      alert('Registro completado')
      navigate('/signin')
    }
    setLoading(false)
  }

  return (
<div className="auth-container">
  <div className="auth-card">
    <h2 className="auth-title">Crear cuenta</h2>

    <form className="auth-form" onSubmit={handleSignUp}>
      <input
        className="auth-input"
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        className="auth-input"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p className="auth-error">{error}</p>}

      <button className="auth-button" type="submit" disabled={loading}>
        {loading ? 'Creando cuenta...' : 'Registrarse'}
      </button>
    </form>

    <p className="auth-footer">
      ¿Ya tienes cuenta? <Link to="/signin">Inicia sesión</Link>
    </p>
  </div>
</div>
  )
}

export default Signup