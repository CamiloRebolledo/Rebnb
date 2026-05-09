import React from 'react'

function HeroSection({listados, detalles}) {
  return (
    <div className="detalle-hero">
        <img src={listados.image} alt={listados.title} className="hero-img" />
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="hero-badge">Disponible</span>
            <h1 className="hero-title">{listados.title}</h1>
            <p className="hero-location">📍 {listados.location}</p>
            <div className="hero-stats">
              <span>🛏 {detalles?.bedrooms ?? '?'} Alcobas</span>
              <span>🚿 {detalles?.bathrooms ?? '?'} Baños</span>
              <span>📐 {detalles?.area ?? '?'} m²</span>
            </div>
          </div>
        </div>
      </div>
  )
}

export default HeroSection