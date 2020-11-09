# map-ui

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### usage
```
yarn add @byzanteam/map-ui

import { BaseMap, Regions } from '@byzanteam/map-ui'
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


# Document
## Map
### Attribute
Attribute|Description|Type|Accepted Values|Default
-|-|-|-|-
features|基础地图的要素|Array/String|['bg', 'point', 'road', 'building'] / none / all|all
mapStyle|地图主题|String|-|高德默认主题
mapOptions|地图配置项|Object|-|-
useMapUi|是否启用高德 ui 库|Boolean|true/false|false

### Events
  Events Name|Description|Parameters
  -|-|-|-
  amap-loaded|地图加载完成|-
  amap-ui-loaded|地图组件加载完成|-
  map-created|地图创建完成| map 类
  map-resize|地图发生了尺寸变化和移动|当前 map 的 bounds

### Methods
  Methods Name|Description|Parameters
  -|-|-|-
  setCenter|设置地图中心点|position
  setZoom|设置地图缩放层级|zoom

## Marker
### Props
  Attribute|Description|Type|Accepted Values|Default
  -|-|-|-|-
  marker|渲染点的数据|Object|-|-
  markerStyle|点的样式|Object|color<br> size<br>strokeColor<br> strokeWidth|color: #04BF78<br> size: 24<br>strokeColor: rgba(255, 255, 255, 0.2)<br>strokeWidth: 1
  innerLabelStyle|点的文本样式，可以设置多行文本和每行文本的样式|Object|fontSize<br> color<br> fontWeight<br> padding|fontSize: 12<br>color: rgba(255, 255, 255, 0.2)<br>fontWeight:400<br>padding: [2, 4]<br>
  icon|点的形状|String| triangle/waterDrop/triangleDown/hexagon/circle/fivePointsStar|circle

### Events
  Events Name|Description|Parameters
  -|-|-|-
  click|鼠标点击事件|event
  mouseover|鼠标移近点事件|event
  mouseout|鼠标移出点事件|event
  marker-rendered|marker 渲染完毕事件|marker 类

### Methods
  Methods Name|Description|Parameters
  -|-|-|-
  setMarkerData|设置点的数据|marker
  clear|清除地图上的当前点覆盖物|-

## StratumMarker
### Props
  Attribute|Description|Type|Accepted Values|Default
  -|-|-|-|-
  markers|渲染点的数据集合|Array|-|-
  markerStyle|点的样式|Object|-|-
  markerStyleMap|可以根据点的值的等级范围来设置不同点的样式|Object|-|null
  innerLabelStyle|点的文本样式，可以设置多行文本和每行文本的样式|Object|-|-
  icon|点的形状|String| triangle/waterDrop/triangleDown/hexagon/circle/fivePointsStar|circle

### Events
  Events Name|Description|Parameters
  -|-|-|-
  marker-clicked|marker 鼠标点击事件|marker 类
  marker-mouseover|marker 鼠标移近点事件|marker 类
  marker-mouseout|marker 鼠标移出点事件|marker 类

### Methods
  Methods Name|Description|Parameters
  -|-|-|-
  clear|清除地图上的当前 StratumMarker 组件的所有点覆盖物|-

## ElasticMarker
### Props
Attribute|Description|Type|Accepted Values|Default
-|-|-|-|-
markers|渲染点的数据集合|Array|-|-
zoomStyleMap|根据地图层级制定的 marker 样式映射|Array|-|-

## Cluster
### Props
Attribute|Description|Type|Accepted Values|Default
-|-|-|-|-
clusterStyle|聚合点的样式|Object|color<br>size<br>borderColor<br>borderWidth<br>|color: #04BF78<br>size: 6<br>borderColor: rgba(255, 255, 255, 0.2)<br>borderWidth: 1
clusterStyleMap|聚合点不同等级的样式映射|Object|-|-
clusterKey|聚合点根据 clusterKey 分级|String|-|单个聚合点的 marker 的数量 count
labelStyle|聚合点文本样式|Object|fontSize<br>color<br>fontWeight<br>|fontSize: 12<br>color: rgba(255, 255, 255, 0.2)<br>fontWeight: 400
icon|聚合点的形状|String| triangle/waterDrop/triangleDown/hexagon/circle/fivePointsStar|circle

### Events
  Events Name|Description|Parameters
  -|-|-|-
  clusterClick|cluster 鼠标点击事件|cluster 类

## Regions
### Props
Attribute|Description|Type|Accepted Values|Default
-|-|-|-|-
areas|区域 geojson 集合|Array|-|-
groups|区域分组|Array|-|-
areaStyle|区域样式|Object|-|strokeColor: 'white'<br>fillColor: '#5fd0dc'<br>fillOpacity: 0.2<br>strokeWeight: 1
areaHoverStyle|鼠标移入某个区域上方时的样式|Object|-|fillOpacity: 1<br>strokeWeight: 2
selectable|是否可选中|Boolean|true/false|true
multipleSelect|是否为多选|Boolean|true/false|false

### Events
  Events Name|Description|Parameters
  -|-|-|-
  area-clicked|某个区域鼠标点击事件|geoJSON, area, component

### Methods
  Methods Name|Description|Parameters
  -|-|-|-
  selectArea|选中某个区域|区域的 GeoJSON 类
  unselectArea| 取消选中某个区域|区域的 GeoJSON 类
  clear|清除绘制的区域|-
  setFitView|调整地图到合适的缩放等级和中心点|区域的 GeoJSON 类

## HeatMap
### Props
Attribute|Description|Type|Accepted Values|Default
-|-|-|-|-
heatPoints|热力图点集合|Array|-|-
heatPointRadius|热力点直径|Number|-|20
heatPointColorMap|热力点样式映射|Object|-|null

### Methods
  Methods Name|Description|Parameters
  -|-|-|-
  setPointData|设置热力图数据|data
  clear|清除热力图|-

## Airline
### Props
Attribute|Description|Type|Accepted Values|Default
-|-|-|-|-
edges|地图上轨迹的走向的集合|Array|-|-
points|轨迹起始点经纬度的集合|Array|-|-
curvature|设定曲线的曲率，值越大越弯曲，0为直线|Number|0～1|1
pieceCount绘制每条路径的点数|Number|-|20
duration|用完成时间来定义速度|Number|-|10

### Methods
  Methods Name|Description|Parameters
  -|-|-|-
  clear|清除轨迹|-
