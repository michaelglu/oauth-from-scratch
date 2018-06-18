const request=require('request');
const keys = require('../configs/keys');

const facebookAuthRoute=`https://www.facebook.com/dialog/oauth?client_id=${keys.facebook.AppID}&redirect_uri=${keys.facebook.redirectURIEncoded}`;
const facebookResourceRoute=(accessToken)=>{
  return new Promise((resolve,reject)=>{
    request({ method: 'GET',
      url: 'https://graph.facebook.com/v2.12/me?fields=id%2Cname%2Cemail',
      headers:
       {
         Authorization: `Bearer ${accessToken}` ,
         redirect_uri: keys.facebook.redirectURIEncoded
       }},(error, response, body) =>{
      if (error) {reject(error);}
      else{resolve(body);}
    });
  });
}

const facebookTokenRoute=(req,res)=>{
return new Promise((resolve,reject)=>{
  request( { method: 'POST',
  url: 'https://graph.facebook.com/v2.4/oauth/access_token',
  headers:
   {
     host: "graph.facebook.com",
     "content-type": "application/x-www-form-urlencoded" },
  formData:
   { grant_type: "authorization_code",
     code: req.query.code,
     redirect_uri: "http://localhost:3000/facebookcallback",
     client_id: keys.facebook.AppID,
     client_secret: keys.facebook.AppSecret } },
       (error, response, body)=> {
  if (error) {reject(error)};
  let jbody=JSON.parse(body);
  facebookResourceRoute(jbody.access_token).then((profile)=>{
    resolve(profile);
  },(error)=>{
    reject(error);
  });
});
});
};


module.exports = {facebookAuthRoute,facebookTokenRoute};
