var sha1 = require('../../utils/sha1.js');
const app = getApp();
var url = app.data.url;
// var url = "http://172.16.41.145:8088";
Page({
  data: {
    bannerURL:''
  },

  onLoad: function (option) {
    console.log(option.bannerURL)
    this.setData({
      bannerURL:option.bannerURL
    })
  },

})




