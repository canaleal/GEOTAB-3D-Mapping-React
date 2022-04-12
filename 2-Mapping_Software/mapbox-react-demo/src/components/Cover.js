import React from 'react'

const Cover = ({coverRef}) => {
  return (
    <div ref={coverRef} className='cover'></div>
  )
}

export default React.memo(Cover);