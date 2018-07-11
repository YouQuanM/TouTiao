Page({
  backIndex:function(){
    wx.navigateTo({
      url: '../index/index',
    })
  },
  onShareAppMessage: function () {
    return {
      title: '租得省心,住得舒心',
      imageUrl: '../../images/share_img.png',
      path: 'pages/yySuccess/yySuccess'
    }
  }
})