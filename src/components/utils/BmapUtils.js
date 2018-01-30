import layerVector from "ol/layer/Vector";
import sourceVector from "ol/source/Vector";
import Style from "ol/style/style";
import Stroke from "ol/style/stroke";
import Draw from "ol/interaction/draw";
import styleFill from "ol/style/fill";
import Select from 'ol/interaction/Select'
import Modify from 'ol/interaction/Modify'
import WFS from 'ol/format/WFS'
import mapConfig from '../../../static/config/common'

class BmapUtils {
    /**
     * post请求loader的源数据
     * @param {*} extent 
     * @param {*} resolution 
     * @param {*} projection 
     * @param {*} url 
     * @param {*} source 
     * @param {*} parameter 请求的参数 key=value
     */
    getSourceLoader(extent, resolution, projection, url, source, parameter = null) {
        let proj = projection.getCode();
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        let onError = () => {
            source.removeLoadedExtent(extent);
        }
        xhr.onerror = onError;
        xhr.onload = () => {
            if (xhr.status == 200) {
                source.addFeatures(
                    source.getFormat().readFeatures(xhr.responseText, {
                        dataProjection: 'EPSG:4326',    // 设定JSON数据使用的坐标系
                        featureProjection: 'EPSG:3857' // 设定当前地图使用的feature的坐标系
                    }));
            } else {
                onError();
            }
        }
        if (parameter) {
            xhr.send(parameter)
        } else {
            xhr.send()
        }
    }

    /**
     * 用于空间查询时先在地图上绘制矩形
     * @param {*} callback 绘制完矩形后的回调函数
     */
    drawRectangle(callback) {
        // 创建用于新绘制feature的layer
        let drawLayer = new layerVector({
            source: new sourceVector(),
            style: new Style({
                stroke: new Stroke({
                    color: 'rgba(0, 0, 255, 0.7)',
                    width: 3
                }),
                fill: new styleFill({
                    color: 'rgba(0, 0, 255, 0.2)'
                })
            })
        });
        // 添加绘制新图形的interaction，用于添加新的线条
        var drawInteraction = new Draw({
            type: "Circle", // 设定为线条
            geometryFunction: Draw.createBox(),
            source: drawLayer.getSource()
        });
        drawInteraction.on("drawend", function ({ feature }) {
            // 绘制结束时暂存绘制的feature            
            callback(feature)
        });
        return { drawInteraction, drawLayer }
    }

    /**
     * 在地图上绘制线
     * @param {*} callback 
     */
    drawLine(callback) {
        // 创建用于新绘制feature的layer
        let drawLayer = new layerVector({
            source: new sourceVector(),
            style: new Style({
                stroke: new Stroke({
                    color: 'rgba(0, 0, 255, 0.7)',
                    width: 3
                })
            })
        });
        // 添加绘制新图形的interaction，用于添加新的线条
        var drawInteraction = new Draw({
            type: "LineString", // 设定为线条
            source: drawLayer.getSource()
        });
        drawInteraction.on("drawend", function ({ feature }) {
            // 绘制结束时暂存绘制的feature            
            callback(feature)
        });
        return { drawInteraction, drawLayer }
    }

    // 选择器
    selectInteraction(filterLayer = null) {
        return new Select({
            style: new Style({
                stroke: new Stroke({
                    color: 'red',
                    width: 2
                })
            }),
            filter: function (feature, layer) {
                if (filterLayer) {
                    return layer === filterLayer;
                } else {
                    return null
                }
            }
        });
    }

    // 修改器
    modifyInteraction({ selectInteraction, callback }) {
        let modify = new Modify({
            style: new Style({
                stroke: new Stroke({
                    color: 'red',
                    width: 5
                })
            }),
            features: selectInteraction.getFeatures()
        });

        modify.on('modifyend', function ({ features }) {
            // 把修改完成的feature暂存起来
            callback(features)
        });
        return modify
    }

    // 保存已经编辑的要素
    onSave(modifiedFeatures) {
        if (modifiedFeatures && modifiedFeatures.getLength() > 0) {
            // 转换坐标
            var modifiedFeature = modifiedFeatures.item(0).clone();
            modifiedFeature.getGeometry().transform("EPSG:3857","EPSG:4326")
            // 注意ID是必须，通过ID才能找到对应修改的feature
            modifiedFeature.setId(modifiedFeatures.item(0).getId());
            // modifiedFeature.setId("id4");
            // 调换经纬度坐标，以符合wfs协议中经纬度的位置
            modifiedFeature.getGeometry().applyTransform(function (flatCoordinates, flatCoordinates2, stride) {
                for (var j = 0; j < flatCoordinates.length; j += stride) {
                    var y = flatCoordinates[j];
                    var x = flatCoordinates[j + 1];
                    flatCoordinates[j] = x;
                    flatCoordinates[j + 1] = y;
                }
            });
            this.modifyWfs([modifiedFeature]);
        }
    }

    // 把修改提交到服务器端
    modifyWfs(features) {
        let WFSTSerializer = new WFS();
        var featObject = WFSTSerializer.writeTransaction(null,
            features, null, {
                featureType: mapConfig.layers.wfst_xl.featureType,
                featureNS: mapConfig.layers.wfst_xl.featureNS,  // 注意这个值必须为创建工作区时的命名空间URI
                srsName: 'EPSG:4326'
            });
        // 转换为xml内容发送到服务器端
        var serializer = new XMLSerializer();
        var featString = serializer.serializeToString(featObject);
        var request = new XMLHttpRequest();
        request.open('POST', mapConfig.layers.wfst_xl.url);
        // 指定内容为xml类型
        request.setRequestHeader('Content-Type', 'text/xml');
        request.onerror = this.onError;
        request.onload = () => {
            if (request.status == 200) {
                alert('保存成功！')
            } else {
                this.onError();
            }
        }
        request.send(featString);
    }

    // 添加到服务器端
    addWfs(features, callback) {
        var WFSTSerializer = new WFS();
        var featObject = WFSTSerializer.writeTransaction(features,
            null, null, {
                featureType: mapConfig.layers.wfst_xl.featureType,
                featureNS: mapConfig.layers.wfst_xl.featureNS,
                srsName: 'EPSG:4326',
                version: '1.0.0'
            });
        var serializer = new XMLSerializer();
        var featString = serializer.serializeToString(featObject);
        var request = new XMLHttpRequest();
        request.open('POST', mapConfig.layers.wfst_xl.url);
        request.setRequestHeader('Content-Type', 'text/xml');
        request.onerror = this.onError;
        request.onload = () => {
            if (request.status == 200) {
                alert('保存成功！')
                if (callback) {
                    callback()
                }
            } else {
                this.onError();
            }
        }
        request.send(featString);
    }

    // 在服务器端删除feature
    deleteWfs(features) {
        var WFSTSerializer = new WFS();
        var featObject = WFSTSerializer.writeTransaction(null,
            null, features, {
                featureType: mapConfig.layers.wfst_xl.featureType,
                featureNS: mapConfig.layers.wfst_xl.featureNS,
                srsName: 'EPSG:4326'
            });
        var serializer = new XMLSerializer();
        var featString = serializer.serializeToString(featObject);
        var request = new XMLHttpRequest();
        request.open('POST', mapConfig.layers.wfst_xl.url);
        request.setRequestHeader('Content-Type', 'text/xml');
        request.onerror = this.onError;
        request.onload = () => {
            if (request.status == 200) {
                alert('删除成功！')
            } else {
                this.onError();
            }
        }
        request.send(featString);
    }

    /**
     * 
     * @param {*异常处理} exception 
     */
    onError(exception) {
        console.log(exception)
    }
}

export default BmapUtils