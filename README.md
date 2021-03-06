Investment_Research
===================

Project Submission - Last Day of NSS Part 1
---------------------------------------------

Main app URL: https://investmentproject-jarus.backliftapp.com/pages/Portfolio_2.html
JSON file: https://investmentproject-jarus.backliftapp.com/backliftapp/portfolios

Main code files to evaluate:
pages/Portfolio_2.html, 
assets/js/pages/portfolio.js, 
assets/js/domain/stock.js

- Unique IDs are now maintained for each portfolio, even if Edit Portfolio is completed
- All buttons - Create Portfolio, View Portfolio, Edit Portfolio & Delete Portfolio - works properly
- Stocktwits, S&P 500 Heat Map, Investor Education are all there to enhance the novice investor's UX
- The project is in good shape EXCEPT that Yahoo's YQL database is unreliable when retrieving data.  The data source will be changed in a future version.
- Major Backlift issues, particularly around json nested arrays, have been resolved.


Week 3.0 - 1 day before final project is due
---------------------------------------------

- Data is now persistent, i.e. stock portfolios created in prior sessions now loads on (document).ready.    
- All buttons - Create Portfolio, View Portfolio, Edit Portfolio & Delete Portfolio - are now operational.  However, issues remain with Backlift and YQL, some of which we have designed workarounds, but others which remain outstanding (see below).
- Many smaller issues outlined in this Google Doc are now resolved: https://docs.google.com/spreadsheet/ccc?key=0Ah7D2allnPgFdHFFVDJDcjVSZ0QxelY0ZEJMM0VIMFE&usp=sharing
- Stocktwits is working; see functionality here: https://investmentproject-jarus.backliftapp.com/pages/StockTwits_3.html
- Plenty of investor education website and book links here: https://investmentproject-jarus.backliftapp.com/pages/Investor_Education_4.html
- Javascript files are broken up to reflect "state" (assets/js/domain/stock.js) versus "behavior" (assets/js/pages/portfolio.js).  I have only a rough understanding of this concept (I believe also known in software circles as Domain Driven Design, or DDD), but my mentor Alan Huffman was very helpful in introducing me to the concept and helping me architect this project per DDD.

Caution: 

- After numerous back-and-forth e-mails with Backlift support, we were successfully able to properly stringify the array that houses all the portfolio stock tickers.  Tickers no longer seem to be parsed incorrectly (letter-by-letter) as was the problem before.  A workaround fix still exists in the code (var fixPortfolio), but this code looks to be unnecessary now. Nevertheless, we will leave it in the code base for now.
- Yahoo's YQL database, which is where all of the raw stock data is retrieved from, is not reliable.  It fails to retrieve data about 50% of the time.  Obviously this is unsatisfactory, but no other free data sources have been found.  At this point, the app is too reliant on YQL to change at this point, but future versions will attempt to find a new data source, such as Reuters.
- Table sorter is not working properly


After Week 2.5:
----------------
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
