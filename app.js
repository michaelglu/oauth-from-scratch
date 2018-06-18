const express = require('express');
const request=require('request');
const app=express();
const {googleTokenRoute,googleAuthRoute}=require('./routes/google-routes');
const{facebookAuthRoute,facebookTokenRoute}=require('./routes/facebook-routes');

app.set('view engine', 'pug');

app.get('/',(req,res)=>{
  res.send('/login-google for google or /login-facebook for Facebook');
});

app.get('/login-google',(req,res)=>
{
    res.redirect(googleAuthRoute);
});

app.get('/googlecallback',(req,res)=>{
  let code=req.query.code;
  googleTokenRoute(code).then((profile)=>{
    res.render('googleView',{id:profile.id,email:profile.email,name:profile.name,link:profile.link,picture:profile.picture});
  },(error)=>{
    res.send('Something went wrong');
  })
});

app.get('/login-facebook',(req,res)=>{
  res.redirect(facebookAuthRoute);
});

app.get('/facebookcallback',(req,res)=>{
  facebookTokenRoute(req,res).then((profile)=>{
    let jprofile=JSON.parse(profile);
      res.render('facebookView',{id:jprofile.id,email:jprofile.email,name:jprofile.name});
  },(error)=>{
    res.send('Something went wrong');
});}
);

app.listen(process.env.PORT||3000,()=>{
  //console.log(`Listening on 3000`);
});
