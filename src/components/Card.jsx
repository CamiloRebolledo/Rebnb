import React from 'react'
import { Link } from 'react-router-dom'
import { useFavoritos } from './Header/FavoritosContexto'

function Card({ item }) {
  const { favIds, toggleFavorito } = useFavoritos()
  const esFavorito = favIds.has(item.id)

  return (
    <div className="card">
      <div className="card-img-container">
        <img src={item.image} alt={item.title} />
        <button
          className="fav-btn"
          onClick={() => toggleFavorito(item.id)}
        >
          {esFavorito ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="card-body">
        <Link to={`/listados/${item.id}`}>
          <h3>{item.title}</h3>
        </Link>
        <p className="location">{item.location}</p>
        <p className="price">${item.price} <span>/ noche</span></p>
      </div>
    </div>
  )
}

export default Card