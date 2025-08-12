import React from 'react'

const EmptyCard = ({imgSrc,message}) => {
  return (
    <div className='flex flex-col items-center justify-center mt-45'>
      <img src = {imgSrc} alt= "NO NOTES" className='w-35'></img> 
      <p className='w-1/2 text-m font-medium font-size[100px] text-slate-700 text-center leading-9 px-12'> 
        {message}
    </p>
    </div>
  )
}

export default EmptyCard
