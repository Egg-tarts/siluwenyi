Page({
  data: {
    members: [
      { id: 1, age: '' }
    ]
  },

  onAddMember() {
    const members = this.data.members;
    const newMember = { id: members.length + 1, age: '' };
    this.setData({
      members: [...members, newMember]
    });
  },

  onInputChange(e) {
    const { value } = e.detail;
    const { index } = e.currentTarget.dataset;
    const members = this.data.members;
    members[index].age = value;
    this.setData({ members });
  },

  onSubmit() {
    const formData = this.data;
    // 在这里可以对表单数据进行处理，比如提交到服务器
    console.log('Form Data:', formData);
  }
});
