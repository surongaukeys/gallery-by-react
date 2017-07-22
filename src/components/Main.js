require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import { findDOMNode } from 'react-dom';
// 此处用了url-loader将图片的名字转换为了图片的真实地址 let yeomanImage =
// require('../images/yeoman.png'); 引入图片数据
var imageDatas = require('../data/imageDatas.json');
/**
 * 利用自执行函数，将图片的名称转换为图片的真实地址
 * @param {Arr} imageDatasArr  图片信息数组
 * @return {Arr} 返回图片信息数组
 */
(function genImageURL(imageDatasArr) {
  for (var i = 0, j = imageDatasArr.length; i < j; i++) {
    var singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
  }
  return imageDatasArr;
})(imageDatas);

/**
 * @description 获取区间内一个随机值
 * @author surong@aukeys.com
 * @param {any} low 最小值
 * @param {any} high 最大值
 * @returns 区间内的一个随机数
 */
function getRangeRandom(low,high){
	return Math.ceil(Math.random() * (high - low) + low);
}
// 图片组件
class ImageFigure extends React.Component {
	render() {
		var styleObj = {};
		if(this.props.arrang){
            styleObj = this.props.arrang.pos;
		}
		return (
			<figure className = "img-figure" style={styleObj}>
				<img src = {this.props.data.imageURL} alt = {this.props.data.title}/>
				<figcaption>
					<h2 className = "img-title" >{this.props.data.title}</h2>
				</figcaption>
			</figure>
		)
	}
}

// 总管家组件
class AppComponent extends React.Component {
	constructor(props) {
		super(props);
		this.Constant = {
			// 中心位置的偏移
			centerPos: {
				top: 0,
				left: 0
			},
			// 水平方向上的坐标取值范围
			hPosRange: {
				leftSecX: [0, 0],
				rightSecX: [0, 0],
				y: [0, 0]
			},
			// 垂直方向上的坐标取值范围
			vPosRange: {
				x: [0, 0],
				topY: [0, 0]
			}
		};
		this.state = {
            imgsArrangeArr:[]
		};
    }
    // 实例化完成
    componentDidMount() {
		//  补充知识点
		// scrollWidth和clientWidth以及offsetWidth三者的区别
		// scrollWidth实际内容的宽度，不包含滚动条等边线宽度
		// wiki里面含有相应的介绍

		//  获取舞台的大小
		var stageDOM = findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW/2),
			halfStageH = Math.ceil(stageH/2);
		
		// 获取figure大小
		var imgFifureDOM = findDOMNode(this.refs.imgFigure0),
			imgW = imgFifureDOM.scrollWidth,
			imgH = imgFifureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);
		
		// 计算中心点的值
		this.Constant.centerPos = {
			top:halfStageH - halfImgH,
			left:halfStageW - halfImgW
		};
		
		// 计算左侧、右侧区域图片排布位置的取值范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
		
		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;

		// 计算上侧区域图片排布位置的取值范围
		this.Constant.vPosRange.topY[0] = -halfImgH
		this.Constant.vPosRange.topY[1] =  halfStageH - halfImgH * 3;

		this.Constant.vPosRange.x[0] =  halfStageW - imgW;
		this.Constant.vPosRange.x[1] =  halfStageW;
		// 生成一个随机数,用于中心图片的位置索引
		this.rearrange(Math.floor(Math.random() * this.state.imgsArrangeArr.length));
	}

	/**
	 * @description 重新布局所有的图片
	 * @author surong@aukeys.com
	 * @param {any} centerIndex 指定需要显示在中央的图片的索引
	 * @memberof AppComponent
	 */
	rearrange(centerIndex){
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,//状态信息
			centerPos = Constant.centerPos,//中心图片的状态信息
			hPosRange = Constant.hPosRange,//水平方向上的位置范围
			vPosRange = Constant.vPosRange,//垂直方向上的位置范围
			hPosRangeLeftSecX = hPosRange.leftSecX,//水平方向上左侧x的取值范围
			hPosRangeRightSecX = hPosRange.rightSecX,//水平方向上右侧x的取值范围
			hPosRangeY = hPosRange.y,//水平方向上y的位置范围
			vPosRangeTopY = vPosRange.topY,//垂直方向上的y的取值范围
			vPosRangeX = vPosRange.x,//垂直方向上的x的取值范围

			imgsArrangeTopArr = [],//位于上测区域的图片信息数组
			topImgNum = Math.floor(Math.random() * 2),//上测区域的图片数量
			topImgSpliceIndex = 0,//上册区域的图片的索引
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);//中心区域的图片信息数组
			
		//设置中心图片的状态信息
		imgsArrangeCenterArr[0].pos = centerPos;

		// 取出要布局上测的图片的状态信息
		topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
		imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
		
		// 布局位于上测的图片
		imgsArrangeTopArr.forEach(function(value,index){
            imgsArrangeTopArr[index].pos = {
				top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
				left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
			}
		});

		// 布局左右两侧的图片
        for(var i = 0 ,j = imgsArrangeArr.length,k = j / 2;i < j; i++){
		   var hPosRangeLORX = null;
		   // 前半部分在左边   后半部分在右侧
			if(i < k){
                hPosRangeLORX = hPosRangeLeftSecX;
			}else{
				hPosRangeLORX = hPosRangeRightSecX;
			}
			// 设置图片的状态信息
			imgsArrangeArr[i].pos = {
				top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
				left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
			}
		}
		// 如果上测区域有图片的话，把上测区域的图片放回去
		if(imgsArrangeTopArr&&imgsArrangeTopArr[0]){
           imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
		}
		// 把中心图片的信息放回数组中去
		imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
		// 重新设置react的状态
		this.setState({
			imgsArrangeArr:imgsArrangeArr
		});
	}
	/**
	 * @description
	 * @author surong@aukeys.com
	 * @returns
	 * @memberof AppComponent
	 */
	getInitialState(){
        return {
			imgsArrangeArr:[
			// {
			// 	pos:{
			// 		left:0,
			// 		top:0
			// 	}
			// }
		    ]
		};
	}

    render() {
        var controllerUnits = [],
			imgFigures = [];
        imageDatas.forEach(function (value, index) {
            if(!this.state.imgsArrangeArr[index]){
                this.state.imgsArrangeArr[index] = {
					pos:{
						top:0,
						left:0
					}
			    }
		    }
		imgFigures.push(<ImageFigure data = {value} key = {index}  ref={'imgFigure'+index} arrang = {this.state.imgsArrangeArr[index]} />);
		}, this);

        return (
			<section className = "stage" ref = "stage">
				<section className = "img-sec">
					{imgFigures}
				</section>
				<nav className = "controller-nav">
					{controllerUnits}
				</nav>
			</section>
        );
      }
    }

    export default AppComponent;
