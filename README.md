Investment_Research
===================

After Week 2.5:
----------------
https://investmentproject-jarus.backliftapp.com/pages/Portfolio_2.html

https://investmentproject-jarus.backliftapp.com/pages/StockTwits_3.html

Create Portfolio functioning properly.  Stocktwits api/page now working properly, and is properly formatted.  

Still needs work: View, Edit and Delete Portfolio Buttons.  Delete individual stocks from portfolios still not working properly.  The following link outlines all outstanding issues and their status:
https://docs.google.com/spreadsheet/ccc?key=0Ah7D2allnPgFdHFFVDJDcjVSZ0QxelY0ZEJMM0VIMFE&usp=sharing

Issues of concern largely out of my control: Ajax call to Yahoo Query Library (YQL) seems to fail about 50% of the time, most prominently during the day.  Theory is that Backlift can only pull secure data, but fixing that does not always produce a consistent result.  Also, some valuation data in Yahoo! Finance was incorrect at one point, but that may have been temporary.  


After Week 2:
-------------
In the prior week, the data gathering from Yahoo Finance was very manually intensive.  Now it is more automated, and the data is more current. Instead of saving the data in JSON a file, we now only save the portfolio of stock tickers in a JSON file.  Through an Ajax call, we can now pull down the most updated data from Yahoo Finance.

The portfolio page is here: https://investmentproject-jarus.backliftapp.com/pages/Portfolio_2.html

Also now incorporating the Stocktwits api to feed the latest thoughts on stocks of interest (not quite working yet): https://investmentproject-jarus.backliftapp.com/pages/StockTwits_6.html

Finally, click in the Investor Education link for websites and books that will make any individual invest and trade more wisely.




After Week 1:
--------------
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
