import layerVector from "ol/layer/Vector";
import sourceVector from "ol/source/Vector";
import geoJSON from "ol/format/GeoJSON";
import style from "ol/style/Style";
import styleIcon from "ol/style/Icon";
import sourceCluster from "ol/source/Cluster";
import styleCircle from "ol/style/Circle";
import styleFill from "ol/style/Fill";
import styleStroke from "ol/style/Stroke";
import styleText from "ol/style/Text";
import extent from 'ol/extent';
import coordinate from "ol/coordinate";

import { content, overlay } from '../utils/bmap'
import mapConfig from '../../../static/config/common'
import store from '../../store/stores'
import BmapUtils from '../utils/BmapUtils'

let bmapUtils = new BmapUtils();

let urlDefalut = mapConfig.layers.layer3.url + "?service=WFS&version=1.0.0&request=GetFeature&typeName=" + mapConfig.layers.layer3.layer
    + "&outputFormat=application/json"

let wfsSource = new sourceVector({
    format: new geoJSON(),
    loader: (extent, resolution, projection) => {
        bmapUtils.getSourceLoader(extent, resolution, projection, urlDefalut, wfsSource)
    }
})

let clusterSource = new sourceCluster({
    distance: parseInt(20, 10),
    source: wfsSource
});

let styleCache = {};
let layerc3 = new layerVector({
    source: clusterSource,
    style: function (feature, resolution) {
        var size = (feature.get("features") ? feature.get("features").length : 0);
        var style1 = styleCache[size];
        if (!style1) {
            if (size > 1) {
                style1 = new style({
                    image: new styleCircle({
                        radius: Math.max(15, size / 3),
                        fill: new styleFill({
                            color: [0, 0, 200, Math.min(0.8, 0.4 + (size / 1000))]
                        })
                    }),
                    text: new styleText({
                        text: size.toString(),
                        fill: new styleFill({
                            color: '#fff'
                        }),
                        stroke: new styleStroke({
                            color: 'rgba(0, 0, 0, 0.6)',
                            width: 3
                        })
                    })
                });
            } else {
                if (feature.getProperties()['onState'] === 'off') {
                    style1 = new style({
                        image: new styleIcon({
                            src: require("../../assets/oun.png")
                        })
                    });
                } else {
                    style1 = new style({
                        image: new styleIcon({
                            src: require("../../assets/oun.png")
                        })
                    });
                }
            }
            styleCache[size] = style1;
        }
        return style1;
    }
})

/**
 * 两个方法的源不一样，这个是集合数据来源
 * @param {*} event 
 */
let initFeatureInfo2 = (event) => {
    for (let data of event.target.getFeatures()) {
        data.on('featureClick', function (event) {
            if (event.target.getProperties().features.length > 1) {
                return
            } else {
                let obj = event.target.getProperties().features[0].getProperties()
                let coordinate = event.target.getGeometry().getCoordinates()
                contentTexts(coordinate, obj)
            }
        })
    }
}

/**
 * 两个方法的源不一样，这个是基础数据来源
 * @param {*} event 
 */
let features3 = []
let initFeatureInfo = (event) => {
    features3 = []
    for (let data of event.target.getFeatures()) {
        let video_id = data.getId()
        let data1 = data.getProperties()
        let datanew = { TYPE: 'layerC3', serialNumber: data1.serialNumber, id: data1.id, name: data1.name, ONUType: data1.ONUType, mac: data1.mac, oltid: data1.oltid, UID: video_id }
        features3.push(datanew)
        data.on('featureClick', function (event) {
            let obj = event.target.getProperties()
            let coordinate = event.target.getGeometry().getCoordinates()
            contentTexts(coordinate, obj)
        })
    }
    store.dispatch('layerC3DataHandle', features3)
}

function contentTexts(coordinate, obj) {
    content.innerHTML = `<table style="font-size: 13px;border="1";color: #000000" >
            <tr><td>名称:</td><td>${obj.name}</td></tr>
            <tr><td>序列号:</td><td>${obj.serialNumber}</td></tr>
            <tr><td>设备类型:</td><td>${obj.ONUType}</td></tr>
            <tr><td>MAC:</td><td>${obj.mac}</td></tr>
            <tr><td>OLTID:</td><td>${obj.oltid}</td></tr>
            </table>`
    overlay.setPosition(coordinate)
}

let isShowLayer3 = (flag) => {    
    if (flag) {
        // layerc3.getSource().refresh()
        store.dispatch('layerC3DataHandle', features3)
    } else {
        // layerc3.getSource().clear()
        store.dispatch('layerC3DataHandle', [])
    }
}

let resetFilter = () => {
    layerc3.setSource(clusterSource)
    layerc3.getSource().refresh()
}

layerc3.getSource().getSource().on('change', initFeatureInfo)
layerc3.getSource().on('change', initFeatureInfo2)

let newSource
let newClusterSource
/**
 * 属性查询
 * @param {*} type 条件名
 * @param {*} value 值
 */
function queryFilter3(type, value) {
    if (!value) {
        resetFilter()
    } else {
        newSource = new sourceVector({
            format: new geoJSON(),
            loader: (extent, resolution, projection) => {
                bmapUtils.getSourceLoader(...[extent, resolution, projection, urlDefalut, newSource, `CQL_FILTER=${type} ilike '%25${value}%25'`])
            }
        });
        newClusterSource = new sourceCluster({
            distance: parseInt(50, 10),
            source: newSource
        });
        layerc3.setSource(newClusterSource)
        layerc3.getSource().getSource().on('change', initFeatureInfo)
        layerc3.getSource().on('change', initFeatureInfo2)
    }

}

/**
 * 空间查询
 * @param {*} value 
 */
function spatialQueryFilter3(value = null) {
    if (!value) {
        resetFilter()
    } else {
        newSource = new sourceVector({
            format: new geoJSON(),
            loader: (extent, resolution, projection) => {
                bmapUtils.getSourceLoader(...[extent, resolution, projection, urlDefalut, newSource, `CQL_FILTER=WITHIN(location,Polygon((${value})))`])
            }
        });
        newClusterSource = new sourceCluster({
            distance: parseInt(50, 10),
            source: newSource
        });
        layerc3.setSource(newClusterSource)
        layerc3.getSource().getSource().on('change', initFeatureInfo)
        layerc3.getSource().on('change', initFeatureInfo2)
    }
}

export { layerc3, isShowLayer3, queryFilter3, spatialQueryFilter3 } 