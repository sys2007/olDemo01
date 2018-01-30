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

let urlDefalut = mapConfig.layers.layer2.url + "?service=WFS&version=1.0.0&request=GetFeature&typeName=" + mapConfig.layers.layer2.layer
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
let layerc2 = new layerVector({
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
                            color: [200, 0, 0, Math.min(0.8, 0.4 + (size / 1000))]
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
                            src: require("../../assets/sxj.png")
                        })
                    });
                } else {
                    style1 = new style({
                        image: new styleIcon({
                            src: require("../../assets/sxj.png")
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
let features2 = []
let initFeatureInfo = (event) => {
    features2 = []
    for (let data of event.target.getFeatures()) {
        let video_id = data.getId()
        let data1 = data.getProperties()
        let datanew = { TYPE: 'layerC2', Tags: data1.Tags, id: data1.id, name: data1.name, serialNumber: data1.serialNumber, platformId: data1.platformId, sspt: data1.sspt, ssqy: data1.ssqy, UID: video_id }
        features2.push(datanew)
        data.on('featureClick', function (event) {
            let obj = event.target.getProperties()
            let coordinate = event.target.getGeometry().getCoordinates()
            contentTexts(coordinate, obj)
        })
    }
    store.dispatch('layerC2DataHandle', features2)
}

function contentTexts(coordinate, obj) {
    content.innerHTML = `<table style="font-size: 13px;border="1";color: #000000" >
    <tr><td>监控点编号:</td><td>${obj.serialNumber}</td></tr>
    <tr><td>监控点名称:</td><td>${obj.name}</td></tr>
    <tr><td>所属组织:</td><td>${(obj.Tags == 'undefined' ? '' : obj.Tags)}</td></tr>
    <tr><td>所属区域:</td><td>${obj.ssqy}</td></tr>
    <tr><td>所属平台:</td><td>${obj.sspt}</td></tr>
    </table>`
    overlay.setPosition(coordinate)
}

let isShowLayer2 = (flag) => {    
    if (flag) {
        // layerc2.getSource().refresh()
        store.dispatch('layerC2DataHandle', features2)
    } else {
        // layerc2.getSource().clear()
        store.dispatch('layerC2DataHandle', [])
    }
}

let resetFilter = () => {
    layerc2.setSource(clusterSource)
    layerc2.getSource().refresh()
}

layerc2.getSource().getSource().on('change', initFeatureInfo)
layerc2.getSource().on('change', initFeatureInfo2)

let newSource
let newClusterSource
/**
 * 属性查询
 * @param {*} type 条件名
 * @param {*} value 值
 */
function queryFilter2(type, value) {
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
        layerc2.setSource(newClusterSource)
        layerc2.getSource().getSource().on('change', initFeatureInfo)
        layerc2.getSource().on('change', initFeatureInfo2)
    }

}

/**
 * 空间查询
 * @param {*} value 
 */
function spatialQueryFilter2(value = null) {
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
        layerc2.setSource(newClusterSource)
        layerc2.getSource().getSource().on('change', initFeatureInfo)
        layerc2.getSource().on('change', initFeatureInfo2)
    }
}

export { layerc2, isShowLayer2, queryFilter2, spatialQueryFilter2 } 