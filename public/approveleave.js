const leaveRequests = [
      { teacher: 'Mr. Sharma', date: '2025-07-28', reason: 'Medical' },
      { teacher: 'Ms. Gupta', date: '2025-07-29', reason: 'Personal Work' },
      { teacher: 'Mr. Roy', date: '2025-07-30', reason: 'Family Function' }
    ];
    const container=document.getElementById("dynamic-container");
   leaveRequests.forEach(req => {
      const div=document.createElement("div");
    div.style.border='1px solid gray';
    div.style.margin='10px 0px';
    div.style.padding='8px';
    div.innerHTML=`<strong>Teacher<strong>:${req.username}<br><strong>Date<strong>:${req.date}<br><strong>Reason<strong>:${req.reason}`;
    container.appendChild(div);
   });