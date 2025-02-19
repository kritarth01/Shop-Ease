import React, { useEffect, useState } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';

const Spinner = ({path = "/login"}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [count,setCount] = useState(4)

    useEffect(()=>{
        const interval = setInterval(()=>{
            setCount((prevValue)=>--prevValue)
        },1000)
        count ===0 && navigate(`${path}`,{
            state : location.pathname
        })
        return ()=>clearInterval(interval)
    },[count,navigate,location,path])
  return (
    <div className="flex items-center justify-center h-screen flex-col bg-white text-black">
      <div><PulseLoader color="#FF0200" size={15} /></div>
      <div className='text-3xl text-black'>Redirecting to you in {count}</div>
    </div>
  );
};

export default Spinner;
