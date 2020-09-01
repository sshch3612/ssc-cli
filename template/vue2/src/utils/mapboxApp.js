/* eslint-disable */
import mapboxgl from "mapbox-gl";
import { Scene } from "@antv/l7";
import { Mapbox } from "@antv/l7-maps";
import 'mapbox-gl/dist/mapbox-gl.css';

export default class MapboxInstance {
    constructor(options, mapType, mapSource) {
        /**缓存初始化设置 */
        this.initOptions = options;
        /** 缓存地图注册的事件，避免注册多个事件 */
        this.storageEvent = [];
        /** 文本是否标注*/
        this.istextMark = false;
        /** 地图底图类型集锦*/
        this.mapType = mapType;
        this.sources = mapSource;
        this.Map = this.loadMap(options);
    }

    /**
     * 初始化地图对象
     * @param options
     *      id: 挂载dom元素
     *      layerNames:初始化呈现的图层名称
     *      center：初始化中心坐标
     *      zoom：初始化地图等级
     * @returns {Scene}scene赋予global全局之上
     */
    loadMap(options) {
        const { id, layerNames, center, zoom, minZoom, maxZoom } = options;
        const layers = [];
        const sources = this.sources;

        Object.keys(this.sources).forEach(key => {
            const layer = {
                id: key,
                type: 'raster',
                source: key,
                layout: {
                    visibility: 'none',
                },
            };
            if (layerNames.includes(key)) {
                layer.layout.visibility = 'visible';
            }
            layers.push(layer);
        });
        const scene = new Scene({
            id,
            map: new Mapbox({
                // style: "http://192.168.1.87:8082/map/deyang/dysl/tileSet/style.json",
                style: {
                    version: 8,
                    sprite: "http://10.176.143.28:8082/msyx/picture/sprite@2x",
                    glyphs: "http://10.176.143.28:8082/msyx/font/{fontstack}/{range}.pbf",
                    sources: sources,
                    layers
                },
                minZoom: minZoom,
                maxZoom: maxZoom,
                center,
                zoom,
            })
        });
        return scene.map;
    }
    /**
     * 内部工具函数
    */
    /**
     *储存函数
     * @param {*} hander
     */
    saveEvent = (eventType, hander) => {
        if (typeof hander === 'function' && typeof eventType === 'string') {
            this.storageEvent.push([eventType, hander])
        }
    }
    freedEvent = () => {
        if (this.storageEvent.length === 0) return;
        this.storageEvent.map((event) => {
            this.Map.off(event[0], event[1])
        })
    }

    /**
     * 对外暴露Api
     * 
    */
    loadDynamicPoint = ({ id, size = 60, color = "55, 200, 200", imageObj = require("../assets/img/mapview/riskstop.png"), scale = 1.0 }) => {
        const _this = this;
        size = size * scale;
        const gifImage = {
            width: size,
            height: size,
            data: new Uint8Array(size * size * 4),
            onAdd: function () {
                const canvas = document.createElement('canvas');
                canvas.width = this.width;
                canvas.height = this.height;
                this.context = canvas.getContext('2d');

                this.img = new Image();
                this.img.src = imageObj;
                //插入图片

            },
            render: function () {
                const duration = 1000;
                const t = (performance.now() % duration) / duration;

                const radius = (size / 2) * .5;
                const outerRadius = (size / 2) * 0.4 + radius;
                const context = this.context;

                // // draw outer circle
                context.clearRect(0, 0, this.width, this.height);
                context.beginPath();
                context.arc(
                    this.width / 2,
                    this.height / 2,
                    radius,
                    0,
                    Math.PI * 2
                );
                context.strokeStyle = `rgba(${color},` + (1 - t) + ')';
                context.lineWidth = 2 + 10 * (1 - t);
                context.stroke();

                context.drawImage(this.img, size / 4, size / 4, size / 2, size / 2);

                // update this image's data with data from the canvas
                this.data = context.getImageData(
                    0,
                    0,
                    this.width,
                    this.height
                ).data;
                _this.Map.triggerRepaint()
                return true
            }
        }
        _this.Map.addImage(id, gifImage) // 可作为icon-image使用
    }
    /**
   * mapbox方式添加自定义图标
   * @param id 图标id
   * @param url 本地路径
   */
    loadMapboxImage = (id, url) => {
        return new Promise((resolve, reject) => {
            this.Map.loadImage(url, (error, image) => {
                if (error) {
                    reject();
                };
                if (!this.Map.hasImage(id)) this.Map.addImage(id, image);
                resolve()
            });
        })

    };

    /**
     *飞到指定位置
     * @param {*} {lon,lat} 经纬度
     * @param {*} zoom  地图层级
     * @returns
     */
    flyToLocation = ({ lng, lat }, zoom = 16) => {
        this.Map.flyTo({
            center: [lng, lat],
            zoom,
            speed: 1.2,
            curve: 1,
            easing(t) {
                return t;
            },
            bearing: 16,
            pitch: 60,
        });
    }
    /**
     *回到默认位置
     * @returns
     */
    flyTodef = () => {
        const { center, zoom } = this.initOptions;
        this.Map.flyTo({
            center,
            zoom,
            speed: 3,
            curve: 1,
            easing(t) {
                return t;
            },
            bearing: 0,
            pitch: 0,
        })
    }
    /**
     *设置图层显隐
     *
     * @param {*} id 图层id
     * @param {*} state  图层状态 'none' | 'visible'
     * @returns
     */
    setLayerVisible = (id, status) => {
        try {
            const layerid = this.Map.getLayer(id);
            if (!layerid) return;
            this.Map.setLayoutProperty(id, 'visibility', status)
        } catch (error) {
            console.log(error)
        }
    }
    /**
    *控制地图底图显隐
    *
    * @param {*} type 图层类型
    * @param {*} status  图层状态
    */
    setMaptypeLayer = (type, status) => {
        const mapType = this.mapType;
        if (type === "SLJC" || type === "YXJC") {
            ["boundary-solid", "boundary-dotted"].map((layerid) => {
                this.Map.setPaintProperty(layerid, 'line-color', type === "SLJC" ? '#28B3B3' : '#fff');
            });

            [...mapType["SLJC"], ...mapType["YXJC"]].map((layerId) => {
                this.setLayerVisible(layerId, "none");
            });
            mapType[type].map((layerId) => {
                this.setLayerVisible(layerId, "visible");
            })

        } else {
            mapType[type].map((layerId) => {
                this.setLayerVisible(layerId, status);
            })
        }
    }
    /**
     * 地图缩放等级
     * @param {*} val
     */
    zoomTo = (val) => {
        const { minZoom, maxZoom } = this.initOptions;
        if (val >= minZoom && val <= maxZoom) {
            this.Map.zoomTo(val)
        }
    }
    /**
     *设备高亮
     *
     * @param {*} geojson
     * @param {*} imageId
     * @returns
     */
    deviceHighlight = (geojson, image = "point") => {
        if (!geojson) throw '参数有误';
        const name = 'deviceHigh';
        const source = this.Map.getSource(name);
        if (source) {
            source.setData(geojson);
            return;
        }
        const sourceData = {
            type: "geojson",
            data: geojson
        }
        this.Map.addSource(name, sourceData);
        const param = {
            id: name,
            type: 'symbol',
            source: name,
            paint: {
                "text-color": "#117170",
            },
            layout: {
                "icon-allow-overlap": true,
                "icon-image": ["case",
                    ["==", ["get", "stop"], "true"], "riskstop",
                    ["all", ["==", ["get", "type"], 2], ["in", ["get", "work"], "一,二,三,四"], ["==", ["get", "xj"], "false"]], "risk1",
                    ["all", ["==", ["get", "type"], 2], ["in", ["get", "work"], "五"], ["==", ["get", "xj"], "false"]], "risk5",
                    ["all", ["==", ["get", "type"], 2], ["in", ["get", "work"], "六"], ["==", ["get", "xj"], "false"]], "risk6",
                    ["all", ["==", ["get", "type"], 2], ["in", ["get", "work"], "七,八"], ["==", ["get", "xj"], "false"]], "risk7",
                    ["all", ["==", ["get", "type"], 1], ["in", ["get", "work"], "五"], ["==", ["get", "xj"], "false"]], "risk1",
                    ["all", ["==", ["get", "type"], 1], ["in", ["get", "work"], "四"], ["==", ["get", "xj"], "false"]], "risk5",
                    ["all", ["==", ["get", "type"], 1], ["in", ["get", "work"], "三"], ["==", ["get", "xj"], "false"]], "risk6",
                    ["all", ["==", ["get", "type"], 1], ["in", ["get", "work"], "一,二"], ["==", ["get", "xj"], "false"]], "risk7",

                    ["all", ["==", ["get", "type"], 2], ["in", ["get", "work"], "一,二,三,四"], ["==", ["get", "xj"], "true"]], "riskperson1",
                    ["all", ["==", ["get", "type"], 2], ["in", ["get", "work"], "五"], ["==", ["get", "xj"], "true"]], "riskperson5",
                    ["all", ["==", ["get", "type"], 2], ["in", ["get", "work"], "六"], ["==", ["get", "xj"], "true"]], "riskperson6",
                    ["all", ["==", ["get", "type"], 2], ["in", ["get", "work"], "七,八"], ["==", ["get", "xj"], "true"]], "riskperson7",
                    ["all", ["==", ["get", "type"], 1], ["in", ["get", "work"], "五"], ["==", ["get", "xj"], "true"]], "riskperson1",
                    ["all", ["==", ["get", "type"], 1], ["in", ["get", "work"], "四"], ["==", ["get", "xj"], "true"]], "riskperson5",
                    ["all", ["==", ["get", "type"], 1], ["in", ["get", "work"], "三"], ["==", ["get", "xj"], "true"]], "riskperson6",
                    ["all", ["==", ["get", "type"], 1], ["in", ["get", "work"], "一,二"], ["==", ["get", "xj"], "true"]], "riskperson7",
                    image
                ],
                'icon-size': 1.5,
            }
        };
        console.log(param, 2228888)
        this.Map.addLayer(param);
    }
    /**
     *清除设备高亮
     *
     * @returns
     */
    removeDeviceHighlight = () => {
        const name = 'deviceHigh';
        const source = this.Map.getSource(name);
        if (source) {
            this.Map.removeSource(name);
            this.Map.removeLayer(name);
        }
        return;
    }
    /**
    * 设置文本标注
   */
    setTextMark = () => {
        this.istextMark = !this.istextMark
    }
    /**
     *  地图取坐标
     * @param {业务回调} callback
     */
    takeCoordinates = (callback) => {

        this.freedEvent();
        const makePoint = (e) => {
            const { lng, lat } = e.lngLat;
            const pointCoordinate = [lng, lat];
            if (callback) callback(pointCoordinate)
        }
        this.Map.once('click', makePoint);
        this.saveEvent('click', makePoint);
    }
    /**
    * mapbox方式加载点图层
    * @param options
    */
    addMapboxPointLayer = async ({ name, image = "point", minZoom = 9, maxZoom = 18, data, callback }) => {
        const map = this.Map;
        const source = map.getSource(name);
        const geojson = {
            "type": "FeatureCollection",
            "features": []
        };
        if (source) {
            source.setData(data);
            return;
        }

        const sourceData = {
            type: "geojson",
            data: data || geojson
        }
        await map.addSource(name, sourceData);
        const param = {
            id: name,
            type: "symbol",
            source: name,
            paint: {
                "text-color": "#117170",
            },
            layout: {
                "icon-allow-overlap": true,
                "icon-image": ["case",
                    ["==", ["get", "stop"], "true"], "riskstop",
                    ["all", ["==", ["get", "type"], 2], ["in", ["get", "work"], "一,二,三,四"], ["==", ["get", "xj"], "false"]], "risk1",
                    ["all", ["==", ["get", "type"], 2], ["in", ["get", "work"], "五"], ["==", ["get", "xj"], "false"]], "risk5",
                    ["all", ["==", ["get", "type"], 2], ["in", ["get", "work"], "六"], ["==", ["get", "xj"], "false"]], "risk6",
                    ["all", ["==", ["get", "type"], 2], ["in", ["get", "work"], "七,八"], ["==", ["get", "xj"], "false"]], "risk7",
                    ["all", ["==", ["get", "type"], 1], ["in", ["get", "work"], "五"], ["==", ["get", "xj"], "false"]], "risk1",
                    ["all", ["==", ["get", "type"], 1], ["in", ["get", "work"], "四"], ["==", ["get", "xj"], "false"]], "risk5",
                    ["all", ["==", ["get", "type"], 1], ["in", ["get", "work"], "三"], ["==", ["get", "xj"], "false"]], "risk6",
                    ["all", ["==", ["get", "type"], 1], ["in", ["get", "work"], "一,二"], ["==", ["get", "xj"], "false"]], "risk7",

                    ["all", ["==", ["get", "type"], 2], ["in", ["get", "work"], "一,二,三,四"], ["==", ["get", "xj"], "true"]], "riskperson1",
                    ["all", ["==", ["get", "type"], 2], ["in", ["get", "work"], "五"], ["==", ["get", "xj"], "true"]], "riskperson5",
                    ["all", ["==", ["get", "type"], 2], ["in", ["get", "work"], "六"], ["==", ["get", "xj"], "true"]], "riskperson6",
                    ["all", ["==", ["get", "type"], 2], ["in", ["get", "work"], "七,八"], ["==", ["get", "xj"], "true"]], "riskperson7",
                    ["all", ["==", ["get", "type"], 1], ["in", ["get", "work"], "五"], ["==", ["get", "xj"], "true"]], "riskperson1",
                    ["all", ["==", ["get", "type"], 1], ["in", ["get", "work"], "四"], ["==", ["get", "xj"], "true"]], "riskperson5",
                    ["all", ["==", ["get", "type"], 1], ["in", ["get", "work"], "三"], ["==", ["get", "xj"], "true"]], "riskperson6",
                    ["all", ["==", ["get", "type"], 1], ["in", ["get", "work"], "一,二"], ["==", ["get", "xj"], "true"]], "riskperson7",
                    image
                ],
                "icon-size": [
                    "interpolate",
                    ["linear"], ["zoom"],
                    9, 1,
                    14, 1
                ],
            }
        };
        if (minZoom) param["minzoom"] = minZoom;
        if (maxZoom) param["maxzoom"] = maxZoom;
        console.log(param, 777777)
        await map.addLayer(param);
        if (callback) {
            callback(map, name);
        } else {
            map.on("click", name, e => {
                const feature = e.features[0];
                console.log(feature, 5555)
                new mapboxgl.Popup({ closeButton: false }).setLngLat(feature.geometry.coordinates)
                    .setText(`${feature.properties.name}`)
                    .addTo(map);
            });
        }

    }

    /**
     * mapbox方式加载线图层
     * @param options
     */
    addMapboxLineLayer = async ({ name, color, width, animate, minZoom, maxZoom, data }, isLight = false, callback) => {
        const map = this.Map;
        const source = map.getSource(name);
        const geojson = {
            "type": "FeatureCollection",
            "features": []
        };
        if (source) {
            source.setData(data);
            return;
        }
        const sourceData = {
            type: "geojson",
            data: data || geojson
        }
        await map.addSource(name, sourceData);
        const param = {
            id: name,
            type: "line",
            source: name,
            paint: {
                "line-color": color,
                "line-width": width || 2,
                "line-opacity": 0.5,
            },
            layout: {
                "line-cap": "butt",
                "line-join": "round",
            }
        };
        if (minZoom) param["minzoom"] = minZoom;
        if (maxZoom) param["maxzoom"] = maxZoom;
        await map.addLayer(param);
        if (animate === 1) {
            param.id = param.id + "-animate";
            const source = map.getSource(param.id);
            if (source) {
                console.error(`${param.id}图层已存在`);
                return;
            }
            map.addLayer(param);
            let step = 0;
            let progress = 0;
            const dashArraySeq = [
                [0, 4, 3],
                [1, 4, 2],
                [2, 4, 1],
                [3, 4, 0],
                [0, 0, 4, 3],
                [0, 1, 4, 2],
                [0, 2, 4, 1],
                [0, 3, 4, 0]
            ];
            const interval = () => {
                try {
                    progress += 1;
                    if (progress % 3 === 1) {
                        if (!map || !map.setPaintProperty) return;
                        step = (step + 1) % dashArraySeq.length;
                        map.setPaintProperty(param.id, "line-dasharray", dashArraySeq[step]);
                    }
                    window.requestAnimationFrame(interval);
                } catch (error) { }

            };
            interval();
        }
        if (isLight) {
            let isTrue = true;
            let progress = 0;
            const timeoutFunc = () => {
                try {
                    progress += 1;
                    if (progress % 28 === 1) {
                        if (!map) return;
                        map.setPaintProperty(param.id, "line-color", isTrue ? "#117170" : color);
                        isTrue = !isTrue;
                    }
                    window.requestAnimationFrame(timeoutFunc);
                } catch (error) {
                    console.log(error);
                }
            };
            timeoutFunc();
        }
        if (callback) {
            callback(map, name);
        } else {
            map.on("click", name, (e) => {
                const feature = e.features[0];
                const lngLat = e.lngLat;
                new mapboxgl.Popup({
                    closeButton: false
                }).setLngLat([lngLat.lng, lngLat.lat])
                    .setText(`${feature.properties.name}`)
                    .addTo(map);
            });
        }
    }
    /**
    * 设置文本图层
    * @param options
    */
    setTextLayer = async ({ name, minZoom, maxZoom, data, color }) => {
        const map = this.Map;
        const source = map.getSource(name);
        const geojson = {
            "type": "FeatureCollection",
            "features": []
        };
        if (source) {
            source.setData(data);
            return;
        }
        const sourceData = {
            type: "geojson",
            data: data || geojson
        }
        await map.addSource(name, sourceData);
        const param = {
            id: name,
            type: "symbol",
            source: name,
            paint: {
                "text-color": color,
            },
            layout: {
                "text-allow-overlap": false,
                "text-padding": 8,
                "text-size": 16,
                "text-field": ["get", "name"],
                "text-font": [
                    "Microsoft YaHei Bold"
                ],
                "text-offset": [0, -2.4],
                "text-anchor": "center",
                'visibility': 'none'
            }
        };
        if (minZoom) param["minzoom"] = minZoom;
        if (maxZoom) param["maxzoom"] = maxZoom;
        await map.addLayer(param);
    }
    /**
     * 加载边界
    */
    loadBoundary = () => {
        this.Map.addSource("boundary", {
            type: "geojson",
            data: require("@/assets/map.json")
        });
        const paramSold = {
            id: "boundary-solid",
            type: "line",
            source: "boundary",
            paint: {
                "line-color": "#fff",
                "line-width": 3,
                "line-dasharray": [1, 0, 0]  // [0, 3, 1],

            },
            layout: {
                "line-cap": "butt",
                "line-join": "round",
            }
        };
        const paramDotted = {
            id: "boundary-dotted",
            type: "line",
            source: "boundary",
            paint: {
                "line-color": "#fff",
                "line-width": 1,
                "line-dasharray": [0, 3, 1],
            },
            layout: {
                "line-cap": "butt",
                "line-join": "round",
            }
        };
        this.Map.addLayer(paramSold).setFilter("boundary-solid", ["==", ["get", "name"], "眉山市"]);
        this.Map.addLayer(paramDotted).setFilter("boundary-dotted", ["!=", ["get", "name"], "眉山市"]);
    }
}