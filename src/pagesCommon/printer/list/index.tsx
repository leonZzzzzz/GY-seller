import Taro, { useState, useEffect, useDidShow } from '@tarojs/taro';
import { View, Text, Radio, RadioGroup } from '@tarojs/components';
import './index.scss';
import { getPrinter, addPrinter, deletePrinter } from '@/api/printer';
import { Dialog } from '@/components/common';

import { AtInput } from 'taro-ui'
export default function Index() {

  // interface modelOptions {
  //   name: string, 
  //   key: string, 
  //   value: string, 
  //   showType: Number
  // }

  const [list, setList] = useState([]);
  const [model, setModel] = useState<any>({ name: '', key: '', value: '', showType: 1, state: '' });
  const [model2, setModel2] = useState<any>({ name: '', key: '', value: '', showType: 2, state: '' });
  // const [model, setModel] = useState<any>({});
  // const [model2, setModel2] = useState<any>({});

  useDidShow(() => {
    getPrinterData(1);
    getPrinterData(2);
  });

  const getPrinterData = async (showType) => {
    Taro.showLoading({ title: 'loading' })
    try {
      const res = await getPrinter({ showType })
      Taro.hideLoading()
      if (showType === 2) {
        if (res.data.data.state) {
          setModel2(res.data.data)
        }
      } else {
        if (res.data.data.state) {
          setModel(res.data.data)
        }
      }
      setList(res.data.data.list)
    } catch (error) {
      Taro.hideLoading()
    }
  }

  const onAddPrinter = async (showType: number, params) => {
    if (params) params = JSON.parse(JSON.stringify(params))
    if (!params.key) {
      Taro.showToast({ title: '请输入打印机终端号', icon: 'none' })
      return
    }
    if (!params.value) {
      Taro.showToast({ title: '请输入打印机秘钥', icon: 'none' })
      return
    }
    try {
      // Taro.showLoading({title: 'loading'})
      const res = await addPrinter(params)
      Taro.hideLoading()
      if (res.data.code == 20000) {
        Taro.showToast({ title: model.id ? '保存成功' : '添加成功' })
        setTimeout(function () { getPrinterData(showType) }, 1000);
      }
    } catch (error) {
      // Taro.hideLoading()
    }
  }


  const formatShowType = (val) => {
    return { '0': '小票打印机', 2: '标签打印机' }[val]
  }

  return (
    <View className='printerlist'>
      <View className='form-box'>
        <View className='form-box-title'>小票打印机</View>
        <View className='form-body'>
          <AtInput
            name='key'
            title='打印机终端号'
            type='text'
            placeholder='请输入'
            placeholderStyle="font-szie: inherit;"
            value={model.key}
            onChange={(value) => {
              model.key = value
              setModel(model)
            }}
          />
          <AtInput
            name='value'
            title='打印机秘钥'
            type='text'
            placeholder='请输入'
            placeholderStyle="font-szie: inherit;"
            value={model.value}
            onChange={(value) => {
              model.value = value
              setModel(model)
            }}
          />
          <View className='form-box-row'>
            <View className='form-box-col label'>打印机状态</View>
            {model.state === '0'
              ? <View className='form-box-col label' style='color: #999;'>离线</View>
              : model.state === '1' ? <View className='form-box-col label' style='color: green;'>在线</View>
                : model.state === '2' ? <View className='form-box-col label' style='color: #eed49a;'>缺纸</View>
                  : model.state === '3' ? <View className='form-box-col label' style='color: #eed49a;'>打印机配置错误</View>
                    : <View className='form-box-col label'>{model.state}</View>
            }
          </View>
        </View>
        <View className='form-btns'>
          <Text className='form-btn' onClick={() => { onAddPrinter(1, model) }}>保 存</Text>
        </View>
      </View>

      <View className='form-box'>
        <View className='form-box-title'>标签打印机</View>
        <View className='form-body'>
          <AtInput
            name='key'
            title='打印机终端号'
            type='text'
            placeholder='请输入'
            placeholderStyle="font-szie: inherit;"
            value={model2.key}
            onChange={(value) => {
              model2.key = value
              setModel2(model2)
            }}
          />
          <AtInput
            name='value'
            title='打印机秘钥'
            type='text'
            placeholder='请输入'
            placeholderStyle="font-szie: inherit;"
            value={model2.value}
            onChange={(value) => {
              model2.value = value
              setModel2(model2)
            }}
          />
          <View className='form-box-row'>
            <View className='form-box-col label'>打印机状态</View>
            {model2.state === '0'
              ? <View className='form-box-col label' style='color: #999;'>离线</View>
              : model2.state === '1' ? <View className='form-box-col label' style='color: green;'>在线</View>
                : model2.state === '2' ? <View className='form-box-col label' style='color: #eed49a;'>缺纸</View>
                  : model2.state === '3' ? <View className='form-box-col label' style='color: #eed49a;'>打印机配置错误</View>
                    : <View className='form-box-col label'>{model2.state}</View>
            }
          </View>
        </View>
        <View className='form-btns'>
          <Text className='form-btn' onClick={() => { onAddPrinter(2, model2) }}>保 存</Text>
        </View>
      </View>
    </View>
  );
}

Index.config = {
  navigationBarTitleText: '打印机管理'
};
