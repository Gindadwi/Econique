import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Search from '../common/search';
import Button from '../common/Button';
import IconDownload from '../assets/Download.png';
import { toast } from 'react-hot-toast'; // Import toast untuk menampilkan notifikasi
import jsPDF from 'jspdf'; // Import jsPDF untuk download PDF
import 'jspdf-autotable'; // Import AutoTable untuk membuat tabel dalam PDF
import { Navigate, useNavigate, Link } from 'react-router-dom';

import Hapus from '../assets/delete.png'
import Edit from '../assets/Edit.png'

const Reservasi = () => {
  const [reservasiData, setReservasiData] = useState([]); // State untuk menyimpan data reservasi
  const [filterData, setFilterData] = useState([]); // State untuk menyimpan data yang sudah difilter
  const [loading, setLoading] = useState(true); // State untuk menunjukkan status loading
  const [selectedMonth, setSelectedMonth] = useState(''); // State untuk menyimpan bulan yang dipilih untuk download
  const [DownloadOption, setDownloadOption] = useState(); // State untuk menunjukkan opsi download
  const downloadRef = useRef(null); // Ref untuk mendeteksi klik di luar opsi download
  const Navigate = useNavigate(); // Hook untuk navigasi halaman

  // Memanggil data dari API menggunakan Axios saat komponen di-mount
  useEffect(() => {
    const fetchReservasi = async () => {
      try {
        const response = await axios.get('https://econique-perhutani-default-rtdb.firebaseio.com/ReservasiKegiatan.json?auth=oahZAHcmPhj9gDp0HdkDFaCuGRt2pPZrX05YsdIl');
        const dataArray = Object.entries(response.data).map(([key, value]) => ({ id: key, ...value })); // Mengubah data menjadi array dengan ID
        setReservasiData(dataArray);  // Menyimpan data ke state reservasiData
        setFilterData(dataArray);     // Menampilkan semua data di awal
      } catch (error) {
        console.error("Error fetching reservasi data:", error); // Menampilkan error jika terjadi kesalahan
      } finally {
        setLoading(false); // Menghentikan status loading setelah data diambil
      }
    };

    fetchReservasi();
  }, []);

  // Daftar bulan untuk pencarian dengan nama bulan
  const SearchMount = {
    januari: '01',
    februari: '02',
    maret: '03',
    april: '04',
    mei: '05',
    juni: '06',
    juli: '07',
    agustus: '08',
    september: '09',
    oktober: '10',
    november: '11',
    desember: '12',
  };

  // Fungsi untuk melakukan pencarian
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      toast.error('Isi Kolom Pencarian'); // Menampilkan notifikasi jika kolom kosong
      setFilterData(reservasiData); // Reset ke data awal jika pencarian kosong
      return;
    }

    const lowercasedTerm = searchTerm.toLowerCase(); // Mengubah input menjadi lowercase untuk pencarian
    const monthNumber = SearchMount[lowercasedTerm]; // Konversi nama bulan menjadi nomor bulan

    // Filter data berdasarkan input pencarian (bulan, nama, tempat, dll)
    const filtered = reservasiData.filter((reservasi) => {
      const reservasiMonth = new Date(reservasi.startDate).getMonth() + 1; // Mendapatkan bulan dari tanggal
      const formattedMonth = reservasiMonth < 10 ? `0${reservasiMonth}` : `${reservasiMonth}`; // Format bulan dengan dua digit
      return (
        (reservasi.startDate && reservasi.startDate.includes(lowercasedTerm)) || // Pencarian berdasarkan tanggal
        (reservasi.namaCustomer && reservasi.namaCustomer.toLowerCase().includes(lowercasedTerm)) || // Pencarian berdasarkan nama customer
        (reservasi.tempat && reservasi.tempat.toLowerCase().includes(lowercasedTerm)) || // Pencarian berdasarkan tempat
        (reservasi.nameKegiatan && reservasi.nameKegiatan.toLowerCase().includes(lowercasedTerm)) || // Pencarian berdasarkan nama kegiatan
        (monthNumber && formattedMonth === monthNumber) // Pencarian berdasarkan bulan
      );
    });

    setFilterData(filtered); // Menyimpan hasil filter ke state

    if (filtered.length === 0) {
      toast.error('Data Bulan ini tidak ditemukan'); // Menampilkan pesan jika data tidak ditemukan
    } else {
      toast.dismiss(); // Menghilangkan notifikasi
    }
  };

  // Daftar pilihan bulan untuk dropdown download
  const monthOption = [
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

  // Fungsi untuk download CSV
  const handleDownloadCSV = () => {
    const filteredData = reservasiData.filter((reservasi) => {
      const dateObj = new Date(reservasi.startDate);
      return dateObj.getMonth() + 1 === parseInt(selectedMonth); // Filter berdasarkan bulan yang dipilih
    });

    if (filteredData.length === 0) {
      toast.error('Tidak ada data untuk bulan yang dipilih'); // Pesan error jika data tidak ada
      return;
    }

    // Header CSV
    const csvHeaders = "Tanggal Mulai; Tanggal Selesai; Nama; Alamat; Nama Kegiatan; Tempat; Jumlah Orang; Sales; Status; Nominal Bayar\n";

    // Konten CSV
    const csvContent = csvHeaders + filteredData.map(reservasi =>
      `${reservasi.startDate};${reservasi.finishDate};${reservasi.namaCustomer};${reservasi.alamat};${reservasi.nameKegiatan};${reservasi.wisata?.namaWisata && reservasi.wisata?.tempatWisata ? `${reservasi.wisata.namaWisata} - ${reservasi.wisata.tempatWisata.join(", ")}` : ""};${reservasi.jumlahPeserta};${reservasi.sales};${reservasi.selectedStatus};${reservasi.Omzet}`
    ).join("\n");

    const encodeUri = encodeURI("data:text/csv;charset=utf-8," + csvContent); // Encode konten CSV
    const link = document.createElement("a"); // Membuat link download
    link.setAttribute("href", encodeUri);
    link.setAttribute("download", `reservasi_data_${selectedMonth}.csv`); // Nama file CSV
    document.body.appendChild(link);
    link.click(); // Mengunduh file CSV
  };

  // Fungsi untuk download PDF
  const handleDownloadPDF = () => {
    const filteredData = reservasiData.filter((reservasi) => {
      const dateObj = new Date(reservasi.startDate);
      return dateObj.getMonth() + 1 === parseInt(selectedMonth); // Filter berdasarkan bulan yang dipilih
    });

    if (filteredData.length === 0) {
      toast.error('Tidak ada data untuk bulan yang dipilih'); // Pesan error jika tidak ada data
      return;
    }

    const doc = new jsPDF(); // Membuat dokumen PDF
    doc.text('Data Reservasi', 14, 16); // Menambahkan teks judul

    // Konten tabel dalam PDF
    const dataTable = filteredData.map((reservasi) => [
      reservasi.startDate,
      reservasi.namaCustomer,
      reservasi.alamat,
      reservasi.nameKegiatan,
      reservasi.wisata?.namaWisata && reservasi.wisata?.tempatWisata ? `${reservasi.wisata.namaWisata} - ${reservasi.wisata.tempatWisata.join(", ")}` : "",
      reservasi.jumlahPeserta,
      reservasi.sales,
      reservasi.selectedStatus,
      reservasi.Omzet,
    ]);

    // Header tabel PDF
    const tableHeaders = [
      "Tanggal Mulai",
      "Nama",
      "Alamat",
      "Nama Kegiatan",
      "Tempat",
      "Jumlah Orang",
      "Sales",
      "Status",
      "Nominal Bayar"
    ];

    doc.autoTable({
      head: [tableHeaders], // Menambahkan header ke tabel
      body: dataTable, // Menambahkan data ke tabel
      startY: 20, // Posisi tabel setelah judul
    });

    doc.save(`reservasi_data_${selectedMonth}.pdf`); // Mengunduh PDF dengan nama file
  };

  // Fungsi untuk mendeteksi klik di luar opsi download
  const handleClickOutside = (event) => {
    if (downloadRef.current && !downloadRef.current.contains(event.target)) {
      setDownloadOption(false); // Menutup opsi download jika klik di luar
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside); // Menambahkan event listener saat komponen di-mount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Menghapus event listener saat komponen di-unmount
    };
  }, []);

// Render halaman reservasi




  return (
    <div className=''>
      <div className='bg-white w-screen items-center justify-start flex p-4 h-[63px] sticky top-0 z-20'>
        <h1 className='font-outfit text-[18px] lg:text-2xl font-medium'>Reservasi Kegiatan</h1>
      </div>

      <div className='mx-auto mt-5 w-auto px-2 lg:px-5 lg:min-w-[1020px] lg:max-w-[1920px] lg:mx-auto '>
        {/* Button fungsi */}
        <div className='lg:mt-10  flex flex-col lg:flex lg:flex-row gap-3'>
          <Search onSearch={handleSearch} />

          <div className='flex gap-2'>
            <Button name="Tambah" className={' w-24 h-9 text-center text-[11px]  lg:text-[24px] lg:w-36 lg:h-[56px]'} onClick={() => Navigate('/tambahData')} />
           
            {/* Membuat Button Download */}
            <div className='flex flex-col relative'>
              <Button img={IconDownload}
                className={'w-14 h-9 lg:h-[56px] items-center justify-center flex'}
                classNameIcon={' w-[30px] lg:w-[40px] '}
                onClick={() => setDownloadOption(!DownloadOption)}
              />{DownloadOption && (
                <div className='absolute top-full mt-2 -ml-12 lg:-left-32 w-48 lg:w-80 bg-white rounded-lg border border-1 border-black flex flex-col gap-1 lg:flex lg:flex-row lg:gap-5 p-4 shadow-2xl z-50'>
                  <select
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    value={selectedMonth}
                    className="border border-warnaDasar h-10 bg-white text-warnaDasar p-2 rounded-lg w-40 lg:w-32 font-outfit font-medium
                 focus:ring-warnaDasar focus:border-warnaDasar transition ease-in-out"
                  >
                    <option
                      className="font-poppins border border-spacing-1 bg-warnaDasar text-white p-2"
                      value=""
                    >
                      Pilih Bulan
                    </option>
                    {monthOption.map((mount) => (
                      <option
                        key={mount.value}
                        value={mount.value}
                        className="font-poppins bg-white text-gray-700 hover:bg-warnaDasar hover:text-white transition-all"
                      >
                        {mount.label}
                      </option>
                    ))}
                  </select>
                  <div className='flex flex-col gap-2'>
                    <button className='bg-warnaDasar p-2 text-white font-outfit rounded-lg text-sm h-10 
                    transform transition-transform duration-300 hover:scale-105' onClick={handleDownloadCSV}>Download CSV</button>

                    <button className='bg-warnaDasar p-2 text-white font-outfit rounded-lg text-sm h-10
                    transform transition-transform duration-300 hover:scale-105' onClick={handleDownloadPDF}>Download PDF</button>
                  </div>
                </div>
              )}
            </div>          
          </div>
        </div>
        {/* akhir button fungsi */}




        {/* Membuat Loading */}
        <div className='rounded-xl relative lg:min-w-[460px] lg:max-w-[1080px] pr-2 flex mt-2'>
          <div>
            {loading ? (
              <div className='flex justify-center mt-10'>
                <div className='spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full'></div>
              </div>
            ) : (
              // Membuat Tabel reservasi
                <div className='container w-auto min-w-[460px] relative rounded-xl flex items-start justify-start lg:items-center lg:justify-center gap-1 mt-5'>
                  <div className='bg-white rounded-xl shadow-lg lg:max-w-7xl'>
                    {/* Membungkus tabel dengan div untuk scroll horizontal */}
                    <div className="relative flex items-start justify-start w-full"> {/* Tambahkan w-full agar mengambil seluruh lebar layar */}
                      <div className="relative overflow-x-auto overflow-y-auto min-w-[300px] max-w-[260px] max-h-[500px] lg:max-w-[1080px] lg:max-h-[400px]"> {/* Pastikan max-w-full untuk layar kecil */}
                        <table className='lg:w-full table-auto leading-normal'>
                          <thead className='bg-white text-black uppercase text-sm font-poppins leading-normal sticky top-0 z-10'>
                            <tr>
                              <th className="px-6 lg:px-6 lg:py-4 text-left font-outfit font-medium lg:font-bold">Tanggal Mulai</th>
                              <th className="px-4 lg:px-6 lg:py-4 text-left font-outfit font-medium lg:font-bold">Nama</th>
                              <th className="px-4 lg:px-6 lg:py-4 text-left font-outfit font-medium lg:font-bold">Tempat</th>
                              <th className="px-4 lg:px-6 lg:py-4 text-left font-outfit font-medium lg:font-bold">Sales</th>
                              <th className="px-4 lg:px-6 lg:py-4 text-left font-outfit font-medium lg:font-bold">Omzet</th>
                              <th className="px-4 lg:px-6 lg:py-4 text-left font-outfit font-medium lg:font-bold">Status</th>
                              <th className="px-6 lg:px-6 lg:py-4 text-left font-outfit font-medium lg:font-bold"></th>
                            </tr>
                          </thead>

                          <tbody>
                            {filterData.map((reservasi, index) => (
                              <tr key={reservasi.id} className={`border-b border-gray-200 hover:bg-gray-100 ${index % 2 === 0 ? 'bg-green-100' : 'bg-white'}`}>
                                <td className="px-3 lg:px-6 lg:py-4 text-left font-outfit font-normal lg:font-medium">{reservasi.startDate}</td>
                                <td className="px-4 lg:px-6 lg:py-4 text-left font-outfit font-normal lg:font-medium">{reservasi.namaCustomer}</td>
                                <td className="px-4 lg:px-6 lg:py-4 text-left font-outfit font-normal lg:font-medium">  {reservasi.wisata?.namaWisata && reservasi.wisata?.tempatWisata ?`${reservasi.wisata.namaWisata} - ${reservasi.wisata.tempatWisata.join(", ")}` : ""}</td>
                                <td className="px-4 lg:px-6 lg:py-4 text-left font-outfit font-normal lg:font-medium">{reservasi.sales}</td>
                                <td className="px-4 lg:px-6 lg:py-4 text-left font-outfit font-normal lg:font-medium">{reservasi.omzet}</td>
                                <td className="px-4 lg:px-6 lg:py-4 text-left font-outfit font-normal lg:font-medium">{reservasi.selectedStatus}</td>
                                <td className="flex flex-col lg:flex-row gap-3 items-center justify-center mt-3">
                                  <button className="" onClick={() => Navigate(`/detailData/${reservasi.id}`)}>
                                    <img className='w-[20px]' src={Edit} alt="Edit" />
                                  </button>

                                  <button className=""><img className='w-[25px]' src={Hapus} alt="" /></button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  <div>
                  </div>
                </div>
               </div>               

            )}
          </div>
        </div>

        {/* Akhir Membuat Tabel  */}
        
      </div>



    </div>
  );
};

export default Reservasi;
