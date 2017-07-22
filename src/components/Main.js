require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
//此处用了url-loader将图片的名字转换为了图片的真实地址
// let yeomanImage = require('../images/yeoman.png');
//引入图片数据
var imageDatas = require('../data/imageDatas.json');
/**
 * 利用自执行函数，将图片的名称转换为图片的真实地址
 * @param {Arr} imageDatasArr  图片信息数组
 * @return {Arr} 返回图片信息数组
 */
(function genImageURL(imageDatasArr){
    for(var i = 0,j = imageDatasArr.length; i < j; i++){
		var singleImageData = imageDatasArr[i];
		singleImageData.imageURL  = require('../images/'+singleImageData.fileName);
	}
	return imageDatasArr;
})(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
	      <section className="img-sec">
                  hello react
		  </section>
		  <nav className="controller-nav">

		  </nav>
	  </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
