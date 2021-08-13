import React from 'react';
import { Button } from '../Button';
import {IoMdCloseCircleOutline} from 'react-icons/io'

import './styles.scss'

export const Modal = ({ id='modal', confirm = () => {} ,onClose = () => {}, children}: any) => {
 
  const handleOutsideClick = (e: any) => {
    if(e.target.id === id) onClose();
  }
 
 
  return (
    <div id={id} className="modal" onClick={handleOutsideClick}>
      <div className="container">
        <div className="content close">
          <h2>{children}</h2>
          <button onClick={onClose} ><IoMdCloseCircleOutline /></button>
        </div>
        <div className="buttons">
          <Button onClick={confirm} >Confirmar</Button>
        </div>
      </div>
    </div>
  )

}

