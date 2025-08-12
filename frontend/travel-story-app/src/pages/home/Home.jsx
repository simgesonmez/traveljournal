import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import {useNavigate} from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance"; 
import Modal from "react-modal";
import TravelStoryCard from '../../components/Cards/TravelStoryCard';  
import AddEditTravelStory from './AddEditTravelStory';
import { ToastContainer, toast } from 'react-toastify';
import ViewTravelStory from './ViewTravelStory'; 
import EmptyCard from '../../components/Cards/EmptyCard'; 
import { getEmptyCardImg, getEmptyCardMessage } from '../../utils/helper';

import { DayPicker } from 'react-day-picker'; 
import moment from 'moment'; 
import FilterInfoType from '../../components/Cards/FilterInfoType'; 

const Home = () => { 
  const navigate =  useNavigate();
  const [userInfo,setUserInfo] = useState(null); 
  const [allStories,setAllStories] = useState([]);  
  const [searchQuery , setSearchQuery] = useState ("");
  const [ filterType , setFilterType] = useState(""); 
   const [dateRange , setDateRange] = useState ({ from:null, to:null});

  const [openAddEditModal, setOpenAddEditModal] = useState({  
    isShown: false,
    type: "add",
    data:null, 

  }); 
  const [openViewModal,setOpenViewModal]=useState({ 
    isShown: false,
    type:"add",
    data: null,
  }) ;
//kullanıcı bilgisi
  const getUserInfo = async () => { 
    try{ 
      const response = await axiosInstance.get("/get-user"); //kullanıcı var mı diye gerekli bağlantılar kuruldu
      if(response.data && response.data.user){ 
        setUserInfo(response.data.user);
      }
    }catch(error){ 
      if(error.response.status === 401){ 
        localStorage.clear();
        navigate("/login");
      }
    }
  }; 

  //Seyehat hikayeleri 
  const getAllTravelStories = async () => { 
    try{ 
      const response = await axiosInstance.get("/get-all-stories"); 
      if(response.data && response.data.stories){ 
        setAllStories(response.data.stories);
      }
    }catch(error){ 
      console.log("Beklenmeyen bir sorun oluştu.Tekrar deneyiniz.");
    }
  } 
  //Story Edit Click 
  const handleEdit = (data) => { 
    setOpenAddEditModal({isShown: true, type:"edit", data:data
    });
  };

 // Travel Story Click 
 const handleViewStory = (data) => { 
  setOpenViewModal({isShown: true, data});
 } ;

 //Update Fav 
 const updateIsFavourite = async  (storyData) => { 
  const storyId = storyData._id; 
  try { 
    const response = await axiosInstance.put( 
     "/update-is-favourite/" + storyId,
     { 
      isFavourite: !storyData.isFavourite,
     }
    ); 
    if(response.data && response.data.story){ 
      toast.success("Hikaye Başarıyla Güncellendi.") 
      if(filterType === "search" && searchQuery){ 
        onSearchStory(searchQuery);
      }else if(filterType === "date" ){ 
        filterStoriesByDate(dateRange);
      }else{
      getAllTravelStories();
    } 
  }
   }  catch(error){ 
    console.log("Beklenmeyen bir sorun oluştu.Tekrar deneyiniz.");
  }
 }; 
 // hikaye silme 
 const deleteTravelStory = async (data) => { 
  const storyId = data._id;
  try{ 
    const response = await axiosInstance.delete("/delete-story/" + storyId); 
    if(response.data && !response.data.error){ 
      toast.error("Hikaye Başarıyla Silindi.");
      setOpenViewModal((prevState) => ({...prevState, isShown: false }));
      getAllTravelStories();
    }
  }catch(error){ 
    console.log("Beklenmedik bir hata oluştu. Daha sonra tekrar deneyiniz.")
  }
 }; 
 //hikaye arama 
 const onSearchStory = async (query) => { 
  try{ 
    const response = await axiosInstance.get("/search",{ 
      params:{ 
        query,
      },
    }); 
    if(response.data && response.data.stories){ 
      setFilterType("search");
      setAllStories(response.data.stories);
    }
  }catch(error){ 
    console.log("Beklenmedik bir hata oluştu. Daha sonra tekrar deneyiniz.")
  }
  }

 const handleClearSearch = () => { 
  setFilterType("");
  getAllTravelStories();
 }; 
 //handle filter 
 const filterStoriesByDate = async (day) => {
  try{ 

   
    const startDate = day.from ? moment(day.from).valueOf() : null;
    const endDate = day.to ? moment(day.to).valueOf() : null; 

    if (startDate && endDate ) { 
      const response = await axiosInstance.get("/travel-stories/filter" ,{ 
        params:{ startDate,endDate},
      });  
      if(response.data && response.data.stories) { 
        setFilterType("date");
        setAllStories(response.data.stories);
      }
    }
  }catch(error){ 
    console.log("Beklenmedik bir hata oluştu. Daha sonra tekrar deneyiniz.");
  }
 };
 // handle date
 const handleDayClick = (day) => { 
  setDateRange(day);
  filterStoriesByDate(day);
 };
  const resetFilter= () => { 
    setDateRange({from: null , to: null});
    setFilterType("");
    getAllTravelStories();
  }
 useEffect(() => { 
  getAllTravelStories();
  getUserInfo();
  return () => {};
 }, []);

  return (
    <>
      <Navbar userInfo={userInfo} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery} 
        onSearchNote={onSearchStory} 
        handleClearSearch={handleClearSearch}
      /> 
    <div className='container mx-auto py-10 '> 
    <FilterInfoType
       filterType={filterType}
       filterDates={dateRange}
       onClear={() => {
        resetFilter();
       }} 
       />
      <div className='flex gap-20'>
        <div className='flex-1'> 
          {allStories.length > 0 ? ( 
            <div className='grid grid-cols-3 gap-8'> 
            {allStories.map((item) => { 
              return( 
                <TravelStoryCard  
                key={item._id } 
                imageUrl={item.imageUrl}
                title={item.title} 
                story={item.story} 
                date={item.visitedDate} 
                visitedLocation={item.visitedLocation} 
                isFavourite={item.isFavourite} 
                // onEdit={() => handleEdit(item)}
                onClick = {() => handleViewStory(item)}
                onFavouriteClick = {() => updateIsFavourite(item)} 
              
                />
              );
            })} 
            </div>
          ) : ( 
             <EmptyCard imgSrc={getEmptyCardImg(filterType)} 
             message={getEmptyCardMessage(filterType)}
             />
          )}
        </div>
        <div className='w-[-120px]'></div> 
        {allStories.length > 0 &&(
        <div className='bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg   '>
           <div className='p-0'> 
            <DayPicker  
             className="rdp"
              captionLayout="dropdown-buttons"  
              mode="range"
              selected={dateRange}
              onSelect={handleDayClick} 
              pagedNavigation />
           </div>
         </div> 
        )}
      </div>
    </div>   

     
    <Modal 
    isOpen={openAddEditModal.isShown}
    onRequestClose={() => {}}
    style={{
      overlay:{ 
        backgroundColor:"rgba(0,0,0,0.2)",
        zIndex: 999,
      },
    }}   
    appElement={document.getElementById("root")}
    className="model-box" 
     > 
    <AddEditTravelStory 
      type= {openAddEditModal.type}
      storyInfo={openAddEditModal.data}
      onClose={() => { 
        setOpenAddEditModal({isShown: false, type: "add", data: null});
      }} 
      getAllTravelStories={getAllTravelStories}
    /> 
    </Modal>  

     <Modal 
    isOpen={openViewModal.isShown}
    onRequestClose={() => {}}
    style={{
      overlay:{ 
        backgroundColor:"rgba(0,0,0,0.2)",
        zIndex: 999,
      },
    }}   
    appElement={document.getElementById("root")}
    className="model-box" 
     > 
    
    <ViewTravelStory  
    storyInfo={openViewModal.data || null} 
    onClose={() => {
      setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
  }}
    onEditClick={() =>{  setOpenViewModal((prevState) => ({ ...prevState, isShown: false })); 
    handleEdit(openViewModal.data || null)
  }}
    onDeleteClick={() => { 
      deleteTravelStory(openViewModal.data || null);
    }}
    />
    </Modal> 
<button
  className="fixed bottom-8 right-14 rounded-lg w-44 h-10 cursor-pointer flex items-center border border-tertiary-500 bg-tertiary  group  transition-all duration-300 shadow-lg " 
  onClick={() => { 
    setOpenAddEditModal({isShown: true, type:"add", data:null});
  }}
> 

  <span
    className="text-black-200 font-semibold ml-8 transform group-hover:translate-x-20 transition-all duration-300"
    >Hikaye Ekle</span
  >
  <span
    className="absolute right-0 h-full w-10 rounded-lg bg-primary flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300"
  >
    <svg
      className="svg w-8 text-white"
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="12" x2="12" y1="5" y2="19"></line>
      <line x1="5" x2="19" y1="12" y2="12"></line>
    </svg>
  </span>
</button>

    <ToastContainer/>
    </>
  )
}

export default Home
