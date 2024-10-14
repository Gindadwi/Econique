// Import React hooks dan komponen yang dibutuhkan
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2"; // Komponen ChartJS khusus untuk grafik batang
import axios from "axios"; // Library untuk request API
import {
    Chart as ChartJS, // Registrasi modul ChartJS agar grafik dapat digunakan
    CategoryScale, // Skala kategori untuk sumbu X
    LinearScale, // Skala linear untuk sumbu Y
    BarElement, // Elemen batang dalam grafik
    Title, Tooltip, Legend, // Plugin untuk judul, tooltip, dan legend
} from "chart.js";

// Registrasi modul-modul ChartJS yang akan digunakan
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Komponen utama grafik batang
const BarChartMobile = () => {
    // State untuk menyimpan data grafik (label dan dataset)
    const [chartData, setChartData] = useState({
        labels: [], // Label bulan
        datasets: [], // Data pesanan per bulan
    });

    // State untuk menyimpan tahun yang dipilih sebagai filter
    const [yearFilter, setYearFilter] = useState(new Date().getFullYear()); // Default: tahun sekarang

    // State untuk menyimpan daftar tahun yang tersedia dalam data
    const [availableYears, setAvailableYears] = useState([]);

    // useEffect untuk memuat data saat komponen pertama kali dirender atau ketika tahunFilter berubah
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "https://econique-perhutani-default-rtdb.firebaseio.com/ReservasiKegiatan.json?auth=oahZAHcmPhj9gDp0HdkDFaCuGRt2pPZrX05YsdIl"
                );
                const data = response.data;

                // Inisialisasi array untuk menyimpan jumlah pesanan per bulan untuk masing-masing status
                const monthlyFiks = new Array(12).fill(0); // Untuk "Fiks"
                const monthlyReschedule = new Array(12).fill(0); // Untuk "Reschedule"

                const yearsSet = new Set(); // Set untuk menyimpan tahun unik

                // Iterasi setiap item data
                Object.values(data).forEach((item) => {
                    const startDate = new Date(item.startDate); // Konversi tanggal mulai
                    const month = startDate.getMonth(); // Dapatkan bulan (0-11)
                    const year = startDate.getFullYear(); // Dapatkan tahun

                    yearsSet.add(year); // Tambahkan tahun ke dalam Set

                    // Pisahkan jumlah pesanan berdasarkan status
                    if (year === parseInt(yearFilter)) {
                        if (item.selectedStatus === "Fiks") {
                            monthlyFiks[month]++;
                        } else if (item.selectedStatus === "Reschedule") {
                            monthlyReschedule[month]++;
                        }
                    }
                });

                // Set data untuk grafik dengan dua dataset berbeda
                setChartData({
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    datasets: [
                        {
                            label: `Pesanan Fiks (${yearFilter})`,
                            data: monthlyFiks,
                            backgroundColor: "rgba(1, 102, 0, 0.8)", // Warna biru transparan
                            borderColor: "rgba(3, 255, 0, 0.8)", // Warna biru lebih gelap
                            borderWidth: 1,
                        },
                        {
                            label: `Pesanan Reschedule (${yearFilter})`,
                            data: monthlyReschedule,
                            backgroundColor: "rgba(255, 82, 0, 0.8)", // Warna oranye transparan
                            borderColor: "rgba(234, 88, 12, 1)", // Warna oranye lebih gelap
                            borderWidth: 1,
                        },
                    ],
                });

                // Set daftar tahun yang tersedia
                setAvailableYears([...yearsSet].sort((a, b) => a - b));
            } catch (error) {
                console.error("Error fetching data:", error); // Tangani error jika ada
            }
        };

        fetchData(); // Panggil fungsi untuk memuat data
    }, [yearFilter]); // Dipicu setiap kali filter tahun berubah

    return (
        <div className="p-4 relative overflow-x-auto bg-white rounded-lg shadow-md max-w-[1080px] lg:w-[500px] mx-0">
            <h2 className="text-lg font-semibold mb-4">Grafik Pesanan</h2>

            {/* Filter Tahun */}
            <div className="mb-4 flex flex-row items-center justify-center">
                <label htmlFor="yearFilter" className="block text-sm w-36 font-medium text-gray-700">
                    Pilih Tahun:
                </label>
                <select
                    id="yearFilter"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500"
                >
                    {availableYears.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            {/* Grafik Batang */}
            <div className="min-w-[500px] overflow-x-auto lg:min-w-0 lg:overflow-x-hidden">
                <div className="flex flex-col justify-start items-start">
                    <Bar
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { position: "top" },
                                title: {
                                    display: true,
                                    text: `Pesanan Fiks & Reschedule per Bulan (${yearFilter})`,
                                },
                            },
                            scales: {
                                y: { beginAtZero: true },
                            },
                        }}
                        height={300} // Tinggi grafik untuk tampilan mobile
                    />
                </div>
            </div>
        </div>
    );

};

// Ekspor komponen agar bisa digunakan di file lain
export default BarChartMobile;
