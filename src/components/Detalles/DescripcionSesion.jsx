import React from 'react'

function DescriptionSection({descripcion}) {
  return (
    <section className="seccion">
            <h2 className="seccion-title">Descripción</h2>
            <p className="detalle-description">{descripcion}</p>
    </section>
  )
}

export default DescriptionSection