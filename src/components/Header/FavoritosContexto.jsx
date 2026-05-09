import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../../SupabaseCliente'

const FavoritosContext = createContext()

export function FavoritosProvider({ children }) {
  const [favIds, setFavIds] = useState(new Set())
  const [user, setUser] = useState(null)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) await cargarFavIds(user.id)
    }
    init()
  }, [])

  async function cargarFavIds(userId) {
    const { data } = await supabase
      .from('favoritos')
      .select('listado_id')
      .eq('user_id', userId)

    if (data) {
      setFavIds(new Set(data.map(f => f.listado_id)))
    }
  }

  async function toggleFavorito(listadoId) {
    if (!user) return

    if (favIds.has(listadoId)) {
      const { error } = await supabase
        .from('favoritos')
        .delete()
        .eq('user_id', user.id)
        .eq('listado_id', listadoId)

      if (!error) {
        setFavIds(prev => {
          const next = new Set(prev)
          next.delete(listadoId)
          return next
        })
      }
    } else {
      const { error } = await supabase
        .from('favoritos')
        .insert({ user_id: user.id, listado_id: listadoId })

      if (!error) {
        setFavIds(prev => new Set([...prev, listadoId]))
      }
    }
  }

  return (
    <FavoritosContext.Provider value={{ favIds, toggleFavorito, user }}>
      {children}
    </FavoritosContext.Provider>
  )
}

export function useFavoritos() {
  return useContext(FavoritosContext)
}