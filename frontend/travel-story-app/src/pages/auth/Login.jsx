import React,{useState} from 'react';
import PasswordInput from '../../components/Input/PasswordInput'; 
import {useNavigate} from "react-router-dom";
import { validateEmail } from '../../utils/helper'; 
import axiosInstance from '../../utils/axiosInstance'; 
const Login = () => { 
  const [email,setEmail] = useState("");
  const [password,setPassword] =useState("");
  const [error,setError] = useState(null); 

  const navigate = useNavigate() 
  const handleLogin = async (e) => { 
    e.preventDefault();
    if(!validateEmail(email)){
      setError("Lütfen geçerl bir email adresi giriniz.");
      return; 
    } 
    if (!password){ 
      setError("Lütfen şifre giriniz.");
      return;
    } 
    setError(""); 
    //Login api çağrısı 
    try{ 
      const response = await axiosInstance.post("/login",{ 
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
        <div className='w-2/4 h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-10 z-50'> 
          <div > 
              <h4 className='text-5xl text-white font-semibold leading-[58px]'>
                Yolculuklarınızı Ölümsüzleştirin
              </h4> 
              <p className='text-[15px] text-white leading-6 pr-7 mt-[260px] transform translate-y-[-250px]'>
                Kişisel seyehat günlüğünde anıların ve tecrübelerin sonsuza kadar 
                seninle olsun.
              </p>
          </div>
        </div> 
        <div className='w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-black/100'> 
          <form onSubmit={handleLogin} > 
            <h4 className='text-2xl font-semibold mb-7'>Giriş Yap</h4> {/*text- tailwind css */} 
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
            {error && <p className="text-red-500 text-xs p-1">{error}</p>}
            <div className='flex justify-center mt-6'>
              <button type='submit' className='btn-primary relative flex items-center px-12 py-3 overflow-hidden font-medium transition-all bg-indigo-500 rounded-md group'
                   class=" relative flex items-center px-12 py-3 overflow-hidden font-medium transition-all bg-tertiary rounded-md group"
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
    >GİRİŞ YAP</span
  >
</button>
</div>
            <p className='flex justify-center text-xs text-slate-500 my-4'>Veya</p> 
            <div className='flex justify-center mt-6'>
            <button type='submit' className='relative flex items-center px-6 py-3 overflow-hidden font-medium transition-all bg-indigo-500 rounded-md group' onClick={() => {
              navigate("/signUp");
            }}
                   class="relative flex items-center px-6 py-3 overflow-hidden font-medium transition-all bg-tertiary rounded-md group"
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
    >HESAP OLUŞTUR</span>
</button>
          </div>
    
          </form>
        </div>
      </div> 
    </div>  
  )
}

export default Login
