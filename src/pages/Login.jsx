import { useState } from 'react';
import Econique from '../assets/Econique.png';
import LogoPerhutani from '../assets/LogoPerhutani.png';
import Button from '../common/Button';
import { Icon } from '@iconify/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
export default function Login (){
    
    const [showPassword, setShowPassword] = useState();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async(e) => {
        e.preventDefault(); // Mencegah refresh halaman secara default
        try {
            const response = await axios.get('https://econique-perhutani-default-rtdb.firebaseio.com/Login.json?auth=oahZAHcmPhj9gDp0HdkDFaCuGRt2pPZrX05YsdIl')
            const users = response.data;
            const userExist = Object.values(users).find(user => user.Username === username && user.Password === password );  

            if(userExist) {
                toast.success('berhasil login')
                navigate('/dasboard')
            }else(
                toast.error('Tidak Berhasil Login')
            )
        } catch (error) {
            console.log("error data", error)
        }
    }


    return(
        <div className='bg-white h-screen w-screen flex flex-col items-center justify-center '>
            <div className='flex flex-row gap-3 w-[245px] items-center justify-start ms-5 absolute top-1 start-1 '>
                <img className='w-14 lg:w-[100px]' src={LogoPerhutani} alt="" />
                <img className='w-14 pt-2 lg:w-[100px]' src={Econique} alt="" />
            </div>

            <div className='w-full max-w-[1080px] flex flex-col gap-5 -mt-16 items-center justify-center'>
                <p className='text-2xl font-outfit font-semibold text-black'>Masuk</p>
                <form onSubmit={handleLogin} className='flex flex-col gap-3 justify-start items-center lg:max-w-[400px] lg:w-full' >
                    <div className='flex flex-col w-full'>
                        <label className='text-black font-poppins text-[14px]'>Username</label>
                        <input type="text" placeholder='Masukan Username'
                         value={username}
                         onChange={(e) => setUsername(e.target.value) }
                         className='w-full border border-1 border-black shadow-md rounded-lg text-black font-outfit px-2 lg:py-3 py-2'/>
                    </div>
                    <div className='flex flex-col relative w-full'>
                        <label className='text-black font-poppins text-[14px]'>Password</label>
                        <input type={showPassword ? "text" : "password"} placeholder='Masukan Password'
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className='w-full border border-1 border-black shadow-md rounded-lg text-black font-outfit px-2 lg:py-3 py-2'/>

                        <button type='button'
                         className='absolute right-4 top-[42px] -translate-y-1/2'
                         onClick={() => setShowPassword(!showPassword)}> 
                            {showPassword ? <Icon icon="mdi:eye-off-outline" width={20} /> : <Icon icon="mdi:eye-outline" width={20} /> }
                        </button>
                    </div>

                    <Button
                    type={'sumbit'}
                    name={"Login"} 
                    className={`text-[16px] w-full h-9`}
                    />

                </form>
            </div>
        </div>
    )
}