import React from 'react'
import {getInitials}  from '../../utils/helper'
const ProfileInfo = ({userInfo, onLogout}) => {

  const fullName = userInfo?.fullName || ""; // Boş değilse fullName al, boşsa ""
  const initials = getInitials(fullName);  // getInitials'ı düzgün bir şekilde çağır

  return ( 
    userInfo &&(
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {initials}  {/* İsimlerin ilk harflerini göster */}
      </div>
      <div>
        <p className="text-sm font-medium">{fullName}</p> {/* Tam ismi göster */}
        <button className="text-sm text-slate-700 underline" onClick={onLogout}>
          Çıkış
        </button>
      </div>
    </div> 
    ) 
  );
}; 
export default ProfileInfo 
