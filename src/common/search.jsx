import { useState } from "react";
import Button from "./Button";
import { toast } from "react-hot-toast";
export default function Search({ onSearch }) { // Mengubah nama fungsi dan menambahkan parameter destructuring

    const [searchTerm, setSearchTerm] = useState('');




    const handleSearch = (e) => {
        e.preventDefault(); // Mencegah reload halaman saat form disubmit
        onSearch(searchTerm); // Memanggil onSearch dengan searchTerm
    
    
    }

    return (
        <div>
            <form className="flex gap-2 lg:gap-4" onSubmit={handleSearch}> {/* Menggunakan onSubmit di sini */}
                <input
                    type="text"
                    className=" w-full h-9 lg:w-[486px] lg:h-14 p-2 rounded-md border text-[12px] lg:text-xl border-black border-1 font-outfit"
                    placeholder="Pencarian"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                    name='Cari'
                    className={` w-14 h-9 text-[12px]  lg:w-20 lg:h-14 lg:text-[24px] `}
                    type="submit" // Menambahkan type submit pada tombol
                />
            </form>
        </div>
    )
}
