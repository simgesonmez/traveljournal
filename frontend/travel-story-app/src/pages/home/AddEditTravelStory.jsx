import React,{  useState } from 'react'
import {MdAdd, MdDeleteOutline, MdUpdate, MdClose} from "react-icons/md"; 
import DateSelector from '../../components/Input/DateSelector';
import ImageSelector from '../../components/Input/ImageSelector';
import TagInput from '../../components/Input/TagInput'; 
import moment from 'moment'; 
import axiosInstance from '../../utils/axiosInstance';
import uploadImage from '../../utils/uploadImage'; 
import {toast} from "react-toastify";
const AddEditTravelStory = ({ storyInfo,
    type,
    onClose,
    getAllTravelStories, 
}) => {  
    const [title, setTitle] = useState(storyInfo?.title || "");
    const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
    const [story, setStory] = useState(storyInfo?.story || "");
    const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
    const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null); 

    const [error,setError] = useState("") 
    // add travel story 
    const addNewTravelStory = async () => {  
      
      try { 
        let imageUrl = ""; 
        //upload image if present 
        if (storyImg) { 
          const imgUploadRes = await uploadImage(storyImg);
          // get image url 
          imageUrl = imgUploadRes.imageUrl || "";
        } 
        const response = await axiosInstance.post("/add-travel-story", { 
          title,
          story,
          imageUrl: imageUrl || "" ,
          visitedLocation,
          visitedDate: visitedDate 
          ? moment(visitedDate).valueOf() 
          : moment().valueOf(),
        });
        if (response.data && response.data.story){ 
          toast.success("Hikaye başarıyla eklendi."); 
          // refresh stories 
          getAllTravelStories();
          //close modal or form 
          onClose(); 
        }
        }catch(error){ 
          if (
            error.response && 
            error.response.data && 
            error.response.data.message
          ) { 
            setError(error.response.data.message);
          }else{ 
            //aciklanamayan hata 
            setError("Açıklanamayan bir sorun oluştu. Lütfen daha sonra tekrar deneyiniz.");
          }
            
        }
      
    }
    //update Travel Story
   const updateTravelStory = async () => {  
    const storyId = storyInfo._id;
     try { 
        let imageUrl = "";  

        let  postData = { 
          title,
          story,
          imageUrl: storyInfo.imageUrl || "",
          visitedLocation,
          visitedDate: visitedDate 
          ? moment(visitedDate).valueOf() 
          : moment().valueOf(),
        };
        if (typeof storyImg === "object") { 
          //yeni fotoğraf ekleme  
          const imgUploadRes = await uploadImage(storyImg);
          imageUrl = imgUploadRes.imageUrl || "" ;
          postData = { 
            ...postData,
            imageUrl: imageUrl,
          };
        }
     
        const response = await axiosInstance.put("/edit-story/" + storyId, postData);
        if (response.data && response.data.story){ 
          toast.success("Hikaye başarıyla güncellendi."); 
          // refresh stories 
          getAllTravelStories();
          //close modal or form 
          onClose(); 
        }
        }catch(error){ 
          if (
            error.response && 
            error.response.data && 
            error.response.data.message
          ) { 
            setError(error.response.data.message);
          }else{ 
            //aciklanamayan hata 
            setError("Açıklanamayan bir sorun oluştu. Lütfen daha sonra tekrar deneyiniz.");
          }
            
        }
   }

    const handleAddOrUpdateClick = () => {  
      console.log("Input Data:,",{title,storyImg,story,visitedLocation,visitedDate}) 

      if(!title){ 
        setError("Lütfen bir başlık giriniz.")
      } 
      if(!story){ 
        setError("Lütfen bir  hikaye yazınız.")
      } 
      setError(""); 
      if(type === "edit"){ 
        updateTravelStory();
      }else{ 
         addNewTravelStory();
      }
    }; 

    const handleDeleteStoryImg = async () => { 
      //fotoğraf silmek 
      const deleteImgRes = await axiosInstance.delete("/delete-image",{ 
        params: { 
          imageUrl: storyInfo.imageUrl,
        },
      }); 
      if(deleteImgRes.data) { 
        const storyId = storyInfo._id; 

        const postData = { 
          title,
          story,
          visitedLocation,
          visitedDate: moment().valueOf(),
          imageUrl: "",
        }; 
        //fotoğraf güncellemek 
        const response = await axiosInstance.put( 
          "/edit-story" + storyId,
          postData
        ); 
        setStory(null);
      }
    };
  return (
    <div className='relative'>
      <div className='flex items-center justify-between'> 
        <h5 className='text-xl font-medium text-slate-700'> 
            {type === "add" ? "Hikaye Ekle" : "Hikaye Güncelle"}
        </h5> 
        <div> 
            <div className='flex items-center gap-3 bg-gray-200 p-2 rounded-l-lg'> 
                {type === "add" ? (
             <button className='btn-small' onClick={handleAddOrUpdateClick}>
                <MdAdd className="text-lg"/> HİKAYE EKLE  
             </button>   
                ) : ( 
              <> 
              <button className='btn-small' onClick={handleAddOrUpdateClick}>
                <MdUpdate className='text-lg'/> HİKAYEYİ GÜNCELLE
              </button> 
             
              </>
            )}
             <button className='' onClick={(onClose)}> 
                <MdClose className='text-sl text-slate-400'/> 

             </button>
            </div> 
            {error && ( 
              <p className='text-red-500 text-xs pt-2 text-right'>{error}</p>
            )}
        </div>
      </div> 
      <div> 
        <div className='flex-1 flex flex-col gap-2 pt-4' > 
            <label className='input-label'>BAŞLIK</label> 
            <input  
                type='text'
                className='text-2xl text-slate-950 outine-none'
                placeholder='İSTANBUL DA BİR GÜN'
                value={title}
                onChange={({target}) => setTitle(target.value)}
            />
           <div className='my-3'> 
            <DateSelector date={visitedDate} setDate={setVisitedDate}   />
           </div> 
           <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImg={handleDeleteStoryImg} /> 
           <div className='flex flex-col gap-2 mt-4'> 
            <label className='input-label'>HİKAYE</label> 
            <textarea 
            type='text'
            className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
            placeholder='Hikayen'
            rows={10}
            value={story}
            onChange={({target}) => setStory(target.value)} 
            />
           </div> 
           <div className='pt-3'> 
            <label className='input-label'>GEZİLERİM  </label>
            <TagInput tags={visitedLocation} setTags={setVisitedLocation}/>
           </div>
        </div>
      </div>
    </div>
  )
}

export default AddEditTravelStory
