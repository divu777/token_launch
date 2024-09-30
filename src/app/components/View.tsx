
import React from 'react'
import { CarouselDemo } from './Carousel'

const View = () => {
  return (
    <div className='h-screen  flex flex-col items-center justify-center gap-5 my-20'>
        <div className="flex  items-start  w-4/5"><h1 className="text-4xl uppercase font-bold w-1/3">
            Explore our collection
        </h1></div>
        
        <CarouselDemo />
        </div>
  )
}

export default View