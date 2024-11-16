import { useState } from 'react';
import Econique from '../assets/Econique.png';
import LogoPerhutani from '../assets/LogoPerhutani.png';
import Button from '../common/Button';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, } from "firebase/auth";
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

            if (querySnapshot.empty) {
                toast.error('Pengguna tidak ditemukan.');
                return;
            };

            const userData = querySnapshot.docs[0].data();

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
        <div className='bg-gradient-to-r from-green-400 to-blue-500 h-screen w-screen flex flex-col items-center justify-center'>
            <div className='flex flex-row gap-4 w-[245px] items-center justify-center mb-5'>
                <img className='w-14 lg:w-[80px]' src={LogoPerhutani} alt="Logo Perhutani" />
                <img className='w-14 pt-2 lg:w-[80px]' src={Econique} alt="Logo Econique" />
            </div>

            <div className='w-full max-w-[300px] lg:max-w-[400px] bg-white rounded-lg shadow-2xl p-8 lg:p-10 flex flex-col items-center gap-5'>
                <div className='text-center'>
                    <p className='text-xl lg:text-2xl font-poppins font-semibold text-gray-800'>Daily Checklist Event</p>
                    <p className='text-lg lg:text-xl font-poppins text-gray-700'>Klaster Banyumas</p>
                </div>

                <form onSubmit={handleLogin} className='flex flex-col gap-4 w-full'>
                    <div className='flex flex-col w-full'>
                        <label className='text-gray-700 font-poppins text-sm lg:text-base'>Username</label>
                        <input
                            type="text"
                            placeholder='Masukan Username'
                            value={namaLengkap}
                            onChange={(e) => setNamaLengkap(e.target.value)}
                            className='w-full border border-gray-300 rounded-lg px-4 py-3 lg:py-4 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'
                        />
                    </div>

                    <div className='flex flex-col w-full relative'>
                        <label className='text-gray-700 font-poppins text-sm lg:text-base'>Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder='Masukan Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full border border-gray-300 rounded-lg px-4 py-3 lg:py-4 text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'
                        />
                        <button
                            type='button'
                            className='absolute right-4 top-[34px] lg:top-[42px] text-gray-500 hover:text-gray-700'
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <Icon icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"} width={22} />
                        </button>
                    </div>

                    <Button
                        type="submit"
                        name="Login"
                        className='w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 lg:py-3 font-poppins font-medium transition duration-300 ease-in-out'
                    />

                </form>
            </div>

            
        </div>
    );
}
