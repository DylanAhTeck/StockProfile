import requests
from flask import Flask, make_response, jsonify
from flask_cors import CORS
from datetime import *
from dateutil.relativedelta import *

application = Flask(__name__)
CORS(application, supports_credentials=True)

@application.route("/")
def loadHome():
    return application.send_static_file('hw6.html')


@application.route("/search/<string:ticker>")
def getCompany(ticker):
    headers = {
        'Content-Type': 'application/json',
        'Authorization' : 'Token 14042d0dd6b6fff20e627a4e3fa8c7d73c65fdf3'
        }
    requestResponse = requests.get("https://api.tiingo.com/tiingo/daily/" + ticker,
                                    headers=headers)

    return make_response(jsonify(requestResponse.json()), 200)

    
@application.route("/stock/<string:ticker>")
def getStock(ticker):
    headers = {
        'Content-Type': 'application/json',
        'Authorization' : 'Token 14042d0dd6b6fff20e627a4e3fa8c7d73c65fdf3'
        }
    requestResponse = requests.get("https://api.tiingo.com/iex/" + ticker,
                                    headers=headers)
    return make_response(jsonify(requestResponse.json()), 200)


@application.route("/news/<string:ticker>")
def getNews(ticker):
    headers = {
        'Content-Type': 'application/json',
        }

    requestResponse = requests.get("https://newsapi.org/v2/everything?q=" + ticker + "&apiKey=81519208556343cc999246b8ead24245",
                                    headers=headers)

    return make_response(jsonify(requestResponse.json()), 200)

@application.route("/chart/<string:ticker>")
def getChart(ticker):
    headers = {
        'Content-Type': 'application/json',
        'Authorization' : 'Token 14042d0dd6b6fff20e627a4e3fa8c7d73c65fdf3'
        }
    date = datetime.now() + relativedelta(months= -6)
    startDate = date.date()
    requestResponse = requests.get(f"https://api.tiingo.com/iex/{ticker}/prices?startDate={startDate}&resampleFreq=12hour&columns=open,high,low,close,volume",
                                    headers=headers)

    return make_response(jsonify(requestResponse.json()), 200)


if __name__ == '__main__':
     #app.run()
    application.debug = True
    application.run()