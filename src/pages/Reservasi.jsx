import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Search from '../common/search';
import Button from '../common/Button';
import IconDownload from '../assets/Download.png';
import { toast } from 'react-hot-toast'; // Import toast
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Navigate, useNavigate, Link } from 'react-router-dom';

import Hapus from '../assets/delete.png'
import Edit from '../assets/Edit.png'

const Reservasi = () => {
  const [reservasiData, setReservasiData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [DownloadOption, setDownloadOption] = useState();
  const downloadRef = useRef(null);
  const Navigate = useNavigate();



  // Menganggil data dari API menggunakan AXios
  // Mengambil data dari API menggunakan Axios
  useEffect(() => {
    const fetchReservasi = async () => {
      try {
        const response = await axios.get('https://econique-perhutani-default-rtdb.firebaseio.com/ReservasiKegiatan.json?auth=oahZAHcmPhj9gDp0HdkDFaCuGRt2pPZrX05YsdIl');
        const dataArray = Object.entries(response.data).map(([key, value]) => ({ id: key, ...value }));
        setReservasiData(dataArray);  // Simpan data API ke reservasiData
        setFilterData(dataArray);     // Awalnya, tampilkan semua data
      } catch (error) {
        console.error("Error fetching reservasi data:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchReservasi();
  }, []);
  // Akhir kode pemanggilan Api 



  // Membuat fungsi Pencarian  
  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      toast.error('Isi Kolom Pencarian');
      setFilterData(reservasiData); // Reset ke data awal jika pencarian kosong
      return;
    }

    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = reservasiData.filter((reservasi) =>
      (reservasi.startDate && reservasi.startDate.includes(lowercasedTerm)) ||
      (reservasi.namaCustomer && reservasi.namaCustomer.toLowerCase().includes(lowercasedTerm)) ||
      (reservasi.tempat && reservasi.tempat.toLowerCase().includes(lowercasedTerm)) ||
      (reservasi.nameKegiatan && reservasi.nameKegiatan.toLowerCase().includes(lowercasedTerm))
    );

    setFilterData(filtered);

    if (filtered.length === 0) {
      toast.error('Data tidak ditemukan');
    } else {
      toast.dismiss();
    }
  };


  // Akhir Membuat Fungsi Pencarian



  // Membuat fungsi download CSV dan PDF

  // Membuat fungsi download CSV dan PDF
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
      return dateObj.getMonth() + 1 === parseInt(selectedMonth);
    });

    if (filteredData.length === 0) {
      toast.error('Tidak ada data untuk bulan yang dipilih');
      return;
    }

    const csvHeaders = "Tanggal Mulai; Tanggal Selesai; Nama; Alamat; Nama Kegiatan; Tempat; Jumlah Orang; Sales; Status; Nominal Bayar\n";

    const csvContent = csvHeaders + filteredData.map(reservasi =>
      `${reservasi.startDate};${reservasi.finishDate};${reservasi.namaCustomer};${reservasi.alamat};${reservasi.nameKegiatan};${reservasi.wisata?.namaWisata && reservasi.wisata?.tempatWisata ? `${reservasi.wisata.namaWisata} - ${reservasi.wisata.tempatWisata.join(", ")}` : ""};${reservasi.jumlahPeserta};${reservasi.sales};${reservasi.selectedStatus};${reservasi.Omzet}`
    ).join("\n");

    const encodeUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodeUri);
    link.setAttribute("download", `reservasi_data_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  // Fungsi untuk download PDF
  const handleDownloadPDF = () => {
    const filteredData = reservasiData.filter((reservasi) => {
      const dateObj = new Date(reservasi.startDate);
      return dateObj.getMonth() + 1 === parseInt(selectedMonth);
    });

    if (filteredData.length === 0) {
      toast.error('Tidak ada data untuk bulan yang dipilih');
      return;
    }

    const doc = new jsPDF();
    doc.text('Data Reservasi', 14, 16);

    const dataTable = filteredData.map((reservasi) => [
      reservasi.startDate,
      reservasi.namaCustomer,
      reservasi.alamat,
      reservasi.nameKegiatan,
      reservasi.wisata?.namaWisata && reservasi.wisata?.tempatWisata ? `${reservasi.wisata.namaWisata} - ${reservasi.wisata.tempatWisata.join(", ")}` : "" ,
      reservasi.jumlahPeserta,
      reservasi.sales,
      reservasi.selectedStatus,
      reservasi.Omzet,
    ]);

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
      head: [tableHeaders],
      body: dataTable,
      startY: 20, // Mengatur posisi tabel setelah judul
    });

    doc.save(`reservasi_data_${selectedMonth}.pdf`);
  };

  const handleClickOutside = (event) => {
    if (downloadRef.current && !downloadRef.current.contains(event.target)) {
      setDownloadOption(false);
    }
  };

  // Menambahkan event listener saat komponen dimount dan menghapusnya saat komponen diunmount
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);




  return (
    <div className='min-w-[460px]'>
      <div className='bg-white lg:w-screen w-screen items-center sticky top-0 z-10 justify-start flex p-4 h-[63px]'>
        <h1 className='font-outfit text-lg lg:text-2xl font-medium'>Reservasi Kegiatan</h1>
      </div>

      <div className='mx-auto mt-5 w-full px-2 lg:px-5 lg:min-w-[1020px] lg:max-w-[1920px] lg:mx-auto '>
        {/* Button fungsi */}
        <div className='lg:mt-10  flex flex-col lg:flex lg:flex-row gap-3'>
          <Search onSearch={handleSearch} />

          <div className='flex gap-2'>
            <Button name="Tambah" className={' w-24 h-9 text-center text-[12px]  lg:text-[24px] lg:w-36 lg:h-[56px]'} onClick={() => Navigate('/tambahData')} />
           
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
                      <div className="relative overflow-x-auto overflow-y-auto min-w-[100px] max-w-[360px] max-h-[500px] lg:max-w-[1080px] lg:max-h-[400px]"> {/* Pastikan max-w-full untuk layar kecil */}
                        <table className='w-full table-auto leading-normal'>
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
