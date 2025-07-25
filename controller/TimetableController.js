import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const timetablePath=path.join(__dirname,'../Data/data.json');
const teacherPath =path.join(__dirname,'../Data/teacher.json');
const readData = () => {
    if (!fs.existsSync(timetablePath)) return [];
    const fileData = fs.readFileSync(timetablePath, 'utf-8');
    try {
        return JSON.parse(fileData); 
    } catch (err) {
        console.error('Invalid JSON:', err);
        return []; 
    }
};
const writeData = (data) => {
    fs.writeFileSync(timetablePath, JSON.stringify(data, null, 2), 'utf-8');
};

const writeTeacherData =(data)=>{
    fs.writeFileSync(teacherPath,JSON.stringify(data,null,2),'utf-8');
}
export const updateTimetable=(req,res)=>{
    const { email, day,date, lecture, subjectName, roomNo,startTime,endTime}=req.body;
    let users=readData();
    const duplicate=users.some(user => user.email!==email && 
        user.timetable?.some(u=>u.day===day && u.lecture===lecture && u.roomNo===roomNo));
        if(duplicate){
           return res.status(400).json({message:"This room no. is already assign to another techer"});
        }
    let user=users.find(u => u.email === email);
   if (!user) {
     user = { email, timetable: [] };
        users.push(user);
        
    }
    let exist=user.timetable.find(item=>item.day==day && item.lecture===lecture);
    if(exist){
        exist.subjectName=subjectName;
        exist.roomNo=roomNo;
        exist.startTime=startTime;
        exist.endTime=endTime;
    }
    else{
        user.timetable.push({day,date,lecture,subjectName,roomNo,startTime,endTime});
    }
    writeData(users);
    res.status(200).json({ message: "Timetable updated successfully!" });
}
export const getTimetable=(req,res)=>{
    const email=req.params.email;
    let users=readData();
    let user=users.find(u=>u.email===email);
    if(!user) return res.status(404).json({message:"Teacher Not Found!"});
    if(!Array.isArray(user.timetable)) user.timetable = [];
    res.status(200).json(user.timetable);
}
export const getdata=(req,res)=>{
     
    const {email,date,reason}=req.body;
    const allUsers=readData();
    const user=allUsers.find(u=>u.email===email);
    if(!user){
        res.status(404).json({message:"Teacher not found"});
    }
    const timetableForDate=user.timetable?.filter(item=>item.date===date)||[]; 
    const leaveData={
        email,
        date,
        reason,
        timetableForDate
    }
    let teacherData=[];
    if(fs.existsSync(teacherPath)){
    teacherData=JSON.parse(fs.readFileSync(teacherPath,'utf-8'));
    }
    teacherData.push(leaveData);
    writeTeacherData(teacherData);
  res.status(200).json({message:"Leave applied and data saved successfully!"});
}

