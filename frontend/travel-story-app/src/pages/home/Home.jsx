import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import {useNavigate} from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance"; 
import Modal from "react-modal";
import TravelStoryCard from '../../components/Cards/TravelStoryCard';  
import AddEditTravelStory from './AddEditTravelStory';
import { ToastContainer, toast } from 'react-toastify';

const Home = () => { 
  const navigate =  useNavigate();
  const [userInfo,setUserInfo] = useState(null); 
  const [allStories,setAllStories] = useState([]); 
  const [openAddEditModal, setOpenAdddEditModal] = useState({  
    isShown: false,
    type: "add",
    data:null, 

  });
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
  const handleEdit = (data) => {}
 // Travel Story Click 
 const handleViewStory = (data) => {} 

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
      getAllTravelStories();
    }
   }  catch(error){ 
    console.log("Beklenmeyen bir sorun oluştu.Tekrar deneyiniz.");
  }
 };

 useEffect(() => { 
  getAllTravelStories();
  getUserInfo();
  return () => {};
 }, []);

  return (
    <>
      <Navbar userInfo={userInfo}/> 
    <div className='container mx-auto py-10 '> 
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
                onEdit={() => handleEdit(item)}
                onClick = {() => handleViewStory(item)}
                onFavouriteClick = {() => updateIsFavourite(item)} 
              
                />
              );
            })} 
            </div>
          ) : ( 
             <>EmptyCardHere</>
          )}
        </div>
        <div className='w-[320px]'></div>
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
        setOpenAdddEditModal({isShown: false, type: "add", data: null});
      }} 
      getAllTravelStories={getAllTravelStories}
    /> 
    </Modal> 
<button
  class="fixed bottom-8 right-14 rounded-lg w-44 h-10 cursor-pointer flex items-center border border-tertiary-500 bg-tertiary  group  transition-all duration-300 shadow-lg " 
  onClick={() => { 
    setOpenAdddEditModal({isShown: true, type:"add", data:null});
  }}
> 

  <span
    class="text-black-200 font-semibold ml-8 transform group-hover:translate-x-20 transition-all duration-300"
    >Hikaye Ekle</span
  >
  <span
    class="absolute right-0 h-full w-10 rounded-lg bg-primary flex items-center justify-center transform group-hover:translate-x-0 group-hover:w-full transition-all duration-300"
  >
    <svg
      class="svg w-8 text-white"
      fill="none"
      height="24"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
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
