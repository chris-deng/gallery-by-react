require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';


let imageDatas = require('../data/imageDatas.json');  //获取图片相关数据
// 利用自执行函数，将图片名信息转化为图片url信息
imageDatas = (
  function getImageURL(imageDatas) {
  for(var i=0,len=imageDatas.length;i<len;i++){
    var singleImageData = imageDatas[i];
    singleImageData.imageURL = require('../images/'+singleImageData.fileName);

    imageDatas[i] = singleImageData;
  }
  return imageDatas;
})(imageDatas);

class GalleryByReact extends React.Component {
  render() {
    return (
      <session className="stage">
        <session className="img-sec">
        </session>
        <nav className="controller-nav">
        </nav>
      </session>
    );
  }
}

GalleryByReact.defaultProps = {
};

export default GalleryByReact;
