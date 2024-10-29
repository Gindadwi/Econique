import React, { useState } from 'react';
import Button from '../common/Button';
import Option from '../common/Option';
import { auth, db } from "../firebase"; // Firebase configuration and initialization
import toast from 'react-hot-toast'; // Notification library
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
const Akses = () => {
  // State untuk menyimpan data dari form
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    noTelepon: '',
    alamat: '',
    password: '',
    role: ''
  });

  // Data Kategori untuk Role pengguna
  const Kategori = [
    { value: 'Super Admin', label: 'Super Admin' },
    { value: 'Admin', label: 'Admin' },
    { value: 'User', label: 'User' },
  ];

  // Fungsi untuk handle perubahan input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };



  // Fungsi untuk melakukan register
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validasi: Cek jika nama lengkap mengandung spasi dan password kurang dari 8 karakter
    if (formData.namaLengkap.includes(' ')) {
      toast.error("Nama lengkap tidak boleh mengandung spasi.");
      return;
    }
    if (formData.password.length < 8) {
      toast.error("Password harus minimal 8 karakter.");
      return;
    }

    // Save the current user (Super Admin) before creating a new account
    const currentUser = auth.currentUser;

    try {
      // Buat user baru dengan email dan password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const newUser = userCredential.user;

      // Update Firestore untuk menyimpan data tambahan
      await setDoc(doc(db, "users", newUser.uid), {
        namaLengkap: formData.namaLengkap,
        email: formData.email,
        noTelepon: formData.noTelepon,
        alamat: formData.alamat,
        role: formData.role,
        createdAt: new Date(),
      });

      // Tampilkan notifikasi sukses
      toast.success("Pengguna berhasil didaftarkan!");

      // Kosongkan form setelah registrasi
      setFormData({
        namaLengkap: "",
        email: "",
        noTelepon: "",
        alamat: "",
        password: "",
        role: "",
      });

      // Setelah berhasil membuat user baru, kembalikan sesi ke Super Admin
      if (currentUser) {
        // Log back into the Super Admin account
        await auth.updateCurrentUser(currentUser);
      }

    } catch (error) {
      // Tangani error
      toast.error(`Error: ${error.message}`);
    }
  };


  return (
    <div className=' px-4 lg:px-0'>
      <div className='bg-white w-full items-center justify-start flex p-4 h-[63px] hidden lg:block'>
        <h1 className='font-outfit text-2xl font-medium'>Daftar Pengguna</h1>
      </div>
      
      <form className='relative max-w-[1080px] mx-auto mt-8 flex flex-col gap-4 p-6 bg-white rounded-lg' onSubmit={handleRegister}>
        <div className='lg:grid lg:grid-cols-2 lg:gap-4'>
          <div className='grid grid-cols-1 gap-4 mb-4 lg:mb-0 '>
            <div className='flex flex-col w-full'>
              <label className='font-medium font-outfit'>Nama Lengkap</label>
              <input
                type="text"
                name="namaLengkap"
                value={formData.namaLengkap}
                className="w-full h-14 font-outfit border border-gray-300 shadow-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder='Masukkan nama lengkap'
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4'>
            <div className='flex flex-col w-full'>
              <label className='font-medium font-outfit'>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                className="w-full h-14 font-outfit border border-gray-300 shadow-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder='Masukkan Email'
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className='lg:grid lg:grid-cols-2 lg:gap-4'>
          <div className='grid grid-cols-1 gap-4 mb-4 lg:mb-0'>
            <div className='flex flex-col w-full'>
              <label className='font-medium font-outfit'>Nomor Telepon</label>
              <input
                type="text"
                name="noTelepon"
                value={formData.noTelepon}
                className="w-full h-14 font-outfit border border-gray-300 shadow-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder='Masukkan Nomor Telepon'
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='grid grid-cols-1 gap-4'>
            <div className='flex flex-col w-full'>
              <label className='font-medium font-outfit'>Alamat</label>
              <input
                type="text"
                name="alamat"
                value={formData.alamat}
                className="w-full h-14 font-outfit border border-gray-300 shadow-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder='Masukkan Alamat'
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          <div className='flex flex-col w-full'>
            <label className='font-medium font-outfit'>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              className="w-full h-14 font-outfit border border-gray-300 shadow-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder='Masukkan Password'
              onChange={handleChange}
            />
          </div>

          <div className='flex flex-col w-full'>
            <label className='font-medium font-outfit'>Kategori</label>
            <Option
              name="role"
              value={formData.role}
              onChange={(e) => handleChange({ target: { name: 'role', value: e.target.value } })}
              options={Kategori}
              className="w-full h-14 font-outfit border border-gray-300 shadow-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className='lg:grid lg:grid-cols-7 grid grid-cols-2'>
          <Button
            type="submit"
            name="Buat Akun"
            className={`w-full lg:h-[50px] h-[45px]`}
          />
        </div>
      </form>
    </div>
  );
};

export default Akses;
