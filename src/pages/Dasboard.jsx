import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cart from '../component/Cart'

export default function Dashboard() {
    const [totalOmzet, setTotalOmzet] = useState(0);
    const [suratMasuk, setSuratMasuk] = useState(0);
    const [suratPenawaran, setSuratPenawaran] = useState(0);
    const [fiks, setFiks] = useState(0);
    const [reschedule, setReschedule] = useState(0);

    // Fungsi untuk mengambil data
    const fetchData = async () => {
        try {
            const response = await axios.get('https://econique-perhutani-default-rtdb.firebaseio.com/ReservasiKegiatan.json?auth=oahZAHcmPhj9gDp0HdkDFaCuGRt2pPZrX05YsdIl');
            const data = response.data;

            // Inisialisasi variabel penghitung
            let fiksCount = 0;
            let suratPenawaranCount = 0;
            let rescheduleCount = 0;

            // Menghitung total omzet
            const omzetList = Object.values(data).map(item => parseFloat(item.omzet.replace(/\./g, '')) || 0);
            const total = omzetList.reduce((acc, current) => acc + current, 0);
            setTotalOmzet(total);

            // Mengelompokkan data berdasarkan status
            Object.values(data).forEach(item => {
                if (item.selectedStatus === "Fiks") {
                    fiksCount++;
                } else if (item.selectedStatus === "Surat Penawaran") {
                    suratPenawaranCount++;
                } else if (item.selectedStatus === "Reschedule") {
                    rescheduleCount++;
                }
            });

            // Mengupdate state dengan hasil perhitungan
            setSuratMasuk(Object.values(data).length); // Total surat masuk
            setSuratPenawaran(suratPenawaranCount);
            setFiks(fiksCount);
            setReschedule(rescheduleCount);

        } catch (error) {
            console.error("Error fetching data: ", error);
            toast.error("Gagal mengambil data");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="">
            {/* Header */}
            <div className='bg-white w-screen items-center justify-start flex p-4 h-[63px] sticky top-0 z-20'>
                <h1 className='font-outfit text-[18px] lg:text-2xl font-medium'>Dashboard</h1>
            </div>

            <div className="relative overflow-x-auto lg:overflow-x-hidden w-full lg:my-7">
                {/* Konten dengan lebar minimum yang lebih besar dari viewport */}
                <div className="w-[450px] lg:max-w-[1080px] lg:w-full px-4 mr-24">
                    {/* Grid layout untuk item-item */}
                    <div className="grid grid-cols-2 gap-2 py-3 lg:grid-cols-4 lg:w-full">
                        <div className="bg-white shadow-lg w-full items-center p-2 lg:p-4 justify-center flex flex-col rounded-lg">
                            <h2 className="font-poppins font-medium text-[14px] lg:text-lg">Surat Masuk</h2>
                            <p className="text-[14px] lg:text-2xl font-bold">{suratMasuk}</p>
                        </div>
                        <div className="bg-white shadow-lg w-full items-center p-2 lg:p-4 justify-center flex flex-col rounded-lg">
                            <h2 className="font-poppins font-medium text-[14px] lg:text-lg">Fiks</h2>
                            <p className="text-[14px] lg:text-2xl font-bold">{fiks}</p>
                        </div>
                        <div className="bg-white shadow-lg w-full items-center p-2 lg:p-4 justify-center flex flex-col rounded-lg">
                            <h2 className="font-poppins font-medium text-[14px] lg:text-lg">Reschedule</h2>
                            <p className="text-[14px] lg:text-2xl font-bold">{reschedule}</p>
                        </div>
                        <div className="bg-white shadow-lg w-full items-center p-2 lg:p-4 justify-center flex flex-col rounded-lg">
                            <h2 className="font-poppins font-medium text-[14px] lg:text-lg">Total Omzet</h2>
                            <p className="text-[14px] lg:text-xl font-bold">Rp. {totalOmzet.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</p>
                        </div>
                    </div>

                    <div>
                    {/* Kontainer Cart yang bisa di-scroll */}
                    <div className="overflow-x-auto">
                        <Cart />
                    </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
