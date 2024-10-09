import { Routes, Route } from 'react-router-dom'; 
import './App.css'
import Sidebar  from './component/Sidebar';
import Reservasi from './pages/Reservasi';
import Dasboard  from './pages/Dasboard';
import TambahData from './pages/TambahData';
import Detail from './pages/Detail'
import Akses  from './pages/Akses';
import { Toaster } from 'react-hot-toast'; 

function App() {
  return (
    <div className='flex h-screen overflow-hidden bg-DasarBg'>
      <Toaster />      
      <Sidebar/>

      <div className='flex-grow overflow-y-auto w-full min-w-[360px] '>
        <Routes>
          <Route path="/reservasi" element={<Reservasi />} />
          <Route path="/dasboard" element={<Dasboard />} />
          <Route path="/tambahData" element={<TambahData />} />
          <Route path="/detailData/:id" element={<Detail />} />
          <Route path="/akses" element={<Akses />} />
        </Routes>      
      </div>
      
    </div>
  )
}

export default App
