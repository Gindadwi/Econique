import React from 'react'

const Option = ({ options, value, onChange, name }) => {

    return (
        <div className='grid grid-cols-1'>

            <select
                value={value}
                onChange={onChange}
                className={`w-full bg-white lg:w-80 h-14 rounded-md px-3 font-outfit border border-1 border-black ${value === '' ? 'text-gray-400' : 'text-black'}`}
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
