


import React from 'react'

const ChartDateToggle = ({chartTime, chartTimeTogglerHandler}) => {
    return (
        <div className="flex mt-2">
            <button className={`border text-center p-1 my-1  w-1/3  rounded-md ${chartTime === 'year' ? 'bg-blue-500 hover:bg-blue-700 color-white' : 'border-black-500 bg-slate-200 hover:bg-slate-300'}`} onClick={() => chartTimeTogglerHandler('year')}>
                <span>Year</span>
            </button>
            <button
                className={`border text-center p-1 my-1  w-1/3  rounded-md ${chartTime === 'month' ? 'bg-blue-500 hover:bg-blue-700 color-white' : 'border-black-500 bg-slate-200 hover:bg-slate-300'}`}
                onClick={() => chartTimeTogglerHandler('month')}>
                <span>Month</span>
            </button>
            <button
                className={`border text-center p-1 my-1  w-1/3  rounded-md ${chartTime === 'day' ? 'bg-blue-500 hover:bg-blue-700 color-white' : 'border-black-500 bg-slate-200 hover:bg-slate-300'}`}
                onClick={() => chartTimeTogglerHandler('day')}>

                <span>Day</span>
            </button>
        </div>
    )
}

export default ChartDateToggle;