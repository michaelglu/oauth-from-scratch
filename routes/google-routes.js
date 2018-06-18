

const http=require("https");
const {google} = require('../configs/keys');
const googleAuthRoute=`https://accounts.google.com/o/oauth2/auth?access_type=offline&redirect_uri=${google.redirectURIEncoded}&response_type=code&client_id=${google.clientID}&scope=${google.scope}`;

// const jwtParser=(token)=> {
//             let base64Url = token.split('.')[1];
//             let base64 = base64Url.replace('-', '+').replace('_', '/');
//         };

const googleResourceRoute=(accessToken)=>{
  return new Promise((resolve,reject)=>{
    //https://www.googleapis.com/userinfo/email
    //https://www.googleapis.com/oauth2/v2/userinfo

    let options ={
      "method": "GET",
      "hostname": "www.googleapis.com",
      "path":"/oauth2/v2/userinfo",// /userinfo/email or/oauth2/v2/userinfo
      "headers": {
      "Authorization": `Bearer ${accessToken}`
      }
    }
    let req = http.request(options, function (res) {
      let chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        let body = Buffer.concat(chunks);
        let sbody=body.toString();
        let jbody=JSON.parse(sbody);
          resolve(jbody);
        },(error)=>{
          reject(error);
        });
      });
      req.end();
  });
};
const googleTokenRoute=(code)=>{
  return new Promise((resolve,reject)=>{
    let options = {
  "method": "POST",
  "hostname": "accounts.google.com",
  "path":"/o/oauth2/token",
  "headers": {
    "content-type": "multipart/form-data; boundary=----BREAK",
    "host": "accounts.google.com"
  }
};
let req = http.request(options, function (res) {
  let chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    let body = Buffer.concat(chunks);
    let jbody=JSON.parse(body);
    // jwtParser(jbody.id_token);
    googleResourceRoute(jbody.access_token).then((profile)=>{
      resolve(profile);
    },(error)=>{
      reject(error);
    });
  });
  res.on('error',(error)=>{
    reject(error);
  })
});
//HTTP Protocol, multiline body needs to be sent with specified encodings for boundaries
req.write(`------BREAK\r\nContent-Disposition: form-data; name=\"grant_type\"\r\n\r\nauthorization_code\r\n`);
req.write(`------BREAK\r\nContent-Disposition: form-data; name=\"code\"\r\n\r\n${code}\r\n`);
req.write(`------BREAK\r\nContent-Disposition: form-data; name=\"redirect_uri\"\r\n\r\n${google.redirectURI}\r\n`);
req.write(`------BREAK\r\nContent-Disposition: form-data; name=\"client_id\"\r\n\r\n${google.clientID}\r\n`)
req.write(`------BREAK\r\nContent-Disposition: form-data; name=\"client_secret\"\r\n\r\n${google.clientSecret}\r\n`);
req.write(`------BREAK--`);
req.end();
  });
};

module.exports = {googleTokenRoute,googleAuthRoute};
