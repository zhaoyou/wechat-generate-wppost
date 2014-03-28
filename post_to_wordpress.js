
var wp = require('wporg');
var request = require('request');
var async = require('async');
var nconf = require('nconf');


var client = wp.createClient({
    username: nconf.get('wp_user'),
    password: nconf.get('wp_password'),
    url: nconf.get('wp_url') + "/xmlrpc.php"
});


downloadImage = function(name, url, callback) {
  var requestSettings = {
    method: 'GET',
    url: url,
    encoding: null
  };

  request(requestSettings, function(error, response, body) {
          // Use body as a binary Buffer
    //callback(name, body)
    client.uploadFile({
        name: name || 'img_dl_navicatMySQL.png',
        type: 'image/png',
        bits: body
    }, function(err, data) {
      console.log(err, data);
      callback(null, data);
    });
  });
}


postToWP = function(name, ids, cb) {
  client.newPost({
      post_title: name || 'post from node.js',
      post_content: ids && ids.length > 0 ? '[gallery ids="' + ids.join(',') + '"]' : '[gallery ids="40,41"]',
      post_status: 'publish',
      post_author: 'hadeser'
  }, function(err, data) {
    console.log(err, data);
    cb(data);
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

  //downloadImage('http://www.navicat.com.cn/images/stories/download/img_dl_navicatMySQL.png', uploadToWP)
}

exports.save = function(picArrays, reply_callback) {

  var i = 0;
  var callbackFuncs = [];
  var func;
  //var picArrays = [
  //  {'name': 'pic-btc-1.png', 'url': 'http://www.btcside.com/File/News/SmallSrc/2014032615/20140326150055_1004.jpg'},
  //  {'name': 'pic-btc-2.jpg', 'url': 'http://www.btcside.com/File/News/SmallSrc/2014032615/20140326152132_5380.jpg'},
  //  {'name': 'pic-btc-3.jpg', 'url': 'http://www.btcside.com/File/News/SmallSrc/2014032512/20140325125502_7900.jpg'}

  //];
  console.log('picarrays: ', picArrays)
  for(; i < picArrays.length; i++) {
    var name = picArrays[i].name;
    var url = picArrays[i].url;
    func =  makeCallbackFunc(name, url);
    callbackFuncs.push(func);
  }

  async.parallel(callbackFuncs, function(err, result) {
    console.log('downloadImage: ', err, result);
    var ids = [];
    var k = 0;
    for(; k < result.length; k++) {
      ids.push(result[k].id);
    }
    postToWP('Post from WeChat Robot ' + new Date().toTimeString() , ids, function(data) {
      var url = nconf.get('wp_url') + '/?p=' + data
      console.log('postToWP Success: ', url);
      reply_callback(url)
    });
  });
}

function makeCallbackFunc(name, url) {
  return function(callback) {
    downloadImage(name, url, callback)
  }
}



