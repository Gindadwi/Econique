import React, { useState } from 'react';
import Button from '../common/Button';
import Option from '../common/Option';
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Akses = () => {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    noTelepon: '',
    alamat: '',
    password: '',
    role: '',
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = formData;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Simpan data pengguna ke Firestore
      await setDoc(doc(db, "users", user.uid), {
        ...formData,
        uid: user.uid,
      });

      alert('Akun berhasil dibuat');
    } catch (error) {
      console.error('Error saat membuat akun:', error);
      alert('Terjadi kesalahan saat mendaftarkan akun.');
    }
  };

  const Kategori = [
    { value: 'Super Admin', label: 'Super Admin' },
    { value: 'Admin', label: 'Admin' },
    { value: 'User', label: 'User' },
  ];

  return (
    <div className='px-4 lg:px-0'>
      <div className='bg-white w-full items-center justify-start flex p-4 h-[63px] hidden lg:block'>
        <h1 className='font-outfit text-2xl font-medium'>Daftar Pengguna</h1>
      </div>

      <form className='relative max-w-[1080px] mx-auto mt-8 flex flex-col gap-4' onSubmit={handleRegister}>

        <div className='lg:grid lg:grid-cols-2 lg:gap-4'>
          <div className='grid grid-cols-1 gap-4'>
            <div className='flex flex-col w-full'>
              <label className='font-medium font-outfit'>Nama Lengkap</label>
              <input
                type="text"
                name="namaLengkap"
                value={formData.namaLengkap}
                className='border border-black rounded-md p-2 lg:p-3 font-outfit'
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
                className='border border-black rounded-md p-2 lg:p-3 font-outfit'
                placeholder='Masukkan Email'
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className='lg:grid lg:grid-cols-2 lg:gap-4'>
          <div className='grid grid-cols-1 gap-4'>
            <div className='flex flex-col w-full'>
              <label className='font-medium font-outfit'>Nomor Telepon</label>
              <input
                type="text"
                name="noTelepon"
                value={formData.noTelepon}
                className='border border-black rounded-md p-2 lg:p-3 font-outfit'
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
                className='border border-black rounded-md p-2 lg:p-3 font-outfit'
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
              className='border border-black rounded-md p-2 lg:p-3 font-outfit'
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
              className={`lg:text-[16px] h-[45px] lg:h-[51px] w-full`}
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
