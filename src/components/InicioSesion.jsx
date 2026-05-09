import { useState } from 'react'
import { supabase } from '../SupabaseCliente'
import { useNavigate, Link } from 'react-router-dom'
import '../Estilos/Signin.css'

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else {
      navigate('/')
    }
    setLoading(false)
  }

  return (
<div className="auth-container">
  <div className="auth-card">
    <h2 className="auth-title">Iniciar sesión</h2>

    <form className="auth-form" onSubmit={handleSignIn}>
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
        {loading ? 'Entrando...' : 'Iniciar sesión'}
      </button>
    </form>

    <p className="auth-footer">
      ¿No tienes cuenta? <Link to="/signup">Regístrate</Link>
    </p>
  </div>
</div>
  )
}

export default SignIn