import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Import toast
import DatePicker from 'react-datepicker';
import Option from '../common/Option';
import OptionsWisata from "../component/OptionsWisata";
import { format } from 'date-fns';
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import Button from '../common/Button'; 

const EditData = () => {
  const { id } = useParams(); // Mengambil id dari URL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
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
  const [selectedWisata, setSelectedWisata] = useState({
    wisata: null,
    tempat: []
  });
  const [jumlahPeserta, setJumlahPeserta] = useState("");
  const [sales, setSales] = useState("");
  const [jumlahDp, setJumlahDp] = useState("");
  const [omzet, setOmzet] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://econique-perhutani-default-rtdb.firebaseio.com/ReservasiKegiatan.json?auth=oahZAHcmPhj9gDp0HdkDFaCuGRt2pPZrX05YsdIl');

        const dataArray = Object.entries(response.data).map(([key, value]) => ({ id: key, ...value }));

        const foundData = dataArray.find(item => item.id === id);
        if (!foundData) throw new Error("Data tidak ditemukan");

        // Set initial states from the fetched data
        setData(foundData);
        setStartDate(new Date(foundData.startDate));
        setFinishDate(new Date(foundData.finishDate));
        setStartDP(new Date(foundData.startDP));
        setWaktu(foundData.waktu);
        setNamaCustomer(foundData.namaCustomer);
        setNomorHp(foundData.nomorHp);
        setAlamat(foundData.alamat);
        setInstansiKeluarga(foundData.instansiKeluarga);
        setNameKegiatan(foundData.nameKegiatan);
        setSelectedWisata({
          wisata: { label: foundData.wisata.namaWisata },
          tempat: foundData.wisata.tempatWisata.map(tempat => ({ label: tempat, selected: false }))
        });

        setJumlahPeserta(foundData.jumlahPeserta);
        setSales(foundData.sales);
        setJumlahDp(foundData.jumlahDp);
        setOmzet(foundData.omzet);
        setSelectedOption(foundData.selectedOption);
        setSelectedStatus(foundData.selectedStatus);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const formatNumber = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // membuat format angka titik
  };

  const handleNumberChange = (e, setter) => {
    const inputValue = e.target.value.replace(/\./g, ''); // Remove existing dots
    setter(formatNumber(inputValue)); // Format and set value
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : null;
    const formattedStartDP = startDP ? format(startDP, 'yyyy-MM-dd') : null;
    const formattedFinishDate = finishDate ? format(finishDate, 'yyyy-MM-dd') : null;

    // Add checks for wisata
    const wisataNama = selectedWisata.wisata ? selectedWisata.wisata.label : "";
    const wisataTempat = selectedWisata.wisata ? selectedWisata.tempat.map(t => t.label) : [];  // Default to empty array if undefined

    const updatedData = {
      ...data, // Keep existing data
      startDate: formattedStartDate,
      finishDate: formattedFinishDate,
      startDP: formattedStartDP,
      waktu,
      namaCustomer,
      nomorHp,
      alamat,
      selectedOption,
      instansiKeluarga,
      nameKegiatan,
      wisata: {
        namaWisata: wisataNama,
        tempatWisata: wisataTempat
      },
      jumlahPeserta,
      sales,
      selectedStatus,
      jumlahDp,
      omzet,
    };

    try {
      await axios.put(`https://econique-perhutani-default-rtdb.firebaseio.com/ReservasiKegiatan/${id}.json?auth=oahZAHcmPhj9gDp0HdkDFaCuGRt2pPZrX05YsdIl`, updatedData);
      toast.success("Data berhasil diubah!"); // Fixed typo here
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Data tidak ditemukan</div>;
  }

  const handleStatus = (e) => {
    setSelectedStatus(e.target.value);
  }

  const option = [
    { value: "Family", label: "Family" },
    { value: "Instansi", label: "Instansi" },
  ];

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const status = [
    { value: "Informasi Awal", label: "Informasi Awal" },
    { value: "Surat Penawaran", label: "Surat Penawaran" },
    { value: "Fiks", label: "Fiks" },
    { value: "Reschedule", label: "Reschedule" }
  ]

  return ( 
    <div>
      <div className='bg-white lg:w-screen w-full items-center lg:sticky lg:top-0 lg:z-10 justify-start flex p-4 h-[63px]'>
        <h1 className='font-outfit text-lg lg:text-2xl font-medium'>Detail Data</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label>Tanggal Mulai</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Tanggal Mulai"
              className='w-[270px] lg:w-80 h-14 rounded-xl px-3 font-outfit border border-1 border-black'
            />
          </div>
          <div>
            <label>Tanggal Selesai</label>
            <DatePicker
              selected={finishDate}
              onChange={(date) => setFinishDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Tanggal Selesai"
              className='w-[270px] lg:w-80 h-14 rounded-xl px-3 font-outfit border border-1 border-black'
            />
          </div>
          <div>
            <label>Waktu Mulai</label>
            <input
              type="text"
              value={waktu}
              onChange={(e) => setWaktu(e.target.value)}
              className='w-[270px] lg:w-80 h-14 rounded-xl px-3 font-outfit border border-1 border-black'
              placeholder='Waktu' />
          </div>
          <div>
            <label>Nama Customer</label>
            <input
              type="text"
              name="namaCustomer"
              value={namaCustomer}
              onChange={(e) => setNamaCustomer(e.target.value)}
              className='w-[270px] lg:w-80 h-14 rounded-xl px-3 font-outfit border border-1 border-black'
            />
          </div>
          <div>
            <label>Nomor Hp</label>
            <input
              type="tel"
              value={nomorHp}
              onChange={(e) => setNomorHp(e.target.value)}
              className='w-[270px] lg:w-80 h-14 rounded-xl px-3 font-outfit border border-1 border-black'
              placeholder='Nomor Hp' />
          </div>
          <div>
            <label>Alamat</label>
            <input
              type="text"
              name="alamat"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className='w-[270px] lg:w-80 h-14 rounded-xl px-3 font-outfit border border-1 border-black'
            />
          </div>
          <div>
            <label>Jenis Kelompok</label>
            <Option
              name={"Jenis Kelompok"}
              value={selectedOption}
              onChange={handleSelectChange}
              options={option}
            />
          </div>
          <div>
            <label>Instansi Keluarga</label>
            <input
              type="text"
              value={instansiKeluarga}
              onChange={(e) => setInstansiKeluarga(e.target.value)}
              className='w-[270px] lg:w-80 h-14 rounded-xl px-3 font-outfit border border-1 border-black'
              placeholder='Instansi Keluarga' />
          </div>
          <div>
            <label>Nama Kegiatan</label>
            <input
              type="text"
              value={nameKegiatan}
              onChange={(e) => setNameKegiatan(e.target.value)}
              className='w-[270px] lg:w-80 h-14 rounded-xl px-3 font-outfit border border-1 border-black'
              placeholder='Nama Kegiatan' />
          </div>
          <div>
            <label>Tempat dan wisata</label>
            <OptionsWisata
              selectedWisata={selectedWisata}
              setSelectedWisata={setSelectedWisata}
            />
          </div>
          <div>
            <label>Jumlah Peserta</label>
            <input
              type="number"
              value={jumlahPeserta}
              onChange={(e) => setJumlahPeserta(e.target.value)}
              className='w-[270px] lg:w-80 h-14 rounded-xl px-3 font-outfit border border-1 border-black'
              placeholder='Jumlah Peserta' />
          </div>
          <div>
            <label>Sales</label>
            <input
              type="text"
              value={sales}
              onChange={(e) => setSales(e.target.value)}
              className='w-[270px] lg:w-80 h-14 rounded-xl px-3 font-outfit border border-1 border-black'
              placeholder='Sales' />
          </div>
          <div>
            <label>Jumlah DP</label>
            <input
              type="text"
              value={jumlahDp}
              onChange={(e) => handleNumberChange(e, setJumlahDp)}
              className='w-[270px] lg:w-80 h-14 rounded-xl px-3 font-outfit border border-1 border-black'
              placeholder='Jumlah DP' />
          </div>
          <div>
            <label>Status</label>
            <Option
              name={"Pilih Status"}
              value={selectedStatus}
              onChange={handleStatus}
              options={status}
            />
          </div>
          <div>
            <label>Omzet</label>
            <input
              type="text"
              value={omzet}
              onChange={(e) => handleNumberChange(e, setOmzet)}
              className='w-[270px] lg:w-80 h-14 rounded-xl px-3 font-outfit border border-1 border-black'
              placeholder='Omzet' />
          </div>
        </div>
        <div className='mt-10'>
          <Button type="submit" name={'Update Data'} className={`w-32 h-10 lg:w-48`} />
        </div>
      </form>
    </div>

  );
};

export default EditData;
