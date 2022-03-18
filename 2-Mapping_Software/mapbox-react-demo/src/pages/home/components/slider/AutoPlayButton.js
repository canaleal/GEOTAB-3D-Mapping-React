

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const TimeButton = ({ isTimerActive, timerToggleHandler, timerResetHandler }) => {
  return (
      <div className="flex">
        <button className={`border  text-center p-1 my-1  w-1/2  rounded-md bg-blue-500 hover:bg-blue-700 color-white`} onClick={timerToggleHandler}>
          {isTimerActive ?
            <FontAwesomeIcon icon="fa-solid fa-pause" /> : <FontAwesomeIcon icon="fa-solid fa-play" />}
        </button>
        <button className="border text-center p-1 my-1  w-1/2 rounded-md border-black-500 bg-slate-0 hover:bg-slate-200 " onClick={timerResetHandler}>
          Reset
        </button>
      </div>
  )
}



export default TimeButton;