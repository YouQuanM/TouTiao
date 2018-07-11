var sha1 = require('../../utils/sha1.js');
const app = getApp();
var url = app.data.url;
Page({
  data: {
    animationData: {},
    box_bg:{},
    rule: false,
    rule_word:false,
    isScroll: true,
    countDownHour: '00',
    countDownMinute: '00',
    countDownSecond: '00', 
    act_data:'',
    owen_head:'',
    owen_name:'',
    remain_time:'',
    friends_num:'',
    no_friend:true,
    friend_list: false,
    no_one_cha: true,
    have_cha: false,
    canvas: true,
    hidden: true,
    btn_share:true,
    topNum: 0,
    user_id:'',
    owner_id:'',
    wancheng:false,
    other: false,
    is_help_bg:'',
    // other_text:'帮Ta拆礼包',
    other_is_onoff:false,
    overdue_onoff: false,
    head_part:true,
    line_bg:'',
    pro_width:'',
    roll_word_list:[],
    num_pro:'',
    num_top:'',
    receive_success:false,
    opacitys: 0,
    progress:true,
    word_line_fin:false,
    goto_coupon:false,
    fin_yes: false,
    fin_no: true,
    count_down:true,
    bang_chai:true,
    chai_success:false,
    already:false,

  },

  onLoad: function (option) {
    var that = this;
    var scene = decodeURIComponent(option.scene)
    var owner_fin = option.owner
    console.log(typeof (owner_fin))
    // var scene = 'user_id=92'
    // var owner_fin = 92
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
    that.roll_word();
   
    if (scene !== 'undefined'){
      console.log(111)
      var owner = scene.split('=')
      var owner_id = owner[1]
      if (that.data.userId == ''){
        that.setData({
          userId: 0
        })
      }
      that.setData({
        owner_id: owner_id,
        other:true,
        wancheng:false,
        btn_share:false,
      })
      that.other_info();
    } else if (owner_fin !== undefined){
      console.log(222)
      var owner_id = owner_fin
      console.log(that.data.userId)
      if (that.data.userId == '') {
        that.setData({
          userId: 0
        })
      }
      that.setData({
        owner_id: owner_id,
        other: true,
        wancheng: false,
        btn_share: false,
      })
      that.other_info();
    }else{
      that.user_status();
    }
    
    var obj_token = app.sha_token({
      app_id: "wx024695259e1a68cb",
      city_id: '',
      user_id: that.data.userId,
    });

    var scene_to = 'user_id=' + value3
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
    // var src ="../../images/box1.png"
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
      ctx.fillText(that.data.userNickname + '：', 50, 60)
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
      rule_word:true,
      isScroll: false
    })
  },
  close:function(){
    this.setData({
      rule: false,
      rule_word:false,
      isScroll: true
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    if (res.from === 'menu') {
      console.log(res.target)
    }
    return {
      title: '就差你了，快来帮我拆礼包！',
      path: "pages/active_cb/active_cb?owner=" + this.data.userId,
      // path: "pages/active_cb/active_cb?public_id=" + this.data.public_id + "&rent_type=" + this.data.rentTypeShare + "&from_app=",
      imageUrl: '../../images/active_share.png',
      success: function (res) {
        console.log(res)
      },
      fail: function (err) {
        console.log(err)
      }
    }
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
          hidden: false,
          topNum: that.data.topNum = 0,
          isScroll:false,
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
                hidden: true,
                isScroll: true,
              })
            }
          }
        })
      }
    })
  },

  other_info:function(){
    var that = this;
    var obj_token = app.sha_token({
      app_id: "wx024695259e1a68cb",
      city_id: '',
      // owner: that.data.owner_id,
      user_id: that.data.userId
    });
    wx.request({
      url: app.data.url + "/web-api/wechat-applets/activity-other-info",
      method: 'GET',
      data: {
        app_id: "wx024695259e1a68cb",
        city_id: "",
        sign: obj_token,
        owner_id: that.data.owner_id,
        user_id: that.data.userId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        console.log(res.data.data.status)
        if (res.data.data.status == 2) {
          if (res.data.data.friends.length !== 0) {
            that.setData({
              no_friend: false,
              friend_list: true
            })
          } else {
            that.setData({
              no_friend: true,
              friend_list: false
            })
          }

          if (res.data.data.friends_num == 0) {
            that.setData({
              no_one_cha: true,
              have_cha: false,
            })
          } else {
            that.setData({
              no_one_cha: false,
              have_cha: true,
            })
          }
          that.setData({
            // chai_success:true,
            have_cha:true,
            owen_head: res.data.data.user_info.images,
            owen_name: res.data.data.user_info.name,
            remain_time: res.data.data.remain_time,
            friends_num: (10 - res.data.data.friends_num),
            friend: res.data.data.friends,
            pro_width: (7 + 9 * res.data.data.friends_num),
            head_widht: (12 + 7.2 * res.data.data.friends.length)
          })
          that.count_down(res.data.data.remain_time);
        } else if (res.data.data.status == 3) {
          that.setData({
            no_one_cha:false,
            no_friend:false,
            friend_list:true,
            already:true,
            owen_head: res.data.data.user_info.images,
            owen_name: res.data.data.user_info.name,
            remain_time: res.data.data.remain_time,
            friends_num: (10 - res.data.data.friends_num),
            friend: res.data.data.friends,
            pro_width: (7 + 9 * res.data.data.friends_num),
            head_widht: (12 + 7.2 * res.data.data.friends.length)
          })
          that.count_down(res.data.data.remain_time);
        } else if (res.data.data.status == 4) {
          that.setData({
            overdue_onoff: true,
            wancheng: false,
            btn_share: false,
            other: false,
            have_cha: false,
            no_one_cha: false,
            no_friend: false,
            friend_list: true,
            owen_head: res.data.data.user_info.images,
            owen_name: res.data.data.user_info.name,
            remain_time: res.data.data.remain_time,
            friends_num: (10 - res.data.data.friends_num),
            friend: res.data.data.friends,
            pro_width: 97,
            head_widht: (12 + 7.2 * res.data.data.friends.length),
            head_part: false,
            line_bg: '#302b50'
          })
          that.count_down(res.data.data.remain_time);
        } else if (res.data.data.status == 5) {
          that.setData({
            no_one_cha: false,
            no_friend: false,
            friend_list: true,
            already: true,
            owen_head: res.data.data.user_info.images,
            owen_name: res.data.data.user_info.name,
            remain_time: res.data.data.remain_time,
            friends_num: (10 - res.data.data.friends_num),
            friend: res.data.data.friends,
            pro_width: (7 + 9 * res.data.data.friends_num),
            head_widht: (12 + 7.2 * res.data.data.friends.length)
          })
        }
        if(res.data.data.is_help == 1){
          that.setData({
            bang_chai: false,
            other_height: 100,
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  help_chai: function () {
    var that = this;
    var obj_token = app.sha_token({
      app_id: "wx024695259e1a68cb",
      city_id: '',
      // owner: that.data.owner_id,
      user_id: that.data.userId
    });
    wx.request({
      url: app.data.url + "/web-api/wechat-applets/activity-help",
      method: 'POST',
      data: {
        app_id: "wx024695259e1a68cb",
        city_id: "",
        sign: obj_token,
        owner_id: that.data.owner_id,
        user_id: that.data.userId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if(!res.data.success){
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }else{
          that.setData({
            bang_chai: false,
            other_height: 100,
            chai_success: true,
            have_cha:false,
            friend: res.data.data.friends,
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  help_ta:function(){
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
    if (that.data.userId == 'undefined' || that.data.userId == '') {
      wx.navigateTo({
        url: '../login/login?active_cb=1'
      })
    }else{
      if (that.data.other_is_onoff == true){
        console.log("已拆过此礼包")
      }else{
        that.help_chai();
      }
    }
  },

  my_too:function(){
    wx.navigateTo({
      url: '../active/active'
    })
  },

  count_down: function (remain_time){
    var totalSecond = remain_time;
    var interval = setInterval(function () {
      // 秒数  
      var second = totalSecond;

      // 小时位  
      var hr = Math.floor(second / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位  
      var min = Math.floor((second - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位  
      var sec = second - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      this.setData({
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        wx.showToast({
          icon:'none',
          title: '活动已结束',
        });
        this.setData({
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
        });
      }
    }.bind(this), 1000);
  },
  
  roll_word:function(){
    var that = this;
    var obj_token = app.sha_token({
      app_id: "wx024695259e1a68cb",
      city_id: '',
    });
    wx.request({
      url: app.data.url + "/web-api/wechat-applets/activity-danmu",
      method: 'GET',
      data: {
        app_id: "wx024695259e1a68cb",
        city_id: "",
        sign: obj_token,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          roll_word_list:res.data.data
        })

      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  
  user_status: function () {
    var that = this;
    var obj_token2 = app.sha_token({
      app_id: "wx024695259e1a68cb",
      city_id: '',
      user_id: that.data.userId
    });
    wx.request({
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
        console.log(res.data.data.friends.length)
        if (res.data.data.status == 2) {
          if (res.data.data.friends.length !== 0) {
            that.setData({
              no_friend: false,
              friend_list: true,
            })
          } else {
            that.setData({
              no_friend: true,
              friend_list: false,
            })
          }

          if (res.data.data.friends_num == 0) {
            that.setData({
              no_one_cha: true,
              have_cha: false,
            })
          } else {
            that.setData({
              no_one_cha: false,
              have_cha: true,
            })
          }
          that.setData({
            owen_head: res.data.data.user_info.images,
            owen_name: res.data.data.user_info.name,
            remain_time: res.data.data.remain_time,
            friends_num: (10 - res.data.data.friends_num),
            friend: res.data.data.friends,
            pro_width: (7 + 9 * res.data.data.friends_num),
            head_widht: (12 + 7.2 * res.data.data.friends.length)
          })
          that.count_down(res.data.data.remain_time);
        } else if (res.data.data.status == 3) {
          that.setData({
            wancheng: true,
            btn_share: false,
            other: false,
            overdue_onoff: false,
            have_cha: false,
            no_one_cha: false,
            no_friend: false,
            friend_list: true,
            owen_head: res.data.data.user_info.images,
            owen_name: res.data.data.user_info.name,
            remain_time: res.data.data.remain_time,
            friends_num: (10 - res.data.data.friends_num),
            friend: res.data.data.friends,
            pro_width: (7 + 9 * res.data.data.friends_num),
            head_widht: (12 + 7.2 * res.data.data.friends.length)
          })
          that.count_down(res.data.data.remain_time);
        } else if (res.data.data.status == 4) {
          that.setData({
            overdue_onoff: true,
            wancheng: false,
            btn_share: false,
            other: false,
            have_cha: false,
            no_one_cha: false,
            no_friend: false,
            friend_list: true,
            owen_head: res.data.data.user_info.images,
            owen_name: res.data.data.user_info.name,
            remain_time: res.data.data.remain_time,
            friends_num: (10 - res.data.data.friends_num),
            friend: res.data.data.friends,
            pro_width: 97,
            head_widht: (12 + 7.2 * res.data.data.friends.length),
            head_part: false,
            line_bg: '#302b50'
          })
          that.count_down(res.data.data.remain_time);
        } else if (res.data.data.status == 5) {
          that.setData({
            wancheng: false,
            btn_share: false,
            other: false,
            overdue_onoff: false,
            have_cha: false,
            no_one_cha: false,
            no_friend: false,
            friend_list: true,
            progress:false,
            word_line_fin: true,
            goto_coupon:true,
            fin_yes: true,
            fin_no: false,
            count_down:false,
            owen_head: res.data.data.user_info.images,
            owen_name: res.data.data.user_info.name,
            friend: res.data.data.friends,
            price_fin: res.data.data.finish.price,
            des_fin: res.data.data.finish.des,
            date_fin: res.data.data.finish.date,
          })
        }
        that.count_down(res.data.data.remain_time);
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  cha_btn: function () {
    var that = this;
    that.setData({
      receive_success: true,
      topNum: that.data.topNum = 0,
      isScroll: false,
    })
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

    var obj_token = app.sha_token({
      app_id: "wx024695259e1a68cb",
      city_id: '',
      user_id: that.data.userId
    });
    wx.request({
      url: app.data.url + "/web-api/wechat-applets/activity-open-gift",
      method: 'POST',
      data: {
        app_id: "wx024695259e1a68cb",
        city_id: "",
        user_id: that.data.userId,
        sign: obj_token,
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
        }else{
          that.setData({
            wancheng: false,
            btn_share: false,
            other: false,
            overdue_onoff: false,
            have_cha: false,
            no_one_cha: false,
            no_friend: false,
            friend_list: true,
            progress: false,
            word_line_fin: true,
            goto_coupon: true,
            fin_yes: true,
            fin_no: false,
            count_down: false,
            owen_head: res.data.data.user_info.images,
            owen_name: res.data.data.user_info.name,
            friend: res.data.data.friends,
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  receive_close: function () {
    var that = this;
    that.setData({
      receive_success: false,
      topNum: that.data.topNum = 0,
      isScroll: true,
    })
    wx.redirectTo({
      url: '../active_cb/active_cb'
    })
  },
  goto_coupon:function(){
    wx.navigateTo({
      url: '../coupon/coupon'
    })
  },
  goto_coupon_1:function(){
    wx.navigateTo({
      url: '../coupon/coupon'
    })
  },

})




