Page({
  data: {
    id: null,
    dataItem: null
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
        console.log('recommendations data:', data);
        // 如果找到数据，则设置 dataItem
        if (data && Object.keys(data).length > 0) {
          const dataItem = data
          console.log('recommendations dataItem:', dataItem);
          if (dataItem) {
            console.log(1)
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
        console.log('recommendations error:', error);
        // 如果第一个路由请求失败，继续请求第二个路由的数据
        return this.fetchData(`https://lzuer.mynatapp.cc/SRJC/attractions/${id}/`);
      })
      .then(data => {
        console.log('attractions data:', data);
        // 如果找到数据，则设置 dataItem
        if (data && Object.keys(data).length > 0) {
          const dataItem = data
          console.log('attractions dataItem:', dataItem);
          if (dataItem) {
            this.setData({ 
              dataItem: {
                ...dataItem,
                images: [dataItem.image1, dataItem.image2, dataItem.image3, dataItem.image4, dataItem.image5]
              }
            }, () => {
              console.log('dataItem set:', this.data.dataItem);
            });
          }
        } else {
          console.log('No data found in attractions for id:', id);
        }
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      });
  },

  fetchData: function(url) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: 'GET',
        success: (res) => {
          console.log(`Fetched data from ${url}:`, res.data);
          resolve(res.data);
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  }
});
