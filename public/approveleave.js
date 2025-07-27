document.addEventListener("DOMContentLoaded",()=>{
  const container=document.getElementById("dynamic-container");
  fetch("/route/getAllTeacherLeaves")
  .then(res=>res.json())
  .then((leaveRequest)=>{
   if(!Array.isArray(leaveRequest)|| leaveRequest.length===0){
    container.innerHTML="<p>No leave requests found</p>";
    return;
   }
   const grouped=[];
   leaveRequest.forEach((req)=>{
    let existing=grouped.find(item=>item.email===req.email);
    if(existing){
    existing.requests.push(req);
    }
    else{
      grouped.push({email:req.email,requests:[req]});
    }
   })
  grouped.forEach((teacher)=>{
   const emailDiv=document.createElement("div");
   emailDiv.className="teacher-email-block";
   emailDiv.innerHTML=`<h3>${teacher.email}</h3>`;
   teacher.requests.forEach((req)=>{
    const timetable=Array.isArray(req.timetableForDate)?`<ul>`+req.timetableForDate.map(lec=>
     `<li> <strong>Lecture:</strong> ${lec.lecture} |
      <strong>Subject:</strong> ${lec.subjectName} |
      <strong>Room:</strong> ${lec.roomNo} |
      <strong>Time:</strong> ${lec.startTime} - ${lec.endTime} </li>`).join("")+`</ul>`:"<li>No timetable found.</li>";
       
      const buttonDiv=document.createElement("div");
 buttonDiv.className="buttonDiv";
 const buttonList=document.createElement("button");
 buttonList.textContent="Available Teachers";
 buttonList.className="left-button";
 const approvebtn=document.createElement("button");
 approvebtn.textContent="Approve";
 approvebtn.className="right-button";
 buttonDiv.appendChild(buttonList);
 buttonDiv.appendChild(approvebtn);
        const singleDiv=document.createElement("div");
        singleDiv.className="leave-request";
   singleDiv.innerHTML=`<strong>Date:</strong>${req.date}<br> <strong>Reason:</strong>${req.reason}<br>
   <strong>Timetable:<strong>${timetable}`;
   
   singleDiv.appendChild(buttonDiv);
      emailDiv.appendChild(singleDiv);


      buttonList.addEventListener("click",()=>{
        fetch("/route/getAllTeacherData")
        .then(res=>res.json())
        .then((teacherData)=>{
          const leaveDate=req.date;
          const freeTeachers=[];
          teacherData.forEach(teacher=>{
            const teacherEmail =teacher.email;
            const timetable=teacher.timetable||[];
            const isMatch=req.timetableForDate.some(leaveLec=>{
              return timetable.some(lec=>
                lec.day===leaveLec.day && lec.lecture === leaveLec.lecture &&
                      lec.startTime === leaveLec.startTime &&
                      lec.endTime === leaveLec.endTime
              )
            });
            if(!isMatch && !freeTeachers.includes(teacher.email)){
               freeTeachers.push(teacher.email);
            }
          });
          const modal = document.getElementById("modal");
          const modalBody=document.getElementById("modal-body");
           modalBody.innerHTML = ""; 
          // const resultDiv=document.createElement("div");
          // resultDiv.classname="resultDiv";
          // resultDiv.innerHTML=`<strong>Free Teachers on ${req.date}:</strong>`;
          if(freeTeachers.length>0){
            // const grid=document.createElement("div");
            // grid.classname="teacher-grid";
            freeTeachers.forEach(email=>{
              const card=document.createElement("div");
              card.className="teacher-card";
              card.innerHTML=`<p>${email}</p><button class='sendRequest'>Send Request</button>`;
              modalBody.appendChild(card);
            });
            // resultDiv.appendChild(grid);
          }
          else{
            modalBody.innerHTML="<p>No teachers available</p>";
          }
          modal.style.display = "block";
          // singleDiv.appendChild(resultDiv);
        })
      })
   })
      container.appendChild(emailDiv);
  })
});
const modal=document.getElementById("modal");
const closebtn=document.querySelector(".close-button");
closebtn.addEventListener("click",()=>{
  modal.style.display="none";
})
   })
  