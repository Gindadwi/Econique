import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cart from '../component/Cart';
import { ImCheckmark, ImCalendar, ImCross } from "react-icons/im";


export default function Dashboard() {
    const [totalOmzet, setTotalOmzet] = useState(0);
    const [fiks, setFiks] = useState(0);
    const [reschedule, setReschedule] = useState(0);
    const [Batal, setBatal] = useState(0);
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");


    //Membuat filter berdasarkan tahun dan bulan untuk total omzet
    const FilterMounth = [
        { value: '01', label: 'Januari' },
        { value: '02', label: 'Februari' },
        { value: '03', label: 'Maret' },
        { value: '04', label: 'April' },
        { value: '05', label: 'Mei' },
        { value: '06', label: 'Juni' },
        { value: '07', label: 'Juli' },
        { value: '08', label: 'Agustus' },
        { value: '09', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' },
    ];


    // Fungsi untuk mengambil data
    const fetchData = async () => {
        try {
            const response = await axios.get('https://econique-perhutani-default-rtdb.firebaseio.com/ReservasiKegiatan.json?auth=oahZAHcmPhj9gDp0HdkDFaCuGRt2pPZrX05YsdIl');
            const data = response.data;

            // Inisialisasi variabel penghitung
            let fiksCount = 0;
            let rescheduleCount = 0;
            let BatalCount = 0;
            let filteredOmzet = 0;
            const yearsSet = new Set(); //untuk menyimpan tahun yang unik

            Object.values(data).forEach(item => {
                const itemDate = new Date (item.startDate);
                const itemYear = itemDate.getFullYear();
                const itemMonth = (itemDate.getMonth() + 1).toString().padStart(2, '0') //memastikan bulan memiliki dua digit

                //Tambahkan tahun ke dalam set 
                yearsSet.add(itemYear)
                //memeriksa apakah otem cocok dengan tahun dan bulan yang dipilih
                if ((!selectedYear || selectedYear === itemYear.toString()) && 
                    (!selectedMonth || selectedMonth == itemMonth)) {
                    //jumlah omzet untuk item yang di filter
                    filteredOmzet += parseFloat (item.omzet.replace(/\./g,'')) || 0;
                    
                    //menghitung berdasarkan status
                    if (item.selectedStatus === "Fiks") fiksCount++;
                    else if (item.selectedStatus === "Reschedule") rescheduleCount++;
                    else if (item.selectedStatus === "Batal") BatalCount++;
                }
            });

            setTotalOmzet(filteredOmzet);
            setFiks(fiksCount);
            setReschedule(rescheduleCount);
            setBatal(BatalCount);


            //ubah yearset menjadi array dan set status availableYears
            setAvailableYears (Array.from(yearsSet).map(year => ({value: year.toString(), label: year.toString() })));

        } catch (error) {
            console.error("Error fetching data: ", error);
            toast.error("Gagal mengambil data");
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedYear, selectedMonth]);

    return (
        <div className="relative w-full max-w-[1080px] ">
            {/* Header */}
            <div className='bg-white w-screen lg:w-screen items-center justify-start flex p-4 h-[63px] lg:sticky lg:top-0 lg:z-10 hidden lg:block'>
                <h1 className='font-outfit text-[18px] lg:text-2xl font-medium hidden lg:block'>Dashboard Admin</h1>
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
                <div className="bg-white flex flex-col items-center p-2 rounded-lg shadow-lg">
                    <div className="flex gap-2 my-2">
                        <div className="relative w-14 lg:w-28">
                            <select
                                className="w-full border border-gray-300 rounded-lg p-1 shadow-md text-gray-700 appearance-none bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            >
                                <option value="" disabled>
                                    Bulan
                                </option>
                                {FilterMounth.map((bulan) => (
                                    <option key={bulan.value} value={bulan.value}>
                                        {bulan.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="relative w-14 lg:w-28 ">
                            <select
                                className="w-full border border-gray-300 rounded-lg p-1 shadow-md text-gray-700 appearance-none bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            >
                                <option value="" disabled className="font-poppins">
                                    Tahun
                                </option>
                                {availableYears.map((year) => (
                                    <option key={year.value} value={year.value}>
                                        {year.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <p className="lg:text-xl text-md font-bold text-gray-700 my-1">
                        Rp. {totalOmzet.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </p>
                </div>
            </div>
            <div className="mt-3 px-4">
                <Cart />
            </div>

        </div>
    );
}
