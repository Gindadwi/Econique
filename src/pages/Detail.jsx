import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import { format, parseISO } from 'date-fns';
import Button from '../common/Button';
import Option from '../common/Option'
import OptionsWisata from "../component/OptionsWisata"


export default function Detail() {

  const { id } = useParams(); // Mengambil ID dari URL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // State untuk form input
  const [startDate, setStartDate] = useState(null);
  const [finishDate, setFinishDate] = useState(null);
  const [namaCustomer, setNamaCustomer] = useState('');
  const [nomorHp, setNomorHp] = useState('');
  const [alamat, setAlamat] = useState('')
  const [nameKegiatan, setNameKegiatan] = useState('');
  const [instansiKeluarga, setInstansiKeluarga] = useState('')
  const [jumlahPeserta, setJumlahPeserta] = useState('');
  const [jumlahDp, setJumlahDp] = useState('');
  const [omzet, setOmzet] = useState('');
  const [pilihPaket, setPilihPaket] = useState('');
  const [sales, setSales] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [wisata, setWisata] = useState({ namaWisata: '', tempatWisata: [] });
  const [startDP, setStartDP] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://econique-perhutani-default-rtdb.firebaseio.com/ReservasiKegiatan.json?auth=oahZAHcmPhj9gDp0HdkDFaCuGRt2pPZrX05YsdIl',)
        const dataArray = Object.entries(response.data).map(([key, value]) => ({
          id: key,
          ...value,
        }));

        const foundData = dataArray.find((item) => item.id === id);
        if (!foundData) throw new Error('Data tidak ditemukan')

        //Set nilai default berdasarkan data yang ditemukan
        // Set nilai default berdasarkan data yang ditemukan
        setData(foundData);
        setStartDate(parseISO(foundData.startDate));
        setFinishDate(parseISO(foundData.finishDate));
        setStartDP(parseISO(foundData.startDP));
        setNamaCustomer(foundData.namaCustomer || '');
        setNomorHp(foundData.nomorHp || '');
        setAlamat(foundData.alamat || '');
        setInstansiKeluarga(foundData.instansiKeluarga || '');
        setNameKegiatan(foundData.nameKegiatan || '');
        setJumlahPeserta(foundData.jumlahPeserta || '');
        setJumlahDp(foundData.jumlahDp || '');
        setOmzet(foundData.omzet || '');
        setPilihPaket(foundData.pilihPaket || '');
        setSales(foundData.sales || '');
        setSelectedOption(foundData.selectedOption || '');
        setSelectedStatus(foundData.selectedStatus || '');
        setWisata({
          namaWisata: foundData.wisata.namaWisata || '',
          tempatWisata: foundData.wisata.tempatWisata || [],
        });
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Membuat Option Untuk Kolom Pilih Kategori
  const option = [
    { value: "Family", label: "Family" },
    { value: "Instansi", label: "Instansi" },
    { value: "Corporate", label: "Corporate" },
    { value: "Komunitas", label: "Komunitas" },
  ];
  // Akhir Kode Pilih Kategori


  //Pilih Paket
  const paketReguler = [
    { value: "Paket", label: "Paket" },
    { value: "Reguler", label: "Reguler" },
  ]
  //Akhir kode pilih paket


  //Pilih status
  const status = [
    { value: "Informasi Awal", label: "Informasi Awal" },
    { value: "Surat Penawaran", label: "Surat Penawaran" },
    { value: "Fiks", label: "Fiks" },
    { value: "Reschedule", label: "Reschedule" },
    { value: "Batal", label: "Batal" },
  ]
  //akhir kode pilih status

  const formatNumber = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // membuat format angka titik
  };

  const handleNumberChange = (e, setter) => {
    const inputValue = e.target.value.replace(/\./g, ''); // Remove existing dots
    setter(formatNumber(inputValue)); // Format and set value
  };



  return (
    <>
      <div className="relative w-full max-w-[1180px] h-screen overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <div className='bg-white w-screen lg:w-screen items-center justify-start flex p-4 h-[63px] lg:sticky lg:top-0 lg:z-10 hidden lg:block'>
          <h1 className='font-outfit text-[18px] lg:text-2xl font-medium hidden lg:block'>Detail Data</h1>
        </div>

        <div className="w-full mb-[130px] px-4 lg:px-8 mt-5">
          <form className=" flex flex-col gap-6 items-center justify-center" >
            {/* Baris Pertama Form Tambah Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
              {/* Tanggal Mulai */}
              <div className='flex flex-col'>
                <label className="font-outfit font-medium">Tanggal Mulai</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
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
                  className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black"
                />
              </div>

              {/* Nama Customer */}
              <div className='flex flex-col'>
                <label className="font-outfit font-medium">Nama Customer</label>
                <input type="text"
                  value={namaCustomer}
                  onChange={(e) => setNamaCustomer(e.target.value)}
                  className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black"
                />
              </div>
            </div>



            {/* Baris Kedua Form Tambah Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
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
              {/* Pilihan Kategori */}
              <div className='flex flex-col'>
                <label className="font-outfit font-medium">Kelompok</label>
                <Option
                  name={"Pilih Jenis Kelompok"}
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  options={option}
                />
              </div>
            </div>


            {/* Baris Ketiga Form Tambah Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
              {/* Nama Instansi atau Keluarga */}
              <div className='flex flex-col'>
                <label className="font-outfit font-medium">Daftar Group</label>
                <input type="text"
                  value={instansiKeluarga}
                  onChange={(e) => setInstansiKeluarga(e.target.value)}
                  className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black"
                  placeholder="Masukan nama group" />
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

              <div className='flex flex-col'>
                {/* Option Pilih tempat wisata */}
                <div className='flex flex-col'>
                  {/* Option Pilih tempat wisata */}
                  <label className="font-outfit font-medium">Tempat Wisata</label>
                  <input
                    className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black items-center"
                    type="text"
                    value={wisata.namaWisata}
                    onChange={(e) =>
                      setWisata((prev) => ({ ...prev, namaWisata: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>


            {/* Baris KeEmpat Form Tambah Data */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 w-full'>
              <div className='flex flex-col'>
                {/* Option Pilih tempat wisata */}
                <div className='flex flex-col'>
                  {/* Option Pilih tempat wisata */}
                  <label className="font-outfit font-medium">Tempat Boking</label>
                  <input
                    className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black items-center"
                    value={wisata.tempatWisata.join(', ')}
                    onChange={(e) =>
                      setWisata((prev) => ({
                        ...prev,
                        tempatWisata: e.target.value.split(', '),
                      }))
                    }
                  />
                </div>
              </div>
              <div className='flex flex-col'>
                {/* Option Pilih tempat wisata */}
                <div className='flex flex-col'>
                  {/* Option Pilih tempat wisata */}
                  <label className="font-outfit font-medium">Wisata</label>
                  <OptionsWisata
                    selectedWisata={wisata}
                    setSelectedWisata={setWisata}
                    value={wisata}
                    onChange={(e) => setWisata(e.target.value)}
                  />
                </div>
              </div>
              
              <div className='flex flex-col'>
                {/* Status Fix atau reschedule */}
                <label className="font-outfit font-medium">Reguler/paket</label>
                <Option
                  name={"Pilih Paket"}
                  value={pilihPaket}
                  onChange={(e) => setPilihPaket(e.target.value)}
                  options={paketReguler}
                />
              </div>
            </div>


            {/* Baris Ke Lima Form Tambah Data */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 w-full'>
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
              <div className='flex flex-col'>
                {/* Status Fix atau reschedule */}
                <label className="font-outfit font-medium">Status</label>
                <Option
                  name={"Pilih Status Pesanan"}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  options={status}
                />
              </div>
            </div>


            {/* Baris Ke Enam Form Tambah Data */}
            <div className='grid grid-cols-1 lg:grid w-full lg:grid-cols-3 gap-5 '>
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
              <Button type="submit" name={'Update'} className={`w-32 h-10 lg:w-48`} />
            </div>
          </form>
        </div>


      </div>

    </>
  )

}