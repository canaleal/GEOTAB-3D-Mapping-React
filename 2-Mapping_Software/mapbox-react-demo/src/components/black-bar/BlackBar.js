import React, { Component, useRef, useState, useEffect } from 'react'


const BlackBar = () => {

    const [city, setCity] = useState('Kingston');
    const [source, setSource] = useState('Open Data Kingston');

    return (
        <div className='h-fit py-1 px-4 bg-neutral-900  color-white'>
            <span>{city}</span>

            <span className='float-right'>{source}</span>

        </div>
    )

}

export default BlackBar