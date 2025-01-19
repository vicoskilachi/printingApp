import React from 'react'
import footer_logo from "../../images/logo-footer.png"
import "./footer.css"

const Footer = () => {

    const currentYear = new Date().getFullYear();

  return (
    <>
        <div className="footer-container">
            <div className="logo">
                <img src={footer_logo} alt={footer_logo} />               
            </div>
            <p>{`© ${currentYear} Nifty Technology. All rights reserved.`}</p>            
        </div>
    </>
  )
}

export default Footer