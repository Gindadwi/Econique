import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cart from '../component/Cart';

export default function Dashboard() {
    const [totalOmzet, setTotalOmzet] = useState(0);
    const [suratMasuk, setSuratMasuk] = useState(0);
    const [suratPenawaran, setSuratPenawaran] = useState(0);
    const [fiks, setFiks] = useState(0);
    const [reschedule, setReschedule] = useState(0);
    const [Batal, setBatal] = useState(0);


    // Fungsi untuk mengambil data
    const fetchData = async () => {
        try {
            const response = await axios.get('https://econique-perhutani-default-rtdb.firebaseio.com/ReservasiKegiatan.json?auth=oahZAHcmPhj9gDp0HdkDFaCuGRt2pPZrX05YsdIl');
            const data = response.data;

            // Inisialisasi variabel penghitung
            let fiksCount = 0;
            let suratPenawaranCount = 0;
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
                } else if (item.selectedStatus === "Surat Penawaran") {
                    suratPenawaranCount++;
                } else if (item.selectedStatus === "Reschedule") {
                    rescheduleCount++;
                } else if (item.selectedStatus === "Batal") {
                    BatalCount++;
                }
            });

            // Mengupdate state dengan hasil perhitungan
            setSuratMasuk(Object.values(data).length); // Total surat masuk
            setSuratPenawaran(suratPenawaranCount);
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

    return (
        <div className="relative w-full max-w-[1080px] ">
            {/* Header */}
            <div className='bg-white w-screen lg:w-screen items-center justify-start flex p-4 h-[63px] lg:sticky lg:top-0 lg:z-10 hidden lg:block'>
                <h1 className='font-outfit text-[18px] lg:text-2xl font-medium hidden lg:block'>Dashboard Admin</h1>
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


            <div className="mt-3">
                <Cart />
            </div>

        </div>
    );
}
