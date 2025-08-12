require("dotenv").config();
 


const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require ("bcrypt");
const express = require("express");
const cors = require ("cors");
const jwt = require("jsonwebtoken"); 
const upload = require ("./multer");
const fs = require ("fs");
const path = require("path");

const{ authenticateToken} = require ( "./utilities");

const User = require("./models/user.model");
const TravelStory = require("./models/travelStory.model");

mongoose.connect(config.connectionString);


const app = express();
app.use(express.json());
app.use(cors({origin: "*"}));

//create account
// post atmak ve sunucu cevabı
app.post("/create-account",async (req,res) => { 
    const {fullName, email, password } = req.body;

    if (!fullName || !email || !password){ 
        return res.status(400).json({ error: true, message: "Tüm alanların doldurulması zorunludur." })
    }   

    const isUser = await User.findOne({ email });
    if(isUser) { 
        return res.status(400).json({ error: true, message: "Kullanıcı zaten mevcuttur. "});
    } 

    const hashedPassword = await bcrypt.hash(password, 10); //şifreyi 10 tur hashler 

    const user = new User ({ 
        fullName,
        email,
        password: hashedPassword,
    
    }); 
    await user.save();
    const accessToken = jwt.sign(
        {userId: user._id }, 
        process.env.ACCESS_TOKEN_SECRET,
        { 
            expiresIn: "72h",  // token atıyoruz kimlik 72 saat açık 
        }
    ); 

    return res.status(201).json({ 
        error: false,
        user: {fullName: user.fullName, email: user.email},
        accessToken,
        message: "Kayıt başarılı.",
    });

});
//Login 
app.post("/login",async (req,res) => { 
   const{email,password} = req.body;
   if(!email || !password){ 
    return res.status(400).json({message:"Email ve şifre gereklidir."}) ;
} 
const user = await User.findOne({ email });
if(!user){ 
    return res.status(400).json({message:"Kullanıcı bulunamadı."});
} 
const isPasswordValid = await bcrypt.compare(password,user.password);
if(!isPasswordValid){ 
    return res.status(400).json({message: "Geçersiz giriş bilgileri"});
} 
const accessToken = jwt.sign(  
    {userId: user._id},
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:"72h",
    }
);
 return res.json({ 
    error:false,
    message:"Oturum başarıyla açıldı.",
    user:{fullName: user.fullName, email: user.email} ,
    accessToken,
 });
}); 
// get user
app.get("/get-user", authenticateToken, async (req,res) => { 
    const { userId } = req.user; 
    const isUser = await User.findOne({_id: userId});

    if(!isUser){ 
        return res.sendStatus(401);
    } 
    return res.json({ 
        user: isUser,
        message: "",
    });

}); 
// add travel story  
app.post("/add-travel-story", authenticateToken, async (req,res) => {
const {title, story, visitedLocation, imageUrl, visitedDate} = req.body;
const {userId} = req.user

// gerekli alanlar 
if (!title || !story || !visitedLocation || !imageUrl || !visitedDate){ 
    return res.status(400).json({error: true, message: "Tüm alanların doldurulması zorunludur." });
} 
// visited date date object çevirme  
const parsedVisitedDate = new Date(parseInt(visitedDate));
try { 
    const travelStory = new TravelStory({ 
      title,
      story,
      visitedLocation,
      userId,
      imageUrl,
      visitedDate: parsedVisitedDate,
    }); 
    await travelStory.save();
    res.status(201).json({story: travelStory, message:'Başarıyla eklendi.'});
} 
catch(error){ 
    res.status(400).json({error: true, message: error.message});
}
});
// get all stories 
app.get("/get-all-stories", authenticateToken, async (req,res) => {
    const {userId} = req.user;
    try{ 
        const travelStories = await TravelStory.find({userId}).sort({
            isFavourite: -1, //önce favori hikayeleri göster 
        }); 
        res.status(201).json({ stories:travelStories});
    } catch(error){ 
        res.status(500).json({error:true , message: error.message});
     }
});  
//edit travel story 
app.put("/edit-story/:id", authenticateToken, async (req,res) => { 
        const {id}= req.params;
        const{title,story,visitedLocation,imageUrl,visitedDate} = req.body;
        const{userId} = req.user;
        // gerekli alanlar 
if (!title || !story || !visitedLocation || !visitedDate){ 
    return res.status(400).json({error: true, message: "Tüm alanların doldurulması zorunludur." });
} 
// visited date date object çevirme  
const parsedVisitedDate = new Date(parseInt(visitedDate));
try{ 
    // idye göre travel story bul ve jayıtlı kullanıcıya mı ait emin ol 
    const travelStory = await TravelStory.findOne({_id: id, userId: userId});
    if(!travelStory){ 
        return res.status(404).json({error: true, message:"Hikaye bulunamadı."});
        
    } 
    const exampleImgUrl = `http://localhost:8000/assets/example.png`;

    travelStory.title = title;
    travelStory.story = story;
    travelStory.visitedLocation = visitedLocation;
    travelStory.imageUrl = imageUrl || exampleImgUrl; 
    travelStory.visitedDate =parsedVisitedDate;
    
    await travelStory.save();
    res.status(200).json({story: travelStory, message: "Hikaye başarıyla güncellendi."});
} catch(error){ 
    res.status(500).json({error:true, message: error.message});
}
 
}); 
// delete a travel story 
app.delete("/delete-story/:id", authenticateToken, async (req,res) => {
    const {id} = req.params;
    const {userId} = req.user;
    try{ 
     // idye göre travel story bul ve jayıtlı kullanıcıya mı ait emin ol 
    const travelStory = await TravelStory.findOne({_id: id, userId: userId});
    if(!travelStory){ 
        return res.status(404).json({error: true, message:"Hikaye bulunamadı."});
    }  
    // delete from database 
     await travelStory.deleteOne({_id: id, userId: userId});
     // image çıkarmak 

     const imageUrl = travelStory.imageUrl;
     const filename= path.basename(imageUrl); 
     //filepath tanımla 

     const filePath = path.join(__dirname,'uploads', filename);
     //delete the image file from the uploads folder 

     fs.unlink(filePath,(err) => { 
        if(err){ 
            console.error("Görsel silinirken bir hata oluştu:",err)
        }
     });
     res.status(200).json({message:"Hikaye başarıyla silindi."});
    } catch(error){ 
             res.status(500).json({error: true, message:error.message});
    }
    });
// resim yükleme rotası 
app.post("/image-upload", upload.single("image"), async (req,res) => { 
try{ 
    if(!req.file){ 
        return res.status(400).json({error:true, message:"Fotoğraf yüklenemedi."});
    } 
    const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
    res.status(200).json({imageUrl});
}catch(error){ 
    res.status(500).json({error:true,message:error.message});
}

}); 
//delete an image from uploads folder 
app.delete("/delete-image", async (req, res) => { 
   const { imageUrl } = req.query;
   if(!imageUrl){ 
    return res.status(400).json({error: true, message:"imageUrl parametresi gerekli."});
   } 
   try{ 
    //imageUrl den filename çıkarmak 
    const filename = path.basename(imageUrl);

    //dosya yolunu tanımla 
    const filePath = path.join(__dirname, 'uploads', filename);
    
    //dosya yolunu kontrol et 
    if(fs.existsSync(filePath)){ 
        // dosya silmek 
        fs.unlinkSync(filePath);
        res.status(200).json({message:"Görsel başarıyla silindi"});
    }else
    { 
        res.status(200).json({error:true,message:"Görsel bulunamadı"});
    }
   }catch(error){ 
    res.status(500).json({error:true, message: error.message}); 
   }
}); 
// Update isFavourite 
app.put("/update-is-favourite/:id", authenticateToken, async (req, res) => { 
    const {id} = req.params;
    const {isFavourite} = req.body;
    const{userId} = req.user;
    try{ 
        const travelStory = await TravelStory.findOne({_id: id, userId: userId});
        if(!travelStory){ 
            return res.status(404).json({error:true,message:"Hikaye bulunamadı "});
        }
        travelStory.isFavourite = isFavourite;  
        travelStory.save();
        res.status(200).json({story:travelStory, message:'Güncelleme Başarıyla Gerçekleştirildi.'});

    }catch(error){ 
        res.status(200).json({error:true,message:error.message});
    }
}); 
// search travel story 
app.get("/search", authenticateToken, async (req, res) => { 
       const {query} = req.query;
       const {userId} = req.user;
       if(!query){ 
        return res.status(404).json({error:true, message: "Sorgu gerekli"})
       } 
       try{ 
        const searchResults = await TravelStory.find({ 
            userId: userId,
            $or:[ 
                {title:{$regex: query, $options: "i"}},
                {story:{$regex: query, $options: "i"}},
                {visitedLocation:{$regex: query, $options: "i"}},
            ],
        }).sort({ isFavourite:-1});
        res.status(200).json({stories:searchResults});
       }catch(error){ 
             res.status(500).json({error:true, message:error.message});
       }
 });
//hiakeyeleri tarihlere göre filtrele 
app.get("/travel-stories/filter", authenticateToken, async (req, res) => { 
const {startDate, endDate} = req.query;
const{userId} = req.user;
try{ 
    //startdate ve enddate date olarak değiştirmesi 
    const start = new Date (parseInt(startDate));
    const end = new Date (parseInt(endDate));

    const filteredStories = await TravelStory.find({ 
        userId: userId,
        visitedDate:{$gte:start, $lte: end}, 
    }).sort({isFavourite: -1}); 
    res.status(200).json({stories: filteredStories}); 
}catch(error){ 
    res.status(500).json({error: true, message: error.message});
}
});
//statik dosya 
app.use("/uploads",express.static(path.join(__dirname,"uploads")));
app.use("/assets",express.static(path.join(__dirname,"assets")));
app.listen(8000); 
module.exports = app;