import React from 'react'

function ImagenSection({img, onClose}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} 
      >
        <img src={img} alt="Vista ampliada" />

        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  )
}

export default ImagenSection