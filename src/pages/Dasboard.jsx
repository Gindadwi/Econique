import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cart from '../component/Cart';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
//Mengambil data dari firestore
import Hapus from '../assets/delete.png'
import { formatDistanceToNow } from "date-fns"; // Install this package using `npm install date-fns`
import { ImCheckmark, ImCalendar, ImCross } from "react-icons/im";

export default function Dashboard() {
    const [totalOmzet, setTotalOmzet] = useState(0);
    const [fiks, setFiks] = useState(0);
    const [reschedule, setReschedule] = useState(0);
    const [Batal, setBatal] = useState(0);
    const [users, setUsers] = useState([]);

    // Fungsi untuk mengambil data dari realtime database
    const fetchData = async () => {
        try {
            const response = await axios.get('https://econique-perhutani-default-rtdb.firebaseio.com/ReservasiKegiatan.json?auth=oahZAHcmPhj9gDp0HdkDFaCuGRt2pPZrX05YsdIl');
            const data = response.data;

            // Inisialisasi variabel penghitung
            let fiksCount = 0;
            let rescheduleCount = 0;
            let BatalCount = 0;

            // Menghitung total omzet
            const omzetList = Object.values(data).map(item => parseFloat(item.omzet.replace(/\./g, '')) || 0);
            const total = omzetList.reduce((acc, current) => acc + current, 0);
            setTotalOmzet(total);

            // Mengelompokkan data berdasarkan status
            Object.values(data).forEach(item => {
                if (item.selectedStatus === "Fiks") {
                    fiksCount++;
                }
                else if (item.selectedStatus === "Reschedule") {
                    rescheduleCount++;
                } else if (item.selectedStatus === "Batal") {
                    BatalCount++;
                }
            });

            // Mengupdate state dengan hasil perhitungan
            setFiks(fiksCount);
            setReschedule(rescheduleCount);
            setBatal(BatalCount);

        } catch (error) {
            console.error("Error fetching data: ", error);
            toast.error("Gagal mengambil data");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);







    // Fetch data users dari Firestore
    useEffect(() => {
        const fetchDataUser = async () => {
            try {
                const querySnapShot = await getDocs(collection(db, "users"));
                const userData = querySnapShot.docs.map(doc => ({
                    id: doc.id, // Simpan ID dengan benar
                    ...doc.data(),
                    lastLoginAgo: doc.data().lastLogin
                        ? formatDistanceToNow(new Date(doc.data().lastLogin.seconds * 1000), { addSuffix: true })
                        : 'Belum pernah login'
                }));

                setUsers(userData);
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };

        fetchDataUser();
    }, []);





    return (
        <div className="relative w-full max-w-[1080px] overflow-y-auto h-screen ">
            {/* Header */}
            <div className='lg:bg-white lg:w-screen lg:items-center lg:justify-start lg:flex lg:p-4 lg:h-[63px] lg:sticky lg:top-0 lg:z-10 shadow-lg'>
                <h1 className='font-outfit text-[18px] lg:text-2xl font-medium hidden lg:block'>Dashboard </h1>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 justify-center items-center px-4 mt-5">
                {/* Card Fiks */}
                <div className="bg-white flex flex-col items-center p-5 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-2 mb-2">
                        <ImCheckmark className="text-green-500 text-2xl" />
                        <h2 className="font-outfit text-gray-500 font-medium text-lg">Fiks</h2>
                    </div>
                    <p className="text-2xl font-bold text-gray-700">{fiks}</p>
                </div>

                {/* Card Reschedule */}
                <div className="bg-white flex flex-col items-center p-5 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-2 mb-2">
                        <ImCalendar className="text-blue-500 text-2xl" />
                        <h2 className="font-outfit text-gray-500 font-medium text-lg">Reschedule</h2>
                    </div>
                    <p className="text-2xl font-bold text-gray-700">{reschedule}</p>
                </div>

                {/* Card Batal */}
                <div className="bg-white flex flex-col items-center p-5 rounded-lg shadow-lg">
                    <div className="flex items-center space-x-2 mb-2">
                        <ImCross className="text-red-500 text-2xl" />
                        <h2 className="font-outfit text-gray-500 font-medium text-lg">Batal</h2>
                    </div>
                    <p className="text-2xl font-bold text-gray-700">{Batal}</p>
                </div>

                {/* Card Total Omzet */}
                <div className="bg-white flex flex-col items-center p-5 rounded-lg shadow-lg">
                    <h2 className="font-outfit text-gray-500 font-medium text-lg mb-2">Total Omzet</h2>
                    <p className="lg:text-xl text-md font-bold text-gray-700">Rp. {totalOmzet.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</p>
                </div>
            </div>

            <div className="mt-3 flex flex-col lg:grid  lg:grid-cols-2 gap-2 px-4 lg:px-0 mb-20 lg:mb-5">
                <Cart />
                <div className="bg-white shadow-lg rounded-lg max-w-lg lg:max-w-lg lg:h-[435px] pb-8 px-6">
                    <h2 className="text-[20px] font-poppins font-semibold mt-4 mb-3">Daftar Pengguna</h2>
                    <div className="relative overflow-y-auto h-[300px] lg:h-[360px] space-y-2">
                        <ul className="flex flex-col gap-4">
                            {users.map((user, index) => {
                                // Set border color berdasarkan role
                                const borderColor =
                                    user.role === "Super Admin" ? "border-green-500" :
                                        user.role === "Admin" ? "border-blue-500" : "border-red-500";

                                return (
                                    <li
                                        key={index}
                                        className={`shadow-md p-4 flex justify-between items-center rounded-lg transition duration-200 hover:shadow-xl border-l-4 border-b-4 ${borderColor}`}
                                    >
                                        <div>
                                            <p className="text-[15px] lg:text-[16px] font-poppins font-semibold text-gray-700">
                                                Nama Lengkap: <span className="font-normal text-gray-600">{user.namaLengkap}</span>
                                            </p>
                                            <p className="text-[14px] lg:text-[15px] font-poppins font-medium text-gray-700">
                                                Role: <span className="font-normal text-gray-600">{user.role}</span>
                                            </p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

            </div>

        </div>
    );
}
