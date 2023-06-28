
var fbsdk = require('facebook-sdk');

var facebook = new fbsdk.Facebook({
  appId  : '597433674805580',
  secret : '3faa0a1afcbf3f240f8a715b26c575bf'
});

facebook.api('/597433674805580', function(data) {
  console.log(data);
});