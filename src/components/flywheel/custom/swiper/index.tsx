import Taro from '@tarojs/taro';
import { SwiperItem, Swiper, Image, Block } from '@tarojs/components';
import { IMG_HOST } from '@/config';
import QcLayoutSplit from '../layout-split';
import './index.scss';

type Props = {
  options: {
    needSplit: boolean;
    autoplay: boolean;
    indicatorDots: boolean;
    height: number;
    interval: number;
    item: {
      url: string;
      iconUrl: string;
      name?: string;
    }[];
  };
};
export default function QcSwiper(props: Props) {
  const { options } = props;
  function onJumpPage(url: string) {
    if (url) {
      Taro.navigateTo({ url });
    }
  }
  const style = { width: '100%', height: props.options.height * 2 + 'rpx' };
  return (
    <QcLayoutSplit needSplit={options.needSplit}>
      <Swiper
        className='qc-swiper'
        style={style}
        indicatorDots={options.indicatorDots}
        autoplay={options.autoplay}
        circular
        interval={options.interval}>
        {options.item.map(item => {
          return (
            <Block key={item.iconUrl}>
              <SwiperItem
                onClick={() => {
                  onJumpPage(item.url);
                }}>
                <Image style={style} mode='widthFix' src={IMG_HOST + item.iconUrl}></Image>
              </SwiperItem>
            </Block>
          );
        })}
      </Swiper>
    </QcLayoutSplit>
  );
}

QcSwiper.defaultProps = {
  options: {
    needSplit: false,
    item: []
  }
};
