import Taro from '@tarojs/taro'
import { Image } from '@tarojs/components'
export default class ScaleImage extends Taro.Component {
    constructor() {
        super(...arguments)
        this.state = {
            offsetX: 0,
            offsetY: 0,
            zoom: false,
            distance: 0,
            scale: 1
        }
        this.startX = 0;
        this.startY = 0;
    }

    render() {
        let { scale } = this.state;
        let { imageSrc } = this.props;
        return (
            <Image
                src={imageSrc}
                mode='widthFix'
                ontouchstart={this.touchStart.bind(this)}
                ontouchmove={this.touchMove.bind(this)}
                ontouchend={this.touchEnd.bind(this)}
                style={{ width: 100 * scale + '%' }}
            />
        )
    }

    touchStart(e) {
        if (e.touches.length == 1) {
            let { clientX, clientY } = e.touches[0];
            this.startX = clientX;
            this.startY = clientY;
        } else {
            let xMove = e.touches[1].clientX - e.touches[0].clientX;
            let yMove = e.touches[1].clientY - e.touches[0].clientY;
            let distance = Math.sqrt(xMove * xMove + yMove * yMove);
            this.setState({
                distance,
                zoom: true,
            })
        }
    }

    // 触摸移动事件
    touchMove(e) {
        if (e.touches.length == 1) {
            //单指移动,缩放状态，不处理单指
            if (this.state.zoom) {
                return;
            }
            let { clientX, clientY } = e.touches[0];
            let newoffsetX = clientX - this.startX;
            let newoffsetY = clientY - this.startY;
            this.startX = clientX;
            this.startY = clientY;
            let { offsetX, offsetY, offsetLeftX, offsetLeftY } = this.state;
            offsetX += newoffsetX;
            offsetY += newoffsetY;
            offsetLeftX = -offsetX;
            offsetLeftY = -offsetY;
            this.setState({
                offsetX, offsetY, offsetLeftX, offsetLeftY
            });
        } else {
            //双指缩放
            let xMove = e.touches[1].clientX - e.touches[0].clientX;
            let yMove = e.touches[1].clientY - e.touches[0].clientY;
            let distance = Math.sqrt(xMove * xMove + yMove * yMove);
            let distanceDiff = distance - this.state.distance;
            let newScale = this.state.scale + 0.005 * distanceDiff;
            // 缩放比例设置
            if (newScale <= 2.5 && newScale >= 1) {
                this.setState({
                    distance,
                    scale: newScale,
                })
            }
        }
    }

    // 触摸结束事件,重置缩放状态
    touchEnd(e) {
        if (e.touches.length == 0) {
            this.setState({
                zoom: false
            })
        }
    }
}