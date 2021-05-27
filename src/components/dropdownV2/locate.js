import React from 'react';
import ReactDOM from 'react-dom';

export function Locate({children}) {
  if(!children){
    return null;
  }
  const el = document.createElement('div');
  document.body.appendChild(el);
  return ReactDOM.createPortal(
    React.cloneElement(children),
    el);
}

