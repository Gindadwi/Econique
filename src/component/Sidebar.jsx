import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Econique from '../assets/Econique.png';
import ButtonNav from '../assets/ButtonNav.png'; // Tidak digunakan dalam contoh ini, pastikan relevan
import { auth, db } from "../firebase"; // Pastikan Firebase diimpor jika role berasal dari Firestore
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation(); // Mengambil rute aktif
    const [isSidebarSmall, setIsSidebarSmall] = useState(true);
    const [userRole, setUserRole] = useState(null); // Menyimpan peran pengguna

    // Daftar menu utama
    const Menu = [
        { title: "Dasboard", path: "/dasboard" },
        { title: "Reservasi Kegiatan", path: "/reservasi" },
        { title: "Log Out", path: "/" },
    ];

    // Menu tambahan untuk Super Admin
    const superAdminMenu = { title: "Akses Akun", path: "/akses" };

    const toggleSidebar = () => {
        setIsSidebarSmall(!isSidebarSmall);
    };

    // Ambil role pengguna saat login
    useEffect(() => {
        const fetchUserRole = async (uid) => {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setUserRole(data.role); // Simpan role dari Firestore
            }
        };

        onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserRole(user.uid);
            } else {
                navigate("/"); // Redirect jika tidak ada user yang login
            }
        });
    }, [navigate]);

    // Navigasi otomatis ke dashboard saat berada di root "/"
    useEffect(() => {
        if (location.pathname === "/") {
            navigate("/dasboard");
        }
    }, [location, navigate]);

    return (
        <>
            <div className={`lg:bg-white bg-white lg:h-screen lg:p-5 lg:transition-all duration-300 lg:w-[256px]`}>
                <div className={`lg:transition-all duration-300 lg:w-[222px]`}>
                    <div className="lg:items-center lg:justify-center flex lg:cursor-pointer" onClick={toggleSidebar}>
                        <img className={`transition-all duration-300 lg:w-[150px] hidden lg:block`} src={Econique} alt="Logo Perhutani" />
                    </div>

                    <ul className={`lg:space-y-2 lg:items-center lg:justify-center mt-10 hidden lg:block`}>
                        {/* Tampilkan menu utama */}
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

                        {/* Tampilkan menu akses akun jika userRole adalah Super Admin */}
                        {userRole === "Super Admin" && (
                            <li
                                onClick={() => navigate(superAdminMenu.path)}
                                className="cursor-pointer font-poppins text-sm font-medium text-warnaDasar flex items-center 
                                    lg:text-lg lg:hover:bg-warnaDasar lg:hover:text-white rounded-md p-2 transition-all duration-300"
                            >
                                {superAdminMenu.title}
                            </li>
                        )}
                        
                    </ul>
                </div>
            </div>
        </>
    );
}
