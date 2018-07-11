var sha1 = require('../../utils/sha1.js');
const app = getApp();
var url = app.data.url;
Page({
  data: {
    user_num:'',
    result:'',
    userNickname:'',
    avatars_list1:[],
    avatars_list2:[],
    now_list:{},
    result_val:'',
    city_id:'',
    position:'',
    room_list:[],
    canvas: true,
    city_name:'',
    hidden: true,
    explain1:'',
    explain2:'',
    anwser_tag:'',
    word_line:'',
    isScroll:true,
    hide_tag:false,
    guodu: true,

  },

  onLoad: function (option) {
    var that = this;
  

    setTimeout(function () {
      that.setData({
        guodu: false
      })
    }, 1500)
    try {
      var value2 = wx.getStorageSync('userNickname')
      var value3 = wx.getStorageSync('userId')
      that.setData({
        userId: value3,
        userNickname: value2,
      })
    } catch (e) {
      console.log(e)
    }

    that.setData({
      result: option.result
    })

    that.user_num();

    if (option.tag == 1) {
      that.answer_submit();
    } else {
      that.user_info();
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
      "page": "pages/qa_active/qa_active",
      "app": 1,
      "line_color": {
        "r": "0",
        "g": "0",
        "b": "0"
      }
    }
    var act_src = url + '/web-api/wechat-applets/two-code?app_id=wx024695259e1a68cb&city_id=&user_id=' + that.data.userId + '&sign=' + obj_token + '&info=' + JSON.stringify(info);

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
        src: '../../images/img_bg.png',
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
      ctx.drawImage(res[0].path, 105, 410, 60, 60)
      ctx.setFillStyle('#232361')
      ctx.setFontSize(14)
      ctx.fillText(value2, 30, 65)

      if (that.data.explain2 == undefined){
        drawText(that.data.explain1, 30, 80, 180);
      }else{
        drawText(that.data.explain1 + that.data.explain2 ,30, 80, 180);
      }

      ctx.setFillStyle('#fff')
      ctx.setFontSize(10)
      var word_line = '经认证，最适合居住在'+ that.data.now_list.des + that.data.now_list.name
      drawText(word_line, 32, 176, 200);
      function drawText(t, x, y, w) {

        if (t !== undefined){
          var chr = t.split("");
          var temp = "";
          var row = [];
          for (var a = 0; a < chr.length; a++) {
            if (ctx.measureText(temp).width < w) {
              ;
            }
            else {
              row.push(temp);
              temp = "";
            }
            temp += chr[a];
          }

          row.push(temp);

          for (var b = 0; b < row.length; b++) {
            ctx.fillText(row[b], x, y + (b + 1) * 20);
          }
        }
      }
      ctx.stroke()
      ctx.draw()
    })



  },

  onHide:function(){
    this.setData({
      hide_tag:true
    })
  },

  onShow:function(){
    if(this.data.hide_tag){
      wx.reLaunch({
        url: '../index/index'
      })
    }
  },

  user_num: function () {
    var that = this;
    var obj_token = app.sha_token({
      city_id: "",
      app_id: "wx024695259e1a68cb"
    });
    wx.request({
      url: url + "/web-api/wechat-applets/answer-user-num",
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        city_id: "",
        app_id: "wx024695259e1a68cb",
        sign: obj_token
      },
      success: function (res) {
        console.log(res)
        if (res.data.success) {
          that.setData({
            user_num: res.data.data.num
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },





  user_info: function () {
    var that = this;
    var obj_token = app.sha_token({
      city_id: "",
      app_id: "wx024695259e1a68cb",
      user_id: that.data.userId,
    });
    wx.request({
      url: url + "/web-api/wechat-applets/answer-user-info",
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        city_id: "",
        app_id: "wx024695259e1a68cb",
        user_id: that.data.userId,
        sign: obj_token
      },
      success: function (res) {
        console.log(res)
        if (res.data.success) {
          var avatars_list1 = res.data.data.avatars.slice(0, 5)
          var avatars_list2 = res.data.data.avatars.slice(5, 9)
          that.setData({
            avatars_list1:avatars_list1,
            avatars_list2: avatars_list2,
            result_val: res.data.data.result
          })
          var result_num = res.data.result;
          that.result_list()
          that.room_list()
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },


  answer_submit: function () {
    var that = this;
    var obj_token = app.sha_token({
      city_id: "",
      app_id: "wx024695259e1a68cb",
      user_id: that.data.userId,
    });
    wx.request({
      url: url + "/web-api/wechat-applets/answer-submit",
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        city_id: "",
        app_id: "wx024695259e1a68cb",
        sign: obj_token,
        user_id: that.data.userId,
        anwser: that.data.result,
        anwser_tag: that.data.anwser_tag
      },
      success: function (res) {
        console.log(res)
        if (res.data.success) {
          var avatars_list1 = res.data.data.avatars.slice(0, 5)
          var avatars_list2 = res.data.data.avatars.slice(5, 9)
          that.setData({
            avatars_list1: avatars_list1,
            avatars_list2: avatars_list2,
            result_val: res.data.data.result
          })
          var result_num = res.data.result;
          that.result_list()
          that.room_list()
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  result_list:function(){
    var that = this;
    var result_fin = [{
      "1_1_1": { "city_id": 1, "city_name": "北京市", "des": "蓝天白云", "district": "d昌平区", "block": "b天通苑", "name": "天通苑", "explain1": "天将降大任于斯人也，必先苦其心志，劳其筋骨，饿其体肤", "explain2": "蛋仔只会背到这了" },
      "1_1_2": { "city_id": 1, "city_name": "北京市", "des": "蓝天白云", "district": "d昌平区", "block": "b回龙观", "name": "回龙观", "explain1": "天将降大任于斯人也，必先苦其心志，劳其筋骨，饿其体肤", "explain2": "蛋仔只会背到这了" },
      "1_1_3": { "city_id": 1, "city_name": "北京市", "des": "颜值领地", "district": "d顺义区", "block": "", "name": "顺义机场", "explain1": "蛋仔老司机要发车了，赶紧刷卡上车", "explain2": "机场=空姐（空少），你懂的" },
      "1_2_1": { "city_id": 1, "city_name": "北京市","des": "宇宙中心", "district": "d海淀区", "block": "", "name": "五道口", "explain1": "一道口、二道口、三道口、四道口、五道口....", "explain2": "就这么定啦，你适合住在五道口" },
      "1_2_2": { "city_id": 1, "city_name": "北京市","des": "程序员森林", "district": "d海淀区", "block": "", "name": "中关村", "explain1": "写字楼里写字间，写字间里程序员。", "explain2": "程序人员写程序，又拿程序换酒钱。" },
      "1_2_3": { "city_id": 1, "city_name": "北京市","des": "皇家园林", "district": "d海淀区", "block": "", "name": "颐和园", "explain1": "感受到你身上强大的皇族气息，你不会是那谁转世吧" },
      "1_3_1": { "city_id": 1, "city_name": "北京市", "des": "C位出道", "district": "d朝阳区", "block": "", "name": "望京", "explain1": "你划船不靠浆，全靠浪~" },
      "1_3_2": { "city_id": 1, "city_name": "北京市","des": "通利福利亚", "district": "d通州区", "block": "", "name": "通州", "explain1": "唯一一个国际范十足的区域，Are you international fashion idol?" },
      "1_4_1": { "city_id": 1, "city_name": "北京市", "des": "明日之星", "district": "d大兴区", "block": "", "name": "大兴", "explain1": "不知妻美、Are you OK的公司都在这，快投简历去吧" },
      "1_4_2": { "city_id": 1, "city_name": "北京市", "des": "老街旧巷", "district": "d东城区", "block": "", "name": "东城", "explain1": "这个地方房子均价10万+，我就是觉得你肯定租的起" },
      "1_4_3": { "city_id": 1, "city_name": "北京市", "des": "老街旧巷", "district": "d西城区", "block": "", "name": "西城", "explain1": "这个地方房子均价10万+，我就是觉得你肯定租的起" },
      "2_1_1": { "city_id": 540, "city_name": "上海市", "des": "工业先驱", "district": "d闵行区", "block": "", "name": "奉贤", "explain1": "天将降大任于斯人也，必先苦其心志，劳其筋骨，饿其体肤", "explain2": "蛋仔只会背到这了" },
      "2_1_2": { "city_id": 540, "city_name": "上海市", "des": "颜值领地", "district": "d长宁区", "block": "", "name": "虹桥新区", "explain1": "蛋仔老司机要发车了，赶紧刷卡上车", "explain2": "机场=空姐（空少），你懂的" },
      "2_2_1": { "city_id": 540, "city_name": "上海市", "des": "程序猿集中营", "district": "d浦东新区", "block": "", "name": "浦东新区", "explain1": "写字楼里写字间，写字间里程序员。", "explain2": "程序人员写程序，又拿程序换酒钱。" },
      "2_3_1": { "city_id": 540, "city_name": "上海市", "des": "图灵之城", "district": "d浦东新区", "block": "", "name": "杨浦", "explain1": "蛋仔一朋友总说自己是做互联网金融，实际他就是个收债的", "explain2": "你觉得互联网的出路广不广" },
      "2_3_2": { "city_id": 540, "city_name": "上海市", "des": "C位出道", "district": "d浦东新区", "block": "b陆家嘴", "name": "陆家嘴", "explain1": "你划船不靠浆，全靠浪~" },
      "2_4_1": { "city_id": 540, "city_name": "上海市", "des": "魔都桥头堡", "district": "d松江区", "block": "", "name": "金山", "explain1": "前朝大海，春暖花开" },
      "3_1_1": { "city_id": 1781, "city_name": "广州市", "des": "鸟语花香", "district": "d海珠区", "block": "b海珠", "name": "海珠", "explain1": "后海有树的院子，夏代有工的玉，", "explain2": "此时此刻的云，二十来岁的你。" },
      "3_1_2": { "city_id": 1781, "city_name": "广州市", "des": "明日之星", "district": "d天河区", "block": "", "name": "增城", "explain1": "天将降大任于斯人也，必先苦其心志，劳其筋骨，饿其体肤", "explain2": "蛋仔只会背到这了" },
      "3_1_3": { "city_id": 1781, "city_name": "广州市", "des": "颜值领地", "district": "d天河区", "block": "", "name": "白云机场", "explain1": "蛋仔老司机要发车了，赶紧刷卡上车", "explain2": "机场=空姐（空少），你懂的" },
      "3_2_1": { "city_id": 1781, "city_name": "广州市", "des": "程序猿森林", "district": "d天河区", "block": "", "name": "黄埔", "explain1": "写字楼里写字间，写字间里程序员。", "explain2": "程序人员写程序，又拿程序换酒钱。" },
      "3_3_1": { "city_id": 1781, "city_name": "广州市", "des": "C位出道", "district": "d天河区", "block": "b天河", "name": "天河", "explain1": "你划船不靠浆，全靠浪~" },
      "3_3_2": { "city_id": 1781, "city_name": "广州市", "des": "图灵之城", "district": "d海珠区", "block": "b琶洲", "name": "琶洲", "explain1": "蛋仔一朋友总说自己是做互联网金融，实际他就是个收债的", "explain2": "你觉得互联网的出路广不广" },
      "3_4_1": { "city_id": 1781, "city_name": "广州市", "des": "老街旧巷", "district": "d海珠区", "block": "", "name": "荔湾", "explain1": "这个地方房子均价5万+，蛋仔就是觉得你肯定租的起" },
      "4_1_1": { "city_id": 178, "city_name": "深圳市", "des": "明日之星", "district": "d龙华区", "block": "", "name": "龙华", "explain1": "天将降大任于斯人也，必先苦其心志，劳其筋骨，饿其体肤", "explain2": "蛋仔只会背到这了" },
      "4_2_1": { "city_id": 178, "city_name": "深圳市", "des": "程序猿森林", "district": "d南山区", "block": "", "name": "南山", "explain1": "写字楼里写字间，写字间里程序员。", "explain2": "程序人员写程序，又拿程序换酒钱。" },
      "4_3_1": { "city_id": 178, "city_name": "深圳市", "des": "C位出道", "district": "d福田区", "block": "", "name": "福田", "explain1": "你划船不靠浆，全靠浪~" },
      "4_3_2": { "city_id": 178, "city_name": "深圳市", "des": "图灵之城", "district": "d龙岗区", "block": "", "name": "龙岗", "explain1": "蛋仔一朋友总说自己是做互联网金融，实际他就是个收债的", "explain2": "你觉得互联网的出路广不广" },
      "4_3_3": { "city_id": 178, "city_name": "深圳市", "des": "图灵之城", "district": "d龙岗区", "block": "", "name": "坂雪岗", "explain1": "蛋仔一朋友总说自己是做互联网金融，实际他就是个收债的", "explain2": "你觉得互联网的出路广不广" },
      "4_4_1": { "city_id": 178, "city_name": "深圳市", "des": "中国华尔街", "district": "d罗湖区", "block": "", "name": "罗湖", "explain1": "钱生钱生钱生钱生钱生钱生钱", "explain2": "请问，上面几个钱？" }
    }]

    var arr_key = [];
    var arr_value = [];
    for (var i = 0, l = result_fin.length; i < l; i++) {
      for (var key in result_fin[i]) {
        arr_key.push(key)
        arr_value.push(result_fin[i][key])
    　　}
    }
    function indexOf(arr, str) {
      // 如果可以的话，调用原生方法
      if (arr && arr.indexOf) {
        return arr.indexOf(str);
      }
      var len = arr.length;
      for (var i = 0; i < len; i++) {
        // 定位该元素位置
        if (arr[i] == str) {
          return i;
        }
      }
      // 数组中不存在该元素
      return -1;
    }

    var index = indexOf(arr_key, that.data.result_val);
    that.setData({
      now_list: arr_value[index],
      city_id: arr_value[index].city_id,
      position: arr_value[index].district + '-' + arr_value[index].block,
      city_name: arr_value[index].city_name,
      explain1: arr_value[index].explain1,
      explain2: arr_value[index].explain2,
    })
  },


  room_list:function(){
    var that = this;
    var obj_token = app.sha_token({
      city_id: that.data.city_id,
      app_id: "wx024695259e1a68cb",
    });
    wx.request({
      url: url+"/web-api/wechat-applets/list",
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        city_id: that.data.city_id,
        app_id: "wx024695259e1a68cb",
        sign: obj_token,
        position: that.data.position,
        search_text:'',
        page: 1
      },
      success: function (res) {
        console.log(res.data[0].data)
        if (res.data[0].data.length == 0){
          console.log(123)
          var obj_token = app.sha_token({
            city_id: that.data.city_id,
            app_id: "wx024695259e1a68cb",
          });
          wx.request({
            url: url + "/web-api/wechat-applets/list",
            method: "GET",
            header: {
              'content-type': 'application/json' // 默认值
            },
            data: {
              city_id: that.data.city_id,
              app_id: "wx024695259e1a68cb",
              sign: obj_token,
              position: '',
              search_text: '',
              page: 1
            },
            success: function (res) {
              console.log(res.data[0])
              console.log(res.data[0].data.slice(0, 4))
              that.setData({
                room_list: res.data[0].data.slice(0, 4)
              })
            },
            fail: function (err) {
              console.log(err)
            }
          })
        }else{
          that.setData({
            room_list: res.data[0].data.slice(0, 4)
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })

  },

  more_room: function(){
    wx.navigateTo({
      url: '../list/list?position=' + this.data.position + '&city_name=' + this.data.city_name + '&city_id=' + this.data.city_id
    })
  },

  /**
     * 生成分享图
    */
  toAlbum: function () {
    var that = this
    app.aldstat.sendEvent('点击保存到相册', {
      '点击': '保存到相册'
    });
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
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
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
        // that.setData({
        //   prurl: res.tempFilePath,
        //   hidden: false
        // })
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
  // save: function () {
  //   var that = this
  //   //生产环境时 记得这里要加入获取相册授权的代码
  
  // },

  onShareAppMessage: function (res) {
    app.aldstat.sendEvent('点击分享好友', {
      '点击': '分享好友'
    });
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    if (res.from === 'menu') {
      console.log(res.target)
    }
    return {
      title: '测测你的最佳住所，来成为我的室友吧！',
      path: "pages/qa_active/qa_active",
      imageUrl: '../../images/share_act.png',
      success: function (res) {
        console.log(res)
      },
      fail: function (err) {
        console.log(err)
      }
    }
  },

  one_more:function(){
    app.aldstat.sendEvent('点击再测一次', {
      '点击': '再测一次'
    });
    wx.navigateTo({
      url: '../qa_active/qa_active?anwser_tag=2'
    })
  },
  toIndex:function(){
    wx.reLaunch({
      url: '../index/index'
    })
  },

})