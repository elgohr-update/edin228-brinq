import React, { useEffect } from 'react'
import { Row } from '@nextui-org/react';
import { useAppContext } from '../../../context/state';

export const BodyContainer = ({children}) => {
  const {state, setState} = useAppContext();

  const handleScroll = (e) => {
    if (e.target.scrollTop === 0 ){
      if (state.scrollY > 0) {
        setState({...state,scrollY:0})
      }
    }
    else if (state.scrollY < 1) {
      setState({...state,scrollY:e.target.scrollTop})
    }
  };

  return (
    <Row fluid className={`z-3 w-full content-main overflow-y-auto pb-4 max-h-[93vh] md:max-h-[94vh]`} onScroll={(e) => handleScroll(e)}>
        {children}
    </Row>
  )
}
