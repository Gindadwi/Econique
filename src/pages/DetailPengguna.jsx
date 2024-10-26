import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { formatDistanceToNow } from "date-fns"; // Install this package using `npm install date-fns`
import { db } from '../firebase';
import { HiEye } from "react-icons/hi";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi";
import Swal from 'sweetalert2';


const DetailPengguna = () => {

    const [users, setUsers] = useState([]);


    // Fetch data users dari Firestore
    useEffect(() => {
        const fetchDataUser = async () => {
            try {
                const querySnapShot = await getDocs(collection(db, "users"));
                const userData = querySnapShot.docs.map(doc => ({
                    id: doc.id, // Simpan ID dengan benar
                    ...doc.data(),
                    lastLoginAgo: doc.data().lastLogin
                        ? formatDistanceToNow(new Date(doc.data().lastLogin.seconds * 1000), { addSuffix: true })
                        : 'Belum pernah login'
                }));

                setUsers(userData);
            } catch (error) {
                console.log('Error fetching data:', error);
            }
        };

        fetchDataUser();
    }, []);


    //Membuat fungsi deleted akun
    const handleDelete = async (id) => {
        console.log("Deleting user with ID:", id); // Debugging: Pastikan ID tertera dengan benar

        if (!id) {
            Swal.fire({
                title: 'ID Tidak Valid!',
                text: 'Gagal menemukan data user yang akan dihapus.',
                icon: 'error',
            });
            return;
        }

        try {
            await deleteDoc(doc(db, "users", id)); // Hapus dokumen dari Firestore
            Swal.fire({
                title: 'Berhasil Dihapus!',
                icon: 'success',
                showConfirmButton: false,
                timer: 1800,
            });

            // Perbarui state users
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        } catch (error) {
            console.error('Gagal menghapus data:', error);
            Swal.fire({
                title: 'Gagal Menghapus!',
                text: 'Terjadi kesalahan saat menghapus data.',
                icon: 'error',
            });
        }
    };

    return (
        <div className="relative w-full max-w-[1080px] ">
            {/* Header */}
            <div className='bg-white w-screen lg:w-screen items-center justify-start flex p-4 h-[63px] lg:sticky lg:top-0 lg:z-10 hidden lg:block'>
                <h1 className='font-outfit text-[18px] lg:text-2xl font-medium hidden lg:block'>Detail Pengguna</h1>
            </div>


            <div className='container w-full mt-5 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mx-auto flex flex-col lg:max-w-[1920px]'>
                {/* Membuat Tabel untuk detail kegiatan */}
                <div className='relative my-5 overflow-x-auto overflow-y-auto max-h-[450px]'>
                    <table className='w-full text-sm overflow-x-auto relative  lg:text-base table-auto'>
                        <thead className='bg-white text-sm text-black font-poppins '>
                            <tr>
                                <th className='px-5 py-2 whitespace-nowrap font-outfit font-semibold text-left'> Nama Lengkap</th>
                                <th className='px-5 py-2 whitespace-nowrap font-outfit font-semibold text-left'> Email</th>
                                <th className='px-5 py-2 whitespace-nowrap font-outfit font-semibold text-left'> Nomor Telepon</th>
                                <th className='px-5 py-2 whitespace-nowrap font-outfit font-semibold text-left'> Alamat</th>
                                <th className='px-5 py-2 whitespace-nowrap font-outfit font-semibold text-left'> Roles</th>
                                <th className='px-5 py-2 whitespace-nowrap font-outfit font-semibold text-left'> Aksi</th>

                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                    <>
                                        <th className='px-5 py-4 whitespace-nowrap font-outfit font-normal text-left'> {user.namaLengkap}</th>
                                        <th className='px-5 py-2 whitespace-nowrap font-outfit font-normal text-left'> {user.email}</th>
                                        <th className='px-5 py-2 whitespace-nowrap font-outfit font-normal text-left'> {user.noTelepon}</th>
                                        <th className='px-5 py-2 whitespace-nowrap font-outfit font-normal text-left'> {user.alamat}</th>
                                        <th className='px-5 py-2 whitespace-nowrap font-outfit font-normal text-left'> {user.role}</th>
                                        <div className='flex flex-col px-5 gap-0'>
                                            <th className='flex gap-2'>
                                                <button className='bg-green-700 font-normal text-white w-24 p-1 rounded-lg flex gap-2 items-center'> <span className='pl-2'>{<HiEye />}</span>Detail</button>
                                                <button onClick={() => handleDelete(user.id)} className='bg-orange-500 font-normal  text-white w-24 p-1 rounded-lg flex gap-2 items-center'><span className='pl-2'>{<HiOutlineTrash />}</span>Hapus</button>
                                            </th>

                                        </div>
                                    </>
                                </tr>
                            ))}

                        </tbody>

                    </table>
                </div>
            </div>

        </div>
    )
}

export default DetailPengguna
