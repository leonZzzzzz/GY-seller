import Taro, { Component, Config } from "@tarojs/taro";
import {
  Block,
  View,
  Text,
  Image,
  Input,
  Picker,
  Switch, MovableArea, MovableView
} from "@tarojs/components";
import "./editgoods.scss";
import "../single-specs/index.scss"
import DatetimePicker from "@/components/datetime-picker";
import { uodataPic } from "@/api/login"
import { listBytype, addGoods, prodLevel, geteditGoods, editGoods, getStoreClass } from "@/api/goodsMan"
import { IMG_HOST } from '@/config'
import utils from '@/utils/utils'
const screenHeight = Taro.getSystemInfoSync().windowHeight

export default class Index extends Component {
  state = {
    units: ['斤', '件', '袋', '箱', '瓶', '包', '个', '盒', '罐', '筐', '双', '捆', '把', '提', '份', '板', '桶'],
    imageurl: "https://guyu-1300342109.cos.ap-guangzhou.myqcloud.com",
    voucherImage: [],
    photos: [],
    pics: [],
    // agg: 1,
    isadd: false,
    // alotData: [0],
    isShow: true,
    startTime: '请选择',
    startTxt: false,
    times: '请选择具体开售时间',
    timeTxt: false,
    islist: true,
    islist1: false,
    islist2: false,
    bylist: [],
    bylist1: [],
    bylist2: [],
    categoryList: [],
    categoryIds: '',
    name: '',
    spec1Name: '',
    spec1Value: '',
    advert: '',
    advert1: '',
    advert2: '',
    id1: '',
    id2: '',
    id3: '',
    price: '',
    qty: '',
    supplierPrice: '',
    origPrice: '',
    number: '',
    productParams: [],
    levels: [],
    leveltxt: '',
    isQtyDisplay: true,
    isSalesQtyDisplay: true,
    introduce: '',
    minOrderQuantity: 1,
    weight: '',
    isShowCom: false,
    totaldata: [],
    rollimg: [],
    categoryname: '',
    productItems: [],
    standList: [],
    level: '',
    prodparams: '请添加',
    prodId: '',
    createTime: '',
    updateTime: '',
    isDeleted: '',
    appId: '',
    appraise: '',
    careSeqNum: '',
    startSellTime: '',
    isSell: false,
    editorContent: '',
    unit: '斤',
    allData: {}, isDate: false, selDate: '', currentDate: '', now: new Date(),
    paramCategoryId: '',
    saveList: [],
    array: {},


    hidden: true,
    flag: false,
    x: 0,
    y: 0,
    tempFilePaths: [],
    disabled: true,
    elements: [],
    textHeight: '',
    maskImg: {},
    beginIndex: 0,
    storeCate: [],
    storeCategoryId: '',
    storeCategoryName: '',
  };
  componentDidShow() {
    Taro.setStorageSync('isalter', true)
    const productParams = Taro.getStorageSync('productParams')
    const totaldata = Taro.getStorageSync('totaldata')
    const editorContent = Taro.getStorageSync('editorContent')
    const storeCategoryId = Taro.getStorageSync('storeCategoryId')
    const storeCategoryName = Taro.getStorageSync('storeCategoryName')
    if (storeCategoryId) {
      this.setState({ storeCategoryId })
    }
    if (storeCategoryName) {
      this.setState({ storeCategoryName })
    }
    if (editorContent) {
      this.setState({ editorContent })
    }
    if (productParams) {
      this.setState({ productParams })
    }

    if (totaldata) {
      if (totaldata[0] === '已删除') {
        this.setState({
          isShowCom: false,
          productItems: []
        })
        return
      }
      this.setState({ totaldata })
    }
  }
  componentDidMount() {
    let id = this.$router.params.id
    this.geteditlist(id)
    this.upStoreClass()
  }
  // 获取店铺分类
  upStoreClass = async () => {
    const res = await getStoreClass()
    this.setState({ storeCate: res.data.data })
  }
  gainStoreClass(e) {
    const { storeCate } = this.state
    const index = e.detail.value
    const storeCategoryId = storeCate[index].id
    const storeCategoryName = storeCate[index].name
    this.setState({ storeCategoryId, storeCategoryName })
  }

  geteditlist = async (id) => {
    Taro.showLoading({ title: 'loading' })
    try {
      const res = await geteditGoods(id)
      const item = res.data.data
      console.log(item)
      const { saveList } = this.state
      if (item.productItems) {
        if (item.productItems.length > 0) {
          item.productItems.map(item => {
            let a = {}
            item.price = Number(item.price / 100)
            item.origPrice = Number(item.origPrice / 100)
            item.supplierPrice = Number(item.supplierPrice / 100)
            item.weight = Number(item.weight / 1000)
            // item.minOrderQuantity = Number(item.lockVersion / 1000)
            a.price = item.price
            a.origPrice = item.origPrice
            a.supplierPrice = item.supplierPrice
            a.weight = item.weight
            a.minOrderQuantity = item.minOrderQuantity
            a.number = item.number
            a.qty = item.qty
            saveList.push(a)
          })
          this.setState({ isShowCom: true })
        }
      }

      if (item.productParams.length > 0) {
        this.setState({ productParams: item.productParams })
      }
      let rolling = item.rollingImgUrl
      rolling = rolling.split('_')
      let createTime = item.createTime
      createTime = createTime.split(' ')
      let categoryList = item.categoryIds.split('_')
      this.setState({ voucherImage: rolling }, () => {
        var query = Taro.createSelectorQuery();
        var nodesRef = query.selectAll(".weui-uploader__file");
        // nodesRef.boundingClientRect(rect => {
        //   console.log(rect)
        // }).exec
        nodesRef.fields({
          dataset: true,
          rect: true
        }, (result) => {
          console.log(result)
          this.setState({
            elements: result
          })
        }).exec()
      })
      this.setState({
        saveList: item.productItems ? item.productItems : [],
        allData: item,
        isSell: item.isSell,
        id1: categoryList[0] || '',
        id2: categoryList[1] || '',
        id3: categoryList[2] || '',
        categoryList,
        // voucherImage: rolling,
        categoryIds: item.categoryIds,
        name: item.name,
        price: parseInt(item.price) / 100,
        qty: item.qty,
        weight: parseInt(item.weight) / 1000,
        supplierPrice: parseInt(item.supplierPrice) / 100,
        origPrice: parseInt(item.origPrice) / 100,
        minOrderQuantity: item.minOrderQuantity,
        productItems: item.productItems ? item.productItems : [],
        introduce: item.introduce,
        leveltxt: item.level,
        startTime: createTime[0],
        times: createTime[1],
        isQtyDisplay: item.isQtyDisplay,
        isSalesQtyDisplay: item.isSalesQtyDisplay,
        prodId: item.id,
        createTime: item.createTime,
        updateTime: item.updateTime,
        isDeleted: item.isDeleted,
        appId: item.appId,
        appraise: item.appraise,
        careSeqNum: item.careSeqNum,
        startSellTime: item.startSellTime ? item.startSellTime : this.getLocalTime(new Date().getTime()),
        editorContent: item.content,
        unit: item.unit,
        paramCategoryId: item.paramCategoryId,
        storeCategoryId: item.storeCategoryId,
        storeCategoryName: item.storeCategoryName
      })
      Taro.hideLoading()
      this.getbyList(categoryList)
      this.getprodLevel()
    } catch (error) {
      Taro.hideLoading()
    }
  }

  // 获取商品一级分类
  getbyList = async (categoryList) => {
    console.log('gggggggggggg', categoryList)
    const res = await listBytype(1, '')
    const bylist = res.data.data
    bylist.map(item => {
      if (item.id == categoryList[0]) {
        const advert = item.name
        this.setState({ advert, bylist1: [], bylist2: [], islist1: false, islist2: false })
        if (categoryList.length > 1) {
          this.gettwoList(categoryList)
        }
      }
    })

    this.setState({ bylist: bylist })
  }
  // 获取商品二级分类
  gettwoList = async (ids) => {
    let id = ''
    if (typeof ids == 'object') {
      id = ids[0]
    } else {
      id = ids
    }
    console.log(id)
    const res = await listBytype(1, id)
    const data = res.data.data
    if (data.length > 0) {
      let a = 0
      data.map(item => {
        if (item.id == ids[1]) {
          a++
        }
      })
      if (a > 0) {
        data.map(item => {
          if (item.id == ids[1]) {
            const advert1 = item.name
            this.setState({ advert1, id2: item.id })
            this.getthreeList(item.id)
          }
        })
      } else {
        this.setState({ advert1: data[0].name, id2: data[0].id })
        this.getthreeList(data[0].id)
      }
      this.setState({ bylist1: data, bylist2: [], islist1: true, islist2: false })
    }
  }
  // 获取商品三级分类
  getthreeList = async (id) => {
    const res = await listBytype(1, id)
    const data = res.data.data
    if (data.length > 0) {
      this.setState({ id3: data[0].id, bylist2: data, islist2: true, advert2: data[0].name })
    }
  }
  // 获取商品优质等级
  getprodLevel = async () => {
    const res = await prodLevel()
    this.setState({ levels: res.data.data })
  }
  // 选择商品分类
  chooseby(e) {
    const value = e.detail.value
    const bylist = this.state.bylist
    const id = bylist[value].id
    const advert = bylist[value].name
    this.setState({ id1: id, advert, advert1: '', advert2: '', id2: '', id3: '', bylist1: [], bylist2: [], islist1: false, islist2: false })
    this.gettwoList(id)
  }
  chooseby1(e) {
    const value = e.detail.value
    const bylist1 = this.state.bylist1
    const id = bylist1[value].id
    const advert1 = bylist1[value].name
    this.setState({ id2: id, advert1, advert2: '', id3: '', bylist2: [], islist2: false })
    this.getthreeList(id)
  }
  chooseby2(e) {
    const value = e.detail.value
    const bylist2 = this.state.bylist2
    const id = bylist2[value].id
    const advert2 = bylist2[value].name
    this.setState({ id3: id, advert2 })
  }
  // 是否选中多规格
  changecommon(e) {
    this.setState({ isShowCom: e.detail.value })
  }
  // 添加/查看规格
  groupAdd() {
    // if (this.state.totaldata.length > 0) {
    //   Taro.setStorageSync('productItems', this.state.totaldata)
    //   // JSON.stringify(this.state.totaldata)
    //   Taro.navigateTo({
    //     url: '../stand-detail/stand-detail'
    //   })
    // } else {
    //   Taro.setStorageSync('productItems', this.state.productItems)
    //   Taro.navigateTo({
    //     url: '../stand-detail/stand-detail'
    //   })
    // }
    // if (this.state.standList.length > 0) {
    //   Taro.setStorageSync('standList', this.state.standList)
    //   Taro.navigateTo({
    //     url: '../goods-common/goods-common'
    //   })
    //   return
    // }

    if (this.state.totaldata.length > 0) Taro.setStorageSync('productItems', this.state.totaldata)
    else Taro.setStorageSync('productItems', this.state.productItems)

    Taro.navigateTo({
      url: '../single-specs/index'
    })
    return

    // if (this.state.totaldata.length > 0) {
    //   Taro.navigateTo({
    //     url: '../stand-detail/stand-detail?productItems=' + JSON.stringify(this.state.totaldata)
    //   })
    // } else {
    //   Taro.navigateTo({
    //     url: '../stand-detail/stand-detail?productItems=' + JSON.stringify(this.state.productItems)
    //   })
    // }
  }

  // 图片上传
  chooseImage() {
    let _this = this
    let { voucherImage } = this.state
    const promiseArray: Array<object> = []
    Taro.chooseImage({
      count: Math.abs(voucherImage.length - 8), // 最多可以选择的图片张数 8
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // tempFilePaths
        res.tempFiles.forEach((img, i) => {
          //获取图片的大小，单位B
          if (img.size <= 2000000) {   //图片小于或者等于2M时 可以执行获取图片
            let promise = uodataPic(res.tempFilePaths[i], { imageType: "sellerOrderRemark" });
            promiseArray.push(promise)
          } else {
            Taro.showToast({
              title: '上传图片不能大于2M',
              icon: 'none'
            })
          }
        })
        Taro.showLoading({
          title: "上传中"
        });
        Promise.all(promiseArray)
          .then(result => {
            for (let res of result) {
              voucherImage.push(res.data.data.imageUrl);
            }
            _this.setState({ voucherImage: voucherImage }, () => {
              var query = Taro.createSelectorQuery();
              var nodesRef = query.selectAll(".weui-uploader__file");
              nodesRef.fields({
                dataset: true,
                rect: true
              }, (result) => {
                this.setState({
                  elements: result
                })
              }).exec()
            })
            Taro.hideLoading();
          })
          .catch(err => {
            console.error("upload err :", err);
            Taro.hideLoading();
          });
      },
    })
  }

  //删除图片
  deleteImg = (index) => (e) => {
    e.stopPropagation()
    let voucherImage = this.state.voucherImage;
    voucherImage.splice(index, 1);
    this.setState({ voucherImage: voucherImage });
  }
  // 移动图片
  movePic(e) {
    console.log(e)
  }
  // 商品名称
  getGoodsname(e) {
    this.setState({ name: e.detail.value })
  }
  // 单位
  // getUnits(e) {
  //   this.setState({ unit: e.detail.value })
  // }
  chooseunit(e) {
    const value = e.detail.value
    let units = this.state.units
    this.setState({ unit: units[value] })
  }
  // 售价
  getSell(e) {
    this.setState({ price: e.detail.value })
  }
  // 库存
  getrepert(e) {
    this.setState({ qty: e.detail.value })
  }
  // 重量
  getWeight(e) {
    this.setState({ weight: e.detail.value })
  }
  // 成本价
  getSupper(e) {
    this.setState({ supplierPrice: e.detail.value })
  }
  // 原价
  orignPrice(e) {
    this.setState({ origPrice: e.detail.value })
  }
  // 最低起订量
  getLowest(e) {
    this.setState({ minOrderQuantity: e.detail.value })
  }
  // 商品编码
  getCode(e) {
    this.setState({ number: e.detail.value })
  }
  // 详情
  goeditor() {
    let { editorContent } = this.state
    if (editorContent) {
      Taro.setStorageSync('editorContent', editorContent)
    }
    Taro.navigateTo({
      url: '../editor/editor'
    })
  }
  // 卖点
  getsellPoint(e) {
    this.setState({ introduce: e.detail.value })
  }
  getScoll() {
    Taro.pageScrollTo({
      scrollTop: 200
    })
  }

  // 优质等级
  onlevelChange(e) {
    let value = e.detail.value
    value = parseInt(value) + 1
    const levels = this.state.levels
    let leveltxt = '', levelid = ''
    levels.map(item => {
      if (value == item.seqNum) {
        leveltxt = item.value
      }
    })
    this.setState({ leveltxt })
  }
  //  显示库存
  switch1Change(e) {
    this.setState({ isQtyDisplay: e.detail.value })
  }
  // 是否显示销量
  switch2Change(e) {
    this.setState({ isSalesQtyDisplay: e.detail.value })
  }
  // 选择开售日期
  onDateChange() {
    this.setState({ isDate: true });
  }
  confirm(e) {
    if (!e) {
      this.setState({ isDate: this.state.currentDate });
    } else {
      const selDate = this.getLocalTime(e);
      this.setState({ selDate, isDate: false });
    }
  }

  cancel() {
    this.setState({ isDate: false });
  }
  // onDateChange(e) {
  //   this.setState({ startTime: e.detail.value, startTxt: true })
  // }
  // // 选择开售时间
  // onDateChangetime(e) {
  //   this.setState({ times: e.detail.value, timeTxt: true })
  // }
  getLocalTime(nS) {
    //将时间戳（十三位时间搓，也就是带毫秒的时间搓）转换成时间格式
    // d.cTime = 1539083829787
    let date = new Date(nS);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let h = date.getHours();
    if (h < 10) {
      h = "0" + h;
    }
    let m = date.getMinutes();
    if (m < 10) {
      m = "0" + m;
    }
    let s = date.getSeconds()
    if (s < 10) {
      s = "0" + s;
    }
    let day = date.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    date = year + "-" + month + "-" + day + " " + h + ":" + m + ":" + s;
    return date;
  }

  // -----------------------------多规格--------------------------------start
  chooseunit1(e) {
    const index = e.currentTarget.dataset.vindex
    // const val = e.currentTarget.dataset.val
    const { array, saveList, units } = this.state
    array.index = index
    const unitindex = e.detail.value
    const unit = units[unitindex]
    saveList[index].unit = unit
    this.setState({ saveList, unit })
  }

  // 规格名
  inputSpecsName1(e, index) {
    const { array, saveList } = this.state
    // array.index = index
    const spec1Name = e.detail.value
    // saveList[index].spec1Name = spec1Name
    saveList.map(item => {
      item.spec1Name = spec1Name
    })
    this.setState({ saveList })
  }

  // 规格值
  inputSpecsValue1(e, index) {
    const { array, saveList } = this.state
    array.index = index
    const spec1Value = e.detail.value
    saveList[index].spec1Value = spec1Value
    this.setState({ saveList })
  }
  // 售价
  getSell1(e, index, val) {
    const { array, saveList } = this.state
    array.index = index
    const price = e.detail.value
    saveList[index].price = price
    saveList[index].seqNum = index
    if (typeof val == 'string') {
      saveList[index].spec1Value = val
    }
    this.setState({ saveList })
  }
  // 库存
  getrepert1(e, index) {
    const { array, saveList } = this.state
    array.index = index
    const qty = e.detail.value
    saveList[index].qty = qty
    this.setState({ saveList })
  }
  // 重量
  getWeight1(e, index) {
    const { array, saveList } = this.state
    array.index = index
    const weight = e.detail.value
    saveList[index].weight = weight
    this.setState({ saveList })
  }
  // 成本价
  getSupper1(e, index) {
    const { array, saveList } = this.state
    array.index = index
    const supplierPrice = e.detail.value
    saveList[index].supplierPrice = supplierPrice
    this.setState({ saveList })
  }
  // 原价
  orignPrice1(e, index) {
    const { array, saveList } = this.state
    array.index = index
    const origPrice = e.detail.value
    saveList[index].origPrice = origPrice
    this.setState({ saveList })
  }
  // 最低起订量
  getLowest1(e, index) {
    const { array, saveList } = this.state
    array.index = index
    const minOrderQuantity = e.detail.value
    saveList[index].minOrderQuantity = minOrderQuantity
    this.setState({ saveList })
  }
  // 商品编码
  getCode1(e, index) {
    const { array, saveList } = this.state
    array.index = index
    const number = e.detail.value
    saveList[index].number = number
    this.setState({ saveList })
  }
  // -----------------------------多规格--------------------------------end

  // 上架
  async putaway() {
    Taro.showLoading()
    let { storeCategoryName, storeCategoryId, isSell, unit, selDate, editorContent, startSellTime, allData, productItems,
      createTime, isDeleted, appId, appraise, careSeqNum,
      prodId, categoryIds, totaldata, saveList, weight, minOrderQuantity, isQtyDisplay, isSalesQtyDisplay,
      introduce, leveltxt, productParams, name, spec1Name, spec1Value,
      id1, id2, id3, price, supplierPrice, origPrice, qty, voucherImage, paramCategoryId } = this.state

    if (!categoryIds || !name) {
      Taro.showToast({
        title: '请将信息填写完整',
        icon: 'none'
      })
      return
    }
    if (id3 || id2 || id1) {
      if (id3) {
        categoryIds = id1 + '_' + id2 + "_" + id3
      } else {
        if (id2) {
          categoryIds = id1 + '_' + id2
        } else {
          categoryIds = id1
        }
      }
    } else {
      categoryIds = categoryIds
      const idlist = categoryIds.split('_')
      id1 = idlist[0]
    }
    if (voucherImage.length == 0) {
      Taro.showToast({
        title: '还没有上传图片哦',
        icon: 'none'
      })
      return
    }
    const Imageurl = voucherImage.join('_')
    let arrayItem = {}
    let params = {}
    let a = 0
    let flag = true;
    // 修改过规格
    if (saveList.length > 0) {
      saveList.map(item => {
        item.price = utils.mul(item.price, 100)
        item.origPrice = utils.mul(item.origPrice, 100)
        item.supplierPrice = utils.mul(item.supplierPrice, 100)
        item.qty = Number(item.qty)
        if (item.unit == '斤') {
          item.weight = 500
        } else {
          item.weight = utils.mul(item.weight, 1000)
        }

        if (!item.minOrderQuantity && item.minOrderQuantity !== 0) {
          item.minOrderQuantity = 1
        }

        if (!item.origPrice) {
          item.origPrice = 0
        }

        if (!item.number) {
          item.number = '0'
        }
        if (saveList.length > 0) {
          arrayItem.spec1Name = saveList[0].spec1Value
          let valueList = saveList.map(value => value.spec1Value)
          arrayItem.spec1Value = valueList.join('_')
        }
        if (!item.spec1Name) {
          Taro.showToast({
            title: '规格名还没填写喔~',
            icon: 'none'
          })
          flag = false
        }
        if (!item.spec1Value) {
          Taro.showToast({
            title: '规格值还没填写喔~',
            icon: 'none'
          })
          flag = false
        }
        if (item.price && item.qty && item.weight && item.supplierPrice && item.unit) {
          a++
        }
      })

      if (a < saveList.length) {
        Taro.showToast({
          title: '还有信息没有填写完整喔~',
          icon: 'none'
        })
        flag = false
        return
      }
      productItems = saveList
    } else {
      productItems = productItems
    }
    if (productItems.length > 0) {
      // 计算出多规格商品中数量，金额，原价等最小的参数用作页面展示
      let minprice = productItems[0].price
      let minweight = productItems[0].weight
      let minsupplierPrice = productItems[0].supplierPrice
      let minorigPrice = productItems[0].origPrice
      let liminOrderQuantity = productItems[0].minOrderQuantity
      let totalqty = 0;
      let minunit = ''
      productItems.map(item => {
        item.name = name
        item.price < minprice ? minprice = item.price : null
        item.weight < minweight ? minweight = item.weight : null
        item.supplierPrice < minsupplierPrice ? minsupplierPrice = item.supplierPrice : null
        item.origPrice < minorigPrice ? minorigPrice = item.origPrice : null
        item.minOrderQuantity < liminOrderQuantity ? liminOrderQuantity = item.minOrderQuantity : null
        totalqty += Number(item.qty)
        if (minprice == item.price) {
          minunit = item.unit
        }
      })
      params = {
        storeCategoryName, storeCategoryId,
        isMultiSpec: true,
        unit: minunit,
        iconUrl: voucherImage[0],
        createTime, isDeleted, appId, appraise, careSeqNum,
        id: prodId,
        isSell: isSell,
        price: minprice, qty: totalqty, weight: minweight, supplierPrice: minsupplierPrice, origPrice: minorigPrice, minOrderQuantity: liminOrderQuantity,
        rollingImgUrl: Imageurl, categoryIds: categoryIds, name,
        productItems: productItems,
        introduce,
        productParams: productParams,
        level: leveltxt,
        isQtyDisplay,
        isSalesQtyDisplay,
        paramCategoryId,
        spec1Name: productItems[0].spec1Name,
        spec1Value: (productItems.map(valueItem => valueItem.spec1Value)).join('_'), seqNum: 0,
        updateTime: this.getLocalTime(new Date().getTime()),
        startSellTime: selDate ? selDate : startSellTime,
        content: editorContent
      }
    } else {
      if (unit == '斤') {
        weight = 0.5
      } else {
        if (!weight) {
          Taro.showToast({
            title: '请填写重量',
            icon: 'none'
          })
          return
        }
      }
      if (!price || !qty) {
        Taro.showToast({
          title: '请将信息填写完整',
          icon: 'none'
        })
        return
      }
      params = {
        storeCategoryName, storeCategoryId,
        isMultiSpec: false,
        unit,
        iconUrl: voucherImage[0],
        createTime, isDeleted, appId, appraise, careSeqNum,
        id: prodId,
        isSell: isSell,
        price: utils.mul(price, 100),
        supplierPrice: utils.mul(supplierPrice, 100),
        origPrice: utils.mul(origPrice, 100),
        qty: Number(qty), weight: utils.mul(weight, 1000),
        minOrderQuantity: minOrderQuantity,
        rollingImgUrl: Imageurl, categoryIds: categoryIds, name,
        productItems: [],
        introduce,
        productParams: productParams,
        level: leveltxt,
        isQtyDisplay,
        isSalesQtyDisplay,
        paramCategoryId,
        spec1Name: spec1Name,
        spec1Value: spec1Value, seqNum: 0,
        updateTime: this.getLocalTime(new Date().getTime()),
        startSellTime: selDate ? selDate : startSellTime,
        content: editorContent
      }
    }

    // if (!this.state.isShowCom) {
    //   params.productItems = []
    //   params.spec1Name = ''
    //   params.spec1Value = ''
    // } else if (this.state.isShowCom && productItems.length === 0) {
    //   Taro.showToast({
    //     title: '请添加规格',
    //     icon: 'none'
    //   })
    //   return
    // }

    const res = await editGoods(params)
    Taro.hideLoading()
    if (res.data.code == 20000) {
      // this.storeRelation()
      Taro.setStorageSync('isalter', false)
      Taro.setStorageSync('changeData', params)
      Taro.showToast({
        title: '商品编辑成功',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack({ delta: 1 })
      }, 1000);
    }
  }

  // -------------------------------移动图片-------------------------------start
  //长按
  longtap(e) {
    var maskImg = e.currentTarget.dataset.img
    this.setState({
      maskImg: maskImg
    })
    const detail = e.detail;
    this.setState({
      x: e.currentTarget.offsetLeft,
      y: e.currentTarget.offsetTop
    })
    this.setState({
      hidden: false,
      flag: true
    })
  }
  //触摸开始
  touchs(e) {
    this.setState({
      beginIndex: e.currentTarget.dataset.index
    })
  }
  //触摸结束
  touchend(e) {
    if (!this.state.flag) {
      return;
    }
    const x = e.changedTouches[0].pageX
    const y = e.changedTouches[0].pageY
    const list = this.state.elements;
    let data = this.state.voucherImage
    for (var j = 0; j < list.length; j++) {
      const item = list[j];
      if (x > item.left && x < item.right && y > item.top && y < item.bottom) {
        const endIndex = item.dataset.index;
        const beginIndex = this.state.beginIndex;
        //向后移动
        if (beginIndex < endIndex) {
          let tem = data[beginIndex];
          for (let i = beginIndex; i < endIndex; i++) {
            data[i] = data[i + 1]
          }
          data[endIndex] = tem;
        }
        //向前移动
        if (beginIndex > endIndex) {
          let tem = data[beginIndex];
          for (let i = beginIndex; i > endIndex; i--) {
            data[i] = data[i - 1]
          }
          data[endIndex] = tem;
        }
        this.setState({
          voucherImage: data
        })
      }
    }
    this.setState({
      hidden: true,
      flag: false
    })
  }
  //滑动
  touchm(e) {
    var { x, y } = this.state
    console.log(x, y, this.state.textHeight)
    //请着重 好好的 看看这里 朋友们 拖拽会不会出bug 就看这里了*
    this.setState({
      x: x - 75,
      y: y - this.state.textHeight * 2
    })
    // 为什么这里要这么写，因为x，y是你拖拽view距离顶部和左边的距离，需要剪掉，如果不减，拖拽会很变态，我这里为什么用了 this.data.textHeight，因为我顶部有个textarea，高是auto的，所以我要获取textarea的高度，这里获取到的高度是px，*2变成rpx

    if (this.state.flag) {
      const x = e.touches[0].pageX
      const y = e.touches[0].pageY
      if (this.state.textHeight > 70) {
        this.setState({
          x: x - 75,
          y: y - this.state.textHeight * 2
        })
      } else {
        this.setState({
          x: x - 75,
          y: y - 140
        })
      }

    }
  }
  // --------------------------------移动图片---------------------------------end
  config: Config = {
    navigationBarTitleText: "编辑商品"
  };
  render() {
    const { storeCate, storeCategoryName, x, y, disabled, saveList, maskImg, editorContent, startSellTime, isDate, selDate, now, isShowCom, productParams, voucherImage, islist1, islist2,
      bylist, bylist1, bylist2, advert, advert1, advert2, levels, id1, unit, units, introduce, price, hidden,
      supplierPrice, origPrice, weight, qty, minOrderQuantity, totaldata, productItems, prodparams, leveltxt, isSalesQtyDisplay, isQtyDisplay } = this.state
    console.log(advert1)
    return (
      <Block>

        {isDate && (
          <View className="choosedate">
            {/* <View className="mengc" onClick={this.datehide}></View> */}
            <DatetimePicker
              className="pickdata"
              type="datetime"
              value={now}
              cancel={this.cancel.bind(this)}
              confirm={this.confirm.bind(this)}
              currentDate={now}
            ></DatetimePicker>
          </View>
        )}
        <View className="add-a">
          <View className='good-pic '>
            <View>
              <Text><Text className='red'>*</Text>商品主图
              <Text className='order-pic'>(最多可上传8张, 建议尺寸750*750, 最大2M)</Text></Text>
            </View>
            <View className="weui-uploader__bd">
              <View className="weui-uploader__files">
                <MovableArea>
                  {voucherImage.map((item, index) => {
                    return (
                      <View className="weui-uploader__file" key={String(index)} data-index={index} data-img={item}
                        onLongPress={this.longtap} onTouchStart={this.touchs} onTouchEnd={this.touchend} onTouchMove={this.touchm}>
                        <Image className="weui-uploader__img"
                          mode='aspectFit'
                          src={IMG_HOST + item}
                          data-src={item}
                          data-index={index}
                          onClick={() => {
                            Taro.previewImage({
                              current: IMG_HOST + item,
                              urls: voucherImage.map(img => IMG_HOST + img)
                            })
                          }}></Image>
                        <Text className='iconfont icon-shanchu delete' onClick={this.deleteImg(index)}></Text>
                      </View>
                    )
                  })}

                  <MovableView x={x} y={y} direction="all" damping='5000' friction='1' disabled={disabled}>
                    {!hidden && (
                      <View className='item-move'>
                        <Image src={IMG_HOST + maskImg} mode='aspectFit'></Image>
                      </View>
                    )}
                  </MovableView>
                </MovableArea>

              </View>
              {voucherImage.length < 8 && (
                <View className="weui-uploader__input-box ">
                  <View className="weui-uploader__input" onClick={this.chooseImage}></View>
                </View>
              )}
            </View>
          </View>
          <View className='goods'>
            <Text>店铺分类</Text>
            <View className='order-write'>
              <Picker mode='selector' range={storeCate} rangeKey='name' onChange={this.gainStoreClass}>
                {storeCategoryName ? (
                  <View className='picker'>{storeCategoryName} </View>
                ) : (
                    <View className='place'>请选择</View>
                  )}
              </Picker>
              <Image className='addStore' onClick={() => { Taro.navigateTo({ url: '../addclass/addclass?type=addProduct' }) }} src={IMG_HOST + '/attachments/null/0368a7153b544becb585e2d90d5c0fde.png'}></Image>
            </View>
          </View>
          <View className='goods'>
            <Text><Text className='red'>*</Text>商品分类</Text>
            <View className='order-write class-list classify'>
              <Picker mode='selector' range={bylist} rangeKey={'name'} onChange={this.chooseby}>
                <View className='picker'>{advert ? advert : '请选择'}</View>
              </Picker>
              {advert1 && (
                <Picker mode='selector' range={bylist1} rangeKey={'name'} onChange={this.chooseby1}>
                  <View className='picker'>>{advert1 ? advert1 : '请选择'} </View>
                </Picker>
              )}
              {advert2 && (
                <Picker mode='selector' range={bylist2} rangeKey={'name'} onChange={this.chooseby2}>
                  <View className='picker'>>{advert2 ? advert2 : '请选择'} </View>
                </Picker>
              )}
            </View>
            {/* <Image className='right-j' src={wx.getStorageSync('imgHostItem')+'qt_111.png'}></Image> */}
          </View>
          <View className='goods'>
            <Text><Text className='red'>*</Text>商品名称</Text>
            <View className='order-write'>
              <Input adjustPosition='false' placeholder='请输入名称' placeholderClass='place' value={name} onInput={this.getGoodsname}></Input>
            </View>
          </View>
        </View >

        <View className='add-a'>
          {/* <View className='goods'>
            <Text>多规格</Text>
            <Switch color="orange" checked={isShowCom} onChange={this.changecommon} />
          </View> */}
          {saveList.length == 0 ? (
            <Block>
              <View className='goods'>
                <Text>单位</Text>
                <View className='order-write'>
                  <Picker style='width:100%' mode='selector' range={units} onChange={this.chooseunit}>
                    {unit ? (
                      <View style='width:100%' className='picker'>{unit}</View>
                    ) : (
                        <View style='width:100%' className='picker'>请选择</View>
                      )}
                  </Picker>
                  {/* <Input placeholder='不填默认为斤' placeholderClass='place' value={unit} onInput={this.getUnits}></Input> */}
                </View>
              </View>
              <View className='goods'>
                <Text><Text className='red'>*</Text>售价</Text>
                <View className='order-write'>
                  <Input adjustPosition='false' placeholder='请输入售价' type='digit' placeholderClass='place' value={price} onInput={this.getSell}></Input>
                  <View>元/{unit}</View>
                </View>
              </View>
              <View className='goods'>
                <Text><Text className='red'>*</Text>库存</Text>
                <View className='order-write'>
                  <Input adjustPosition='false' placeholder='请输入库存' type='number' placeholderClass='place' value={qty} onInput={this.getrepert}></Input>
                  <View>{unit}</View>
                </View>
              </View>
              {unit != '斤' && (
                <View className='goods'>
                  <Text><Text className='red'>*</Text>重量</Text>
                  <View className='order-write'>
                    <Input adjustPosition='false' placeholder='用于计算配送物流费' type='digit' placeholderClass='place' value={weight} onInput={this.getWeight}></Input>
                    <View>公斤/{unit}</View>
                  </View>
                </View>
              )}
              <View className='goods'>
                <Text>成本价</Text>
                <View className='order-write'>
                  <Input adjustPosition='false' placeholder='不填写默认为0' type='digit' placeholderClass='place' value={supplierPrice} onInput={this.getSupper}></Input>
                  <View>元/{unit}</View>
                </View>
              </View>
              <View className='goods'>
                <Text>原价</Text>
                <View className='order-write'>
                  <Input adjustPosition='false' placeholder='不填写默认为0' type='digit' placeholderClass='place' value={origPrice} onInput={this.orignPrice}></Input>
                  <View>元/{unit}</View>
                </View>
              </View>
              <View className='goods'>
                <Text>最低起订量</Text>
                <View className='order-write'>
                  <Input adjustPosition='false' placeholder='不填写默认为1' type='number' placeholderClass='place' value={minOrderQuantity} onInput={this.getLowest}></Input>
                  <View>{unit}</View>
                </View>
              </View>
            </Block>
          ) : (
              // <View className="addstand" onClick={this.groupAdd}>
              //   <View className='add-char' >
              //     {productItems.length > 0 || totaldata.length > 0 ? <View>已设置，点击查看</View> : <View>+ 添加规格</View>}
              //   </View>
              // </View>
              <View className="add-a">
                <View>
                  {saveList.length > 0 && (
                    <View className='specs-name'>
                      <Text style='margin-right: 40rpx;'>规格名: </Text>
                      <Input adjustPosition='false' style='flex: 1;text-align: left; font-size: 32rpx; color: #333;'
                        placeholder='请输入规格名'
                        placeholderClass='place'
                        value={saveList[0].spec1Name}
                        onInput={(e) => { this.inputSpecsName1(e, 0) }}
                      ></Input>
                      {/* onBlur={(e) => (this.inputSpecsName(e, 0))} */}
                    </View>
                  )}
                  {saveList.map((val, valindex) => {
                    return (
                      <View className='sku-row' key={String(valindex)}>
                        <View className='common-title'>
                          <Block>
                            <View className='val-col'>
                              <View className='row-specs-name'>{val.spec1Name} ： </View>
                            </View>
                            <View className='val-col row-specs-value'>
                              {/* <View style="color:#FF671E">{val.spec1Value}</View> */}
                              <Input adjustPosition='false' autoFocus className='specs-value-input'
                                style="color:#FF671E;"
                                placeholder='请输入规格值'
                                placeholderClass='place'
                                value={val.spec1Value}
                                onBlur={(e) => (this.inputSpecsValue1(e, valindex))}></Input>
                              <Image className='delete-img' src={wx.getStorageSync('imgHostItem') + 'cancel.png'} onClick={() => {
                                saveList.splice(valindex, 1)
                                this.setState({ saveList })
                              }}></Image>
                            </View>
                          </Block>
                        </View>
                        <View className='goods'>
                          <Text>单位</Text>
                          <View className='order-write'>
                            <Picker style='width:100%' mode='selector' range={units} data-vindex={valindex} data-val={val} onChange={(e) => { this.chooseunit1(e) }}>
                              {saveList[valindex].unit ? (
                                <View style='width:100%' className='picker'>{saveList[valindex].unit}</View>
                              ) : (
                                  <View style='width:100%' className='picker'>请选择</View>
                                )}
                            </Picker>
                            {/* <Input placeholder='不填默认为斤' type='digit' placeholderClass='place' value={val.unit} onInput={(e) => (this.getUnit(e, valindex, val))}></Input> */}
                          </View>
                        </View>
                        <View className='goods'>
                          <Text><Text className='red'>*</Text>售价</Text>
                          <View className='order-write'>
                            <Input adjustPosition='false' placeholder='请输入售价' type='digit' placeholderClass='place' value={val.price} onBlur={(e) => (this.getSell1(e, valindex, val))}></Input>
                            <View>元/{saveList[valindex].unit}</View>
                          </View>
                        </View>
                        <View className='goods'>
                          <Text><Text className='red'>*</Text>库存</Text>
                          <View className='order-write'>
                            <Input adjustPosition='false' placeholder='请输入库存' type='number' placeholderClass='place' value={val.qty} onInput={(e) => (this.getrepert1(e, valindex))}></Input>
                            <View>{saveList[valindex].unit}</View>
                          </View>
                        </View>
                        {saveList[valindex].unit != '斤' && (
                          <View className='goods'>
                            <Text><Text className='red'>*</Text>重量</Text>
                            <View className='order-write'>
                              <Input adjustPosition='false' placeholder='用于计算配送物流费' diabled type='digit' placeholderClass='place' value={val.weight} onInput={(e) => (this.getWeight1(e, valindex))}></Input>
                              <View>公斤/{saveList[valindex].unit}</View>
                            </View>
                          </View>
                        )}
                        <View className='goods'>
                          <Text><Text className='red'>*</Text>成本价</Text>
                          <View className='order-write'>
                            <Input adjustPosition='false' placeholder='请输入成本价' type='digit' placeholderClass='place' value={val.supplierPrice} onInput={(e) => (this.getSupper1(e, valindex))}></Input>
                            <View>元/{saveList[valindex].unit}</View>
                          </View>
                        </View>
                        <View className='goods'>
                          <Text>原价</Text>
                          <View className='order-write'>
                            <Input adjustPosition='false' placeholder='不填写默认为 0' type='digit' placeholderClass='place' value={val.origPrice} onInput={(e) => (this.orignPrice1(e, valindex))}></Input>
                            <View>元/{saveList[valindex].unit}</View>
                          </View>
                        </View>
                        <View className='goods'>
                          <Text>最低起订量</Text>
                          <View className='order-write'>
                            <Input adjustPosition='false' placeholder='不填写默认为 1' type='number' placeholderClass='place' value={val.minOrderQuantity} onInput={(e) => (this.getLowest1(e, valindex))}></Input>
                            <View>{saveList[valindex].unit}</View>
                          </View>
                        </View>
                      </View>
                    )
                  })}
                  {saveList.length > 0 && (
                    <View className='addSpecsValue' onClick={() => {
                      let spec1NameStr = saveList[0] ? saveList[0].spec1Name : ''
                      let unitStr = saveList[0] ? saveList[0].unit : ''
                      saveList.push({
                        spec1Name: spec1NameStr,
                        spec1Value: '',
                        unit: unitStr
                      })
                      this.setState({ saveList: saveList })
                    }}>+ 添加规格值</View>
                  )}
                </View>
              </View>
            )}
          {saveList.length == 0 && <View className='addSpecsValue' onClick={() => {
            // if (productParams.length == 0) {
            //   saveList[0].price = price
            //   saveList[0].qty = qty
            //   saveList[0].weight = weight
            //   saveList[0].origPrice = origPrice
            //   saveList[0].supplierPrice = supplierPrice
            //   saveList[0].minOrderQuantity = minOrderQuantity
            // }
            saveList.push({
              spec1Name: '',
              spec1Value: '',
              unit: unit,
              price: price,
              qty: qty,
              weight: weight,
              origPrice: origPrice,
              supplierPrice: supplierPrice,
              minOrderQuantity: minOrderQuantity
            })
            saveList.push({
              spec1Name: '',
              spec1Value: '',
              unit: '斤',
            })

            this.setState({ saveList: saveList })
          }}>+ 添加规格</View>}
        </View>

        <View className="add-a">
          <View className='goods' onClick={this.goeditor}>
            <Text>商品详情</Text>
            <View className='order-write'>
              {/* <Editor></Editor> */}

              <Text>{editorContent ? '去查看' : '请添加'}</Text>
              <Image src={Taro.getStorageSync('imgHostItem') + 'qt_181.png'}></Image>
            </View>
          </View>
          <View className='goods'>
            <Text>商品卖点</Text>
            <View className='order-write'>
              <Input adjustPosition='false' cursorSpacing='5' placeholder='请输入' placeholderClass='place' value={introduce} onInput={this.getsellPoint}></Input>
            </View>
          </View>
          <View className='goods' onClick={() => { Taro.navigateTo({ url: '../addstand/addstand?id=' + id1 + '&productParams=' + JSON.stringify(productParams) }) }}>
            <Text>商品参数</Text>
            <View className='order-write'>
              {productParams.length == 0 ? (
                <Text>去设置</Text>
              ) : (
                  <Text>去查看</Text>
                  // <Block>
                  //   {productParams.map(item => {
                  //     return (
                  //       <Text>{item.paramName}</Text>
                  //     )
                  //   })}
                  // </Block>
                )}

              <Image src={wx.getStorageSync('imgHostItem') + 'qt_181.png'}></Image>
            </View>
          </View>
          {/* onClick={this.getprodLevel} */}
          <View className='goods'>
            <Text>商品优质等级</Text>
            <View className='order-write'>
              <Picker style='width:500rpx;z-index:88' mode='selector' range={levels} rangeKey={'value'} onChange={this.onlevelChange}>
                {leveltxt ? (
                  <View className='picker'>{leveltxt} </View>
                ) : (
                    <View className='place'>请选择</View>
                  )}
              </Picker>
              <Image src={Taro.getStorageSync('imgHostItem') + 'qt_111.png'}></Image>
            </View>
          </View>
        </View>

        <View className="add-a">
          <View className='goods'>
            <Text>是否显示库存</Text>
            {isQtyDisplay ? (
              <Switch color="orange" checked onChange={this.switch1Change} />
            ) : (
                <Switch color="orange" onChange={this.switch1Change} />
              )}

          </View>
          <View className='goods'>
            <Text>是否显示销量</Text>
            {isSalesQtyDisplay ? (
              <Switch checked color="orange" onChange={this.switch2Change} />
            ) : (
                <Switch color="orange" onChange={this.switch2Change} />
              )}

          </View>
          <View className='goods'>
            <Text>开售时间</Text>
            <View className='order-write'>
              <View style='display:flex;width:450rpx;'>
                {selDate ? (
                  <View className='picker' onClick={this.onDateChange}>{selDate}</View>
                ) : (
                    <View className='picker' onClick={this.onDateChange}>{startSellTime}</View>
                  )}
                {/* <Picker mode='date' onChange={this.onDateChange}>
                  <View className='picker'>{this.state.startTime} </View>
                </Picker>
                {startTime && (
                  <Picker mode='time' onChange={this.onDateChangetime}>
                    <View className='picker'>{this.state.times}</View>
                  </Picker>
                )} */}
              </View>
              {/* <Image src={wx.getStorageSync('imgHostItem')+'qt_111.png'}></Image> */}
            </View>
          </View>
        </View>
        <View className="goods-way">
          <Text>库存扣减方式：</Text>
          <Text>买家提交订单后，扣减库存数量，订单10分钟内不付款或手动取消订单，系统自动返还库存</Text>
        </View>
        <View style="height:140rpx;"></View>
        <View className="btns">
          <View onClick={() => { this.putaway() }}>保存</View>
        </View>

      </Block >
    );
  }
}
