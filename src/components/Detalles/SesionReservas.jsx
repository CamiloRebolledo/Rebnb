import React from 'react'

function BookingSection({listados,startDate,setStartDate,endDate,setEndDate,personas,setPersonas,noches,handleBooking,maxPersonas}) {
  return (
    <aside className="detalle-booking">
          <div className="booking-card">
            <div className="booking-precio">
              <span className="precio-valor">${listados.price?.toLocaleString()}</span>
              <span className="precio-noche">/ noche</span>
            </div>

            <div className="booking-fechas">
              <div className="fecha-grupo">
                <label>Llegada</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="fecha-grupo">
                <label>Salida</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>

            <div className="personas-selector">
              <label>Personas</label>
              <div className="personas-control">
                <button onClick={() => setPersonas(p => Math.max(1, p - 1))}>−</button>
                <span>{personas}</span>
                <button onClick={() => setPersonas(p => Math.min(maxPersonas, p + 1))}>+</button>
              </div>
              <small>Máximo {maxPersonas} personas</small>
            </div>

            {noches > 0 && (
              <div className="booking-resumen">
                <div className="resumen-fila">
                  <span>${listados.price?.toLocaleString()} × {noches} noches</span>
                  <span>${(listados.price * noches).toLocaleString()}</span>
                </div>
                <div className="resumen-fila resumen-total">
                  <span>Total</span>
                  <span>${(listados.price * noches).toLocaleString()}</span>
                </div>
              </div>
            )}

            <button className="booking-btn" onClick={handleBooking}>Reservar ahora</button>
            <p className="booking-nota">No se te cobrará nada aún</p>
          </div>
        </aside>
  )
}

export default BookingSection