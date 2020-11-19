import Taro from '@tarojs/taro';
const Utils = {
/**
   * 加
   */
  add(val1: number | any, val2: number | any) {
    let a = !isNaN(val1) ? val1 : 0;
    let b = !isNaN(val2) ? val2 : 0;
    return parseFloat((a + b).toPrecision(12));
  },
  /**
   * 减
   */
  subtr(val1: number, val2: number) {
    let a = !isNaN(val1) ? val1 : 0;
    let b = !isNaN(val2) ? val2 : 0;
    return parseFloat((a - b).toPrecision(12));
  },
  /**
   * 乘
   */
  mul(val1: number | any, val2: number | any) {
    let a = !isNaN(val1) ? val1 : 0;
    let b = !isNaN(val2) ? val2 : 0;
    return parseFloat((a * b).toPrecision(12));
  },
  /**
   * 除
   */
  chu(val1: number, val2: number) {
    let a = !isNaN(val1) ? val1 : 0;
    let b = !isNaN(val2) ? val2 : 0;
    return parseFloat((a / b).toPrecision(12));
  },
  /**
   * 金额分转元
   */
  filterPrice(val: any) {
    if (val === '' || val === undefined || val === null || val === 0) return '0.00';
    let num = this.chu(val, 100).toFixed(2);
    // let num = (val / 100).toFixed(2)
    // 　num = parseFloat(num)
    // 　num = num.toLocaleString()
    return num;
  },
  // 相册授权验证
  async checkAuthorizeWritePhotosAlbum() {
    try {
      const res = await Taro.getSetting();
      console.log('getSetting', res);
      if (!res.authSetting['scope.writePhotosAlbum']) {
        const modalRes = await Taro.showModal({
          title: '需要相册授权',
          content: '在设置中打开相册授权，才能保存图片到相册中',
          showCancel: true,
          cancelText: '取消',
          confirmText: '确定',
          confirmColor: '#294A7B'
        });
        if (modalRes.confirm) {
          Taro.openSetting();
        }
      } else {
        Taro.showToast({
          title: '保存失败，请重试',
          icon: 'none'
        });
      }
    } catch (err) {
      console.error('getSetting error', err);
    }
  },
}

export default Utils;