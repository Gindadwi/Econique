import React, { useEffect, useState } from 'react';
import btnNav from '../assets/ButtonNav.png';
import Econique from '../assets/Econique.png'
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../firebase"; // Pastikan Firebase diimpor jika role berasal dari Firestore
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Swal from 'sweetalert2';


export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(""); // State untuk menyimpan menu yang dipilih
    const navigate = useNavigate();
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
        { title: "Detail Pengguna", path: "/detailPengguna"},
        { title: "Log Out", path: "/" },
    ]


    //Daftar menu users
    const manuUsers = [
        { title: "Dashboard", path: "/dashboardUsers" },
        { title: "Reservasi Kegiatan", path: "/reservasiUsers" },
        { title: "Log Out", path: "/" },
    ]


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
        <div className='relative'>
            {/* Kontainer utama navbar */}
            <div className="flex w-full min-w-[360px] items-center">
                {/* Header yang tetap di bagian atas */}
                <header className="bg-white w-full sticky z-20 top-0 py-3">
                    {/* Kontainer isi header */}
                    <div className=' px-4 grid grid-cols-2 items-center justify-between text-2xl font-semibold font-outfit mx-auto max-w-[1080px]'>
                        {/* Bagian kiri: title menu yang dipilih */}
                        {/* Bagian kanan header: Navigasi dan tombol Register */}
                        <div className='w-full flex '>
                            {/* Tombol navigasi mobile (hamburger menu) */}
                            <img
                                src={btnNav} // Sumber gambar tombol navigasi
                                className='w-8 cursor-pointer block md:hidden' // Kelas CSS: tampilkan hanya di layar kecil
                                alt='Button Nav' // Alt text untuk aksesibilitas
                                onClick={() => setOpen(!open)} // Handler saat tombol diklik
                            />
                        </div>
                        {/* Bagian kanan header: Navigasi dan tombol Register */}
                        <div className='w-full flex items-end justify-end'>
                            {/* Tombol navigasi mobile (hamburger menu) */}
                            <img
                                src={Econique} // Sumber gambar tombol navigasi
                                className='w-10 cursor-pointer block md:hidden' // Kelas CSS: tampilkan hanya di layar kecil
                                alt='Button Nav' // Alt text untuk aksesibilitas
                                onClick={() => setOpen(!open)} // Handler saat tombol diklik
                            />
                        </div>
                    </div>
                </header>

                {/* Menu navigasi untuk mobile, muncul saat open true */}
                <div className={`fixed top-0 left-0 h-full w-1/2 bg-white shadow-lg transform ${open ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50 lg:hidden`}>
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
                    <ul className={`lg:space-y-2 lg:items-center lg:justify-center mt-10`}>
                        {/* Menu based on the user's role */}
                        {(() => {
                            if (userRole === "Super Admin") {
                                return manuSuperAdmin.map((menu, index) => (
                                    <li
                                        key={index}
                                        onClick={menu.title === "Log Out" ? handleLogout : () => navigate(menu.path)}
                                        className="cursor-pointer font-poppins text-sm font-medium text-black flex items-center 
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
                                        className="cursor-pointer font-poppins text-sm font-medium text-black flex items-center 
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
                                        className="cursor-pointer font-poppins text-sm font-medium text-black flex items-center 
                                lg:text-lg lg:hover:bg-warnaDasar lg:hover:text-white rounded-md p-2 transition-all duration-300"
                                    >
                                        {menu.title}
                                    </li>
                                ));
                            }
                        })()}
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
