require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';


let imageDatas = require('json!../data/imageDatas.json');  //获取图片相关数据
console.log(imageDatas);

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

// 单个图片组件
class ImgFigure extends React.Component {
    render() {
        return (
            <figure className="img-figure">
                <img src={this.props.data.imageURL} alt={this.props.data.title}/>
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                </figcaption>
            </figure>
        )
    }
}
// 最外层组件
class GalleryByReact extends React.Component {
  // 常量的初始化
  Constant = {
    centerPos :{       //中心点的坐标
      left: 0,
      top:0
    },
    hposRange:{        // 水平方向坐标的范围
      leftSectionX:[0,0],              // 左分区x的取值范围
      rightSectionX:[0,0],            // 右分区x的取值范围
      y:[0,0]                         // y的取值范围相同
    },
    vposRange:{        // 垂直方向坐标范围
      x:[0,0],
      y:[0,0]
    }
  }

  // 组件加载后，为每张图片计算其位置的范围
  componentDidMount() {
    // 获取舞台元素节点
     var stageDom = ReactDOM.findDOMNode(this.refs.stage),
         halfStageWidth = Math.ceil(stageDom.scrollWidth/2),    // 舞台宽度的一半
         halfStageHeight = Math.ceil(stageDom.scrollHeight/2);

    // 拿到imgFigure的大小
    var imgFigureDom = React.findDOMNode(this.refs.imgFigure0),
        halfImgWidth = Math.ceil(imgFigureDom.scrollWidth/2),
        halfImgHeight = Math.ceil(imgFigureDom.scrollHeight/2);

    // 计算中心图片的位置
    this.Constant.centerPos = {
      left: halfStageWidth-halfImgWidth,
      top: halfStageHeight-halfImgHeight
    }
    // 水平图片位置的范围
    this.Constant.hposRange.leftSectionX[0] = - halfImgWidth;
    this.Constant.hposRange.leftSectionX[1] = halfStageWidth- halfImgWidth*3;
    // 右分区
    this.Constant.hposRange.rightSectionX[0] = halfStageWidth + halfImgWidth;
    this.Constant.hposRange.rightSectionX[1] = halfStageWidth*2 - halfImgWidth;

    this.Constant.hposRange.y[0] = - halfImgHeight;
    this.Constant.hposRange.y[1] = halfStageHeight*2 - halfImgHeight;
    // 垂直图片位置的范围

    // 上分区
    this.Constant.vposRange.x[0] = halfStageWidth - halfImgWidth*2;
    this.Constant.vposRange.x[1] = halfStageWidth*2 + halfImgWidth*2;

    this.Constant.vposRange.y[0] = - halfImgHeight;
    this.Constant.vposRange.y[1] = halfStageHeight*2 - halfImgHeight*3;
  }

  // 重新布局所有的图片
  rearrange(centerIndex){    // 指定居中的图片

  }
  getInitialStage(){
    return {
      imgsArrangeArr: [
        // {
        //   pos:{
        //     left:'0',
        //     top:'0'
        //   }
        // }
      ]
    }
  }

  render() {
      var controllerUnits = [],     // 下边btn结构
          imgFigures = [];          // 图片结构

      imageDatas.forEach(function(value,index){
          if(!this.state.imgsArrangeArr[index]){
            this.state.imgsArrangeArr[index] = {
              pos:{
                left:0,
                top:0
              }
            }
          }
          imgFigures.push(<ImgFigure data={value} ref={"imgFigure" + index} />);
      }).bind(this);

    return (
      <session className="stage" ref="stage">
        <session className="img-sec">
            {imgFigures}
        </session>
        <nav className="controller-nav">
            {controllerUnits}
        </nav>
      </session>
    );
  }
}

GalleryByReact.defaultProps = {
};

export default GalleryByReact;
