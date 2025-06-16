import React,{useState} from 'react';
import PasswordInput from '../../components/Input/PasswordInput'; 
import {useNavigate} from "react-router-dom";
import { validateEmail } from '../../utils/helper'; 
import axiosInstance from '../../utils/axiosInstance'; 
const SignUp = () => { 
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] =useState("");
  const [error,setError] = useState(null); 

  const navigate = useNavigate() 
  const handleSignUp = async (e) => { 
    e.preventDefault();
    if(!name){
      setError("Lütfen adınızı giriniz.");
      return; 
    }  
    if(!validateEmail(email)){
      setError("Lütfen geçerli bir email adresi giriniz.");
      return; 
    } 
    if (!password){ 
      setError("Lütfen şifre giriniz.");
      return;
    } 
    setError(""); 
    //Sign up api çağrısı 
    try{ 
      const response = await axiosInstance.post("/create-account",{ 
        fullName:name,
        email:email,
        password:password,
      });
     //başarılı 
     if(response.data && response.data.accessToken){ 
      localStorage.setItem("token",response.data.accessToken);
      navigate("/dashboard");
     }
    } catch(error){ 
      //giriş error 
      if(error.response && error.response && error.response.data.message ){ 
        setError(error.response.data.message);
      }else{ 
        setError("Açıklanamayan bir hata oluştu. Lütfen daha sonra tekrar deneyinz.");
      }
    }
  };
  
  return (
     <div className='h-screen overflow-hidden relative'> {/*h-screen tailwind css sınıfıdır. div yüksekliğini 100vh yapar.*/} 
     <div className='login-iu-box right-10 -top-40'/>
     <div className='login-iu-box -bottom-40 right-1/2'/>
      <div className='container h-screen flex items-center justify-center px-20 mx-auto'>
        <div className='w-2/4 h-[90vh] flex items-end bg-signup-bg-img bg-cover bg-center rounded-lg p-10 z-50'> 
          <div > 
              <h4 className='text-5xl text-[#544343] font-semibold leading-[208px]'>
                  HAYDİ MACERAYA
              </h4> 
              <p className='text-[15px] text-gray leading-6 pr-7 mt-[260px] transform translate-y-[-310px] '>
              Gez, hisset, paylaş  milyonlarca hikâyenin içinde seninkini başlat!
              </p>
          </div>
        </div> 
        <div className='w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-black/100  '> 
          <form onSubmit={handleSignUp} > 
            <h4 className='text-2xl font-semibold mb-7'>Kayıt Ol</h4> {/*text- tailwind css */} 

            <input type='text' 
            placeholder='Adınız' 
            className='input-box ' 
            value={name}
            onChange={({target}) => { 
              setName(target.value); 
            }
          }    
            /> 


            <input type='text' 
            placeholder='Email' 
            className='input-box ' 
            value={email}
            onChange={({target}) => { 
              setEmail(target.value); 
            }
          }    
            /> 
            <PasswordInput 
             value={password}
             onChange={({target}) => { 
               setPassword(target.value);   
             }
           } 
              /> 

<p className={`text-red-500 text-xs mb-1 transition-opacity duration-300 ${error ? 'opacity-100' : 'opacity-0'}`}>
  {error || '⠀'}
</p>

            <div className='flex justify-center mt-6'>
              <button type='submit' className='btn-primary relative flex items-center px-12 py-3 overflow-hidden font-medium transition-all bg-indigo-500 rounded-md group'
                   class=" relative top-[-23px] flex items-center px-5 py-3 overflow-hidden font-medium transition-all bg-tertiary rounded-md group"
               >
                <span
                  class="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-accent rounded group-hover:-mr-4 group-hover:-mt-4"
                 >
                <span
                   class="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"
                ></span>
                </span>
                 <span
                class="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-accent rounded group-hover:-ml-4 group-hover:-mb-4"
                >
                <span
                 class="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"
    ></span>
  </span>
  <span
    class="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-accent rounded-md group-hover:translate-x-0"
  ></span>
  <span
    class="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white "
    >HESAP OLUŞTUR</span
  >
</button>
</div> 
      
            <p className='relative top-[-15px] flex justify-center text-xs text-slate-500 my-0'>Veya</p> 
            
            <div className='flex justify-center mt-6'>
            <button type='submit' className='relative flex items-center px-6 py-3 overflow-hidden font-medium transition-all bg-indigo-500 rounded-md group ' onClick={() => {
              navigate("/login");
            }}
                   class="relative top-[-33px] flex items-center px-11 py-3 overflow-hidden font-medium transition-all bg-tertiary rounded-md group "
               >
                <span 
                  class="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-accent rounded group-hover:-mr-4 group-hover:-mt-4"
                 >
                <span
                   class="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"
                ></span>
                </span>
                 <span
                class="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-accent rounded group-hover:-ml-4 group-hover:-mb-4"
                >
                <span
                 class="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"
    ></span>
  </span>
  <span
    class="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-accent rounded-md group-hover:translate-x-0"
  ></span>
  <span
    class="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white"
    >GİRİŞ YAP</span>
</button>
          </div>
    
          </form>
        </div>
      </div> 
    </div>  
  )
}

export default SignUp

