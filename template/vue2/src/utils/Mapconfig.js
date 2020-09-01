export const mapType = {
    GISBZ: ["gistText"],
    SLJC: ["SLJC", "SLLW", "SLSY", "SLBZ"],
    SLBZ: ["SLBZ"],
    SLSY: ["SLSY"],
    SLLW: ["SLLW"],
    YXJC: ["SCJC", "YXJC"],
    YXBZ: ["YXBZ"],
    YXLW: ["YXLW"],
    YXSY: ["YXSY"]
};
// 初始化地图资源配置
export const mapSource = {
    SCJC: {
        type: "raster",
        tiles: ["http://192.168.1.87:8082/scjc/{z}/{x}/{y}.png"],
        tileSize: 256,
    },
    YXJC: {
        type: "raster",
        tiles: ["http://192.168.1.87:8082/msyx/{z}/{x}/{y}.png"],
        tileSize: 256,
    },
    SLJC: {
        type: "raster",
        tiles: ["http://192.168.1.87:8082/mssl/jc/{z}/{x}/{y}.png"],
        tileSize: 256,
    },
    SLSY: {
        type: "raster",
        tiles: ["http://192.168.1.87:8082/mssl/sw/{z}/{x}/{y}.png"],
        tileSize: 256,
    },
    SLLW: {
        type: "raster",
        tiles: [
            "http://192.168.1.87:8082/mssl/lw/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
    },
    SLBZ: {
        type: "raster",
        tiles: [
            "http://192.168.1.87:8082/mssl/bz/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
    },
};


/**
 * 参数配置对象
 */
export const mapConfig = {
    /** 存儲不同地图等级显示设备 */
    zoomPsr: [],
    /** 设备类型 */
    psrType: [],
    /** 电压等级 */
    dydj: [],
    /** 线路颜色 */
    lineStyle: {},
    psrConfig: {},
    authority: [],
    /** 根据电压来判断是否标注文本 */
    showtext: 25,
    callouttextColor: "#F4A460"
};
/**
 * 加载图片资源
*/
export const loadImageSource = async (data, mapboxInstance) => {
    if (!mapboxInstance) {
        // mapboxInstance = window["GWMap"];
    }
    try {
        // 根据数据规则加载images 资源
        // mapboxInstance.loadMapboxImage()

    } catch (error) {

    }
};

/**
 * 设置每个地图层级对应应显示的 Layer ids
 *
*/
export function setZoomPsr(data) {
    const result = {};
    data.forEach((item) => {
        for (let i = item.mapMinZoom; i <= item.mapMaxZoom; i += 1) {
            if (result[i]) {
                result[i].push(`${item.code}-${item.voltage}`);
            } else {
                result[i] = [`${item.code}-${item.voltage}`];
            }
            if (item.animate) {
                result[i].push(`${item.code}-${item.voltage}-animate`);
            }
        }
    });
    mapConfig.zoomPsr = result;
    return result;
}

/**
 * 获取地图层级中所有的Layer ids
 * **/
export function getZoomPsr(zoom) {
    const currentPsr = mapConfig.zoomPsr[zoom] || [];
    return currentPsr;
    // 下面进行权限控制
    // if (mapConfig.authority.length === 0) return currentPsr;
    // return currentPsr.filter((psr) => (mapConfig.authority.includes(psr)));
}