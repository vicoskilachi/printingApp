import React from 'react'
import { Link } from 'react-router-dom'
import "./header.css"
import logo from "../../images/nifty_logo.png"

const Header = () => {
  return (
    <>
        <div className="header-container">
            <div className="logo">
                <Link to="/"><img src={logo} alt={logo} /></Link>
            </div>
            <div className="right-content">
                <h1>Printing Business </h1>
            </div>
        </div>
    </>
  )
}

export default Header