import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const LayerButton = ({ item, layerHandler }) => {


  return (
    <button onClick={() => layerHandler(item.id)}
      className={`border  w-full text-left ${item.isOn ?'btn-blue' : 'btn-gray'} `} value={item.id}>
      <FontAwesomeIcon icon={`fa-solid ${item.icon} `} size="xl" width={"2rem"}/><span>{item.layer}</span>
    </button>
  )
}



export default React.memo(LayerButton);