import React from 'react';

const Option = ({ selectedOption, setSelectedOption, options }) => {
    if (!options || options.length === 0) {
        return <div>Loading options...</div>;
    }

    return (
        <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="w-[270px] lg:w-80 h-14 rounded-xl px-3 font-outfit border border-1 border-black"
        >
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default Option;
