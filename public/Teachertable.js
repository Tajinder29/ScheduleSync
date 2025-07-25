//import { upload } from "../controller/multerConroller";

const emailSelect=document.getElementById("select");
const username=localStorage.getItem("username");
const loginEmail=localStorage.getItem("loginEmail");
document.getElementById("username").innerText=username;
const profileImage =document.getElementById("profilePic");
const uploadPopup=document.getElementById("uploadPopup");
profileImage.addEventListener("click",function(event){
    if(uploadPopup.style.display==="none"){
        uploadPopup.style.display="block";
    }
    else{
        uploadPopup.style.display="none";
    }
})
document.addEventListener("click",function(event){
if(!uploadPopup.contains(event.target) && event.target!==profileImage){
    uploadPopup.style.display="none";
}
});


function loadImage(){
    fetch(`/route/getUserImage/${loginEmail}`)
.then(res=>res.json())
.then(data=>{
    if(data.imageUrl){
        document.getElementById("profilePic").src=data.imageUrl;
    }
});
} 
loadImage();
document.getElementById("uploadForm").addEventListener("submit", function(e){
    e.preventDefault();
    const formData=new FormData();// includes image & email
    formData.append("profilePic",document.getElementById("profileImageInput").files[0]);
    // formData.append("email", loginEmail);
     fetch(`/route/uploadImage?email=${loginEmail}`,{///route/uploadImage
        method:"POST",
    body: formData
    })
    .then(res=>res.json())
    .then(data=>{
        alert("Image Uploaded");
        document.getElementById("profilePic").src = data.imageUrl;
         document.getElementById("uploadPopup").style.display = "none";
    })
    .catch(err => {
        console.error(err);
        alert("Failed to upload image");
    });

})



function ShowData(selectedEmail){
    document.querySelectorAll("td[id*='Lecture']").forEach(td => td.innerHTML = "");
    fetch(`/route/getTimetable/${selectedEmail}`)
    .then(res=>res.json())
    .then(timetable=>{
        timetable.forEach(item => {
            const cellId=`${item.day}-${item.lecture}`;
            const cell=document.getElementById(cellId);
            if(cell){
                cell.innerHTML=`${item.subjectName}<br>Room:${item.roomNo}`;
            }
        });
    })
}
function logout(){
    fetch("/route/logout")
    .then(res=>{
        if(res.redirected){//agar server side pe login page redirect hua hai to ise true assign hoga 
            window.location.href=res.url;//res.url contain the full url like http://localhost:3000/login.html
        }
    });
}

window.onload=function(){
            const loginEmail = localStorage.getItem("loginEmail");
            if(loginEmail){
                ShowData(loginEmail);
            }
        };