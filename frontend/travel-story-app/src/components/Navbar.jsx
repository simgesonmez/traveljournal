import React from 'react'
import LOGO from '../assets/images/logo1.png';
import ProfileInfo from './Cards/ProfileInfo';
import { useNavigate } from 'react-router-dom'; 
import SearchBar from './Input/SearchBar';
const Navbar = ({userInfo , searchQuery , setSearchQuery, onSearchNote, handleClearSearch}) => { 
  const isToken = localStorage.getItem("token"); 
  const navigate = useNavigate();
  const onLogout = () => { 
    localStorage.clear();
    navigate("/login");
  };  

  const handleSearch = () => { 
    if (searchQuery) {  
       console.log("Arama yapılıyor:", searchQuery); // test log
      onSearchNote(searchQuery);
    }
  };
  const onClearSearch = () => { 
    handleClearSearch();
    setSearchQuery("");
  };
  return (
    <div className='bg-white flex items-center justify-between px-5 py-0 drop-shadow sticky top-0 z-10 h-16'>
      <img src={LOGO} alt="travel story" className="h-100"/>  
      <>
      <SearchBar 
        value = {searchQuery} 
        onChange = {({target})  => { 
          setSearchQuery(target.value);

        }} 
      handleSearch={handleSearch} 
      onClearSearch={onClearSearch}
      /> 
    {isToken && <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>} 
    </>
    </div>
  )
}

export default Navbar
