import React from 'react'

const Option = ({ options, value, onChange, name, className }) => {

    return (
        <div className='relative grid grid-cols-1 lg:grid-cols-none 2xl:grid-cols-noner'>

            <select
                value={value}
                onChange={onChange}
                className={`${className}w-full bg-white  lg:w-80 2xl:w-[510px] h-14 rounded-md px-3 font-outfit border border-1 border-black ${value === '' ? 'text-gray-400' : 'text-black'}`}
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
