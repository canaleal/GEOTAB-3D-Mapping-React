import React from 'react'

const Header = ({city}) => {


    return (
        <div className='h-fit  py-1 px-5 bg-black color-white '>
            <span>{city} - Last Updated: 2022-02-22 8:30am</span>
        </div>
    )
}

export default React.memo(Header);