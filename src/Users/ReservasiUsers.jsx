import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Search from '../common/search';
import Button from '../common/Button';
import IconDownload from '../assets/Download.png';
import { toast } from 'react-hot-toast'; // Import toast untuk menampilkan notifikasi
import jsPDF from 'jspdf'; // Import jsPDF untuk download PDF
import 'jspdf-autotable'; // Import AutoTable untuk membuat tabel dalam PDF
import { Navigate, useNavigate, Link } from 'react-router-dom';


import Edit from '../assets/Edit.png'
import { HiEye } from 'react-icons/hi';

const Reservasi = () => {
  const [reservasiData, setReservasiData] = useState([]); // State untuk menyimpan data reservasi
  const [filterData, setFilterData] = useState([]); // State untuk menyimpan data yang sudah difilter
  const [loading, setLoading] = useState(true); // State untuk menunjukkan status loading
  const [selectedMonth, setSelectedMonth] = useState(''); // State untuk menyimpan bulan yang dipilih untuk download
  const [DownloadOption, setDownloadOption] = useState(); // State untuk menunjukkan opsi download
  const downloadRef = useRef(null); // Ref untuk mendeteksi klik di luar opsi download
  const Navigate = useNavigate(); // Hook untuk navigasi halaman
  const [selectedYear, setSelectedYear] = useState('');



  // Memanggil data dari API menggunakan Axios saat komponen di-mount
  useEffect(() => {
    const fetchReservasi = async () => {
      try {
        const response = await axios.get('https://econique-perhutani-default-rtdb.firebaseio.com/ReservasiKegiatan.json?auth=oahZAHcmPhj9gDp0HdkDFaCuGRt2pPZrX05YsdIl');
        const dataArray = Object.entries(response.data).map(([key, value]) => ({ id: key, ...value })); // Mengubah data menjadi array dengan ID
        //Mengurutkan data berdasarkan start date
        dataArray.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
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
      toast.error('Isi Kolom Pencarian');
      setFilterData(reservasiData); // Reset data jika input pencarian kosong
      return;
    }

    const lowercasedTerm = searchTerm.toLowerCase();
    const searchTerms = lowercasedTerm.split(' '); // Memisahkan input menjadi array [bulan, tahun]
    const searchMonth = searchTerms[0]; // Bulan yang dicari
    const searchYear = searchTerms[1]; // Tahun yang dicari (opsional)

    const monthNumber = SearchMount[searchMonth]; // Mendapatkan nomor bulan berdasarkan input bulan

    // Filter data berdasarkan input pencarian (bulan dan tahun)
    const filtered = reservasiData.filter((reservasi) => {
      const reservasiDate = new Date(reservasi.startDate);
      const reservasiMonth = reservasiDate.getMonth() + 1; // Mendapatkan bulan dari tanggal
      const reservasiYear = reservasiDate.getFullYear(); // Mendapatkan tahun dari tanggal

      const formattedMonth = reservasiMonth < 10 ? `0${reservasiMonth}` : `${reservasiMonth}`; // Format bulan jadi dua digit

      const isMonthMatch = monthNumber && formattedMonth === monthNumber;
      const isYearMatch = searchYear ? reservasiYear === parseInt(searchYear) : true;

      return (
        (reservasi.startDate && reservasi.startDate.includes(lowercasedTerm)) ||
        (reservasi.namaCustomer && reservasi.namaCustomer.toLowerCase().includes(lowercasedTerm)) ||
        (reservasi.tempat && reservasi.tempat.toLowerCase().includes(lowercasedTerm)) ||
        (reservasi.nameKegiatan && reservasi.nameKegiatan.toLowerCase().includes(lowercasedTerm)) ||
        (isMonthMatch && isYearMatch) // Pencarian berdasarkan bulan dan tahun
      );
    });

    setFilterData(filtered);

    if (filtered.length === 0) {
      toast.error('Data tidak ditemukan untuk bulan dan tahun ini');
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

  // Extract unique years from reservasiData
  const yearOption = [...new Set(reservasiData.map((reservasi) => {
    const dateObj = new Date(reservasi.startDate);
    return dateObj.getFullYear();
  }))];

  //membuat fungsi download csv
  const handleDownloadCSV = () => {
    const filteredData = reservasiData.filter((reservasi) => {
      const dateObj = new Date(reservasi.startDate);
      return (
        dateObj.getMonth() + 1 === parseInt(selectedMonth) &&
        dateObj.getFullYear() === parseInt(selectedYear)
      );
    });

    if (filteredData.length === 0) {
      toast.error('Tidak ada data untuk bulan dan tahun yang dipilih');
      return;
    }

    // Hitung total omzet untuk 'Fiks'
    const totalOmzetFiks = filteredData.reduce((total, reservasi) => {
      if (reservasi.selectedStatus === "Fiks") {
        const parsedOmzet = parseFloat(
          reservasi.omzet?.replace(/\./g, "") || 0
        );
        return total + parsedOmzet;
      }
      return total;
    }, 0);

    // Hitung total omzet untuk 'Batal'
    const totalOmzetBatal = filteredData.reduce((total, reservasi) => {
      if (reservasi.selectedStatus === "Batal") {
        const parsedOmzet = parseFloat(
          reservasi.omzet?.replace(/\./g, "") || 0
        );
        return total + parsedOmzet;
      }
      return total;
    }, 0);

    const csvHeaders =
      "Tanggal Mulai; Tanggal Selesai; Nama; Alamat; Nama Kegiatan; Tempat; Jumlah Orang; Sales; Status; Nominal Bayar\n";

    const csvContent =
      csvHeaders +
      filteredData
        .map((reservasi) =>
          `${reservasi.startDate};${reservasi.finishDate};${reservasi.namaCustomer};${reservasi.alamat};${reservasi.nameKegiatan};${reservasi.wisata?.namaWisata && reservasi.wisata?.tempatWisata
            ? `${reservasi.wisata.namaWisata} - ${reservasi.wisata.tempatWisata.join(", ")}`
            : ""
          };${reservasi.jumlahPeserta};${reservasi.sales};${reservasi.selectedStatus};${reservasi.omzet}`
        )
        .join("\n") + '\n' +
      // Tambahkan baris untuk Total Omzet Fiks dan Batal di bawah data
      `\nTotal Omzet Fiks: ;${totalOmzetFiks}\nTotal Omzet Batal: ;${totalOmzetBatal}`;

    const encodeUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodeUri);
    link.setAttribute(
      "download",
      `reservasi_data_${selectedYear}_${selectedMonth}.csv`
    );
    document.body.appendChild(link);
    link.click();
  };


  //fungsi download pdf
  const handleDownloadPDF = () => {
    const filteredData = reservasiData.filter((reservasi) => {
      const dateObj = new Date(reservasi.startDate);
      return dateObj.getMonth() + 1 === parseInt(selectedMonth) && dateObj.getFullYear() === parseInt(selectedYear);
    });

    if (filteredData.length === 0) {
      toast.error('Tidak ada data untuk bulan dan tahun yang dipilih');
      return;
    }

    const doc = new jsPDF({ orientation: 'landscape' }); // Mengatur orientasi halaman menjadi landscape
    doc.setFontSize(10);
    doc.autoTable({
      head: [
        [
          'Tanggal Mulai',
          'Tanggal Selesai',
          'Nama',
          'Alamat',
          'Nama Kegiatan',
          'Tempat',
          'Jumlah Orang',
          'Sales',
          'Status',
          'Nominal Bayar'
        ]
      ],
      body: filteredData.map(reservasi => [
        new Date(reservasi.startDate).toLocaleDateString('id-ID'), // Format tanggal
        new Date(reservasi.finishDate).toLocaleDateString('id-ID'),
        reservasi.namaCustomer,
        reservasi.alamat,
        reservasi.nameKegiatan,
        reservasi.wisata?.namaWisata && reservasi.wisata?.tempatWisata
          ? `${reservasi.wisata.namaWisata} - ${reservasi.wisata.tempatWisata.join(", ")}`
          : "",
        reservasi.jumlahPeserta,
        reservasi.sales,
        reservasi.selectedStatus,
        `Rp ${reservasi.omzet}`
      ]),
      styles: {
        overflow: 'linebreak',
        cellPadding: 3
      },
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 10
      },
      // Menggunakan autoWidth untuk penyesuaian kolom otomatis
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' },
        4: { cellWidth: 'auto' },
        5: { cellWidth: 'auto' },
        6: { cellWidth: 'auto' },
        7: { cellWidth: 'auto' },
        8: { cellWidth: 'auto' },
        9: { cellWidth: 'auto' }
      }
    });

    doc.save(`reservasi_data_${selectedYear}_${selectedMonth}.pdf`);
  };



  //Akhir kode 


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
      <div className='lg:bg-white lg:w-screen lg:items-center lg:justify-start lg:flex lg:p-4 lg:h-[63px] lg:sticky lg:top-0 lg:z-10'>
        <h1 className='font-outfit lg:text-2xl lg:font-medium hidden lg:block'>Reservasi Kegiatan</h1>
      </div>

      <div className='container w-full mt-3 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mx-auto flex flex-col lg:max-w-[1920px]'>
        {/* Button fungsi */}
        <div className='lg:mt-4  flex flex-col lg:flex lg:flex-row gap-3'>
          <Search onSearch={handleSearch} />

          <div className=' flex flex-col lg:flex lg:flex-row gap-3'>
            <div className='flex gap-2'>
              <div className='flex flex-col relative'>
                <Button img={IconDownload}
                  className={'w-14 h-9 lg:h-[56px] items-center justify-center flex'}
                  classNameIcon={' w-[30px] lg:w-[40px] '}
                  onClick={() => setDownloadOption(!DownloadOption)}
                />
                {DownloadOption && (
                  <div className='absolute top-full mt-2 -ml-12 lg:-left-32 w-48 lg:w-80 bg-white rounded-lg border border-1 border-black flex flex-col gap-2 lg:flex lg:flex-row lg:gap-2 p-4 shadow-2xl z-50'>
                    {/* Year Dropdown */}

                    <div className='flex flex-col gap-2'>
                      <select
                        onChange={(e) => setSelectedYear(e.target.value)}
                        value={selectedYear}
                        className="border border-warnaDasar h-10 bg-white text-warnaDasar p-2 rounded-lg w-40 lg:w-32 font-outfit font-medium
                            focus:ring-warnaDasar focus:border-warnaDasar transition ease-in-out"
                      >
                        <option value="">Pilih Tahun</option>
                        {yearOption.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>

                      {/* Month Dropdown */}
                      <select
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        value={selectedMonth}
                        className="border border-warnaDasar h-10 bg-white text-warnaDasar p-2 rounded-lg w-40 lg:w-32 font-outfit font-medium
  focus:ring-warnaDasar focus:border-warnaDasar transition ease-in-out"
                      >
                        <option value="">Pilih Bulan</option>
                        {monthOption.map((month) => (
                          <option key={month.value} value={month.value}>
                            {month.label}
                          </option>
                        ))}
                      </select>

                    </div>

                    {/* Download Buttons */}
                    <div className='flex flex-col gap-2'>
                      <button className='bg-warnaDasar p-2 text-white font-outfit rounded-lg text-sm h-10 
                    transform transition-transform duration-300 hover:scale-105' onClick={handleDownloadCSV}>
                        Download CSV
                      </button>

                      <button className='bg-warnaDasar p-2 text-white font-outfit rounded-lg text-sm h-10
                    transform transition-transform duration-300 hover:scale-105' onClick={handleDownloadPDF}>
                        Download PDF
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* akhir button fungsi */}




        {/* Membuat Loading */}
        <div className='relative my-5 overflow-x-auto overflow-y-auto max-h-[450px] lg:max-h-[450px]'>
          <table className='w-full text-sm overflow-x-auto relative  lg:text-base table-auto'>
            <thead className='bg-blue-700 text-black sticky top-0 z-10'>
              <tr>
                <th className='min-w-[150px] whitespace-nowrap px-5 py-2 font-outfit font-semibold lg:font-semibold text-center'>Tanggal Mulai</th>
                <th className='min-w-[150px] whitespace-nowrap px-5 py-2 font-outfit font-semibold lg:font-semibold text-left'>Nama</th>
                <th className='min-w-[150px] whitespace-nowrap px-5 py-2 font-outfit font-semibold lg:font-semibold text-left'>Institusi/Instansi/Corporate<br />/Komunitas</th>
                <th className='min-w-[150px] whitespace-nowrap px-5 py-2 font-outfit font-semibold lg:font-semibold text-left'>Daftar Gorup</th>
                <th className='min-w-[150px] whitespace-nowrap px-5 py-2 font-outfit font-semibold lg:font-semibold text-left'>Alamat Kota</th>
                <th className='min-w-[150px] whitespace-nowrap px-5 py-2 font-outfit font-semibold lg:font-semibold text-left'>No Tlp/WA</th>
                <th className='min-w-[150px] whitespace-nowrap px-5 py-2 font-outfit font-semibold lg:font-semibold text-left'>Jenis Kegiatan</th>
                <th className='min-w-[150px] whitespace-nowrap px-5 py-2 font-outfit font-semibold lg:font-semibold text-left'>Tempat</th>
                <th className='min-w-[150px] whitespace-nowrap px-5 py-2 font-outfit font-semibold lg:font-semibold text-left'>Jumlah Peserta</th>
                <th className='min-w-[150px] whitespace-nowrap px-5 py-2 font-outfit font-semibold lg:font-semibold text-left'>Reguler/Paket</th>
                <th className='min-w-[150px] whitespace-nowrap px-5 py-2 font-outfit font-semibold lg:font-semibold text-left'>Sales</th>
                <th className='min-w-[150px] whitespace-nowrap px-5 py-2 font-outfit font-semibold lg:font-semibold text-left'>Omzet</th>
                <th className='min-w-[150px] whitespace-nowrap px-5 py-2 font-outfit font-semibold lg:font-semibold text-left'>Status</th>
                <th className='min-w-[150px] whitespace-nowrap px-5 py-2 font-outfit font-semibold lg:font-semibold text-left'>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filterData.map((reservasi, index) => (
                <tr key={reservasi.id} className={index % 2 === 0 ? 'bg-green-100' : 'bg-white'}>
                  <td className='px-5 py-2 lg:w-auto min-w-[150px] whitespace-nowrap text-left'>{reservasi.startDate}</td>
                  <td className='px-5 py-2 lg:w-auto min-w-[150px] whitespace-nowrap text-left'>{reservasi.namaCustomer}</td>
                  <td className='px-5 py-2 lg:w-auto min-w-[150px] whitespace-nowrap text-left'>{reservasi.selectedOption}</td>
                  <td className='px-5 py-2 lg:w-auto min-w-[150px] whitespace-nowrap text-left'>{reservasi.instansiKeluarga}</td>
                  <td className='px-5 py-2 lg:w-auto min-w-[150px] whitespace-nowrap text-left'>{reservasi.alamat}</td>
                  <td className='px-5 py-2 lg:w-auto min-w-[150px] whitespace-nowrap text-left'>{reservasi.nomorHp}</td>
                  <td className='px-5 py-2 lg:w-auto min-w-[150px] whitespace-nowrap text-left'>{reservasi.nameKegiatan}</td>
                  <td className="px-5 py-2 lg:w-auto min-w-[150px] whitespace-nowrap text-left">
                    {reservasi.wisata?.namaWisata && reservasi.wisata?.tempatWisata
                      ? `${reservasi.wisata.namaWisata} - ${reservasi.wisata.tempatWisata.join(', ')}`
                      : ""}
                  </td>
                  <td className='px-5 py-2 lg:w-auto min-w-[150px] whitespace-nowrap text-left'>{reservasi.jumlahPeserta}</td>
                  <td className='px-5 py-2 lg:w-auto min-w-[150px] whitespace-nowrap text-left'>{reservasi.pilihPaket}</td>
                  <td className='px-5 py-2 lg:w-auto min-w-[150px] whitespace-nowrap text-left'>{reservasi.sales}</td>
                  <td className='px-5 py-2 lg:w-auto min-w-[150px] whitespace-nowrap  text-left'>Rp. {reservasi.omzet}</td>
                  <td className='px-5 py-2 lg:w-auto min-w-[150px] whitespace-nowrap  text-left'>{reservasi.selectedStatus}</td>
                  <td className='flex flex-row lg:flex-row gap-4 items-left justify-left'>
                    <button className='flex gap-2 bg-green-700 items-center text-white font-poppins py-1 px-2 rounded-lg' onClick={() => Navigate(`/detailUsers/${reservasi.id}`)}>
                      <span className=''>{<HiEye />}</span>Detail
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>



        {/* Akhir Membuat Tabel  */}

      </div>



    </div>
  );
};

export default Reservasi;
