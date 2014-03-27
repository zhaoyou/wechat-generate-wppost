
var wp = require('wporg');
var request = require('request');

var client = wp.createClient({
    username: "hadeser",
    password: "zy",
    url: "http://10.88.0.71/xmlrpc.php"
});


downloadImage = function(url, callback) {
  var requestSettings = {
    method: 'GET',
    url: url,
    encoding: null
  };

  request(requestSettings, function(error, response, body) {
          // Use body as a binary Buffer
    callback(body)
  });
}

uploadToWP = function(data) {
  client.uploadFile({
      name: 'img_dl_navicatMySQL.png',
      type: 'image/png',
      bits: data
  }, function(err, data) {
    console.log(err, data);
  });

}

postToWP = function() {
  client.newPost({
      post_title: 'post from node.js',
      post_content: '[gallery ids="40,41"]',
      post_status: 'publish',
      post_author: 'hadeser'
  }, function(err, data) {
    console.log(err, data);
  });
}

exports.test = function() {
  //client.getUsersBlogs(function(err, data){
  //    if(err){
  //        console.log(err);
  //    }
  //    else {
  //        console.log(data);
  //        // Do something.
  //    }
  //});

  //client.getPost("7", function(err, data) {
  //  console.log(err, data);
  //});

  downloadImage('http://www.navicat.com.cn/images/stories/download/img_dl_navicatMySQL.png', uploadToWP)
}

exports.save = function(picArrays) {
  console.log('picarrays: ', picArrays)
  return 'http://nodejs.org'
}
