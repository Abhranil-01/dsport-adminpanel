import React from 'react'
import {Outlet} from 'react-router-dom'
import Sidebar from '../Components/SideBar/Sidebar'



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
