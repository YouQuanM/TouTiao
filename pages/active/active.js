var sha1 = require('../../utils/sha1.js');
var util = require('../../utils/promise.util.js');
const app = getApp();
var url = app.data.url;
Page({
  data: {
    animationData: {},
    box_bg:{},
    rule: false,
    rule_word:false,
    receive_success:false,
    opacitys: 0,
    canvas: true,
    hidden: true,
    userMobile:'',
    userNickname:'',
    userId:'',
    userAvatar:'',
    head_img:'',
    user_name:'',
    status:'',
    remain_time:''
  },

  onLoad: function (option) {
    var that = this;
    
    try {
      var value1 = wx.getStorageSync('userMobile')
      var value2 = wx.getStorageSync('userNickname')
      var value3 = wx.getStorageSync('userId')
      var value4 = wx.getStorageSync('userAvatar')
      that.setData({
        userMobile: value1,
        userNickname: value2,
        userId: value3,
        userAvatar: value4
      })
      
    } catch (e) {
      console.log(e)
    }
   
    if (that.data.userId !== ''){
      that.user_status();
    }

    var obj_token = app.sha_token({
      app_id: "wx024695259e1a68cb",
      city_id: '',
      user_id: that.data.userId,
    });
    
    var scene_to = 'user_id=' + value3
    console.log(scene_to)
    var info = {
      "scene": scene_to,
      "width": "250",
      "page": "pages/active_cb/active_cb",
      "app": 1,
      "line_color": {
        "r": "0",
        "g": "0",
        "b": "0"
      }
    }
    
    var act_src = app.data.url + '/web-api/wechat-applets/two-code?app_id=wx024695259e1a68cb&city_id=&user_id=' + that.data.userId + '&sign=' + obj_token + '&info=' + JSON.stringify(info);

    var src = act_src
    console.log(src)
    let promise1 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: src,
        success: function (res) {
          console.log(res)
          resolve(res);
        }
      })
    });
    let promise2 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: '../../images/photo.png',
        success: function (res) {
          console.log(res)
          resolve(res);
        }
      })
    });
    Promise.all([
      promise1, promise2
    ]).then(res => {
      console.log(res)
      const ctx = wx.createCanvasContext('shareCanvas')

      //主要就是计算好各个图文的位置
      ctx.drawImage('../../' + res[1].path, 0, 0, 272.5, 480)
      ctx.drawImage(res[0].path, 178, 350, 60, 60)
      ctx.setTextAlign('center')
      ctx.setFillStyle('#ffffff')
      ctx.setFontSize(16)
      ctx.fillText(value2 + '：', 50, 60)
      ctx.stroke()
      ctx.draw()
    })


    console.log(that.data.userMobile)
    console.log(that.data.userNickname)
    console.log(that.data.userId)
    console.log(that.data.userAvatar)
  },

  clickRule:function(){
    this.setData({
      rule:true,
      rule_word:true
    })
  },
  close:function(){
    this.setData({
      rule: false,
      rule_word:false
    })
  },
  receive:function(){
    var that = this;
  if (that.data.userId == ''){
      wx.showModal({
        content: '登录后才可以抽奖哟~',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '../login/login?active=1'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
    that.setData({
      receive_success: true,
    })

    that.receive_animation()

    setTimeout(function () {
      that.box_bg()
    }, 1000)

    var opacitys = that.data.opacitys
    setTimeout(function () {
      var interval = setInterval(function () {
        if (((opacitys++) / 10) >= 1) {
          clearInterval(interval)
          that.setData({
            opacitys: 1,
          })
        } else {
          that.setData({
            opacitys: ((opacitys++) / 10)
          })
        }
      }, 100)
    }, 600)

    that.join_activity();
    }
  },
  receive_animation:function(){
    var animation = wx.createAnimation({
      duration: 20,
      timingFunction: 'linear',
    })

    this.animation = animation

    // animation.scale3d(0.5, 0.5).step()
    // animation.scale3d(0.6, 0.6).step()
    // animation.scale3d(0.7, 0.7).step() 
    // animation.scale3d(0.8, 0.8).step()
    // animation.scale3d(0.9, 0.9).step()
    // animation.scale3d(1.0, 1.0).step()

    animation.scale3d(1.0, 1.0).step()
    // animation.scale3d(1.1, 1.1).step()
    animation.scale3d(1.2, 1.2).step()
    // animation.scale3d(1.3, 1.3).step()
    animation.scale3d(1.4, 1.4).step()
    // animation.scale3d(1.5, 1.5).step()
    animation.scale3d(1.6, 1.6).step()
    // animation.scale3d(1.7, 1.7).step()
    animation.scale3d(1.8, 1.8).step()
    // animation.scale3d(1.9, 1.9).step()
    animation.scale3d(2.0, 2.0).step()

    console.log(this.data.receive_success)
    if (this.data.receive_success) {
      this.setData({
        animationData: animation.export()
      })
    }
  },

  box_bg:function(){
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation
    this.setData({
      animationData: animation.export()
    })  
    var n = 0;
    var m = true;
    //连续动画需要添加定时器,所传参数每次+1就行  
    setInterval(function () {
      n = n + 1;
      if (m) {
        this.animation.rotate(30 * (n)).step()
        m = !m;
      } else {
        this.animation.rotate(30 * (n)).step()
        m = !m;
      }
      this.setData({
        box_bg: this.animation.export()
      })
    }.bind(this), 600)
  },


  onShareAppMessage: function (res){
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    if (res.from === 'menu') {
      console.log(res.target)
    }
    return {
      title: '就差你了，快来帮我拆礼包！',
      path: "pages/active_cb/active_cb",
      // path: "pages/active_cb/active_cb?public_id=" + this.data.public_id + "&rent_type=" + this.data.rentTypeShare + "&from_app=",
      imageUrl:'../../images/active_share.png',
      success: function (res) {
        console.log(res)
      },
      fail: function (err) {
        console.log(err)
      }
    }
  },
  receive_close:function () {
    wx.reLaunch({
      url: '../active_cb/active_cb'
    })
  },


  /**
   * 生成分享图
  */
  share: function () {
    var that = this
    wx.showLoading({
      title: '努力生成中...'
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 750,
      height: 1334,
      // destWidth: 750,
      // destHeight: 1334,
      canvasId: 'shareCanvas',
      success: function (res) {
        console.log(res);
        console.log(res.tempFilePath);
        that.setData({
          prurl: res.tempFilePath,
          hidden: false
        })
        wx.hideLoading()
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  /**
   * 保存到相册
  */
  save: function () {
    var that = this
    //生产环境时 记得这里要加入获取相册授权的代码
    wx.saveImageToPhotosAlbum({
      filePath: that.data.prurl,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好哒',
          confirmColor: '#72B9C3',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              that.setData({
                hidden: true
              })
            }
          }
        })
      }
    })
  },


  join_activity:function(){
    var that = this;
    var obj_token = app.sha_token({
      app_id: "wx024695259e1a68cb",
      city_id: '',
      user_id: that.data.userId
    });
    wx.request({
      url: app.data.url + "/web-api/wechat-applets/join-activity",
      method: 'POST',
      data: {
        app_id: "wx024695259e1a68cb",
        city_id: "",
        sign: obj_token,

        user_id: that.data.userId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (!res.data.data.success){
          wx.showToast({
            title: res.data.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  user_status:function(){
    var that = this;
    var obj_token2 = app.sha_token({
      app_id: "wx024695259e1a68cb",
      city_id: '',
      user_id: that.data.userId
    });
    wx.request({
      // url: 'http://172.16.50.49:8000/web-api/wechat-applets/activity-user-info',
      url: app.data.url + "/web-api/wechat-applets/activity-user-info",
      method: 'GET',
      data: {
        app_id: "wx024695259e1a68cb",
        city_id: "",
        sign: obj_token2,

        user_id: that.data.userId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        // var userInfo_string = JSON.stringify(res.data);
        if (res.data.data.status == 1){
            
        } else if (res.data.data.status !== 1){
          wx.reLaunch({
            url: '../active_cb/active_cb'
          })
        }
      
        // console.log(userInfo_string)
        // console.log(JSON.parse(userInfo_string))
        // if (res.data.success){
        //   console.log(res)
        //   console.log(res.data.data.status)
        //   that.setData({
        //     head_img: res.data.data.user_info.images,
        //     user_name: res.data.data.user_info.name,
        //     status: res.data.data.status,
        //     remain_time: res.data.data.remain_time
        //   })
        // }

      },
      fail: function (res) {
        console.log(res)
      }
    })
  }

  
})




