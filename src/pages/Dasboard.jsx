import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cart from '../component/Cart';
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
//Mengambil data dari firestore
import Hapus from '../assets/delete.png'
import { formatDistanceToNow } from "date-fns"; // Install this package using `npm install date-fns`
import Swal from 'sweetalert2';

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
            <div className='bg-white w-screen lg:w-screen items-center justify-start flex p-4 h-[63px] lg:sticky lg:top-0 lg:z-10 hidden lg:block'>
                <h1 className='font-outfit text-[18px] lg:text-2xl font-medium hidden lg:block'>Dashboard </h1>
            </div>

            <div className="grid grid-cols-2 gap-1 lg:grid-cols-4 justify-center items-center px-4 mt-3">
                <div className="bg-white p-4 text-center rounded-lg">
                    <h2 className="font-poppins font-medium text-[14px] lg:text-lg">Fiks</h2>
                    <p className="text-[14px] lg:text-2xl font-bold">{fiks}</p>
                </div>
                <div className="bg-white p-4 text-center rounded-lg">
                    <h2 className="font-poppins font-medium text-[14px] lg:text-lg">Reschedule</h2>
                    <p className="text-[14px] lg:text-2xl font-bold">{reschedule}</p>
                </div>
                <div className="bg-white p-4 text-center rounded-lg">
                    <h2 className="font-poppins font-medium text-[14px] lg:text-lg">Batal</h2>
                    <p className="text-[14px] lg:text-xl font-bold">{Batal}</p>
                </div>
                <div className="bg-white p-4 text-center rounded-lg">
                    <h2 className="font-poppins font-medium text-[14px] lg:text-lg">Total Omzet</h2>
                    <p className="text-[14px] lg:text-xl font-bold">Rp. {totalOmzet.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</p>
                </div>
            </div>

            <div className="mt-3 flex flex-col lg:grid  lg:grid-cols-2 gap-2 px-4 lg:px-0 mb-20 lg:mb-5">
                <Cart />
                <div className="bg-white shadow-lg rounded-lg max-w-lg lg:max-w-lg lg:h-[435px] pb-10 px-5">
                    <h2 className="text-[18px] font-poppins font-semibold mt-2">Daftar Pengguna</h2>
                    <div className="relative overflow-y-auto  lg:h-[360px]  ">
                        <ul className="">
                            {users.map((user, index) => (
                                <>
                                    <li key={index} className="shadow-lg p-4 flex justify-between mt-2 rounded-md border border-3 border-gray-300">
                                        <div>
                                            <p className="text-[14px] lg:text-[16px] font-outfit"><span className="font-medium font-poppins">Nama Lengkap:</span> {user.namaLengkap}</p>
                                            <p className="text-[14px] font-outfit"><span className="font-medium font-poppins">Role:</span> {user.role}</p>
                                        </div>

                                    </li>

                                </>
                            ))}


                        </ul>
                    </div>
                </div>
            </div>

        </div>
    );
}
