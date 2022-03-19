import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const LayerButton = ({ item, layerHandler }) => {


  return (
    <button onClick={() => layerHandler(item.id)}
      className={`border slide-in-left block w-full text-left p-3 my-1 rounded-md 
      ${item.isOn ? 'bg-blue-500 hover:bg-blue-700 color-white' : 'border-black-500 bg-slate-0 hover:bg-slate-200'} `}
      value={item.id}>
      <FontAwesomeIcon icon={`fa-solid ${item.icon} `} size="xl" width={"2rem"}/>{item.layer}
    </button>
  )
}



export default LayerButton;