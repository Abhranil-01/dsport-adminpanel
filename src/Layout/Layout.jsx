import React from 'react'
import {Outlet} from 'react-router-dom'
import Sidebar from './../Components/Sidebar/Sidebar';
import { useOrderSocket } from './../hooks/useOrderSocket.js';




function Layout() {
  useOrderSocket()
  return (
    <>
     {/* <Navbar/> */}
     <Sidebar/>
   
            
        



     <Outlet/>
    </>
  )
}

export default Layout
