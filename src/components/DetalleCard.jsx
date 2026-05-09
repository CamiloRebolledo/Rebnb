import '../Estilos/Listadodetallado.css'
import Header from '../Pages/Header.jsx'
import HeroSection from './Detalles/PortadaSesion.jsx'
import DescriptionSection from './Detalles/DescripcionSesion.jsx'
import GallerySection from './Detalles/GaleriaSesion.jsx'
import BookingSection from './Detalles/SesionReservas.jsx'
import ImagenSection from './Detalles/ImagenGrande.jsx'
import Resenas from './Detalles/Resenas.jsx'


function DetalleCard({
  listados,
  imagenes,
  galeriaActiva,
  setGaleriaActiva,
  imgModal,
  setImgModal,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  personas,
  setPersonas,
  noches,
  handleBooking,
  listadoId
  
}) {
  
  const detalles = Array.isArray(listados.listados_detalles)
    ? listados.listados_detalles[0]
    : listados.listados_detalles

  const maxPersonas = (detalles?.bedrooms ?? 1) * 2
  const descripcion = detalles?.description ?? 'Sin descripción disponible.'
  const categorias = ['todas', 'alcoba', 'baño', 'sala', 'comedor', 'cocina']

  const imagenesFiltradas = galeriaActiva === 'todas'
    ? imagenes
    : imagenes.filter(img => img.descripcion?.toLowerCase().includes(galeriaActiva))

  return (
    <div>
          <Header />

        <HeroSection listados={listados} detalles={detalles}/>

        <div className="detalle-wrapper">


          
          <div className="detalle-body">

            <div className="detalle-main">

              <DescriptionSection descripcion={descripcion} />

              <GallerySection imagenes={imagenes} galeriaActiva={galeriaActiva} setGaleriaActiva={setGaleriaActiva} imgModal={imgModal} setImgModal={setImgModal}  />
            </div>

            <BookingSection listados={listados} startDate={startDate} setStartDate={setStartDate }endDate={endDate} setEndDate={setEndDate} personas={personas} setPersonas={setPersonas }noches={noches} handleBooking= {handleBooking} maxPersonas={maxPersonas} />
          </div>

          {imgModal &&<ImagenSection img={imgModal} onClose={()=> setImgModal(null)} />}



            <Resenas listadoId={listados.id}/>
        </div>
      </div>
  )
}

export default DetalleCard