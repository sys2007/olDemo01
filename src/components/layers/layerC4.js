import layerVector from "ol/layer/Vector";
import sourceVector from "ol/source/Vector";
import geoJSON from "ol/format/GeoJSON";
import style from "ol/style/Style";
import styleStroke from "ol/style/Stroke";

import store from '../../store/stores'
import { content, overlay } from '../utils/bmap'
import mapConfig from '../../../static/config/common'
import BmapUtils from '../utils/BmapUtils'

let bmapUtils = new BmapUtils();
let urlDefalut = mapConfig.layers.layer4.url + "?service=WFS&version=1.0.0&request=GetFeature&typeName=" + mapConfig.layers.layer4.layer
    + "&outputFormat=application/json"
let wfsSource = new sourceVector({
    format: new geoJSON({
        geometryName: 'location'
    }),
    loader: (extent, resolution, projection) => {
        bmapUtils.getSourceLoader(extent, resolution, projection, urlDefalut, wfsSource)
    }
})

let layerc4 = new layerVector({
    source: wfsSource,
    style: function (feature, resolution) {
        return new style({
            stroke: new styleStroke({
                color: "red",
                width: 4
            })
        });
    }
})

function layerc4QueryWfs() {
    let newSource = new sourceVector({
        format: new geoJSON({
            geometryName: 'location'
        }),
        url:
            mapConfig.layers.layer4.url + "?service=WFS&version=1.0.0&request=GetFeature&typeName=" + mapConfig.layers.layer4.layer
            + "&maxFeatures=10000&outputFormat=application/json"
    });
    layerc4.setSource(newSource)
    layerc4.getSource().on('change', sourceChange)
}

/**
 * 两个方法的源不一样，这个是基础数据来源
 * @param {*} event 
 */
let features4 = []
let initFeatureInfo = (event) => {
    features4 = []
    for (let data of event.target.getFeatures()) {
        let video_id = data.getId()
        let data1 = data.getProperties()
        let datanew = { TYPE: 'layerC4', Tags: data1.Tags, id: data1.id, name: data1.name, platformId: data1.platformId, sspt: data1.sspt, ssqy: data1.ssqy, UID: video_id }
        features4.push(datanew)
        data.on('featureClick', function (event) {
            let obj = event.target.getProperties()
            let coordinate = event.target.getGeometry().getCoordinateAt(0.5)
            contentTexts(coordinate, obj)
        })
    }
    store.dispatch('layerC4DataHandle', features4)
}

function contentTexts(coordinate, obj) {
    content.innerHTML = `<table style="font-size: 13px;border="1";color: #000000" >
    <tr><td>监控点编号:</td><td>${obj.platformId}</td></tr>
    <tr><td>监控点名称:</td><td>${obj.name}</td></tr>
    <tr><td>所属组织:</td><td>${obj.Tags}</td></tr>
    <tr><td>所属区域:</td><td>${obj.ssqy}</td></tr>
    <tr><td>所属平台:</td><td>${obj.sspt}</td></tr>
    </table>`
    overlay.setPosition(coordinate)
}

let isShowLayer4 = (flag) => {
    if (flag) {
        // layerc4.getSource().refresh()
        store.dispatch('layerC4DataHandle', features4)
    } else {
        // layerc4.getSource().clear()
        store.dispatch('layerC4DataHandle', [])
    }
}

let resetFilter = () => {
    layerc4.setSource(wfsSource)
    layerc4.getSource().refresh()
}

layerc4.getSource().on('change', initFeatureInfo)

let newSource
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
        layerc4.setSource(newSource)
        layerc4.getSource().on('change', initFeatureInfo)
    }

}

/**
 * 空间查询
 * @param {*} value 
 */
function spatialQueryFilter4(value = null) {
    if (!value) {
        resetFilter()
    } else {
        newSource = new sourceVector({
            format: new geoJSON(),
            loader: (extent, resolution, projection) => {
                bmapUtils.getSourceLoader(...[extent, resolution, projection, urlDefalut, newSource, `CQL_FILTER=WITHIN(location,Polygon((${value})))`])
            }
        });
        layerc4.setSource(newSource)
        layerc4.getSource().on('change', initFeatureInfo)
    }
}

export { layerc4, isShowLayer4, queryFilter4, spatialQueryFilter4, layerc4QueryWfs } 