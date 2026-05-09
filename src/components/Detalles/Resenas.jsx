import React, { useEffect, useState } from 'react'
import { supabase } from '../../SupabaseCliente'

function Resenas({ listadoId }) {


  const [usuario, setUsuario] = useState(null)
  //para guardar reseñas
  const [resenas, setResenas] = useState([])

  //para guardar comentario nuevo
  const [comentario, setComentario] = useState('')

  // para guardar estrellas nuevas
  const [estrellas, setEstrellas] = useState(0)

  // cargar reseñas
  useEffect(() => {

    const cargarResenas = async () => {

      const { data, error } = await supabase
        .from('resenas')
        .select('*')
        .eq('listado_id', listadoId)
        .order('created_at', { ascending: false })

      if (!error) {
        setResenas(data)
      }
    }

    cargarResenas()

  }, [listadoId])
//para poder saber quien esta haciendo la reseña, que usuario

useEffect(() => {

  const obtenerUsuario = async () => {

    const { data } = await supabase.auth.getUser()

    setUsuario(data.user)
  }

  obtenerUsuario()

}, [])

  // promedio estrellas
  const promedio =
    resenas.length > 0
      ? (
          resenas.reduce((acc, r) => acc + r.estrellas, 0)
          / resenas.length
        ).toFixed(1)
      : 0

  // enviar reseña
  const enviarResena = async () => {

    if (!usuario) return
    if (!comentario || estrellas === 0) return

    const nuevaResena = {
      listado_id: listadoId,
      nombre: usuario.email,
      comentario,
      estrellas,
      user_id:usuario.id//pa saber quien guardo la reseña
    }

    const { data, error } = await supabase
      .from('resenas')
      .insert([nuevaResena])
      .select()
      .single()
    
      console.log(error)
    if (!error) {

      // agregar nueva reseña arriba
      setResenas([data, ...resenas])

      // limpiar formulario
      setComentario('')
      setEstrellas(0)
    }
  }
  //Eliminar las señenas
  const eliminarResena = async (id) => {

  const { error } = await supabase
    .from('resenas')
    .delete()
    .eq('id', id)

  if (!error) {

    
    const nuevasResenas = resenas.filter((r) => r.id !== id)

    setResenas(nuevasResenas)
  }
}

  return (
    <section className="seccion resenas-seccion">

      {/* TITULO */}
      <div className="resenas-header">

        <h2 className="seccion-title">
          Reseñas
        </h2>

        <div className="resenas-promedio">

          <span className="promedio-numero">
            {promedio}
          </span>

          <div className="promedio-estrellas">

            {[1,2,3,4,5].map((s) => (

              <span
                key={s}
                className={`estrella-estatica ${s <= promedio ? 'llena' : ''}`}
              >
                ★
              </span>

            ))}

          </div>

          <span className="promedio-total">
            ({resenas.length})
          </span>

        </div>

      </div>

      {/* RESEÑAS */}
      <div className="resenas-lista">

        {resenas.map((r) => (

          <div key={r.id} className="resena-card">

            <div className="resena-top">

              <div className="resena-avatar">
                {r.nombre?.[0]}
              </div>

              <div className="resena-info">

                <span className="resena-nombre">
                  {r.nombre}
                </span>

              </div>

              <div className="resena-estrellas">

                {[1,2,3,4,5].map((s) => (

                  <span
                    key={s}
                    className={`estrella-estatica ${s <= r.estrellas ? 'llena' : ''}`}
                  >
                    ★
                  </span>

                ))}

              </div>

            </div>

            <p className="resena-comentario">
              {r.comentario}
            </p>
            
             {/* BOTON */}
        {usuario?.id === r.user_id && (

          <button
            className="btn-cancelar-reserva"
            onClick={() => eliminarResena(r.id)}
          >
            Eliminar
          </button>

        )}
          </div>

        ))}

      </div>

      {/* FORMULARIO */}
      <div className="resena-form">

        <h3 className="resena-form-title">
          Deja tu reseña
        </h3>

        {/* ESTRELLAS */}
        <div className="estrellas-selector">

          <span className="estrellas-label">
            Tu puntuación:
          </span>

          <div className="estrellas-interactivas">

            {[1,2,3,4,5].map((s) => (

              <span
                key={s}
                className={`estrella-click ${s <= estrellas ? 'activa' : ''}`}
                onClick={() => setEstrellas(s)}
              >
                ★
              </span>

            ))}

          </div>

        </div>

        {/* TEXTAREA */}
        <textarea
          className="resena-textarea"
          placeholder="Escribe tu comentario..."
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />
        <button className="resena-btn" onClick={enviarResena}>
          Publicar reseña
        </button>
       

      </div>

    </section>
  )
}

export default Resenas