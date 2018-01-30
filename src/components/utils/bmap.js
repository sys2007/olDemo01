import "ol/ol.css";
import Map from "ol/map";
import View from "ol/view";
import Control from "ol/control";
import MousePosition from "ol/control/MousePosition";
import TileLayer from "ol/layer/tile";
import WMTSSource from "ol/source/WMTS";
import ProjectionProj from "ol/proj/Projection";
import WMTSTillegrid from "ol/tilegrid/wmts";
import Events from 'ol/events';
import Overlay from 'ol/overlay';
import mapConfig from '../../../static/config/common'

// let resolutions = [1.71661376953125E-4, 8.58306884765625E-5, 4.291534423828125E-5, 2.1457672119140625E-5, 1.0728836059570312E-5];
let resolutions = [156543.03390625, 78271.516953125, 39135.7584765625, 19567.87923828125, 9783.939619140625, 4891.9698095703125, 2445.9849047851562, 1222.9924523925781, 611.4962261962891, 305.74811309814453, 152.87405654907226, 76.43702827453613, 38.218514137268066, 19.109257068634033, 9.554628534317017, 4.777314267158508, 2.388657133579254, 1.194328566789627, 0.5971642833948135, 0.29858214169740677, 0.14929107084870338, 0.07464553542435169, 0.037322767712175846, 0.018661383856087923, 0.009330691928043961, 0.004665345964021981, 0.0023326729820109904, 0.0011663364910054952, 5.831682455027476E-4, 2.915841227513738E-4, 1.457920613756869E-4];
// let gridNames = ['EPSG:4326:12', 'EPSG:4326:13', 'EPSG:4326:14', 'EPSG:4326:15', 'EPSG:4326:16'];
let gridNames = ['EPSG:900913:0', 'EPSG:900913:1', 'EPSG:900913:2', 'EPSG:900913:3', 'EPSG:900913:4', 'EPSG:900913:5', 'EPSG:900913:6', 'EPSG:900913:7', 'EPSG:900913:8', 'EPSG:900913:9', 'EPSG:900913:10', 'EPSG:900913:11', 'EPSG:900913:12', 'EPSG:900913:13', 'EPSG:900913:14', 'EPSG:900913:15', 'EPSG:900913:16', 'EPSG:900913:17', 'EPSG:900913:18', 'EPSG:900913:19', 'EPSG:900913:20', 'EPSG:900913:21', 'EPSG:900913:22', 'EPSG:900913:23', 'EPSG:900913:24', 'EPSG:900913:25', 'EPSG:900913:26', 'EPSG:900913:27', 'EPSG:900913:28', 'EPSG:900913:29', 'EPSG:900913:30'];
	
let projection = new ProjectionProj({
    code: "EPSG:900913",//"EPSG:4326",
    units: "m",//"degrees",
    axisOrientation: "neu"
});
let tileGrid = new WMTSTillegrid({
    tileSize: [256, 256],
    extent: [-2.003750834E7, -2.003750834E7, 2.003750834E7, 2.003750834E7],
	origin: [-2.003750834E7, 2.003750834E7],
    // origin: [-180.0, 90.0],
    resolutions: resolutions,
    matrixIds: gridNames
});

let wmtsSource = new WMTSSource({
    url: mapConfig.mapInfo.url,
    layer: mapConfig.mapInfo.layer,
    matrixSet: "EPSG:900913",//"EPSG:4326",
    format: "image/png",
    projection: projection,
    tileGrid: tileGrid,
    style: '',
    wrapX: true
});

let map = new Map({
    // target: "mymap",//可配置
    controls: Control.defaults({
        attribution: false
    }).extend([new MousePosition()]),
    layers: [
        new TileLayer({
            source: wmtsSource,
            crossOrigin: "anonymous",
            zIndex: -100000
        })
    ],
    view: new View({
        center: mapConfig.mapInfo.center,
        projection: projection,
        zoom: mapConfig.mapInfo.zoom,
        minZoom: mapConfig.mapInfo.minZoom,
        maxZoom: mapConfig.mapInfo.maxZoom
    })
});

map.on('click', (evt) => {
    var feature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature) {
            return feature;
        });
    if (feature) {
        feature.dispatchEvent({ type: 'featureClick', event: evt })
    } else {
        clearOverlay()
    }
});

let container = null
let content = null
let closer = null
let overlay = null

let clearOverlay = () => {
    overlay.setPosition(undefined)
    closer.blur()
    return false
}

map.on('change:target', (evt) => {
    container = document.getElementById('popup')
    content = document.getElementById('popup-content')
    closer = document.getElementById('popup-closer')
    overlay = new Overlay({
        id: 'resourceClick',
        element: container,
        positioning: 'top-center',
        autoPan: true,
        autoPanAnimation: {
            positioning: 'top-center',
            duration: 250
        }
    })
    closer.onclick = clearOverlay
    map.addOverlay(overlay)
})

export { content, overlay }
export default map;
