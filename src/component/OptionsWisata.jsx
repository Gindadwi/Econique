import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Select from "react-select";

export default function OptionWisata({ selectedWisata, setSelectedWisata }) {
    const [wisataOptions, setWisataOptions] = useState([]);
    const [tempatOptions, setTempatOptions] = useState([]);
    const [selectedTempat, setSelectedTempat] = useState([]);

    // Fetch semua opsi wisata saat komponen di-mount
    useEffect(() => {
        const getWisata = async () => {
            try {
                const wisataCollection = collection(db, "TempatWisata");
                const wisataSnapshot = await getDocs(wisataCollection);
                const wisataList = wisataSnapshot.docs.map((doc) => ({
                    value: doc.id,
                    label: doc.data().nama,
                }));
                setWisataOptions(wisataList);
            } catch (error) {
                console.error("Error fetching Wisata: ", error);
            }
        };
        getWisata();
    }, []);

    // Fetch Tempat untuk wisata yang dipilih
    const handleWisataChange = async (selected) => {
        setSelectedWisata((prevState) => ({
            ...prevState,
            wisata: selected,
            tempat: [], // Reset tempat setiap kali wisata berubah
        }));
        setSelectedTempat([]); // Reset selectedTempat

        try {
            const tempatCollection = collection(db, `TempatWisata/${selected.value}/Tempat`);
            const tempatSnapshot = await getDocs(tempatCollection);
            const tempatList = tempatSnapshot.docs.map((doc) => ({
                value: doc.id,
                label: doc.data().nama,
            }));
            setTempatOptions(tempatList);
        } catch (error) {
            console.error("Error fetching Tempat: ", error);
        }
    };

    // Handle perubahan Tempat
    const handleTempatChange = (selected) => {
        setSelectedTempat(selected);
        setSelectedWisata((prevState) => ({
            ...prevState,
            tempat: selected, // Update selected tempat
        }));
    };

    return (
        <div className="relative grid grid-cols-1 lg:grid-cols-none 2xl:grid-cols-none space-y-2">
            {/* Dropdown untuk memilih wisata */}
            <Select
                options={wisataOptions}
                value={selectedWisata?.wisata || null}
                onChange={handleWisataChange}
                placeholder="Pilih Wisata"
                className="w-full lg:w-80 2xl:w-[510px] h-14 rounded-md border-black"
                styles={{
                    control: (base) => ({
                        ...base,
                        height: '3.5rem',
                        border: '1px solid black',
                        borderRadius: '0.75rem',
                    }),
                }}
            />

            {/* Dropdown untuk memilih tempat (muncul setelah wisata dipilih) */}
            {selectedWisata?.wisata && (
                <Select
                    options={tempatOptions}
                    value={selectedTempat}
                    onChange={handleTempatChange}
                    isMulti
                    placeholder="Pilih Tempat"
                    className="w-full lg:w-80 2xl:w-[510px] h-auto rounded-md border-black"
                    styles={{
                        control: (base) => ({
                            ...base,
                            border: '1px solid black',
                            borderRadius: '0.75rem',
                        }),
                    }}
                />
            )}
        </div>
    );
}
