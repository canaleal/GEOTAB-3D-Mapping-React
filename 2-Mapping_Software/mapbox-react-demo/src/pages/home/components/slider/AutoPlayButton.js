

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const TimeButton = ({ isTimerActive, timerToggleHandler, timerResetHandler }) => {
  return (
    <div className="flex">
      <button className={`border  text-center w-1/2   btn-blue`} onClick={timerToggleHandler}>
        <span> {isTimerActive ? <FontAwesomeIcon icon="fa-solid fa-pause" /> : <FontAwesomeIcon icon="fa-solid fa-play" />}</span>
      </button>
      <button className="border text-center w-1/2 btn-gray " onClick={timerResetHandler}>
        <span>Reset</span>
      </button>
    </div>
  )
}



export default TimeButton;