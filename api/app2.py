from flask import Flask, request, make_response, jsonify, render_template
from flask_cors import CORS
from flask_restx import Api, Resource  # Api 구현을 위한 Api 객체 import

import pandas as pd
import json

app = Flask(__name__)  # Flask 객체 선언, 파라미터로 어플리케이션 패키지의 이름을 넣어줌.
api = Api(app)  # Flask 객체에 Api 객체 등록
CORS(app)

def read_chart():
    df = pd.read_csv('../크롤링/샘플차트.csv')
    df = chart_date(df, '2020-08-01', '2020-09-01')
    return df

def chart_date(chart_df, start_date, end_date):
    return chart_df.loc[(chart_df['date'] >= start_date) & (chart_df['date'] <= end_date)]

def chart_track(chart_df):
    return list(chart_df.groupby(['title'])[['streams']].sum().sort_values('streams', ascending = False ).reset_index()[:50].sort_values('streams', ascending = True ).to_dict('index').values())

def chart_artist(chart_df):
    return list(chart_df.groupby(['artist'])[['streams']].sum().sort_values('streams', ascending = False ).reset_index()[:50].sort_values('streams', ascending = True ).to_dict('index').values())

def chart_region(chart_df):
    return list(chart_df.groupby(['region_code3'])[['streams']].sum().sort_values('streams', ascending = False ).reset_index().rename(columns = {'region_code3':'id','streams':'value'}).to_dict('index').values())

def chart_daterange(chart_df):
    return list(chart_df.groupby(['date'])[['streams']].sum().reset_index().rename(columns = {'date':'x','streams':'y'}).to_dict('index').values())

@api.route('/total_chart_api', methods = ['POST'])
class total_chart(Resource):
    def post(self):
        r = request.get_json()
        start_date = r['start_date'] or '2020-08-01'
        end_date = r['end_date'] or '2020-09-01'
        df = pd.read_csv('../크롤링/샘플차트.csv')
        df = chart_date(df, start_date, end_date)
        region = r['region'] or 'GLOBAL'
        region_df = df.loc[df['region_code3'] == region]
        region_result = chart_region(region_df)
        if r['title']:
            title = r['title']
            title_df = region_df.loc[region_df['title'] == title]
            title_result = chart_track(title_df)
            artist_result = chart_artist(title_df)
            region_result = chart_region(title_df)
            daterange_result = chart_daterange(title_df)
        elif r['artist']:
            artist = r['artist']
            artist_df = region_df.loc[region_df['artist'] == artist]
            artist_result = chart_artist(artist_df)
            title_result = chart_track(artist_df)
            region_result = chart_region(artist_df)
            daterange_result = chart_daterange(artist_df)
        else:
            artist_result = chart_artist(region_df)
            title_result = chart_track(region_df)
            region_result = chart_region(region_df)
            daterange_result = chart_daterange(region_df)

        return make_response(jsonify({
                                "artist_result": artist_result,
                                "title_result": title_result,
                                "region_result": region_result,
                                "daterange_result": daterange_result
                                }),200)



@api.route('/hello')  # 데코레이터 이용, '/hello' 경로에 클래스 등록
class HelloWorld(Resource):
    def get(self):  # GET 요청시 리턴 값에 해당 하는 dict를 JSON 형태로 반환

        return make_response(jsonify({"hello": "world!"}),200)

@api.route('/date_chart', methods = ['POST'])
class chart_read(Resource):
    def post(self):

        df = pd.read_csv('../크롤링/샘플차트.csv')
        start_date = request.get_json()['start_date']
        end_date = request.get_json()['end_date']
        df = chart_date(df, start_date, end_date)
        # print(jsonify(request.get_json()))
        return make_response(jsonify(df.to_dict('index')),200)
        # return jsonify(request.get_json())

@api.route('/region_chart', methods = ['POST'])
class chart_read(Resource):
    def get(self):
        input = pd.DataFrame(request.get_json())
        df = chart_date(read_chart(), '2020-08-01', '2020-09-01')

        return make_response(jsonify(chart_region(df)),200)

@api.route('/artist_chart')
class chart_read(Resource):
    def get(self):
        df = chart_date(read_chart(), '2020-08-01', '2020-09-01')

        return make_response(jsonify(chart_artist(df)),200)

@api.route('/track_chart')
class chart_read(Resource):
    def get(self):
        df = chart_date(read_chart(), '2020-08-01', '2020-09-01')

        return make_response(jsonify(chart_track(df)),200)

if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0',port = '5000')
