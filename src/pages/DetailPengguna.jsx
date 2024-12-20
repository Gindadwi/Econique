import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from "date-fns";
import { db } from '../firebase';
import { HiEye } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const DetailPengguna = () => {
    const navigate = useNavigate();
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

    // Membuat fungsi deleted akun
    const handleDelete = async (id) => {
        console.log("Deleting user with ID:", id);

        if (!id) {
            Swal.fire({
                title: 'ID Tidak Valid!',
                text: 'Gagal menemukan data user yang akan dihapus.',
                icon: 'error',
            });
            return;
        }

        try {
            // Show confirmation dialog
            const result = await Swal.fire({
                title: 'Apakah Anda yakin?',
                text: 'Data yang dihapus tidak dapat dikembalikan!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya, Hapus!',
                cancelButtonText: 'Batal',
            });

            // If user confirms the deletion
            if (result.isConfirmed) {
                await deleteDoc(doc(db, "users", id)); // Hapus dokumen dari Firestore

                // Perbarui state users
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));

                // Show success message
                Swal.fire({
                    title: 'Terhapus!',
                    text: 'Data telah berhasil dihapus.',
                    icon: 'success',
                });
            }
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
        <div className="relative overflow-x-hidden">
            {/* Header */}
            <div className='lg:bg-white lg:w-screen lg:items-center lg:justify-start lg:flex lg:p-4 lg:h-[63px] lg:sticky lg:top-0 lg:z-10 shadow-lg'>
                <h1 className='font-outfit text-[18px] lg:text-2xl font-medium hidden lg:block'>Detail Pengguna</h1>
            </div>

            <div className='container w-full rounded-lg mt-5 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mx-auto flex flex-col lg:max-w-[1920px]'>
                {/* Membuat Tabel untuk detail kegiatan */}
                <div className='relative my-5 overflow-x-auto overflow-y-auto max-h-[450px]'>
                    <table className='w-full text-sm overflow-x-auto relative lg:text-base table-auto'>
                        <thead className='bg-green-100 text-sm text-black font-poppins'>
                            <tr>
                                <th className='px-5 py-5 whitespace-nowrap font-outfit font-semibold text-left'> Nama Lengkap</th>
                                <th className='px-5 py-5 whitespace-nowrap font-outfit font-semibold text-left'> Email</th>
                                <th className='px-5 py-5 whitespace-nowrap font-outfit font-semibold text-left'> Nomor Telepon</th>
                                <th className='px-5 py-5 whitespace-nowrap font-outfit font-semibold text-left'> Alamat</th>
                                <th className='px-5 py-5 whitespace-nowrap font-outfit font-semibold text-left'> Roles</th>
                                <th className='px-5 py-5 whitespace-nowrap font-outfit font-semibold text-left'> Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-green-100' : 'bg-white'}>
                                    <>
                                        <th className='px-5 py-5 whitespace-nowrap font-outfit font-normal text-left'>{user.namaLengkap}</th>
                                        <th className='px-5 py-5 whitespace-nowrap font-outfit font-normal text-left'>{user.email}</th>
                                        <th className='px-5 py-5 whitespace-nowrap font-outfit font-normal text-left'>{user.noTelepon}</th>
                                        <th className='px-5 py-5 whitespace-nowrap font-outfit font-normal text-left'>{user.alamat}</th>
                                        <th className='px-5 py-5 whitespace-nowrap font-outfit font-normal text-left'>{user.role}</th>
                                        <div className='flex flex-col px-5 gap-0'>
                                            <th className='flex gap-2'>
                                                <button onClick={() => navigate(`/updatePengguna/${user.id}`)} className='bg-green-700 font-normal text-white w-24 p-1 rounded-lg flex gap-2 items-center'>
                                                    <span className='pl-2'>{<HiEye />}</span>Detail
                                                </button>
                                                <button onClick={() => handleDelete(user.id)} className='bg-orange-500 font-normal text-white w-24 p-1 rounded-lg flex gap-2 items-center'>
                                                    <span className='pl-2'>{<HiOutlineTrash />}</span>Hapus
                                                </button>
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

export default DetailPengguna;
