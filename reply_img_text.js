var wp = require('./post_to_wordpress');

exports.postForReply = function(pics, callback) {
  wp.save(pics, function(url) {
    callback(null, [{
        title: 'WeChat Reply Message',
        description: 'WeChat description',
        picurl: pics[0].url,
        url: url
      }
    ]);
  });
}
