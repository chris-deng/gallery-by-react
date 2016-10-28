/**
 * Created by dengbingyu on 2016/10/28.
 */
require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
//获取图片相关的数据
let imageDatas = require('json!../data/imageDatas.json');


imageDatas = ((imageDatasArr)=>{               // 将图片的url加入的图片object数组中
  for(var i=0,len=imageDatasArr.length;i<len;i++){
    let singleImgDate = imageDatasArr[i];
    singleImgDate.imageURL= require('../images/' + singleImgDate.fileName);

    imageDatasArr[i] = singleImgDate;
  }
  return imageDatasArr;
})(imageDatas);

// 拿到一个范围内的随机值
var getRandomPos = (low,high) => Math.floor(Math.random()*(high-low)+low);

// 拿到0-30度角里面的随机角度值
var getRandomRotate = ()=> {
  return (Math.random()>0.5?'':'-') + Math.ceil(Math.random()*30);
};

// 创建单个图片组件
class SingleImgComp extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    let styleObj = {};   // 样式对象

    if(this.props.arragneStyle.pos){
      styleObj = this.props.arragneStyle.pos;
    }
    if(this.props.arragneStyle.rotate){
      // ['-webkit-','-moz-','-o-',''].forEach((value)=>{
      //   styleObj[value+'transform'] = 'rotate(' + this.props.arragneStyle.rotate + 'deg)';
      // });
      styleObj['transform'] = 'rotate(' + this.props.arragneStyle.rotate + 'deg)';
    }

    return (
      <figure className="img-figure" style={styleObj}>
        <img src={this.props.data.imageURL} alt={this.props.data.title} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back">
            <p>{this.props.data.desc}</p>
          </div>
        </figcaption>
      </figure>
    );
  }
}


class GalleryByReactApp extends React.Component {
  constructor(props){
    super(props);

    this.Constant = {       // 初始化每张图片的坐标范围，用于盛放各个分区的坐标范围
      centerPos: {
        left:0,
        top:0
      },
      hsec:{        // 水平区域坐标
        hLeftSecX:[0,0],                // 水平区域左分区x轴的坐标范围
        hRightSecX:[0,0],               // 水平区域右分区x轴的坐标范围
        hY: [0,0]                      // 水平区域y的取值相同
      },
      vsec:{                           // 垂直方向只有上分区
        leftX: [0,0],
        topY: [0,0]
      }
    };
    this.state = {             // 真正的图片坐标
      imgsArrangeArr: [             // 图片坐标数组
        // {
        //   pos:{
        //     top:0,
        //     left:0
        //   },
        //   rotate:0,
        //   isInverse: false   // 是否翻转
        // }
      ]
    };
  }

  inverse(index){              // 翻转图片的函数
    return () => {
      let imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }
  }

  // 布局页面图片的坐标
  rearrange(centerIndex){
    let arrangeImgArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hLeftSecRangeX = Constant.hsec.hLeftSecX,
        hRightSecRangeX = Constant.hsec.hRightSecX,
        hY = Constant.hsec.hY,
        vLeftX = Constant.vsec.leftX,      // 上分区
        vTopY = Constant.vsec.topY;

        // 根据居中图片的下标，插入中心图片的坐标
       let centerImgPosArr = arrangeImgArr.splice(centerIndex,1);  // 取出了中心图片的元素
        centerImgPosArr[0] = {
          pos : centerPos           // 将中心图片的坐标插入,居中的图片不需要旋转
        };

        // 上分区图片位置
        let imgTopArr = [],  //用于放置上分区图片
            topNum = Math.floor(Math.random()*2);   // 上分区图片的个数，0或者1

        let topImgIndex = Math.floor(Math.random()*(arrangeImgArr.length - topNum));   // 随机取出放置在上分区图片的下标
            imgTopArr = arrangeImgArr.splice(topImgIndex,topNum);   // 位于上分区的图片数组

        imgTopArr && imgTopArr.forEach((value,index)=>{     // 填充上分区图片的位置信息
          imgTopArr[index] = {
            pos:{
              top: getRandomPos(vTopY[0],vTopY[1]),
              left: getRandomPos(vLeftX[0],vLeftX[1])
            },
            rotate: getRandomRotate()
          }
        });

    // 左分区和右分区图片位置信息
    for (let i=0,len=arrangeImgArr.length,k=len/2;i<len;i++){
      let secLOR = null;        // 存放左分区或者右分区x的坐标
      if(i<k){   // 左分区
        secLOR = hLeftSecRangeX;
      }else {
        secLOR = hRightSecRangeX;
      }
      arrangeImgArr[i]={
        pos : {
          top: getRandomPos(hY[0],hY[1]),
          left: getRandomPos(secLOR[0],secLOR[1])
        },
        rotate: getRandomRotate()
      }

    }

    //前面分割了arrangeImgArr，取居中和上分区图片元素出来，现在合并进去
    if(imgTopArr && imgTopArr){        // 填充上分区图片位置信息
      arrangeImgArr.splice(topImgIndex,0,imgTopArr[0]);
    }
    arrangeImgArr.splice(centerIndex,0,centerImgPosArr[0]);      // 填充居中图片的位置信息

    this.setState({
      imgsArrangeArr: arrangeImgArr
    });
  }


  componentDidMount(){       // 给初始化的变量赋值
    let stageDom = ReactDOM.findDOMNode(this.refs.stage),   // 舞台dom元素
        stageWidth = stageDom.scrollWidth,   // 舞台宽度
        stageHeight = stageDom.scrollHeight,    // 舞台高度
        halfStageW = Math.ceil(stageWidth / 2),   // 舞台宽一半
        halfStageH = Math.ceil(stageHeight/2);     // 舞台高一半

    let imgFigDom = ReactDOM.findDOMNode(this.refs.imgFigure0),   // 图片的dom元素，因为每张图片的宽高相同，所以这里取imgFigure0
        imgFigWidth = imgFigDom.scrollWidth,         // 图片宽
        imgFigHeight = imgFigDom.scrollHeight,
        halfImgW = Math.ceil(imgFigWidth/2),
        halfImgH = Math.ceil(imgFigHeight/2);

    let centerPos = {                    // 中心图片的坐标
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };
    this.Constant.centerPos = centerPos;

    // 水平方向--左侧分区x的坐标范围
    this.Constant.hsec.hLeftSecX[0] = - halfImgW;
    this.Constant.hsec.hLeftSecX[1] = halfStageW - halfImgW*3;

    // 水平方向--右侧分区x的坐标范围
    this.Constant.hsec.hRightSecX[0] = halfStageW + halfImgW;
    this.Constant.hsec.hRightSecX[1] = stageWidth - halfImgW;

    // 水平方向--y的取值方位
    this.Constant.hsec.hY[0] = - halfImgH;
    this.Constant.hsec.hY[1] = stageHeight - halfImgH;

    // 垂直方向--上分区x的取值范围
    this.Constant.vsec.leftX[0] = halfStageW - halfImgW;
    this.Constant.vsec.leftX[1] = halfStageW;

    // 垂直方向--上分区y的取值范围
    this.Constant.vsec.topY[0] = -halfImgH;
    this.Constant.vsec.topY[1] = halfStageH - halfImgH*3;

    this.rearrange(0);   // 将第0张图片作为中心图片布局页面
  }

  render(){

    let controllerUtils = [];
    let imgFigures = [];

    imageDatas.forEach((value,index)=>{
      if(!this.state.imgsArrangeArr[index]){      // 如果对应下标中午位置信息，则填充
        this.state.imgsArrangeArr[index] = {
          pos: {
            left:0,
            top:0
          },
          rotate:0,
          isInverse: false          // 默认为正面
        }
      }
      imgFigures.push(<SingleImgComp data={value} arragneStyle={this.state.imgsArrangeArr[index]} isInverse={this.inverse(index)} ref={'imgFigure'+index} />)
    });


    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUtils}
        </nav>
      </section>
    );
  }
}

GalleryByReactApp.defaultProps = {};

export default GalleryByReactApp;
