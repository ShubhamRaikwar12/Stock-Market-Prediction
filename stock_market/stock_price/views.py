from django.shortcuts import render, get_object_or_404, redirect, reverse
import pandas as pd
import pandas_datareader.data as web
import datetime
from pandas import Series, DataFrame
import math
import numpy as np
from sklearn import preprocessing, svm
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.neighbors import KNeighborsRegressor
from sklearn.linear_model import Ridge
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline
from django.http import HttpResponse
import requests
from bs4 import BeautifulSoup

def home_view(request):
	company = 'AMZN'
	start_date = '2017-01-01'
	end_date = datetime.datetime.now()
	if request.method == 'POST':
		company = request.POST.get('company')
		start_date = request.POST.get('start_date')
		end_date = request.POST.get('end_date')
	df = web.DataReader(company, 'yahoo', start_date, end_date)
	df['Average'] = df['Adj Close'].rolling(window=100).mean()
	df['Rets'] = df['Adj Close'] / df['Adj Close'].shift(1) - 1
	df['HL_PCT'] = (df['High'] - df['Low']) / df['Close'] * 100.0
	df['PCT_change'] = (df['Close'] - df['Open']) / df['Open'] * 100.0
	df2 = df.rename(columns={"Adj Close": "Adj_Close"}).fillna('')
	new_table = df2.tail(100).reset_index().to_dict(orient='records')
	table_two = df2.tail(10).reset_index().to_dict(orient='records')
	dfreg = df.loc[:,['Adj Close','Volume']]
	dfreg['HL_PCT'] = (df['High'] - df['Low']) / df['Close'] * 100.0
	dfreg['PCT_change'] = (df['Close'] - df['Open']) / df['Open'] * 100.0
	dfreg.fillna(value=-99999, inplace=True)
	forecast_out = int(math.ceil(0.01 * len(dfreg)))
	forecast_col = 'Adj Close'
	dfreg['label'] = dfreg[forecast_col].shift(-forecast_out)
	X = np.array(dfreg.drop(['label'], 1))
	X = preprocessing.scale(X)
	X_lately = X[-forecast_out:]
	X = X[:-forecast_out]
	y = np.array(dfreg['label'])
	y = y[:-forecast_out]
	X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
	clfreg = LinearRegression(n_jobs=-1)
	clfreg.fit(X_train, y_train)
	clfpoly2 = make_pipeline(PolynomialFeatures(2), Ridge())
	clfpoly2.fit(X_train, y_train)
	clfpoly3 = make_pipeline(PolynomialFeatures(3), Ridge())
	clfpoly3.fit(X_train, y_train)
	clfknn = KNeighborsRegressor(n_neighbors=2)
	clfknn.fit(X_train, y_train)
	confidencereg = clfreg.score(X_test, y_test)
	confidencepoly2 = clfpoly2.score(X_test,y_test)
	confidencepoly3 = clfpoly3.score(X_test,y_test)
	confidenceknn = clfknn.score(X_test, y_test)
	forecast_set = clfreg.predict(X_lately)
	dfreg['Forecast'] = np.nan
	last_date = dfreg.iloc[-1].name
	last_unix = last_date
	next_unix = last_unix + datetime.timedelta(days=1)
	for i in forecast_set:
	    next_date = next_unix
	    next_unix += datetime.timedelta(days=1)
	    dfreg.loc[next_date] = [np.nan for _ in range(len(dfreg.columns)-1)]+[i]
	final_table = dfreg.rename(columns={"Adj Close": "Adj_Close"}).fillna('').tail(100).reset_index().to_dict(orient='records')
	final_table8 = dfreg.rename(columns={"Adj Close": "Adj_Close"}).fillna('').tail(8).reset_index().to_dict(orient='records')
	u='https://seekingalpha.com/market-news'
	r=requests.get(u)
	soup=BeautifulSoup(r.content,'lxml')
	news=soup.find('div',{"id":'all-news'})
	# print(news.text)
	headlines=news.find_all('h4')
	results = []
	for headline in headlines:
		result = {
		'title': headline.text,
		'link': 'https://seekingalpha.com'+headline.find('a').get('href'),
		}
		results.append(result)
	# print(results)
	context = {
		'first_table': table_two,
		'full_table': new_table,
		'final_table': final_table,
		'final_table10': final_table8,
		'confidencereg': confidencereg,
		'forecast_out': forecast_out,
		'company': company,
		'feeds':results,
		}
	return render(request, 'index.html', context)
def about(request):
	return render(request,'about.html')
def contact(request):
	return render(request,'contact.html')

