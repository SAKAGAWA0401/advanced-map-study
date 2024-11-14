import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import OpacityControl from 'maplibre-gl-opacity';
import 'maplibre-gl-opacity/dist/maplibre-gl-opacity.css';
import distance from '@turf/distance';

const map = new maplibregl.Map({
  container: 'map',
  zoom: 5, //初期zoom level
  center: [138, 37], //初期中心座標
  minZoom: 5, //ユーザ操作可能なzoom level
  maxZoom: 18,
  maxBounds: [[122, 20], [154, 50]],
  style: {
    version: 8,
    sources: {
      // osmlayer
      osm: {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        maxzoom: 19, //source側で決まっている可能なzoom level
        tileSize: 256,
        attribute: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
      // hazardlayer
      hazard_flood: {
          type: 'raster',
          tiles: [
              'https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin_data/{z}/{x}/{y}.png',
          ],
          minzoom: 2,
          maxzoom: 17,
          tileSize: 256,
          attribution:
              '<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>',
      },      
      hazard_hightide: {
        type: 'raster',
        tiles: [
            'https://disaportaldata.gsi.go.jp/raster/03_hightide_l2_shinsuishin_data/{z}/{x}/{y}.png',
        ],
        minzoom: 2,
        maxzoom: 17,
        tileSize: 256,
        attribution:
            '<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>',
      },
      hazard_tsunami: {
          type: 'raster',
          tiles: [
              'https://disaportaldata.gsi.go.jp/raster/04_tsunami_newlegend_data/{z}/{x}/{y}.png',
          ],
          minzoom: 2,
          maxzoom: 17,
          tileSize: 256,
          attribution:
              '<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>',
      },
      hazard_doseki: {
          type: 'raster',
          tiles: [
              'https://disaportaldata.gsi.go.jp/raster/05_dosekiryukeikaikuiki/{z}/{x}/{y}.png',
          ],
          minzoom: 2,
          maxzoom: 17,
          tileSize: 256,
          attribution:
              '<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>',
      },
      hazard_kyukeisha: {
          type: 'raster',
          tiles: [
              'https://disaportaldata.gsi.go.jp/raster/05_kyukeishakeikaikuiki/{z}/{x}/{y}.png',
          ],
          minzoom: 2,
          maxzoom: 17,
          tileSize: 256,
          attribution:
              '<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>',
      },
      hazard_jisuberi: {
          type: 'raster',
          tiles: [
              'https://disaportaldata.gsi.go.jp/raster/05_jisuberikeikaikuiki/{z}/{x}/{y}.png',
          ],
          minzoom: 2,
          maxzoom: 17,
          tileSize: 256,
          attribution:
              '<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>',
      },
      // 指定緊急避難場所vectorlayer
      skhb: {
        type: 'vector',
        tiles: [
            `${location.href.replace(
                '/index.html',
                '',
            )}/skhb/{z}/{x}/{y}.pbf`,
        ],
        minzoom: 5,
        maxzoom: 8,
        attribution:
            '<a href="https://www.gsi.go.jp/bousaichiri/hinanbasho.html" target="_blank">国土地理院:指定緊急避難場所データ</a>',
      },
      route: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      },
    },
    layers: [
      {
        id: 'osm-layer',
        type: 'raster',
        source: 'osm',
      },
      {
        id: 'hazard_flood-layer',
        source: 'hazard_flood',
        type: 'raster',
        paint: { 'raster-opacity': 0.7 },
        layout: { visibility: 'none' },
      },
      {
        id: 'hazard_hightide-layer',
        source: 'hazard_hightide',
        type: 'raster',
        paint: { 'raster-opacity': 0.7 },
        layout: { visibility: 'none' },
      },
      {
        id: 'hazard_tsunami-layer',
        source: 'hazard_tsunami',
        type: 'raster',
        paint: { 'raster-opacity': 0.7 },
        layout: { visibility: 'none' },
      },
      {
        id: 'hazard_doseki-layer',
        source: 'hazard_doseki',
        type: 'raster',
        paint: { 'raster-opacity': 0.7 },
        layout: { visibility: 'none' },
      },
      {
        id: 'hazard_kyukeisha-layer',
        source: 'hazard_kyukeisha',
        type: 'raster',
        paint: { 'raster-opacity': 0.7 },
        layout: { visibility: 'none' },
      },
      {
        id: 'hazard_jisuberi-layer',
        source: 'hazard_jisuberi',
        type: 'raster',
        paint: { 'raster-opacity': 0.7 },
        layout: { visibility: 'none' },
      },
      {
        id: 'skhb-1-layer',
        source: 'skhb',
        'source-layer': 'skhb',
        type: 'circle',
        paint: {
          'circle-color': '#6666cc',
          'circle-radius': [
              // ズームレベルに応じた円の大きさ
              'interpolate',
              ['linear'],
              ['zoom'],
              5,
              2,
              14,
              6,
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
        filter: ['get', 'disaster1'],
        layout: { visibility: 'none' },
      },
      {
        id: 'skhb-2-layer',
        source: 'skhb',
        'source-layer': 'skhb',
        type: 'circle',
        paint: {
          'circle-color': '#6666cc',
          'circle-radius': [
              // ズームレベルに応じた円の大きさ
              'interpolate',
              ['linear'],
              ['zoom'],
              5,
              2,
              14,
              6,
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
        filter: ['get', 'disaster2'],
        layout: { visibility: 'none' },
      },
      {
        id: 'skhb-3-layer',
        source: 'skhb',
        'source-layer': 'skhb',
        type: 'circle',
        paint: {
          'circle-color': '#6666cc',
          'circle-radius': [
              // ズームレベルに応じた円の大きさ
              'interpolate',
              ['linear'],
              ['zoom'],
              5,
              2,
              14,
              6,
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
        filter: ['get', 'disaster3'],
        layout: { visibility: 'none' },
      },
      {
        id: 'skhb-4-layer',
        source: 'skhb',
        'source-layer': 'skhb',
        type: 'circle',
        paint: {
          'circle-color': '#6666cc',
          'circle-radius': [
              // ズームレベルに応じた円の大きさ
              'interpolate',
              ['linear'],
              ['zoom'],
              5,
              2,
              14,
              6,
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
        filter: ['get', 'disaster4'],
        layout: { visibility: 'none' },
      },
      {
        id: 'skhb-5-layer',
        source: 'skhb',
        'source-layer': 'skhb',
        type: 'circle',
        paint: {
          'circle-color': '#6666cc',
          'circle-radius': [
              // ズームレベルに応じた円の大きさ
              'interpolate',
              ['linear'],
              ['zoom'],
              5,
              2,
              14,
              6,
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
        filter: ['get', 'disaster5'],
        layout: { visibility: 'none' },
      },
      {
        id: 'skhb-6-layer',
        source: 'skhb',
        'source-layer': 'skhb',
        type: 'circle',
        paint: {
          'circle-color': '#6666cc',
          'circle-radius': [
              // ズームレベルに応じた円の大きさ
              'interpolate',
              ['linear'],
              ['zoom'],
              5,
              2,
              14,
              6,
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
        filter: ['get', 'disaster6'],
        layout: { visibility: 'none' },
      },
      {
        id: 'skhb-7-layer',
        source: 'skhb',
        'source-layer': 'skhb',
        type: 'circle',
        paint: {
          'circle-color': '#6666cc',
          'circle-radius': [
              // ズームレベルに応じた円の大きさ
              'interpolate',
              ['linear'],
              ['zoom'],
              5,
              2,
              14,
              6,
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
        filter: ['get', 'disaster7'],
        layout: { visibility: 'none' },
      },
      {
        id: 'skhb-8-layer',
        source: 'skhb',
        'source-layer': 'skhb',
        type: 'circle',
        paint: {
          'circle-color': '#6666cc',
          'circle-radius': [
              // ズームレベルに応じた円の大きさ
              'interpolate',
              ['linear'],
              ['zoom'],
              5,
              2,
              14,
              6,
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
        filter: ['get', 'disaster8'],
        layout: { visibility: 'none' },
      },
      {
        id: 'route-layer',
        source: 'route',
        type: 'line',
        paint:{
          'line-color': '#33aaff',
          'line-width': 4,
        }
      }
    ]
  }
})

let userLocation = null; // ユーザの位置情報を格納する変数

const geolocationControl = new maplibregl.GeolocateControl({
  trackUserLocation: true,  // 位置情報取得ボタンを表示
});
map.addControl(geolocationControl, 'bottom-right');

// ダミー位置の設定
// const dummyLocation = [139.6917, 35.6895];  // 東京の経度, 緯度
geolocationControl.on('geolocate', (e) => {
  // 位置情報をダミー位置に上書き
  // userLocation = dummyLocation;
  userLocation = [e.coords.longitude, e.coords.latitude];
});

// 最寄りの避難所
// 表示レイヤーのフィルター特定関数
const getCurrentSkhbLayerFilter = () => {
  const style = map.getStyle();
  const skhbLayers = style.layers.filter((layer) => layer.id.startsWith('skhb'));
  const visibleSkhbLayer = skhbLayers.filter((layer) => layer.layout.visibility === 'visible');
  return visibleSkhbLayer[0].filter;
}

//経緯度から最寄りの避難所を返す関数
const getNearestFeature = (longitude, latitude) => {
  const getCurrentSkhbLayerFilter = getCurrentSkhbLayerFilter();
  const features = map.querySourceFeatures('skhb', {
    sourceLayer: 'skhb',
    filter: getCurrentSkhbLayerFilter,
  }); // display layer filter condtionに合致するfeatureを取得

  const nearestFeature = features.reduce((minDistFeature, feature) => {
    const dist = distance(
      [longitude, latitude],
      feature.geometry.coordinates,
      { units: 'kilometers' }
    );
    if (minDistFeature === null || minDistFeature.properties.dist > dist) {
      return { 
        ...feature,
        properties: {
          ...feature.properties,
          dist,
        },
      };
    }
    return minDistFeature;
  }, null);

  return nearestFeature;
}


map.on('load', () => {
  const opacity = new OpacityControl({
    baseLayers: {
      'hazard_flood-layer': '洪水浸水想定区域',
      'hazard_hightide-layer': '高潮浸水想定区域',
      'hazard_tsunami-layer': '津波浸水想定区域',
      'hazard_doseki-layer': '土石流・れい雪警戒区域',
      'hazard_kyukeisha-layer': '急傾斜警戒区域',
      'hazard_jisuberi-layer': '地すべり警戒区域',
    }
  });
  map.addControl(opacity, 'top-left');

  const opacitySkhb = new OpacityControl({
    baseLayers: {
      'skhb-1-layer': '洪水',
      'skhb-2-layer': '崖崩れ/土石流/地滑り',
      'skhb-3-layer': '高潮',
      'skhb-4-layer': '地震',
      'skhb-5-layer': '津波',
      'skhb-6-layer': '大規模な火事',
      'skhb-7-layer': '内水氾濫',
      'skhb-8-layer': '火山現象',      
    }
  });
  map.addControl(opacitySkhb, 'top-right');  

  // 地図上をクリックした際のイベント
  // 地図の初期ロードが完了した後にのみクリックイベントが登録されるようにするために
  // map.on('load', () => { ... }) の中に記述
  map.on('click', (e) => {
    // クリック箇所に指定緊急避難場所レイヤーが存在するかどうかをチェック
    const features = map.queryRenderedFeatures(e.point, {
        layers: [
            'skhb-1-layer',
            'skhb-2-layer',
            'skhb-3-layer',
            'skhb-4-layer',
            'skhb-5-layer',
            'skhb-6-layer',
            'skhb-7-layer',
            'skhb-8-layer',
        ],
    });
    if (features.length === 0) return; // 地物がなければ処理を終了

    // 地物があればポップアップを表示する
    const feature = features[0]; // 複数の地物が見つかっている場合は最初の要素を用いる
    const popup = new maplibregl.Popup()
        .setLngLat(feature.geometry.coordinates) // [lon, lat]
        // 名称・住所・備考・対応している災害種別を表示するよう、HTMLを文字列でセット
        // 以下spanタグの中身に関して、
        // spanタグはデフォルトで文字スタイルが黒文字、disaster#がfalseの場合のみstyleでグレー化
        .setHTML(
            `\
    <div style="font-weight:900; font-size: 1.2rem;">${
        feature.properties.name
    }</div>\
    <div>${feature.properties.address}</div>\
    <div>${feature.properties.remarks ?? ''}</div>\
    <div>\
    <span${
        feature.properties.disaster1 ? '' : ' style="color:#ccc;"'
    }">洪水</span>\
    <span${
        feature.properties.disaster2 ? '' : ' style="color:#ccc;"'
    }> 崖崩れ/土石流/地滑り</span>\
    <span${
        feature.properties.disaster3 ? '' : ' style="color:#ccc;"'
    }> 高潮</span>\
    <span${
        feature.properties.disaster4 ? '' : ' style="color:#ccc;"'
    }> 地震</span>\
    <div>\
    <span${
        feature.properties.disaster5 ? '' : ' style="color:#ccc;"'
    }>津波</span>\
    <span${
        feature.properties.disaster6 ? '' : ' style="color:#ccc;"'
    }> 大規模な火事</span>\
    <span${
        feature.properties.disaster7 ? '' : ' style="color:#ccc;"'
    }> 内水氾濫</span>\
    <span${
        feature.properties.disaster8 ? '' : ' style="color:#ccc;"'
    }> 火山現象</span>\
    </div>`,
        )
        .setMaxWidth('400px')
        .addTo(map);
  });

    // 地図上でマウスが移動した際のイベント
    map.on('mousemove', (e) => {
      // マウスカーソル以下に指定緊急避難場所レイヤーが存在するかどうかをチェック
      const features = map.queryRenderedFeatures(e.point, {
          layers: [
              'skhb-1-layer',
              'skhb-2-layer',
              'skhb-3-layer',
              'skhb-4-layer',
              'skhb-5-layer',
              'skhb-6-layer',
              'skhb-7-layer',
              'skhb-8-layer',
          ],
      });
      map.getCanvas().style.cursor = features.length > 0 ? 'pointer' : '';
  });  

  // 地図が描画される毎フレームごとにユーザの現在地から最寄り避難所を計算する
  map.on('render', () => {
    if (geolocationControl._watchState === 'OFF') userLocation = null;
    //if (map.getZoom() < 7 || userLocation === null) return; // 位置情報が取得できていない場合は処理を終了
    if (map.getZoom() < 7 || userLocation === null) {
      map.getSource('route').setData({
        type: 'FeatureCollection',
        features: [],
      });
      return; // 位置情報が取得できていない場合はちゃんと表示ラインを空にしてから処理を終了
    }

    const nearestFeature = getNearestFeature(userLocation[0], userLocation[1]);
    const routeFeature = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [userLocation, nearestFeature.geometry.coordinates],
      },
    };
    map.getSource('route').setData({
      type: 'FeatureCollection',
      features: [routeFeature],
    }); // 位置情報が取得できている場合はデータを更新して作成
  });

  map.addSource('terrain', {
    type: 'raster-dem',
    tiles: [`https://api.maptiler.com/tiles/terrain-rgb-v2/{z}/{x}/{y}.webp?key=${process.env.MAPTILER_API_KEY}`],
    maxzoom: 12,
    attribution: `
      <a href="https://maptiler.com/" target="_blank">
        <img src="./public/maptiler-logo.png" alt="MapTiler logo" style="width: 60px; vertical-align: middle;">
      </a>
      `
  })
  map.addLayer(
    {
      id: 'hillshade-layer',
      type: 'hillshade',
      source: 'terrain',
      paint: {
        'hillshade-illumination-anchor': 'map',
        'hillshade-exaggeration': 0.2,
      },
    },
    'hazard_jisuberi-layer',
  )
  map.addControl(
    new maplibregl.TerrainControl({
      source: 'terrain',
      exaggeration: 1,
    }),
    'top-right',
  )
})
