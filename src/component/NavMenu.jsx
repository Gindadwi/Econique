import React, { useState } from 'react';
import btnNav from '../assets/ButtonNav.png';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(""); // State untuk menyimpan menu yang dipilih
    const navigate = useNavigate();

    const Menu = [
        { title: "Dasboard", path: "/dasboard" },
        { title: "Reservasi Kegiatan", path: "/reservasi" },
        { title: "Akses Akun", path: "/akses" },
        { title: "Log Out", path: "/" },
    ];

    const handleMenuClick = (item) => {
        setSelectedMenu(item.title); // Set judul menu yang diklik
        setOpen(false); // Tutup menu mobile setelah dipilih
        navigate(item.path); // Navigasi ke halaman
    };

    return (
        <div className='relative'>
            {/* Kontainer utama navbar */}
            <div className="flex w-full min-w-[360px] items-center">
                {/* Header yang tetap di bagian atas */}
                <header className="bg-white w-full sticky z-20 top-0 start-0 py-5">
                    {/* Kontainer isi header */}
                    <div className='px-4 grid grid-cols-2 items-center justify-between text-2xl font-semibold font-outfit mx-auto max-w-[1080px]'>
                        {/* Bagian kiri: title menu yang dipilih */}
                        <div className=' items-center gap-5'>
                            {selectedMenu && (
                                <span className='text-black text-[18px] font-medium'>
                                    {selectedMenu}
                                </span>
                            )}
                        </div>

                        {/* Bagian kanan header: Navigasi dan tombol Register */}
                        <div className='w-full flex items-end justify-end gap-5'>
                            {/* Tombol navigasi mobile (hamburger menu) */}
                            <img
                                src={btnNav} // Sumber gambar tombol navigasi
                                className='w-8 cursor-pointer block md:hidden' // Kelas CSS: tampilkan hanya di layar kecil
                                alt='Button Nav' // Alt text untuk aksesibilitas
                                onClick={() => setOpen(!open)} // Handler saat tombol diklik
                            />
                        </div>
                    </div>
                </header>

                {/* Menu navigasi untuk mobile, muncul saat open true */}
                <div className={`fixed top-0 right-0 h-full w-1/2 bg-white shadow-lg transform ${open ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50 lg:hidden`}>
                    {/* Tombol close menu mobile */}
                    <div className='flex justify-end m-5'>
                        <button
                            onClick={() => setOpen(false)} // Handler saat tombol close diklik
                            type='button'
                            className="text-black bg-transparent hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                        >
                            {/* Ikon silang untuk tombol close */}
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    {/* Navigasi mobile */}
                    <ul className='flex flex-col gap-5 ps-5 pt-6 text-black'>
                        {Menu.map((item, index) => (
                            <li
                                key={index}
                                onClick={() => handleMenuClick(item)} // Handler untuk klik menu
                                className="cursor-pointer"
                            >
                                {item.title}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Overlay latar belakang saat menu mobile terbuka */}
                {open && (
                    <div
                        className='fixed inset-0 bg-black bg-opacity-50 transition duration-300 ease-in-out z-30'
                        onClick={() => setOpen(false)} // Handler saat overlay diklik untuk menutup menu
                    ></div>
                )}
            </div>
        </div>
    );
}
