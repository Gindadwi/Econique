import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Econique from '../assets/Econique.png';
import ButtonNav from '../assets/ButtonNav.png'

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation(); // Mengambil rute aktif
    const [isSidebarSmall, setIsSidebarSmall] = useState(true);

    const Menu = [
        { title: "Dasboard", path: "/dasboard" },
        { title: "Reservasi Kegiatan", path: "/reservasi" },
        { title: "Akses Akun", path: "/akses" },
        { title: "Log Out", path: "/" },
    ];

    const toggleSidebar = () => {
        setIsSidebarSmall(!isSidebarSmall);
    };

    // Otomatis masuk ke dasboard saat masuk ke admin
    // Navigasi ke dashboard hanya jika berada di halaman root ("/")
    useEffect(() => {
        if (location.pathname === "/") {
            navigate("/dasboard");
        }
    }, [location, navigate]);

    return (
        <>        
        <div className={`lg:bg-white bg-white lg:h-screen lg:p-5 lg:transition-all duration-300 lg:w-[256px]`}>
            <div className={`lg:transition-all duration-300  lg:w-[222px]`}>
                <div className="lg:items-center lg:justify-center flex lg:cursor-pointer" onClick={toggleSidebar}>
                    <img className={`transition-all duration-300 lg:w-[150px] hidden lg:block`} src={Econique} alt="Logo Perhutani" />
                </div>

                <ul className={`lg:space-y-2 lg:items-center lg:justify-center mt-10 hidden lg:block `}>
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
            

        </>
    );
}
