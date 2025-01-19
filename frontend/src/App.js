import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import axios from 'axios';
import ServiceList from './pages/serviceList/ServiceList';
import "./App.css";
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import SideBar from './components/sideBar/SideBar';

const App = () => {
  

  return (
    
    <div className='app'>
      <Header/>
      <div className="app-container">
        <div className="sidebar">
          <SideBar/>
        </div>
        <div className="main"><Outlet/></div>
      </div>
      <Footer/>
    </div>
  );
};

export default App;
