let button=document.getElementById("button");
        button.addEventListener("click",function(){
          window.location.href="/admin";
        })
        const emailSelect=document.getElementById("select");
        function updateTimetable(email, day, lecture, subjectName, roomNo){
         fetch("/route/updateTimetable",{
           method:"POST",
           headers:{"Content-type":"application/json"},
           body:JSON.stringify({email, day, lecture, subjectName, roomNo})
         })
         .then(res=>res.json()) 
         .then(data=>console.log("Data is found"))
         .catch(err=>console.log(err));
        }
        function renderEmail(selectedEmail){
            document.querySelectorAll("td[id*='Lecture']").forEach(td => td.innerHTML = "");
            fetch(`/route/getTimetable/${selectedEmail}`)
            .then(res=>res.json())
            .then(timetable=>{
            timetable.forEach(item =>{
                    const cellId=`${item.day}-${item.lecture}`;
                 const cell=document.getElementById(cellId);
                 if(cell){
                    cell.innerHTML=`${item.subjectName}<br> Room: ${item.roomNo}`;
                cell.onclick=function(){
                    document.getElementById("subjectInput").value=item.subjectName;
                    document.getElementById("roomInput").value=item.roomNo;
                    document.getElementById('currentDay').value=item.day;
                    document.getElementById("currentLecture").value=item.lecture;
                    new bootstrap.Modal(document.getElementById("editModal")).show();
                }
                }
                    
            });
            })
            .catch(err=>console.log(err));
            
        }

        document.getElementById("saveBtn").addEventListener("click",function(){
         const subject=document.getElementById("subjectInput").value;
         const room=document.getElementById("roomInput").value;
         const day= document.getElementById('currentDay').value;
         const lecture= document.getElementById("currentLecture").value;
         const selectedEmail =emailSelect.value;
         const cellId=`${day}-${lecture}`;
         const cell=document.getElementById(cellId);
          cell.innerHTML=`${subject}<br> Room:${room}`;
         updateTimetable(selectedEmail, day, lecture, subject, room);
         bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
         
        })

        window.onload=function(){
            const selectedEmail = localStorage.getItem("selectedEmail")||emailSelect.value;
            if(selectedEmail){
                emailSelect.value=selectedEmail;
                renderEmail(selectedEmail);
            }
        };
        
        emailSelect.addEventListener("change",function(){
            const newEmail=this.value;
            localStorage.setItem("selectedEmail",newEmail);
            renderEmail(newEmail);
        });