
import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom';

const Footer = ({ }) => {


  const [mapList, setMapList] = useState([
    {
      "id": 0,
      "name": "Kingston",
      "link": "/Kingston",

    }, {

      "id": 1,
      "name": "Vancouver",
      "link": "/Vancouver",
    }, {

      "id": 2,
      "name": "Chicago",
      "link": "/Chicago",


    },
    {

      "id": 3,
      "name": "France",
      "link": "/France",


    }]);

  const [applicationToolsList, setApplicationToolsList] = useState([
    {
      "id": 0,
      "name": "Animista",
      "link": "https://animista.net/play/basic",
    },

    {
      "id": 1,
      "name": "Developer Icons",
      "link": "https://devicon.dev/",
    },
    {
      "id": 2,
      "name": "Color Designer",
      "link": "https://colordesigner.io/tools",
    },
    {
      "id": 3,
      "name": "Font Awesome",
      "link": "https://fontawesome.com/",
    },
    {
      "id": 4,
      "name": "Cool Backgrounds",
      "link": "https://coolbackgrounds.io/"
    },
    {
      "id": 5,
      "name": "Gradient Generator",
      "link": "https://cssgradient.io/"
    }
  ])

  const [aboutList, setAboutList] = useState([
    {
      "id": 0,
      "name": "Linkedin",
      "link": "https://www.linkedin.com/in/alex-canales",
    },
    {
      "id": 1,
      "name": "Github",
      "link": "https://github.com/canaleal",
    },
    {
      "id": 2,
      "name": "Bitbucket",
      "link": "https://bitbucket.org/Canaleal/",
    },
  ]);

  return (
    <Fragment>

      <div className='bg-smoke mt-4  '>
        <hr></hr>
        <div className=' py-8 px-5'>
          <div className='grid grid-cols-1 sm:grid-cols-3 '>
            <div className='col-span-1 py-2'>
              <p className='font-bold'>Maps</p>

              {mapList.map((item) => (
                <div key={item.id} className='my-2'>
                  <Link to={{ pathname: `${item.link}` }} className='text-sm  hover:underline'>{item.name}</Link>
                </div>
              ))}

            </div>

            <div className='col-span-1 py-2'>

              <p className='font-bold'>Application Tools</p>
              {applicationToolsList.map((item) => (
                <div key={item.id} className='my-2'>
                  <a href={`${item.link}`} target='_blank' rel="noreferrer" className='text-sm  hover:underline'>{item.name}</a>
                </div>
              ))}

            </div>


            <div className='col-span-1 py-2'>

              <p className='font-bold'>About</p>

              {aboutList.map((item) => (
                <div key={item.id} className='my-2'>
                  <a href={`${item.link}`} target='_blank' className='text-sm  hover:underline'>{item.name}</a>
                </div>
              ))}

            </div>
          </div>


          <div className='grid grid-cols-1 sm:grid-cols-3 mt-8'>
            <div className='col-span-1 py-2'>
              <p className='font-bold'>Disclaimer</p>
              <p className='font-bold text-xs my-2'> © Alex Canales Portfolio. All rights reserved. </p>
              <p className='font-bold text-xs my-2'>Website Terms and Policies</p>


              <p className='text-xs my-2'>If you require any more information or have any questions about our site's disclaimer, please feel free to contact me by email at alexcanales766@gmail.com. The Disclaimer was generated with the help of the Disclaimer Generator.
                All the information on this website - Showcase - is published in good faith and for general information purpose only.
              </p>


            </div>

            <div className='col-span-1 py-2 '>
            </div>

            <div className='col-span-1 py-2 '>
              <p className='font-bold'>License Terms</p>
              <img class="h-16 my-2" src="data:image/png;base64,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" data-src="https://www.rbg.ca/app/uploads/RBG_Horizontal_Black_CMYK.svg?x96454" loading="lazy" alt="RRBG logo_Horizontal_Black_CMYK" data-was-processed="true" />
              <p className='text-xs my-2'>Ea nulla elit sint amet laborum. Tempor fugiat amet Lorem esse veniam id sint tempor deserunt et aute. Dolor nisi do esse mollit adipisicing veniam officia qui aliqua non veniam pariatur. Consequat culpa velit eu aute magna sit esse non aute aliquip ad amet qui elit. Elit id nostrud incididunt adipisicing elit nulla qui aliquip commodo cupidatat qui voluptate. Ut est cupidatat deserunt excepteur. Amet nostrud culpa incididunt anim ut nulla deserunt veniam ullamco proident nulla.</p>
            </div>

          </div>

        </div>

      </div>

    </Fragment>
  )
}



export default React.memo(Footer);