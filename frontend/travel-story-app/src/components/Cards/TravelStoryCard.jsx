import React from 'react'; 
import moment from 'moment/moment';
import { FaHeart } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";


const TravelStoryCard = ({
  imageUrl,
  title,
  date,
  story,
  visitedLocation,
  isFavourite,
  onFavouriteClick,
  onClick,
}) => {
  return (
    <div
      className="relative group cursor-pointer overflow-hidden duration-500 w-64 h-80 bg-tertiary text-gray-50 p-5"
      onClick={onClick}
    >
      <div>
        <div
          className="group-hover:scale-110 w-full h-60 duration-500 bg-cover bg-center rounded-md"
         style={{ backgroundImage: `url(${imageUrl})` }} >  
        
          <button 
          className='w-12 h-12 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 absolute top-4 right-4'
          onClick={onFavouriteClick}>  
        
         <FaHeart className={`icon-btn ${isFavourite ? "text-purple-500" : "text-white"}`} />

          </button>
           
        </div>

        <div className="absolute w-56 left-0 p-5 -bottom-16 duration-500 group-hover:-translate-y-12">
          <div className="absolute -z-10 left-0 w-64 h-28 opacity-0 duration-500 group-hover:opacity-50 group-hover:bg-accent"></div>

          <div className=" flex justify-between items-center mb-1">
            <span className="text-xl font-bold">{ title.length > 150 ? story.slice(0, 150) + "..." : title}</span>
          
          </div>

          <p className="text-sm opacity-0 group-hover:opacity-100 duration-500"> {story.length > 40 ? story.slice(0, 40) + "..." : story}</p>

          <div className="flex items-center mt-2 text-xs gap-2 opacity-0 group-hover:opacity-100 duration-500">
            <GrMapLocation />
            <span>{visitedLocation?.join(', ')}</span>
          </div>

          <div className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 duration-500">
           {date ? moment(date).format("Do MMM YYYY") : "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelStoryCard;

