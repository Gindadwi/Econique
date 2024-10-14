import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Select from "react-select";

export default function OptionWisata({ selectedWisata, setSelectedWisata }) {
    const [wisataOptions, setWisataOptions] = useState([]);
    const [tempat, setTempat] = useState([]);
    const [selectedTempat, setSelectedTempat] = useState(null);

    // Fetch Wisata options on component mount
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

    // Handle Wisata change
    const handleWisataChange = async (selected) => {
        if (selected !== selectedWisata?.wisata) {
            setSelectedWisata((prevState) => ({
                ...prevState,
                wisata: selected, // Update selected Wisata
                tempat: [] // Reset Tempat when Wisata changes
            }));
            setSelectedTempat(null); // Reset Tempat selection

            if (selected) {
                try {
                    const tempatCollection = collection(db, `TempatWisata/${selected.value}/Tempat`);
                    const tempatSnapshot = await getDocs(tempatCollection);
                    const tempatList = tempatSnapshot.docs.map((doc) => ({
                        value: doc.id,
                        label: doc.data().nama,
                    }));
                    setTempat(tempatList);
                } catch (error) {
                    console.error("Error fetching Tempat: ", error);
                }
            } else {
                setTempat([]); // Clear Tempat options if no Wisata is selected
            }
        }
    };

    // Handle Tempat change
    const handleTempatChange = (selected) => {
        setSelectedTempat(selected);
        setSelectedWisata((prevState) => ({
            ...prevState,
            tempat: selected // Update selected Tempat(s)
        }));
    };

    return (
        <div className="flex flex-col space-y-2">
            {/* Dropdown for selecting Wisata */}
            <Select
                options={wisataOptions}
                value={selectedWisata?.wisata || null} // Set the current Wisata selection
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

            {/* Dropdown for selecting Tempat (only appears after Wisata is selected) */}
            {selectedWisata && (
                <Select
                    options={tempat}
                    value={selectedTempat} // Set the current Tempat selection(s)
                    onChange={handleTempatChange}
                    isMulti // Allow multiple selections for Tempat
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
