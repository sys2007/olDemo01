<template>
  <div id="app">
    <div id="map"/>
    
  </div>
</template>

<script>
import "ol/ol.css";
import Map from "ol/map";
import View from "ol/view";
import TileLayer from "ol/layer/tile";
import WMTS from "ol/source/WMTS";
import tWMTS from "ol/tilegrid/wmts";
import projection from "ol/proj/Projection";
import layerImage from "ol/layer/Image";
import imageWMS from "ol/source/ImageWMS";
import layerVector from "ol/layer/Vector";
import sourceVector from "ol/source/Vector";
import geoJSON from "ol/format/GeoJSON";
import style from "ol/style/Style";
import styleCircle from "ol/style/Circle";
import styleFill from "ol/style/Fill";
import styleStroke from "ol/style/Stroke";
import styleIcon from "ol/style/Icon";
import sourceCluster from "ol/source/Cluster";
import styleText from "ol/style/Text";

export default {
  name: "app",
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let wfsSource = new sourceVector({
        format: new geoJSON(),
        url:
          "http://47.104.22.110:9000/geoserver/hd2017/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=hd2017:c&maxFeatures=10000&outputFormat=application/json"
      });

      let clusterSource = new sourceCluster({
        distance: parseInt(50, 10),
        source: wfsSource
      });

      let styleCache = {};

      let clusters = new layerVector({
        source: clusterSource,
        style: function(feature) {
          var size = feature.get("features").length;
          var style1 = styleCache[size];
          if (!style1) {
            if (size > 10) {
              style1 = new style({
                image: new styleCircle({
                  radius: 10,
                  stroke: new styleStroke({
                    color: "#fff"
                  }),
                  fill: new styleFill({
                    color: "#3399CC"
                  })
                }),
                text: new styleText({
                  text: size.toString(),
                  fill: new styleFill({
                    color: "#fff"
                  })
                })
              });
            } else {
              style1 = new style({
                image: new styleIcon({
                  src: require("../assets/shexiangtou.png")
                })
              });
            }

            styleCache[size] = style1;
          }
          return style1;
        }
      });

      let vector1 = new layerVector({
        source: wfsSource,
        style: function(feature, resolution) {
          return new style({
            image: new styleIcon({
              src: require("../assets/shexiangtou.png")
            })
            // image: new styleCircle({
            //   radius: 5,
            //   fill: new styleFill({
            //     color: "red"
            //   }),
            //   stroke: new styleStroke({
            //     color: "red",
            //     size: 10
            //   })
            // })
          });
        }
      });

      new Map({
        target: "map",
        layers: [
          new TileLayer({
            source: new WMTS({
              url: "http://47.104.22.110:9000/geoserver/gwc/service/wmts",
              layer: "sjz:10",
              matrixSet: "EPSG:900913",
              format: "image/png",
              projection: new projection({
                code: "EPSG:900913",
                units: "m",
                axisOrientation: "neu"
              }),
              tileGrid: new tWMTS({
                tileSize: [256, 256],
                extent: [
                  -2.003750834e7,
                  -2.003750834e7,
                  2.003750834e7,
                  2.003750834e7
                ],
                origin: [-2.003750834e7, 2.003750834e7],
                resolutions: [
                  156543.03390625,
                  78271.516953125,
                  39135.7584765625,
                  19567.87923828125,
                  9783.939619140625,
                  4891.9698095703125,
                  2445.9849047851562,
                  1222.9924523925781,
                  611.4962261962891,
                  305.74811309814453,
                  152.87405654907226,
                  76.43702827453613,
                  38.218514137268066,
                  19.109257068634033,
                  9.554628534317017,
                  4.777314267158508,
                  2.388657133579254,
                  1.194328566789627,
                  0.5971642833948135,
                  0.29858214169740677,
                  0.14929107084870338,
                  0.07464553542435169,
                  0.037322767712175846,
                  0.018661383856087923,
                  0.009330691928043961,
                  0.004665345964021981,
                  0.0023326729820109904,
                  0.0011663364910054952,
                  5.831682455027476e-4,
                  2.915841227513738e-4,
                  1.457920613756869e-4
                ],
                matrixIds: [
                  "EPSG:900913:0",
                  "EPSG:900913:1",
                  "EPSG:900913:2",
                  "EPSG:900913:3",
                  "EPSG:900913:4",
                  "EPSG:900913:5",
                  "EPSG:900913:6",
                  "EPSG:900913:7",
                  "EPSG:900913:8",
                  "EPSG:900913:9",
                  "EPSG:900913:10",
                  "EPSG:900913:11",
                  "EPSG:900913:12",
                  "EPSG:900913:13",
                  "EPSG:900913:14",
                  "EPSG:900913:15",
                  "EPSG:900913:16",
                  "EPSG:900913:17",
                  "EPSG:900913:18",
                  "EPSG:900913:19",
                  "EPSG:900913:20",
                  "EPSG:900913:21",
                  "EPSG:900913:22",
                  "EPSG:900913:23",
                  "EPSG:900913:24",
                  "EPSG:900913:25",
                  "EPSG:900913:26",
                  "EPSG:900913:27",
                  "EPSG:900913:28",
                  "EPSG:900913:29",
                  "EPSG:900913:30"
                ]
              }),
              style: "",
              wrapX: true
            }),
            crossOrigin: "anonymous"
          }),
          // new layerImage({
          //   source: new imageWMS({
          //     ratio: 1,
          //     url: 'http://47.104.22.110:9000/geoserver/hd2017/wms',
          //     params: {
          //       FORMAT: "image/png",
          //       VERSION: "1.1.1",
          //       STYLES: "",
          //       crossOrigin: "anonymous",
          //       LAYERS: 'hd2017:c'
          //     }
          //   })
          // })
          clusters
          // new layerVector({
          //   source: wfsSource,
          //   style: function(feature, resolution) {
          //     return new style({
          //       image: new styleIcon({
          //         src: require("../assets/shexiangtou.png")
          //       })
          //       // image: new styleCircle({
          //       //   radius: 5,
          //       //   fill: new styleFill({
          //       //     color: "red"
          //       //   }),
          //       //   stroke: new styleStroke({
          //       //     color: "red",
          //       //     size: 10
          //       //   })
          //       // })
          //     });
          //   }
          // })
        ],
        view: new View({
          center: [12745063.0532, 4583931.74708], //ol.proj.transform(JSON.parse([114.50645307654527, 38.04201862454738]), 'EPSG:4326', 'EPSG:3857'),
          zoom: 10
        })
      });
    }
  }
};
</script>

<style>
/* #app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
