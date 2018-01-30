import '../../assets/css/popup.css'
import map from './bmap'
import mapConfig from '../../../static/config/common'

import Overlay from 'ol/Overlay'
import Draw from 'ol/interaction/draw';
import SourceVector from 'ol/source/vector';
import LayerVector from 'ol/layer/Vector'
import Style from "ol/style/Style";
import styleCircle from "ol/style/Circle";
import styleFill from "ol/style/Fill";
import styleStroke from "ol/style/Stroke";
import styleIcon from "ol/style/Icon";
import sourceCluster from "ol/source/Cluster";
import styleText from "ol/style/Text";
import Polygon from 'ol/geom/polygon'
import LineString from 'ol/geom/linestring';
import Observable from 'ol/Observable'
import proj from 'ol/proj';
import Sphere from 'ol/sphere';

let isLayerAdd = false
let measureTooltipElement, measureTooltip

let source = new SourceVector({ wrapX: false })

// 添加一个绘制的线使用的layer style使用[]
var lineLayer = new LayerVector({
    source: source,
    style: [new Style({
        fill: new styleFill({
            color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new styleStroke({
            color: '#ffcc33',
            width: 2
        }),
        image: new styleCircle({
            radius: 7,
            fill: new styleFill({
                color: '#ffcc33'
            })
        })
    })]
})

//创建测量提示框
let createMeasureTooltip = () => {
    //创建测量提示框的div
    measureTooltipElement = document.createElement('div')
    measureTooltipElement.setAttribute('id', 'lengthLabel')
    //设置测量提示要素的样式
    measureTooltipElement.className = 'tooltip tooltip-measure'
    //创建一个测量提示的覆盖标注
    measureTooltip = new Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    })
    //将测量提示的覆盖标注添加到地图中
    map.addOverlay(measureTooltip)
}

let formatLength = (line) => {
    var length
    length = (line.getLength() * 100).toFixed(2) //km
    var output
    if (length > 1) {
        output = length + ' ' + 'km' //换算成KM单位
    } else {
        output = length * 1000 + ' ' + 'm' //m为单位
    }
    return output
}


let formatArea = (polygon) => {
    var area
    area = (polygon.getArea() * 10000).toFixed(2) //km
    var output
    if (area > 1) {
        output = area + ' ' + 'km<sup>2</sup>'
    } else {
        output = area * 1000 + ' ' + 'm<sup>2</sup>'
    }
    return output
}

let addInteraction = (type) => {
    if (!isLayerAdd) {
        isLayerAdd = !isLayerAdd
        map.addLayer(lineLayer)
    }
    //创建一个交互式绘图对象
    let draw = new Draw({
        //绘制的数据源
        source: source,
        //绘制类型
        type: type,
        //样式
        style: [new Style({
            fill: new styleFill({
                color: 'rgba(255,255,255,0.2)'
            }),
            stroke: new styleStroke({
                color: 'rgba(0,0,0,0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new styleCircle({
                radius: 5,
                stroke: new styleStroke({
                    color: 'rgba(0,0,0,0.7)'
                }),
                fill: new styleFill({
                    color: 'rgba(255,255,255,0.2)'
                })
            })
        })]
    })
    //将交互绘图对象添加到地图中
    map.addInteraction(draw)
    //创建测量提示框
    createMeasureTooltip()
    //定义一个事件监听
    let listener
    //定义一个控制鼠标点击次数的变量
    let drawingSingleclickListener
    let count = 0
    let sketch
    //绘制开始事件
    draw.on('drawstart', (evt) => {
        sketch = evt.feature
        //提示框的坐标
        var tooltipCoord = evt.coordinate
        //监听几何要素的change事件
        listener = sketch.getGeometry().on('change', function (evt) {
            //获取绘制的几何对象
            var geom = evt.target
            //定义一个输出对象，用于记录面积和长度
            var output
            if (geom instanceof Polygon) {
                map.removeEventListener('singleclick')
                //输出多边形的面积
                output = formatArea(geom)
                //获取多变形内部点的坐标
                tooltipCoord = geom.getInteriorPoint().getCoordinates()
            } else if (geom instanceof LineString) {
                //输出多线段的长度
                output = formatLength(geom)
                //获取多线段的最后一个点的坐标
                tooltipCoord = geom.getLastCoordinate()
            }
            //设置测量提示框的内标签为最终输出结果
            measureTooltipElement.innerHTML = output
            //设置测量提示信息的位置坐标
            measureTooltip.setPosition(tooltipCoord)
        })
        //地图单击事件
        // drawingSingleclickListener = map.on('singleclick', function (evt) {
        //     //设置测量提示信息的位置坐标，用来确定鼠标点击后测量提示框的位置
        //     measureTooltip.setPosition(evt.coordinate)
        //     //如果是第一次点击，则设置测量提示框的文本内容为起点
        //     if (count == 0) {
        //         measureTooltipElement.innerHTML = '起点'
        //     }
        //     //更改测量提示框的样式，使测量提示框可见
        //     measureTooltipElement.className = 'tooltip tooltip-static'
        //     //创建测量提示框
        //     createMeasureTooltip()
        //     //点击次数增加
        //     count++
        // })
        map.once('dblclick', function (e) {
            return false
        })

    }, this)
    //绘制结束事件
    draw.on('drawend', function (evt) {
        count = 0
        measureTooltipElement.className = 'tooltip tooltip-static'
        sketch = null
        measureTooltipElement = null
        createMeasureTooltip()
        Observable.unByKey(listener)
        Observable.unByKey(drawingSingleclickListener)
        map.removeInteraction(draw)
    }, this)

}

let maptools = (type) => {
    if ('clear' == type) {
        clearMap()
    } else if ('center' == type) {
        renderMapCenter()
    } else if ('exportPDF') {
        exportPNG()
    } else {
        addInteraction(type)
    }
}

let clearMap = () => {
    map.getOverlays().clear()
    source.clear()
    if (isLayerAdd) {
        isLayerAdd = !isLayerAdd
        map.removeLayer(lineLayer)
    }
    map.renderSync()
}

let renderMapCenter = () => {
    map.getView().setCenter(mapConfig.mapInfo.center)
    map.renderSync()
}

function exportPNG() {
    map.once('postcompose', function (event) {
        // var canvas = event.context.canvas;
        let div_map = document.getElementById('div_map')
        let div_map2 = div_map.context
        let canvas = event.context.canvas;
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
        } else {
            canvas.toBlob(function (blob) {
                var newImg = document.createElement("img"),
                    url = URL.createObjectURL(blob);

                newImg.onload = function () {
                    // no longer need to read the blob so it's revoked
                    URL.revokeObjectURL(url);
                };

                newImg.src = url;
                document.body.appendChild(newImg);
            });
        }
    });
    map.renderSync();
}

export default maptools