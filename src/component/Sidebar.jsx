import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Econique from '../assets/Econique.png';
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { HiHome, HiCalendar, HiUserAdd, HiIdentification, HiLogout } from "react-icons/hi";
import Footer from "./Footer";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarSmall, setIsSidebarSmall] = useState(true);
    const [userRole, setUserRole] = useState(null);

    const MenuAdmin = [
        { title: "Dashboard", path: "/dashboardAdmin", icon: <HiHome className="text-[25px]" /> },
        { title: "Reservasi", path: "/reservasiAdmin", icon: <HiCalendar className="text-[25px]" /> },
        { title: "Log Out", path: "/", icon: <HiLogout className="text-[25px]" /> },
    ];

    const manuSuperAdmin = [
        { title: "Dashboard", path: "/dasboard", icon: <HiHome className="text-[25px]" /> },
        { title: "Reservasi", path: "/reservasi", icon: <HiCalendar className="text-[25px]" /> },
        { title: "Akses Akun", path: "/akses", icon: <HiUserAdd className="text-[25px]" /> },
        { title: "Detail Pengguna", path: "/detailPengguna", icon: <HiIdentification className="text-[25px]" /> },
        { title: "Log Out", path: "/", icon: <HiLogout className="text-[25px]" /> },
    ];

    const manuUsers = [
        { title: "Dashboard", path: "/dashboardUsers", icon: <HiHome className="text-[25px]" /> },
        { title: "Reservasi", path: "/reservasiUsers", icon: <HiCalendar className="text-[25px]" /> },
        { title: "Log Out", path: "/", icon: <HiLogout className="text-[25px]" /> },
    ];

    const toggleSidebar = () => {
        setIsSidebarSmall(!isSidebarSmall);
    };

    useEffect(() => {
        const fetchUserRole = async (uid) => {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setUserRole(data.role);
            }
        };

        onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserRole(user.uid);
            } else {
                navigate("/");
            }
        });
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/");
            Swal.fire({
                title: 'Berhasil Logout',
                icon: "success",
                showConfirmButton: false,
                timer: 1800
            });
        } catch (error) {
            console.error("Logout gagal:", error);
            Swal.fire({
                title: 'Logout Gagal',
                text: 'Terjadi kesalahan saat logout. Silakan coba lagi.',
                icon: "error"
            });
        }
    };

    return (
        <div className="lg:bg-white bg-white lg:h-screen lg:w-[256px] flex flex-col justify-between">
            <div className="flex flex-col">
                <div className="lg:items-center lg:justify-center flex lg:cursor-pointer" onClick={toggleSidebar}>
                    <img className="transition-all duration-300 lg:w-[150px] hidden lg:block" src={Econique} alt="Logo Perhutani" />
                </div>
                <ul className="lg:space-y-2 lg:items-center lg:justify-center mt-10 px-2 hidden lg:block flex-grow">
                    {(() => {
                        if (userRole === "Super Admin") {
                            return manuSuperAdmin.map((menu, index) => (
                                <li
                                    key={index}
                                    onClick={menu.title === "Log Out" ? handleLogout : () => navigate(menu.path)}
                                    className="cursor-pointer font-poppins text-[12px] font-medium text-warnaDasar flex gap-2 items-center 
                                    lg:text-lg lg:hover:bg-warnaDasar lg:hover:text-white rounded-md p-2 transition-all duration-300"
                                >
                                    <span>{menu.icon}</span>
                                    {menu.title}
                                </li>
                            ));
                        } else if (userRole === "Admin") {
                            return MenuAdmin.map((menu, index) => (
                                <li
                                    key={index}
                                    onClick={menu.title === "Log Out" ? handleLogout : () => navigate(menu.path)}
                                    className="cursor-pointer font-poppins text-[12px] font-medium text-warnaDasar flex gap-2 items-center 
                                    lg:text-lg lg:hover:bg-warnaDasar lg:hover:text-white rounded-md p-2 transition-all duration-300"
                                >
                                    <span>{menu.icon}</span>
                                    {menu.title}
                                </li>
                            ));
                        } else {
                            return manuUsers.map((menu, index) => (
                                <li
                                    key={index}
                                    onClick={menu.title === "Log Out" ? handleLogout : () => navigate(menu.path)}
                                    className="cursor-pointer font-poppins text-[12px] font-medium text-warnaDasar flex gap-2 items-center 
                                    lg:text-lg lg:hover:bg-warnaDasar lg:hover:text-white rounded-md p-2 transition-all duration-300"
                                >
                                    <span>{menu.icon}</span>
                                    {menu.title}
                                </li>
                            ));
                        }
                    })()}
                </ul>
            </div>
            <Footer />
        </div>
    );
}
