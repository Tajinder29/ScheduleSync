import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const DataFilePath=path.join(__dirname,'../Data/data.json');
const readData=()=>{
    if(!fs.existsSync(DataFilePath))return [];
    const fileData=fs.readFileSync(DataFilePath,"utf-8");

   try {
        return JSON.parse(fileData);
    } catch (error) {
        console.error("Invalid JSON:", error);
        return [];
    }
}
const writeData=(data)=>{
  fs.writeFileSync(DataFilePath,JSON.stringify(data,null,2),'utf-8');
   
}

export const signup=(req,res)=>{
 const {email,password,role}=req.body;
 let Data=readData();
Data.push({email, password, role, timetable: []});
 writeData(Data);
 res.status(200).json({message:"Signup successful!"})
};
export const login=(req,res)=>{
    const {email,password,role}=req.body;
    let Data=readData();
  const User=Data.find(user=>user.email===email && user.password===password && user.role===role);
  if(User){
     req.session.isAuthentication = true;
    // req.session.User = User;
    req.session.User={ email:User.email , role:User.role};
    res.status(200).json({ message: "Login successful!" ,role:User.role});
  }
  else{
    res.status(401).json({message:"Invalid Credentials!"});
  }

};

export const logout=(req,res)=>{
  req.session.destroy((err)=>{
    if(err){
      console.log(err);
      return res.status(500).send("logout failed");
    }
  
   res.clearCookie("connect.sid");
    res.redirect("/login");
    
    
    
  })
 
}
