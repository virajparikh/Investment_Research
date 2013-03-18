Investment_Research
===================

After Week 2:
Prior week, the data gathering from Yahoo Finance was very manually intensive.  Now it is more automated, with dynamic updating of data.  Instead of saving the data in JSON file, we now simply save the portfolio of stock tickers in a JSON file, which will then pull down the most updated data from Yahoo Finance.

The portfolio page is here: https://investmentproject-jarus.backliftapp.com/pages/Portfolio_2.html

Also incorporating Stocktwits api to feed latest thoughts on stocks of interest (not quite working yet): https://investmentproject-jarus.backliftapp.com/pages/StockTwits_6.html

Finally, click in the Investor Education link for websites and books that will make any individual invest and trade more wisely.

After Week1 1:
Investment research website and app.  Project begun in Nashville Software School.

Backlift url: https://investmentproject-jarus.backliftapp.com/
Backlift admin url: https://investmentproject-jarus.backliftapp.com/pages/admin/index.html

Pulls financial data from Yahoo Finance for the stock tickers chosen.  Utilizes the Yahoo! Query Language (YQL) Web Service.

Directions:
> take the YQL go change the YQL Query & encode it
> paste it to the bottom of the BaseYQL URL
> go to the URL, download the page (save) over the stocks.json
> reprocess & now you have whatever stocks you listed.

YQL:
select * from yahoo.finance.quotes where symbol in ("YHOO","AAPL","GOOG","MSFT", "EBAY")


ENCODE THE YQL HERE:
http://meyerweb.com/eric/tools/dencoder/

Base YQL URL: (paste to the end of this -- NO SPACES)
http://query.yahooapis.com/v1/public/yql?env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json&q=

Here is one with YHOO, AAPL, GOOG, MSFT & EBAY:
http://query.yahooapis.com/v1/public/yql?env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json&q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22YHOO%22%2C%22AAPL%22%2C%22GOOG%22%2C%22MSFT%22%2C%20%22EBAY%22)
