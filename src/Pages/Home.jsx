import { supabase } from '../SupabaseCliente'
import Header from '../Pages/Header.jsx'
import Card from '../components/Card.jsx'
import { useEffect, useState } from 'react'
import '../Estilos/Propiedadeshome.css'
function Home({item}) {
  const[count,setCount]= useState(0)
  const [listados, setListados] = useState([])
  const[buscar , setBuscar] = useState('')

  useEffect(() => {
    getListados()
  }, [])

  async function getListados() {
  const response = await supabase
    .from('listados')
    .select('*')

  console.log('RESPONSE:', response)

  const { data, error } = response

  if (error) {
    console.error('ERROR:', error)
  } else {
    console.log('DATA:', data)
    setListados(data)
  }
}
 const listadosFiltrados = listados.filter((item) => {
    const termino = buscar.toLowerCase()
    return (
      item.title?.toLowerCase().includes(termino) ||
      item.location?.toLowerCase().includes(termino) ||
      item.description?.toLowerCase().includes(termino)
    )
  })

  return (
    <div>
      <Header  setBuscar={setBuscar}/>
      <h1>Alojamientos</h1>
      <div className='grid'>
        {listadosFiltrados.map((item)=>
        <Card key={item.id} item={item} setCount={setCount}/>
        )}
      </div>
     
    </div>
  )
}

export default Home