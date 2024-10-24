import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Econique from '../assets/Econique.png';
import ButtonNav from '../assets/ButtonNav.png'; // Tidak digunakan dalam contoh ini, pastikan relevan
import { auth, db } from "../firebase"; // Pastikan Firebase diimpor jika role berasal dari Firestore
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation(); // Mengambil rute aktif
    const [isSidebarSmall, setIsSidebarSmall] = useState(true);
    const [userRole, setUserRole] = useState(null); // Menyimpan peran pengguna

    // Daftar menu Admin
    const MenuAdmin = [
        { title: "Dasboard", path: "/dashboardAdmin" },
        { title: "Reservasi Kegiatan", path: "/reservasi" },
        { title: "Log Out", path: "/" },
    ];

    //Daftar menu super admin
    const manuSuperAdmin = [
        { title: "Dashboard", path: "/dasboard" },
        { title: "Reservasi Kegiatan", path: "/reservasi" },
        { title: "Akses Akun", path: "/akses" },
        { title: "Log Out", path: "/" },
    ]


    //Daftar menu users
    const manuUsers = [
        { title: "Dashboard", path: "/dashboardUsers" },
        { title: "Reservasi Kegiatan", path: "/reservasiUsers" },
        { title: "Log Out", path: "/" },
    ]




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
                navigate("/");
            }
        });
    }, [navigate]);

    // Navigasi otomatis ke dashboard saat berada di root "/"



    //Membuat fungsi LogOut 

    const handleLogout = async () => {
        try {
            await signOut(auth);// akan pergi ke halaman login
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
    }

    return (
        <>
            <div className={`lg:bg-white bg-white lg:h-screen lg:p-5 lg:transition-all duration-300 lg:w-[256px]`}>
                <div className={`lg:transition-all duration-300 lg:w-[222px]`}>
                    <div className="lg:items-center lg:justify-center flex lg:cursor-pointer" onClick={toggleSidebar}>
                        <img className={`transition-all duration-300 lg:w-[150px] hidden lg:block`} src={Econique} alt="Logo Perhutani" />
                    </div>

                    <ul className={`lg:space-y-2 lg:items-center lg:justify-center mt-10 hidden lg:block`}>
                        {/* Menu based on the user's role */}
                        {(() => {
                            if (userRole === "Super Admin") {
                                return manuSuperAdmin.map((menu, index) => (
                                    <li
                                        key={index}
                                        onClick={menu.title === "Log Out" ? handleLogout : () => navigate(menu.path)}
                                        className="cursor-pointer font-poppins text-sm font-medium text-warnaDasar flex items-center 
                                lg:text-lg lg:hover:bg-warnaDasar lg:hover:text-white rounded-md p-2 transition-all duration-300"
                                    >
                                        {menu.title}
                                    </li>
                                ));
                            } else if (userRole === "Admin") {
                                return MenuAdmin.map((menu, index) => (
                                    <li
                                        key={index}
                                        onClick={menu.title === "Log Out" ? handleLogout : () => navigate(menu.path)}
                                        className="cursor-pointer font-poppins text-sm font-medium text-warnaDasar flex items-center 
                                lg:text-lg lg:hover:bg-warnaDasar lg:hover:text-white rounded-md p-2 transition-all duration-300"
                                    >
                                        {menu.title}
                                    </li>
                                ));
                            } else {
                                return manuUsers.map((menu, index) => (
                                    <li
                                        key={index}
                                        onClick={menu.title === "Log Out" ? handleLogout : () => navigate(menu.path)}
                                        className="cursor-pointer font-poppins text-sm font-medium text-warnaDasar flex items-center 
                                lg:text-lg lg:hover:bg-warnaDasar lg:hover:text-white rounded-md p-2 transition-all duration-300"
                                    >
                                        {menu.title}
                                    </li>
                                ));
                            }
                        })()}
                    </ul>

                </div>
            </div>
        </>
    );
}
