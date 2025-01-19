import React from 'react'
import {Link} from 'react-router-dom'
import "./sideBar.css"

const SideBar = () => {
  return (
    <div className="sidebar-component">
        <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/service-list">Job Services</Link></li>
            <li><Link to="/add-expenditure">Add Expenditure</Link></li>
            <li><Link to="/expenditure-list">Expenditure List</Link></li> 
            <li><Link to="/quotation">Quotation</Link></li>           
            <li><Link to="/todolist">TodoList</Link></li>
        </ul>
    </div>
  )
}

export default SideBar