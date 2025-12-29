import React from 'react'
import {Outlet} from 'react-router-dom'
import Navbar from '../Components/Navbar/Navbar.jsx'
import Sidebar from '../Components/SideBar/Sidebar.jsx'
function Layout() {
  return (
    <>
     {/* <Navbar/> */}
     <Sidebar/>
   
            
        



     <Outlet/>
    </>
  )
}

export default Layout
