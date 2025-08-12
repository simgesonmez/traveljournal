import EMPTY_STATE from '../assets/images/emptystate.gif';
import EMPTY from '../assets/images/travel.gif';
   export const validateEmail = (email) => { 
    const regex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //email düzeni ornek@gmail.com gibi girilebilmesi için
    return regex.test(email);
 }; 

 export const getInitials = (name) =>{ 
   if(!name) return "";
   const words = name.split(" ");
   let initials= "";
   for(let i= 0; i<Math.min(words.length, 2); i++){ 
      initials += words[i][0];
   }
    return initials.toUpperCase();
 }; 
 export const getEmptyCardMessage = (filterType) => { 
   
   switch(filterType){ 
      case "search":
         return 'Oops! Aramanızla eşleşen hikayeye bulunamadı.' 
         case "date":
            return 'Bu zaman aralığına ait hikaye bulunamadı.' 
            default:
            return 'Henüz bir seyahat hikayen yok. Yeni yerler keşfetmeye başladığında, anılarını burada saklayabilirsin! "Hikaye Ekle" butonuna tıklayarak ilk hikayeni paylaş!';
            
   }
 }; 
 export const getEmptyCardImg = (filterType) => { 
   switch(filterType){ 
      case "search":
         return EMPTY_STATE; 
      case "date":
         return EMPTY_STATE;
      default:
         return EMPTY;
   } 
 }