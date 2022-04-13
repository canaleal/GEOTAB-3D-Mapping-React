import React, { Fragment } from 'react'
import { Link } from 'react-router-dom';

const Header = ({ city, color}) => {





    return (
        <Fragment>

            <nav className={`${color}`}>
                <div className="px-5 py-2">
                    <Link to="/" className="nav-item">
                        <span className="text-xl weight-bold">USARS 3D Mapping - {city}</span>
                    </Link>

                </div>
            </nav>


            <div className='h-fit  py-1 px-5 bg-black color-white '>
                <span>Last Updated : 2022-04-13 2:56 AM </span>
            </div>
        </Fragment>

    )
}

export default React.memo(Header);