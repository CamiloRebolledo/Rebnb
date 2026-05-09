import React from 'react'
import Logo from '../../assets/Logo.png'

function LogoSection() {
  return (
    <div className="logo">
        <img src={Logo} alt="logo" />
        <p>Rebnb</p>
    </div>
  )
}

export default LogoSection