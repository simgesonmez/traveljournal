/** @type {import('tailwindcss').Config} */
export default {
  content: [ 
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { 
    fontFamily: {
      sans: ["Merriweather", "sans-serif"], // Varsayılan font olarak ayarlar
      display: ["Anton", "sans-serif"] // Özel başlıklar için
    },
  
    extend: { 
      //colors
      colors:{ 
        primary:"#77966D",
        secondary:"#BDC667",
        tertiary:"#626D58",
        accent:"#544343",
      }, 
      backgroundImage:{ 
        'login-bg-img':"url('./src/assets/images/bg.jpeg')",
        'signup-bg-img':"url('./src/assets/images/signupphoto.jpeg')"
      }
    }, 
  },
  plugins: [],
}

