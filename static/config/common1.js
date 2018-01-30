export default {
    mapInfo: {
        // url: 'http://47.104.22.110:9001/geoserver/gwc/service/wmts',
        url: 'http://13.81.18.16:9001/geoserver/gwc/service/wmts',
        zoom: 12,
        minZoom: 10,
        maxZoom: 16,
        layer: 'hd2017:12',//'hd2017:handan_12',
        center: [12744723.245639589,4384904.463861339]//[114.494705, 36.6161125]
    },
    layers: {
        wfst_xl: {
            url: 'http://13.81.18.16:9001/geoserver/wfs?service=wfs',
            featureType: 'c4_projections',
            featureNS: 'hd2017.cn'
        },
        layer1: {
            url: 'http://13.81.18.16:9001/geoserver/hd2017/ows',
            layer: 'hd2017:c1_projections'
        },
        layer2: {
            url: 'http://13.81.18.16:9001/geoserver/hd2017/ows',
            layer: 'hd2017:c2_projections'
        },
        layer3: {
            url: 'http://13.81.18.16:9001/geoserver/hd2017/ows',
            layer: 'hd2017:c3_projections'
        },
        layer4: {
            url: 'http://13.81.18.16:9001/geoserver/hd2017/ows',
            layer: 'hd2017:c4_projections'
        }         
    }
}