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
    if (!startDate || !finishDate || !startDP || !namaCustomer || !nomorHp || !alamat || !jumlahPeserta || !sales || !selectedStatus || !nameKegiatan || !instansiKeluarga) {
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
    <div className='min-w-[460px] '>
      <div className='bg-white lg:w-screen w-full items-center sticky top-0 z-10 justify-start flex p-4 h-[63px]'>
        <h1 className='font-outfit text-lg lg:text-2xl font-medium'>Tambah Data</h1>
      </div>
      <h1 className="font-outfit font-semibold ml-2 lg:ml-0 mt-5 mb-5 text-lg lg:text-center lg:text-2xl w-full">Lengkapi Form Dibawah</h1>
      <div className=' p-1 lg:p-5  lg:items-center lg:justify-center flex'>
        <form action="" onSubmit={handleSumbitForm} className="flex flex-col gap-5">

          {/* Baris Pertama Form Tambah Data */}
          <div className='flex flex-col lg:flex-row gap-5'>
            {/* Tanggal Mulai */}
            <div>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Tanggal Mulai"
                className=' w-[270px] lg:w-80 h-14 rounded-xl px-3 font-outfit border border-1 border-black'
              />
            </div>
            <div >
              {/* Tanggal Selesai */}
              <DatePicker
                selected={finishDate}
                onChange={(date) => setFinishDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Tanggal Selesai"
                className='w-[270px] lg:w-80 h-14 rounded-xl px-3 font-outfit border border-1 border-black'
              />
            </div>
            <div className='flex flex-col'>
              {/* Waktu Mulai */}
              <input type="text"
                value={waktu}
                onChange={(e) => setWaktu(e.target.value)}
                className='w-[270px] lg:w-80  h-14 rounded-xl px-3 font-outfit border border-1 border-black'
                placeholder='Waktu' />
            </div>
          </div>


          {/* Baris Kedua Form Tambah Data */}
          <div className='flex flex-col lg:flex-row gap-5'>
            {/* Nama Customer */}
            <div className='flex flex-col'>
              <input type="text"
                value={namaCustomer}
                onChange={(e) => setNamaCustomer(e.target.value)} 
                className='w-[270px] lg:w-80  h-14 rounded-xl px-3 font-outfit border border-1 border-black'
                placeholder='Nama Customer' />
            </div>
            <div className='flex flex-col'>
              {/* Nomor Hp */}
              <input type="tel" 
                value={nomorHp}
                onChange={(e) => setNomorHp(e.target.value)} 
                className='w-[270px] lg:w-80  h-14 rounded-xl px-3 font-outfit border border-1 border-black'
                placeholder='Nomor Hp' />
            </div>
            <div className='flex flex-col'>
              {/* Alamat */}
              <input type="text"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}  
                className='w-[270px] lg:w-80  h-14 rounded-xl px-3 font-outfit border border-1 border-black'
                placeholder='Alamat' />
            </div>
          </div>


          {/* Baris Ketiga Form Tambah Data */}
          <div className='flex flex-col lg:flex-row gap-5'>
            <div className='flex flex-col'>
              {/* Option Pilih Keterangan keluarga atau instansi */}
              <Option
              name={"Jenis Kelompok"}
              value={selectedOption}
              onChange={handleSelectChange}
              options={option}
              />
            </div>

            <div className='flex flex-col'>
              {/* Nama Instansi atau Keluarga */}
              <input type="text"
                value={instansiKeluarga}
                onChange={(e) => setInstansiKeluarga(e.target.value)}  
                className='w-[270px] lg:w-80  h-14 rounded-xl px-3 font-outfit border border-1 border-black'
                placeholder='Nama Instansi/Keluarga' />
            </div>
            <div className='flex flex-col'>
              {/* Nama Kegiatan */}
              <input type="text" 
                value={nameKegiatan}
                onChange={(e) => setNameKegiatan(e.target.value)}  
              className='w-[270px] lg:w-80  h-14 rounded-xl px-3 font-outfit border border-1 border-black'
                placeholder='Nama Kegiatan' />
            </div>

          </div>


          {/* Baris KeEmpat Form Tambah Data */}
          <div className='flex flex-col lg:flex-row gap-5'>
            <div className='flex flex-col'>
              {/* Option Pilih tempat wisata */}
              <OptionsWisata
              selectedWisata={wisata} 
              setSelectedWisata={setWisata} 
              value={wisata}
              onChange={(e) => setWisata(e.target.value)}
              />
            </div>
            {/* Jumlah Peserta */}
            <div className='flex flex-col'>
              <input type="text"
                value={jumlahPeserta}
                onChange={(e) => setJumlahPeserta(e.target.value)}  
                className='w-[270px] lg:w-80  h-14 rounded-xl px-3 font-outfit border border-1 border-black'
                placeholder='Jumlah Peserta' />
            </div>
            <div className='flex flex-col'>
              {/* Nama Sales */}
              <input type="text" 
                value={sales}
                onChange={(e) => setSales(e.target.value)}  
              className='w-[270px] lg:w-80  h-14 rounded-xl px-3 font-outfit border border-1 border-black'
                placeholder='Sales' />
            </div>
            
          </div>


          {/* Baris Ke Lima Form Tambah Data */}
          <div className='flex flex-col lg:flex-row gap-5'>
            <div className='flex flex-col'>
              {/* Status Fix atau reschedule */}
              <Option
                name={"Pilih Status"}
                value={selectedStatus}
                onChange={handleStatus}
                options={status}
              />
            </div>
            <div className='flex flex-col'>
              {/* Jumlah DP */}
              <input type="text"
                value={jumlahDp}
                onChange={(e) => handleNumberChange(e, setJumlahDp)}
                className='w-[270px] lg:w-80 h-14 rounded-xl px-3 font-outfit border border-1 border-black'
                placeholder='Jumlah DP' />
            </div>
            {/* Tanggal DP */}
            <DatePicker
              selected={startDP}
              onChange={(date) => setStartDP(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Tanggal DP"
              className='w-[270px] lg:w-80  h-14 rounded-xl px-3 font-outfit border border-1 border-black'
            />

            
          </div>

          {/* Baris Ke Enam Form Tambah Data */}
          <div className='flex flex-col lg:flex-row gap-5'>
            <div className='flex flex-col'>
              {/* Omzet Keegiatan */}
              <input type="text"
                value={omzet}
                onChange={(e) => handleNumberChange(e, setOmzet)}
                className='w-[270px] lg:w-80 h-14 rounded-xl px-3 font-outfit border border-1 border-black'
                placeholder='Omzet' />
            </div>
          </div>
            <Button type="submit" name={'Simpan'} className={`w-32 h-10 lg:w-48`} />
        </form>
      </div>
    </div>
  );
}

export default TambahData;
