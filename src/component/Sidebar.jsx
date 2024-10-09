import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LogoPerhutani from '../assets/LogoPerhutani.png';

export default function Sidebar() {
    const navigate = useNavigate();
    const [isSidebarSmall, setIsSidebarSmall] = useState(true); // State untuk mengatur ukuran sidebar

    const Menu = [
        { title: "Dasboard", path: "/dasboard" },
        { title: "Reservasi Kegiatan", path: "/reservasi" },
        { title: "Log Out", path: "/" },
    ];

    const toggleSidebar = () => {
        setIsSidebarSmall(!isSidebarSmall); // Toggle ukuran sidebar
    };

    return (
        <div className={`bg-white h-screen p-5 transition-all duration-300 
                        ${isSidebarSmall ? 'w-[80px]' : 'w-[240px]'} lg:w-[256px]`}>

            <div className={`transition-all duration-300 ${isSidebarSmall ? 'w-[50px]' : 'w-[200px]'} lg:w-[222px]`}>
                {/* Gambar logo yang bisa di-klik untuk memperbesar/memperkecil sidebar */}
                <div className="lg:items-center lg:justify-center flex cursor-pointer" onClick={toggleSidebar}>
                    <img className={`transition-all duration-300 ${isSidebarSmall ? 'w-[40px]' : 'w-[150px]'} lg:w-[150px]`} src={LogoPerhutani} alt="Logo Perhutani" />
                </div>

                {/* Menu navigasi, sembunyikan di mobile jika sidebar kecil */}
                <ul className={`space-y-2 lg:items-center lg:justify-center mt-10 
                                ${isSidebarSmall ? 'hidden' : 'block'} lg:block`}>
                    {Menu.map((menu, index) => (
                        <li
                            key={index}
                            onClick={() => navigate(menu.path)}
                            className="cursor-pointer font-poppins text-sm font-medium text-warnaDasar flex items-center 
                                lg:text-lg lg:hover:bg-warnaDasar lg:hover:text-white rounded-md p-2 transition-all duration-300"
                        >
                            {menu.title}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
