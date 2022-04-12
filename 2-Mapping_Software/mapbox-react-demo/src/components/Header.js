import React from 'react'

const Header = ({city}) => {


    


    return (
        <div className='h-fit  py-1 px-5 bg-black color-white '>
            <span>{city} </span>
        </div>
    )
}

export default React.memo(Header);