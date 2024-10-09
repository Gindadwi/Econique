import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

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
        <div>
            <div className='bg-white w-screen items-center justify-start flex p-4 h-[63px]'>
                <h1 className='font-outfit text-2xl font-medium'>Dashboard</h1>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="border border-blue-500 p-4 rounded-lg">
                    <h2 className="font-outfit text-lg">Surat Masuk</h2>
                    <p className="text-2xl font-bold">{suratMasuk}</p>
                </div>
                <div className="border border-gray-300 p-4 rounded-lg">
                    <h2 className="font-outfit text-lg">Surat Penawaran</h2>
                    <p className="text-2xl font-bold">{suratPenawaran}</p>
                </div>
                <div className="border border-gray-300 p-4 rounded-lg">
                    <h2 className="font-outfit text-lg">Fiks</h2>
                    <p className="text-2xl font-bold">{fiks}</p>
                </div>
                <div className="border border-gray-300 p-4 rounded-lg">
                    <h2 className="font-outfit text-lg">Reschedule</h2>
                    <p className="text-2xl font-bold">{reschedule}</p>
                </div>
                <div className="border border-gray-300 p-4 rounded-lg">
                    <h2 className="font-outfit text-lg">Total Omzet</h2>
                    <p className="text-2xl font-bold">Rp {totalOmzet.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</p>
                </div>
            </div>
        </div>
    );
}
