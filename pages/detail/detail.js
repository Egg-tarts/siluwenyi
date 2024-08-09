Page({
  data: {
    id: null,
    dataItem: null,
    comment: '',
    like: 0,
    likeIcon: '/pages/images/love_unfull.png'  // 初始图标路径
  },
  onInputComment: function(e) {
    const id = this.data.id
    const app = getApp();
    const token = app.globalData.token;
    this.setData({
      comment: e.detail.value
    });
    // 如果有评论内容，则向后端发送评论信息
    if (this.data.comment.trim()) {
      if(app.globalData.currentTab==='city'){
      wx.request({
        url: `https://lzuer.mynatapp.cc/SRJC/recommendations/${id}/comments/`, // 替换为你的评论接口
        method: 'POST',
        header: {
          Authorization: 'Token ' + token // 使用全局 token
        },
        data: {
          comment: this.data.comment
        },
        success: ()  => {
          console.log(this.data.comment)
          this.setData({
            comment: ''
          },()=>{ wx.nextTick(() => {
            console.log('Comment cleared:', this.data.comment);
            this.onLoad({ id: this.data.id });
          });
        });
      },
        fail: function(error) {
        }
      });
    }
  }else{
    wx.request({
      url: `https://lzuer.mynatapp.cc/SRJC/attractions/${id}/comments/`, // 替换为你的评论接口
      method: 'POST',
      header: {
        Authorization: 'Token ' + token // 使用全局 token
      },
      data: {
        comment: this.data.comment
      },
      success: function(res) {
        this.onLoad({ id: this.data.id });
      },
      fail: function(error) {
      }
    });
  }

  },

  // 点赞处理函数
  onLike: function() {
    const id = this.data.id
    const app = getApp();
    const token = app.globalData.token;
    const newLikeState = this.data.like === 0 ? 1 : 0;
    const newLikeIcon = newLikeState === 1 ? '/pages/images/love_unfull.png' : '/pages/images/love_full.png';
    // 更新本地状态
    this.setData({
      like: newLikeState,
      likeIcon: newLikeIcon
    });
    if(app.globalData.currentTab==='city'){
    // 向后端发送点赞请求
    wx.request({
      url: `https://lzuer.mynatapp.cc/SRJC/recommendations/${id}/like/`, // 替换为你的点赞接口
      method: 'POST',
      header: {
        Authorization: 'Token ' + token 
      },
      success: function(res) {
        console.log(1)
        
      },
      fail: function(error) {
      
      }
    });
  }else{
    wx.request({
      url: `https://lzuer.mynatapp.cc/SRJC/attractions/${id}/like/`, // 替换为你的点赞接口
      method: 'POST',
      header: {
        Authorization: 'Token ' + token 
      },
      success: function(res) {

      },
      fail: function(error) {
      
      }
    });

  }
  },

  navigateBack: function () {
    wx.navigateTo({
      url: '/pages/community/community'
    });
  },

  onLoad: function(options) {
    const id = options.id;
    this.setData({ id });

    // 尝试第一个路由的数据请求
    this.fetchData(`https://lzuer.mynatapp.cc/SRJC/recommendations/${id}/`)
      .then(data => {

        // 如果找到数据，则设置 dataItem
        if (data && Object.keys(data).length > 0) {
          const dataItem = data

          if (dataItem) {

            this.setData({ 
              dataItem: {
                ...dataItem,
                images: [dataItem.images1, dataItem.images2, dataItem.images3],
                text_big: dataItem.head_txt
              } 
            });

            return; // 提前返回，避免继续执行
          }
        }
        // 如果没有找到，继续请求第二个路由的数据
        return this.fetchData(`https://lzuer.mynatapp.cc/SRJC/attractions/${id}/`);
      })
      .catch(error => {

        // 如果第一个路由请求失败，继续请求第二个路由的数据
        return this.fetchData(`https://lzuer.mynatapp.cc/SRJC/attractions/${id}/`);
      })
      .then(data => {

        // 如果找到数据，则设置 dataItem
        if (data && Object.keys(data).length > 0) {
          const dataItem = data

          if (dataItem) {
            this.setData({ 
              dataItem: {
                ...dataItem,
                images: [dataItem.image1, dataItem.image2, dataItem.image3, dataItem.image4, dataItem.image5]
              }
            }, () => {
              
            });
          }
        } else {
         ;
        }
      })
      .catch(error => {
    
      });
  },

  fetchData: function(url) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: 'GET',
        success: (res) => {
      
          resolve(res.data);
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  }
});
