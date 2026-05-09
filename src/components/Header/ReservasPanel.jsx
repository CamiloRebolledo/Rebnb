import { useNavigate } from 'react-router-dom'
import Alojamientos from '../../assets/Alojamientos.png'
function ReservasPanel({ userInitial }) {
  const navigate = useNavigate()

  return (
    <div>
      <a href="#" onClick={(e) => {
        e.preventDefault()
        if (userInitial) navigate('/reservas')
      }}>
        <img src={Alojamientos} alt="" />
        <span>Reservas</span>
      </a>
    </div>
  )
}

export default ReservasPanel