import { useState } from 'react';
import Econique from '../assets/Econique.png';
import LogoPerhutani from '../assets/LogoPerhutani.png';
import Button from '../common/Button';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import Swal from 'sweetalert2';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [namaLengkap, setNamaLengkap] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("namaLengkap", "==", namaLengkap));
            const querySnapshot = await getDocs(q);

            console.log('Query Snapshot:', querySnapshot); // Debug

            if (querySnapshot.empty) {
                toast.error('Pengguna tidak ditemukan.');
                return;
            }

            const userData = querySnapshot.docs[0].data();
            console.log('User Data:', userData); // Debug

            await signInWithEmailAndPassword(auth, userData.email, password);

            if (userData.role === "Super Admin") {
                navigate('/dasboard');
                Swal.fire({
                    title: 'Berhasil Login',
                    text: 'Anda Login Sebagai Super Admin',
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1800
                });
            } else if (userData.role === "Admin") {
                navigate('/dashboardAdmin');
                Swal.fire({
                    title: 'Berhasil Login',
                    text: 'Anda Login Sebagai Admin',
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1800
                });
            } else if (userData.role === "User") {
                navigate('/dashboardUsers');
                Swal.fire({
                    title: 'Berhasil Login',
                    text: 'Anda Login Sebagai User',
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1800
                });
            }
        } catch (error) {
            console.error('Login gagal:', error);
            toast.error('Login gagal. Cek nama lengkap atau password.');
        }
    };

    return (
        <div className='bg-white h-screen w-screen flex flex-col items-center justify-center'>
            <div className='flex flex-row gap-3 w-[245px] items-center justify-center'>
                <img className='w-14 lg:w-[100px]' src={LogoPerhutani} alt="" />
                <img className='w-14 pt-2 lg:w-[100px]' src={Econique} alt="" />
            </div>

            <div className='w-full max-w-[1080px] flex flex-col gap-5  items-center'>
                <div className='flex flex-col gap-1 justify-center items-center'>
                    <p className='text-lg font-poppins font-medium text-black'>Daily Checklist Event</p>
                    <p className='text-lg font-poppins font-medium text-black'>Klaster Banyumas</p>
                </div>
                <form onSubmit={handleLogin} className='flex flex-col px-5 gap-3 items-center lg:max-w-[400px] w-full'>
                    <div className='flex flex-col w-full'>
                        <label className='text-black font-poppins text-[14px]'>Username</label>
                        <input
                            type="text"
                            placeholder='Masukan Username'
                            value={namaLengkap}
                            onChange={(e) => setNamaLengkap(e.target.value)}
                            className='w-full border border-black shadow-md rounded-lg px-2 py-2 lg:py-3'
                        />
                    </div>

                    <div className='flex flex-col relative w-full'>
                        <label className='text-black font-poppins text-[14px]'>Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder='Masukan Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full border border-black shadow-md rounded-lg px-2 py-2 lg:py-3'
                        />
                        <button
                            type='button'
                            className='absolute right-4 top-[32px] lg:top-[38px]'
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <Icon icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"} width={20} />
                        </button>
                    </div>

                    <Button
                        type="submit"
                        name="Login"
                        className='text-[16px] w-full h-9'
                    />
                </form>
            </div>
        </div>
    );
}
