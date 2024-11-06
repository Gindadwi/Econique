import { useEffect, useState } from "react";
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
  const [pilihPaket, setPilihPaket] = useState([]);



  // Membuat Option Untuk Kolom Pilih Kategori
  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };
  const option = [
    { value: "Family", label: "Family" },
    { value: "Instansi", label: "Instansi" },
    { value: "Corporate", label: "Corporate" },
    { value: "Komunitas", label: "Komunitas" },
  ];
  // Akhir Kode Pilih Kategori

  //Membuat Option untuk memilih paket
  const handlePaket = (e) => {
    setPilihPaket(e.target.value);
  }

  const paketReguler = [
    { value: "Paket", label: "Paket" },
    { value: "Reguler", label: "Reguler" },
  ]


  // Membuat Option Untuk Kolom Status
  const handleStatus = (e) => {
    setSelectedStatus(e.target.value)
  }
  const status = [
    { value: "Informasi Awal", label: "Informasi Awal" },
    { value: "Surat Penawaran", label: "Surat Penawaran" },
    { value: "Fiks", label: "Fiks" },
    { value: "Reschedule", label: "Reschedule" },
    { value: "Batal", label: "Batal" },
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
      for (const key in data) {
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


  //Fungsi Untuk Manyimpan Data
  const handleSumbitForm = async (e) => {
    e.preventDefault();

    // Validasi sederhana
    if (
      !startDate || !finishDate || !namaCustomer || !nomorHp ||
      !alamat || !jumlahPeserta || !sales || !nameKegiatan 
    ) {
      toast.error("field bertanda * wajib diisi!");
      return;
    }

    // Format tanggal tanpa waktu menggunakan date-fns
    const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : null;
    const formattedFinishDate = finishDate ? format(finishDate, 'yyyy-MM-dd') : null;

    // Validasi jika tanggal dan tempat wisata sama
    const duplicateFound = reservation.some(reservation => {
      const tempatTerdaftar = reservation.wisata.tempatWisata; // Tempat yang sudah dipesan
      const tempatDipilih = wisata.tempat.map(t => t.label); // Tempat yang dipilih user

      // Abaikan validasi jika status reservasi adalah "Batal"
      if (reservation.selectedStatus === "Batal") {
        return false;
      }

      // Cek jika ada tempat yang sama di tanggal yang sama
      return (
        reservation.startDate === formattedStartDate &&
        tempatDipilih.some(tempat => tempatTerdaftar.includes(tempat)) // Tempat bentrok
      );
    });

    if (duplicateFound) {
      toast.error("Tanggal dan tempat wisata sudah dibooking.");
      return;
    }

    // Cek jika ada rentang tanggal bertabrakan di wisata yang sama (jika perlu)
    const isDateRangeOverlapping = (existingStart, existingFinish, newStart, newFinish) => {
      return (newStart <= existingFinish && newFinish >= existingStart);
    };

    const overlappingDate = reservation.some(reservation => {
      const existingStart = reservation.startDate;
      const existingFinish = reservation.finishDate;

      // Abaikan validasi jika status reservasi adalah "Batal"
      if (reservation.selectedStatus === "Batal") {
        return false;
      }

      return (
        isDateRangeOverlapping(existingStart, existingFinish, formattedStartDate, formattedFinishDate) &&
        reservation.wisata.tempatWisata.some(tempat => wisata.tempat.map(t => t.label).includes(tempat)) // Tempat bentrok dalam rentang tanggal
      );
    });

    if (overlappingDate) {
      toast.error("Sudah ada kegiatan di tempat yang sama dalam rentang tanggal ini.");
      return;
    }

    // Jika validasi lolos, lanjutkan dengan membuat data booking
    const data = {
      startDate: formattedStartDate,
      finishDate: formattedFinishDate,
      namaCustomer,
      nomorHp,
      alamat,
      selectedOption,
      instansiKeluarga,
      nameKegiatan,
      wisata: {
        namaWisata: wisata.wisata.label,
        tempatWisata: wisata.tempat.map(t => t.label),
      },
      jumlahPeserta,
      pilihPaket,
      sales,
      selectedStatus,
      jumlahDp,
      startDP: formattedStartDate,
      omzet,
    };

    try {
      const response = await axios.post(
        'https://econique-perhutani-default-rtdb.firebaseio.com/ReservasiKegiatan.json?auth=oahZAHcmPhj9gDp0HdkDFaCuGRt2pPZrX05YsdIl',
        data
      );
      toast.success("Data berhasil ditambahkan");
      console.log("Data berhasil dikirim", response.data);

      // Reset form setelah sukses
      setStartDate(null);
      setFinishDate(null);
      setNamaCustomer("");
      setNomorHp("");
      setAlamat("");
      setSelectedOption("");
      setInstansiKeluarga("");
      setNameKegiatan("");
      setWisata("");  // Reset wisata
      setJumlahPeserta("");
      setPilihPaket("");
      setSales("");
      setSelectedStatus("");
      setJumlahDp("");
      setOmzet("");
    } catch (error) {
      console.error("Error", error);
      toast.error("Data gagal ditambahkan");
    }
  };





  return (
    <>
      <div className="relative w-full max-w-[1180px] h-screen overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <div className='bg-white w-screen lg:w-screen items-center justify-start flex p-4 h-[63px] lg:sticky lg:top-0 lg:z-10 hidden lg:block'>
          <h1 className='font-outfit text-[18px] lg:text-2xl font-medium hidden lg:block'>Tambah Data</h1>
        </div>


        <div className="w-full mb-[130px] px-4 lg:px-8 mt-5">
          <form onSubmit={handleSumbitForm} className=" flex flex-col gap-6 items-center justify-center">
            {/* Baris Pertama Form Tambah Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
              {/* Tanggal Mulai */}
              <div className='flex flex-col'>
                <div className="">
                  <label className="font-outfit font-medium">Tanggal Mulai</label>
                  <label className="font-outfit font-light text-[20px] text-red-700">*</label>
                </div>
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
                <div className="">
                  <label className="font-outfit font-medium">Tanggal Selesai</label>
                  <label className="font-outfit font-light text-[20px] text-red-700">*</label>
                </div>
                <DatePicker
                  selected={finishDate}
                  onChange={(date) => setFinishDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Masukan Tanggal Selesai"
                  className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black"
                />
              </div>

              {/* Nama Customer */}
              <div className='flex flex-col'>
                <div className="">
                  <label className="font-outfit font-medium">Nama Customer</label>
                  <label className="font-outfit font-light text-[20px] text-red-700">*</label>
                </div>
                <input type="text"
                  value={namaCustomer}
                  onChange={(e) => setNamaCustomer(e.target.value)}
                  className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black"
                  placeholder="Masukan Nama Customer" />
              </div>

            </div>

            {/* Baris Kedua Form Tambah Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
              {/* Nomor HP */}
              <div className='flex flex-col'>
                <div>
                  <label className="font-outfit font-medium">Nomor Telp</label>
                  <label className="font-outfit font-light text-[20px] text-red-700">*</label>
                </div>
                <input type="tel"
                  value={nomorHp}
                  onChange={(e) => setNomorHp(e.target.value)}
                  className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black"
                  placeholder="Masukan Nomor Hp/Wa" />
              </div>

              {/* Alamat */}
              <div className='flex flex-col'>
                <div>
                  <label className="font-outfit font-medium">Alamat</label>
                  <label className="font-outfit font-light text-[20px] text-red-700">*</label>
                </div>
                <input type="text"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black"
                  placeholder="Masukan Alamat Customer" />
              </div>
              {/* Pilihan Kategori */}
              <div className='flex flex-col'>
                <div>
                  <label className="font-outfit font-medium">Kelompok</label>
                  <label className="font-outfit font-light text-[20px] text-red-700"></label>
                </div>
                <Option
                  name={"Pilih Jenis Kelompok"}
                  value={selectedOption}
                  onChange={handleSelectChange}
                  options={option}
                />
              </div>

            </div>

            {/* Baris Ketiga Form Tambah Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
              {/* Nama Instansi atau Keluarga */}
              <div className='flex flex-col'>
                <div>
                  <label className="font-outfit font-medium">Daftar Group</label>
                  <label className="font-outfit font-light text-[20px] text-red-700"></label>
                </div>
                <input type="text"
                  value={instansiKeluarga}
                  onChange={(e) => setInstansiKeluarga(e.target.value)}
                  className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black"
                  placeholder="Masukan nama group" />
              </div>

              {/* Nama Kegiatan */}
              <div className='flex flex-col'>
                <div>
                  <label className="font-outfit font-medium">Kegiatan</label>
                  <label className="font-outfit font-light text-[20px] text-red-700">*</label>
                </div>
                <input type="text"
                  value={nameKegiatan}
                  onChange={(e) => setNameKegiatan(e.target.value)}
                  className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black"
                  placeholder="Masukan Nama Kegiatan" />
              </div>

              <div className='flex flex-col'>
                {/* Option Pilih tempat wisata */}
                <div>
                  <label className="font-outfit font-medium">Tempat Wisata</label>
                  <label className="font-outfit font-light text-[20px] text-red-700"></label>
                </div>
                <OptionsWisata
                  selectedWisata={wisata}
                  setSelectedWisata={setWisata}
                  value={wisata}
                  onChange={(e) => setWisata(e.target.value)}
                />
              </div>

            </div>

            {/* Baris KeEmpat Form Tambah Data */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 w-full'>

              <div className='flex flex-col'>
                <div>
                  {/* Status Fix atau reschedule */}
                  <label className="font-outfit font-medium">Reguler/paket</label>
                  <label className="font-outfit font-light text-[20px] text-red-700"></label>
                </div>
                <Option
                  name={"Pilih Paket"}
                  value={pilihPaket}
                  onChange={handlePaket}
                  options={paketReguler}
                />
              </div>

              {/* Jumlah Peserta */}
              <div className='flex flex-col'>
                <div>
                  <label className="font-outfit font-medium">Jumlah Peserta</label>
                  <label className="font-outfit font-light text-[20px] text-red-700">*</label>
                </div>
                <input type="text"
                  value={jumlahPeserta}
                  onChange={(e) => setJumlahPeserta(e.target.value)}
                  className='w-full lg:w-80  h-14 rounded-md px-3 font-outfit border border-1 border-black'
                  placeholder='Masukan Jumlah Peserta' />
              </div>
              <div className='flex flex-col'>
                {/* Nama Sales */}
                <div>
                  <label className="font-outfit font-medium">Sales</label>
                  <label className="font-outfit font-light text-[20px] text-red-700">*</label>
                </div>
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
                <div>
                  <label className="font-outfit font-medium">Status</label>
                  <label className="font-outfit font-light text-[20px] text-red-700"></label>
                </div>
                <Option
                  name={"Pilih Status Pesanan"}
                  value={selectedStatus}
                  onChange={handleStatus}
                  options={status}
                />
              </div>
              <div className='flex flex-col'>
                {/* Jumlah DP */}
                <div>
                  <label className="font-outfit font-medium">Total DP</label>
                  <label className="font-outfit font-light text-[20px] text-red-700"></label>
                </div>
                <input type="text"
                  value={jumlahDp}
                  onChange={(e) => handleNumberChange(e, setJumlahDp)}
                  className="w-full h-14 rounded-md px-3 font-outfit border border-1 border-black"
                  placeholder='Masukan Jumlah DP' />
              </div>
              {/* Tanggal DP */}
              <div className="flex flex-col">
                <div>
                  <label className="font-outfit font-medium">Tanggal Dp</label>
                  <label className="font-outfit font-light text-[20px] text-red-700"></label>
                </div>
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
                <div>
                  <label className="font-outfit font-medium">Omzet</label>
                  <label className="font-outfit font-light text-[20px] text-red-700"></label>
                </div>
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
