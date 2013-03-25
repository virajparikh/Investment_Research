Investment_Research
===================

Week 3.0 - 2 days before final project is due
---------------------------------------------

Main app URL: https://investmentproject-jarus.backliftapp.com/pages/Portfolio_2.html

Main files to evaluate:
pages/Portfolio_2.html, 
assets/js/pages/portfolio.js, 
assets/js/domain/stock.js

The Good News:

- The Javascript files are broken up to reflect "state" (assets/js/domain/stock.js) versus "behavior" (assets/js/pages/portfolio.js).  I only have a rough understanding of this concept, as this is my first project implementing it (known in software circles as Domain Driven Design, or DDD), but my mentor Alan Huffman was very helpful in helping me architect this project using this concept.
- Data is now persistent, i.e. stock portfolios created in prior sessions now loads on (document).ready.  
- All buttons are now operational: Create Portfolio, View Portfolio, Edit Portfolio & Delete Portfolio.
- Many other smaller issues outlined in this Google Doc are now resolved: https://docs.google.com/spreadsheet/ccc?key=0Ah7D2allnPgFdHFFVDJDcjVSZ0QxelY0ZEJMM0VIMFE&usp=sharing
- Stocktwits is working here.  See app here: https://investmentproject-jarus.backliftapp.com/pages/StockTwits_3.html
- Plenty of investor education website and book links here: https://investmentproject-jarus.backliftapp.com/pages/Investor_Education_4.html

The Bad News: 

- The app was fully functional, and now it is not.  I have gone back several times to the point where it worked, and it does not work properly even at that prior point.  The problem is that the stock tickers are now being parsed letter-by-letter, so the tickers when viewed are not accurate.  This is highly unusual, and after spending the last day addressing this issue, I am not confident this will be resolved.
- Yahoo's YQL database, which is where all of the raw stock data is retrieved from, is not reliable.  It fails to retrieve data about 50% of the time.  Obviously this is unsatisfactory, but no other free data sources have been found.  Moreover, at this point, my program is too reliant on YQL to change at this point.
- Backlift does not support application/json for ajax POST, which is creating stringify issues.
- Table sorter is not working properly


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
