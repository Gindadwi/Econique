import React from 'react'

const Option = ({ options, value, onChange, name }) => {

    return (
        <div className='flex flex-col'>

            <select
                value={value}
                onChange={onChange}
                className={`w-[270px] bg-white lg:w-80 h-14 rounded-xl px-3 font-outfit border border-1 border-black ${value === '' ? 'text-gray-400' : 'text-black'}`}
                >

                 <option value="" className='text-gray-400'>
                    {name}                
                 </option>
                 {options.map((option, index) => (
                    <option key={index} value={option.value} className='text-black'>
                        {option.label}
                    </option>
                 ))}       

            </select>

        </div>
    )
}

export default Option
