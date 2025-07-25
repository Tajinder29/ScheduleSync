export function isAuthentication(req,res,next){
if(req.session.User){
    next();
}
else{
     res.redirect("/login.html");
}
}
export function isAdmin(req,res,next){
    if(req.session.User && req.session.User.role==="Admin"){
    next();
    }
    else{
        res.status(403).send("Access denied: Admins only");
    }
}
export function isTeacher(req,res,next){
    if(req.session.User && req.session.User.role==="Teacher"){
     next();
    }
    else{
        res.status(403).send("Access denied: Teacher only");
    }
}
