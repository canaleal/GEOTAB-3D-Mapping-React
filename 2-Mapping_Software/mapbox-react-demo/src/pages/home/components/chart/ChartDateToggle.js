


import React from 'react'

const ChartDateToggle = ({ chartTime, chartTimeTogglerHandler }) => {
    return (
        <div className="flex my-2">
            <button
                className={`border text-center  w-1/3  ${chartTime === 'year' ? 'btn-blue' : 'btn-gray'}`}
                onClick={() => chartTimeTogglerHandler('year')}>
                <span>Year</span>
            </button>
            <button
                className={`border text-center w-1/3  ${chartTime === 'month' ? 'btn-blue' : 'btn-gray'}`}
                onClick={() => chartTimeTogglerHandler('month')}>
                <span>Month</span>
            </button>
            <button
                className={`border text-center  w-1/3   ${chartTime === 'day' ? 'btn-blue' : 'btn-gray'}`}
                onClick={() => chartTimeTogglerHandler('day')}>

                <span>Day</span>
            </button>
        </div>
    )
}

export default ChartDateToggle;