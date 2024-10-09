import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Select from "react-select";

export default function OptionWisata({ selectedWisata, setSelectedWisata }) {
    const [wisataOptions, setWisataOptions] = useState([]);
    const [tempat, setTempat] = useState([]);
    const [selectedTempat, setSelectedTempat] = useState(null);

    useEffect(() => {
        const getWisata = async () => {
            const wisataCollection = collection(db, "TempatWisata");
            const wisataSnapshot = await getDocs(wisataCollection);
            const wisataList = wisataSnapshot.docs.map((doc) => ({
                value: doc.id,
                label: doc.data().nama,
            }));
            setWisataOptions(wisataList);
        };

        getWisata();
    }, []);
    const handleWisataChange = async (selected) => {
        setSelectedWisata(prevState => ({
            ...prevState,
            wisata: selected,  // Update nama wisata
            tempat: []  // Reset tempat saat ganti wisata
        }));

        if (selected) {
            const tempatCollection = collection(db, `TempatWisata/${selected.value}/Tempat`);
            const tempatSnapshot = await getDocs(tempatCollection);
            const tempatList = tempatSnapshot.docs.map((doc) => ({
                value: doc.id,
                label: doc.data().nama,
            }));
            setTempat(tempatList);
        } else {
            setTempat([]);
            setSelectedTempat(null);
        }
    };

    const handleTempatChange = (selected) => {
        setSelectedTempat(selected);
        setSelectedWisata(prevState => ({
            ...prevState,
            tempat: selected  // Update tempat
        }));
    };


    return (
        <div className="flex flex-col space-y-2">
            <Select
                options={wisataOptions}
                value={selectedWisata?.wisata || null}                
                onChange={handleWisataChange}
                placeholder="Pilih Tempat Wisata"
                className="w-[270px] lg:w-80 h-14 rounded-xl border-black"
                styles={{
                    control: (base) => ({
                        ...base,
                        height: '3.5rem',
                        border: '1px solid black',
                        borderRadius: '0.75rem',
                        boxShadow: 'none',
                        '&:hover': {
                            borderColor: 'black',
                        },
                    }),
                }}
            />
            {selectedWisata && (
                <Select
                    options={tempat}
                    value={selectedTempat}
                    onChange={handleTempatChange}
                    isMulti
                    placeholder="Pilih Tempat"
                    className="w-[270px] lg:w-80 h-auto rounded-xl border-black"
                    styles={{
                        control: (base) => ({
                            ...base,
                            height: 'auto',
                            border: '1px solid black',
                            borderRadius: '0.75rem',
                            boxShadow: 'none',
                            '&:hover': {
                                borderColor: 'black',
                            },
                        }),
                    }}
                />
            )}
        </div>
    );
}
