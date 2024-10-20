import { Routes, Route, useLocation } from 'react-router-dom'; 
import './App.css'
import Sidebar  from './component/Sidebar';
import Reservasi from './pages/Reservasi';
import Dasboard  from './pages/Dasboard';
import TambahData from './pages/TambahData';
import Detail from './pages/Detail'
import Akses  from './pages/Akses';
import { Toaster } from 'react-hot-toast'; 
import Login from './pages/Login';
import { useState } from 'react';
import NavMenu from './component/NavMenu'
import DasboardAdmin from './Admin/DasboardAdmin'

function App() {
  const location = useLocation();
  const [open, setOpen] = useState();

  const isLoginPage = location.pathname === ('/');



  return (
    <div className='flex flex-col lg:flex-row h-screen overflow-hidden bg-DasarBg'>
      <Toaster /> 

      {/* NavMenu hanya muncul di mobile */}
      {!isLoginPage && (
        <div className="lg:hidden ">
          <NavMenu />
        </div>
      )}

      {!isLoginPage && (
        <>
          <Sidebar open={open} setOpen={setOpen} />
        </>
      )}


      <div className='lg:flex-grow lg:overflow-y-auto lg:w-full lg:min-w-[360px] '>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/navmenu" element={<NavMenu/>} />
          <Route path="/reservasi" element={<Reservasi />} />
          <Route path="/dasboard" element={<Dasboard />} />
          <Route path="/tambahData" element={<TambahData />} />
          <Route path="/detailData/:id" element={<Detail />} />
          <Route path="/akses" element={<Akses />} />
          <Route path="/dashboardAdmin" element={<DasboardAdmin />} />
        </Routes>      
      </div>
      
    </div>
  )
}

export default App
