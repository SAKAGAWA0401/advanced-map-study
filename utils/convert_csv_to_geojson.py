import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

# CSVファイルの読み込み
df = pd.read_csv('./utils/全国指定緊急避難場所データ.csv')
# 最初にデータをざっと確認する
# print(df.head(10))  # 例: 先頭10行を表示
# print(df.sample(10)) # データフレームからランダムに10行を表示
# print(df.shape) # データの行数とカラム数を確認
# print(df.columns) # カラム名の一覧を表示
# print(df.info()) # データ型の情報を表示

# 不要なカラムを削除
df = df.drop(columns=["市町村コード", "都道府県名及び市町村名", "NO", "指定避難所との住所同一"])

# カラム名を変更
df = df.rename(columns={
    "施設・場所名": "name",
    "住所": "address",
    "洪水": "disaster1",
    "崖崩れ、土石流及び地滑り": "disaster2",
    "高潮": "disaster3",
    "地震": "disaster4",
    "津波": "disaster5",
    "大規模な火事": "disaster6",
    "内水氾濫": "disaster7",
    "火山現象": "disaster8",
    "緯度": "latitude",
    "経度": "longitude",
    "備考": "remark"
})

# disasterカラムをBooleanに変換 (nullはFalse、それ以外はTrue)
for disaster_col in ["disaster1", "disaster2", "disaster3", "disaster4", "disaster5", "disaster6", "disaster7", "disaster8"]:
    df[disaster_col] = df[disaster_col].notnull()

# 緯度・経度のカラムを指定して、Pointオブジェクトを作成
geometry = [Point(xy) for xy in zip(df['longitude'], df['latitude'])]
gdf = gpd.GeoDataFrame(df, geometry=geometry)

gdf = gdf.drop(columns=["latitude", "longitude"])
# print(gdf.info())

# GeoJSONファイルに出力
gdf.to_file('skhb.geojson', driver='GeoJSON')
