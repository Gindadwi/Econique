import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../common/Button";
import OptionsWisata from "../component/OptionsWisata"
import Option from "../common/Option"
import axios from "axios";
import toast from "react-hot-toast";
import { format } from 'date-fns';

const TambahData = () => {
  // Membuat state untuk tanggal mulai, tanggal selesai dan Tanggal DP dll
  const [startDate, setStartDate] = useState(null);
  const [finishDate, setFinishDate] = useState(null);
  const [startDP, setStartDP] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [waktu, setWaktu] = useState("");
  const [namaCustomer, setNamaCustomer] = useState("");
  const [nomorHp, setNomorHp] = useState("");
  const [alamat, setAlamat] = useState("");
  const [instansiKeluarga, setInstansiKeluarga] = useState("");
  const [nameKegiatan, setNameKegiatan] = useState("");
  const [wisata, setWisata] = useState({
    wisata: "",
    tempat: []
  });
  const [jumlahPeserta, setJumlahPeserta] = useState("");
  const [sales, setSales] = useState("");
  const [jumlahDp, setJumlahDp] = useState("");
  const [omzet, setOmzet] = useState("");
  const [reservation, setReservation] = useState([]);



  // Membuat Option Untuk Kolom Pilih Kategori
  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value); 
  };
  const option = [
    {value: "Family", label: "Family"},
    {value: "Instansi", label: "Instansi"},
  ];
  // Akhir Kode Pilih Kategori




  // Membuat Option Untuk Kolom Status
  const handleStatus = (e) =>{
    setSelectedStatus(e.target.value)
  }
  const status = [
    {value:"Informasi Awal", label:"Informasi Awal"},
    {value:"Surat Penawaran", label:"Surat Penawaran"},
    {value:"Fiks", label:"Fiks"},
    {value: "Reschedule", label:"Reschedule"}
  ]
  // Kode akhir pilih starus



  const formatNumber = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // membuat format angka titik
  };

  const handleNumberChange = (e, setter) => {
    const inputValue = e.target.value.replace(/\./g, ''); // Remove existing dots
    setter(formatNumber(inputValue)); // Format and set value
  };


  // Membuat fungsi untuk mengambil data reservasi yang tersimpan didata base
  
  const fetchReservasi = async () => {
    try {
      const response = await axios.get('https://econique-perhutani-default-rtdb.firebaseio.com/ReservasiKegiatan.json?auth=oahZAHcmPhj9gDp0HdkDFaCuGRt2pPZrX05YsdIl')
      const data = response.data;
      const reservasiArray = [];
      // Mengubah objet array dan menyimpan ID pembaruan
      for (const key in data){
        reservasiArray.push({ ...data[key], id: key });
      }
      // Menyimpan data reservasi ke state
      setReservation(reservasiArray); 
    } catch (error) {
      console.error("Error fetching reservations: ", error);
      toast.error("Gagal memuat data reservasi!"); // Menampilkan pesan kesalahan
    }
  }
  
  // Mengambil fungsi untuk mengambil data reservasi
  useEffect(() => {
    fetchReservasi();
  }, []);


  const handleSumbitForm = async (e) => {
    e.preventDefault();

    // Validasi sederhana
    if (!startDate || !finishDate || !namaCustomer || !nomorHp || !alamat || !jumlahPeserta || !sales || !selectedStatus || !nameKegiatan || !instansiKeluarga) {
      toast.error("Semua field yang diperlukan harus diisi!");
      return;
    }


    // Format tanggal tanpa waktu menggunakan date-fns
    const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : null;
    const formattedStartDP = startDP ? format(startDP, 'yyyy-MM-dd') : null;
    const formattedFinishDate = finishDate ? format(finishDate, 'yyyy-MM-dd') : null;



    // Membuat pesan error ketika tanggal dan tempat pesanan sama
    const duplicateFound = reservation.some(reservation => {
      return reservation.startDate === formattedStartDate &&
        reservation.wisata.tempatWisata === wisata.tempatWisata;
    });

    if (duplicateFound) {
      toast.error("Tanggal dan Tempat sudah ada");
      return;
    }

    // Cek untuk bentrokan tanggal
    const isDateRangeOverlapping = (existingStart, existingFinish, newStart, newFinish) => {
      return (newStart <= existingFinish && newFinish >= existingStart);
    };

    const duplicateDate = reservation.some(reservation => {
      const existingStart = reservation.startDate; // Tanggal mulai yang sudah ada
      const existingFinish = reservation.finishDate; // Tanggal selesai yang sudah ada

      return isDateRangeOverlapping(existingStart, existingFinish, formattedStartDate, formattedFinishDate);
    });

    if (duplicateDate) {
      toast.error("Sudah Ada Kegiatan di Tanggal ini");
      return;
    }
    // Akhir kodingan membuat peringatan error tanggan dan tempat 


    const data = {
      startDate: formattedStartDate,      
      finishDate: formattedFinishDate,
      waktu,
      namaCustomer,
      nomorHp,
      alamat,
      selectedOption,
      instansiKeluarga,
      nameKegiatan,
      wisata: {
        namaWisata: wisata.wisata.label,  // Mengambil nama wisata
        tempatWisata: wisata.tempat.map(t => t.label)  // Mengambil nama tempat
      },      
      jumlahPeserta,
      sales,
      selectedStatus,
      jumlahDp,
      startDP: formattedStartDP,
      omzet,
    };

    try {
      const response = await axios.post('https://econique-perhutani-default-rtdb.firebaseio.com/ReservasiKegiatan.json?auth=oahZAHcmPhj9gDp0HdkDFaCuGRt2pPZrX05YsdIl', data)
      toast.success("Data Berhasil ditambahkan");
      console.log("data berhasil di kirim", response.data);
      // Reset form setelah sukses
      setStartDate(null);
      setFinishDate(null);
      setWaktu("");
      setNamaCustomer("");
      setNomorHp("");
      setAlamat("");
      setSelectedOption("");
      setInstansiKeluarga("");
      setNameKegiatan("");
      setWisata("");  // Reset wisata
      setJumlahPeserta("");
      setSales("");
      setSelectedStatus("");
      setJumlahDp("");
      setStartDP(null);
      setOmzet("");
    } catch (error) {
      console.log("error", error.data);
      toast.error("data gagal ditambahkan")
    }

  }

  // Membuat Kode error saat tanggan dan tempat sudah di boking




  return (
    <>
      <div className="relative w-full max-w-[1180px] h-screen overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <div className='bg-white w-screen lg:w-screen items-center justify-start flex p-4 h-[63px] lg:sticky lg:top-0 lg:z-10 hidden lg:block'>
          <h1 className='font-outfit text-[18px] lg:text-2xl font-medium hidden lg:block'>Dashboard</h1>
        </div>


        <div className="w-full mb-[130px] px-4 lg:px-8 mt-5">
          <form onSubmit={handleSumbitForm} className=" flex flex-col gap-6 items-center justify-center">
            {/* Baris Pertama Form Tambah Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
              {/* Tanggal Mulai */}
              <div className='flex flex-col'>
                <label className="font-outfit font-medium">Tanggal Mulai</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Masukan Tanggal Mulai"
                  className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black"
                />
              </div>

              {/* Tanggal Selesai */}
              <div className='flex flex-col'>
                <label className="font-outfit font-medium">Tanggal Selesai</label>
                <DatePicker
                  selected={finishDate}
                  onChange={(date) => setFinishDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Masukan Tanggal Selesai"
                  className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black"
                />
              </div>

              {/* Waktu Mulai */}
              <div className='flex flex-col'>
                <label className="font-outfit font-medium">Jam Mulai</label>
                <input type="text"
                  value={waktu}
                  onChange={(e) => setWaktu(e.target.value)}
                  className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black"
                  placeholder='Waktu' />
              </div>
            </div>

            {/* Baris Kedua Form Tambah Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
              {/* Nama Customer */}
              <div className='flex flex-col'>
                <label className="font-outfit font-medium">Nama Customer</label>
                <input type="text"
                  value={namaCustomer}
                  onChange={(e) => setNamaCustomer(e.target.value)}
                  className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black"
                  placeholder="Masukan Nama Customer" />
              </div>

              {/* Nomor HP */}
              <div className='flex flex-col'>
                <label className="font-outfit font-medium">Nomor Telp</label>
                <input type="tel"
                  value={nomorHp}
                  onChange={(e) => setNomorHp(e.target.value)}
                  className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black"
                  placeholder="Masukan Nomor Hp/Wa" />
              </div>

              {/* Alamat */}
              <div className='flex flex-col'>
                <label className="font-outfit font-medium">Alamat</label>
                <input type="text"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black"
                  placeholder="Masukan Alamat Customer" />
              </div>
            </div>

            {/* Baris Ketiga Form Tambah Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
              {/* Pilihan Kategori */}
              <div className='flex flex-col'>
                <label className="font-outfit font-medium">Kelompok</label>
                <Option
                  name={"Pilih Jenis Kelompok"}
                  value={selectedOption}
                  onChange={handleSelectChange}
                  options={option}
                />
              </div>

              {/* Nama Instansi atau Keluarga */}
              <div className='flex flex-col'>
                <label className="font-outfit font-medium">Nama Instansi/Keluarga</label>
                <input type="text"
                  value={instansiKeluarga}
                  onChange={(e) => setInstansiKeluarga(e.target.value)}
                  className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black"
                  placeholder="Nama Instansi/Keluarga" />
              </div>

              {/* Nama Kegiatan */}
              <div className='flex flex-col'>
                <label className="font-outfit font-medium">Kegiatan</label>
                <input type="text"
                  value={nameKegiatan}
                  onChange={(e) => setNameKegiatan(e.target.value)}
                  className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black"
                  placeholder="Masukan Nama Kegiatan" />
              </div>
            </div>

            {/* Baris KeEmpat Form Tambah Data */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 w-full'>
              <div className='flex flex-col'>
                {/* Option Pilih tempat wisata */}
                <label className="font-outfit font-medium">Tempat Wisata</label>
                <OptionsWisata
                  selectedWisata={wisata}
                  setSelectedWisata={setWisata}
                  value={wisata}
                  onChange={(e) => setWisata(e.target.value)}
                />
              </div>
              {/* Jumlah Peserta */}
              <div className='flex flex-col'>
                <label className="font-outfit font-medium">Jumlah Peserta</label>
                <input type="text"
                  value={jumlahPeserta}
                  onChange={(e) => setJumlahPeserta(e.target.value)}
                  className='w-full lg:w-80  h-14 rounded-md px-3 font-outfit border border-1 border-black'
                  placeholder='Masukan Jumlah Peserta' />
              </div>
              <div className='flex flex-col'>
                {/* Nama Sales */}
                <label className="font-outfit font-medium">Sales</label>
                <input type="text"
                  value={sales}
                  onChange={(e) => setSales(e.target.value)}
                  className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black"
                  placeholder='Masukan Nama Sales' />
              </div>
            </div>

            {/* Baris Ke Lima Form Tambah Data */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 w-full'>
              <div className='flex flex-col'>
                {/* Status Fix atau reschedule */}
                <label className="font-outfit font-medium">Status</label>
                <Option
                  name={"Pilih Status Pesanan"}
                  value={selectedStatus}
                  onChange={handleStatus}
                  options={status}
                />
              </div>
              <div className='flex flex-col'>
                {/* Jumlah DP */}
                <label className="font-outfit font-medium">Total DP</label>
                <input type="text"
                  value={jumlahDp}
                  onChange={(e) => handleNumberChange(e, setJumlahDp)}
                  className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black"
                  placeholder='Masukan Jumlah DP' />
              </div>
              {/* Tanggal DP */}
              <div className="flex flex-col">
                <label className="font-outfit font-medium">Tanggal Dp</label>
                <DatePicker
                  selected={startDP}
                  onChange={(date) => setStartDP(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Masukan Tanggal DP"
                  className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black"
                />
              </div>
            </div>

            {/* Baris Ke Enam Form Tambah Data */}
            <div className='grid grid-cols-1 lg:grid w-full lg:grid-cols-3 gap-5 '>
              <div className='flex flex-col'>
                {/* Omzet Keegiatan */}
                <label className="font-outfit font-medium">Omzet</label>
                <input type="text"
                  value={omzet}
                  onChange={(e) => handleNumberChange(e, setOmzet)}
                  className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black"
                  placeholder='Masukan Total Omzet Kegiatan' />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:flex lg:flex-col justify-end items-end w-full">
              <Button type="submit" name={'Simpan'} className={`w-32 h-10 lg:w-48`} />
            </div>

          </form>
        </div>

        </div>
    </>
  );
}

export default TambahData;
