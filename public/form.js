// const date=document.getElementById("date").value;
// const reason=document.getElementById("textarea").value;
// localStorage.setItem("date",date);
// localStorage.setItem("reason",reason);
// const loginEmail=localStorage.getItem("loginEmail");
// console.log(loginEmail);
document.getElementById("leaveForm").addEventListener("submit",function(e){
    e.preventDefault();
    const date=document.getElementById("date").value;
const reason=document.getElementById("textarea").value;
const loginEmail=localStorage.getItem("loginEmail");
if(!loginEmail ){
    alert("login first");
    return;
}
if( !date || !reason){
    alert("fill date and reason");
    return;
}
    fetch("/route/getdata",{
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify({email:loginEmail,date,reason})
    })
    .then(res=>res.json())
    .then(data=>{
        alert("data submit");
        console.log(data.message);
    })
    .catch(err=>{
        console.log(err);
        alert("something is wrong");
    })
window.location.href="/Teachertable";
})
