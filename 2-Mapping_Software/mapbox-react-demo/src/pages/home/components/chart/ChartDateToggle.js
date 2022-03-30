


import React from 'react'

const ChartDateToggle = ({ chartTime, chartTimeTogglerHandler }) => {
    return (
        <div className="flex mt-2">
            <button
                className={`border text-center p-1 my-1  w-1/3  rounded-md ${chartTime === 'year' ? 'btn-blue' : 'btn-gray'}`}
                onClick={() => chartTimeTogglerHandler('year')}>
                <span>Year</span>
            </button>
            <button
                className={`border text-center p-1 my-1  w-1/3  rounded-md ${chartTime === 'month' ? 'btn-blue' : 'btn-gray'}`}
                onClick={() => chartTimeTogglerHandler('month')}>
                <span>Month</span>
            </button>
            <button
                className={`border text-center p-1 my-1  w-1/3  rounded-md ${chartTime === 'day' ? 'btn-blue' : 'btn-gray'}`}
                onClick={() => chartTimeTogglerHandler('day')}>

                <span>Day</span>
            </button>
        </div>
    )
}

export default ChartDateToggle;