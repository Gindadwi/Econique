import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Registrasi modul yang dibutuhkan oleh ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChartMobile = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [],
    });

    const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
    const [availableYears, setAvailableYears] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "https://econique-perhutani-default-rtdb.firebaseio.com/ReservasiKegiatan.json?auth=oahZAHcmPhj9gDp0HdkDFaCuGRt2pPZrX05YsdIl"
                );
                const data = response.data;

                const monthlyFiks = new Array(12).fill(0);
                const monthlyReschedule = new Array(12).fill(0);
                const yearsSet = new Set();

                Object.values(data).forEach((item) => {
                    const startDate = new Date(item.startDate);
                    const month = startDate.getMonth();
                    const year = startDate.getFullYear();
                    yearsSet.add(year);

                    if (year === parseInt(yearFilter)) {
                        if (item.selectedStatus === "Fiks") {
                            monthlyFiks[month]++;
                        } else if (item.selectedStatus === "Reschedule") {
                            monthlyReschedule[month]++;
                        }
                    }
                });

                setChartData({
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    datasets: [
                        {
                            label: `Pesanan Fiks (${yearFilter})`,
                            data: monthlyFiks,
                            backgroundColor: "rgba(1, 102, 0, 0.8)",
                            borderColor: "rgba(3, 255, 0, 0.8)",
                            borderWidth: 1,
                        },
                        {
                            label: `Pesanan Reschedule (${yearFilter})`,
                            data: monthlyReschedule,
                            backgroundColor: "rgba(255, 82, 0, 0.8)",
                            borderColor: "rgba(234, 88, 12, 1)",
                            borderWidth: 1,
                        },
                    ],
                });

                setAvailableYears([...yearsSet].sort((a, b) => a - b));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [yearFilter]);

    return (
        <div className="w-full flex flex-col items-start  lg:px-4 lg:pb-4">
            <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-lg lg:max-w-full">
                <h2 className="text-lg font-semibold mb-4 text-center">Grafik Reservasi</h2>

                <div className="mb-4 flex items-center space-x-4 ">
                    <label htmlFor="yearFilter" className="block text-sm font-medium text-gray-700">
                        Pilih Tahun:
                    </label>
                    <select
                        id="yearFilter"
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="lg:w-80 w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500"
                    >
                        {availableYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Kontainer grafik responsif */}
                <div
                    className="w-full"
                    style={{
                        height: '300px', // Tinggi grafik default (mobile)
                        maxWidth: '750px', // Maksimum lebar grafik (mobile)
                    }}
                >
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
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        display: false, // Menyembunyikan angka di sumbu y
                                    },
                                },
                            }
                        }}
                    />
                </div>
           
            </div>

        </div>
    );
};

export default BarChartMobile;
