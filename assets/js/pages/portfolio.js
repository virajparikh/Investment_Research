$(document).ready(function() {

	var processStock = function(stock) {
		var sdo = new StockDomainObject(stock);
		stock.id = stock.symbol;
		stock.ForwardPE = sdo.calcForwardPE();
		stock.PriceToBook = sdo.calcPriceToBook();
		stock.stMomentum = sdo.calcSTMomentum();
		stock.ltMomentum = sdo.calcLTMomentum();
	};

	var createYQLURL = function(portfolio){
	    var baseYQLURL = 'http://query.yahooapis.com/v1/public/yql?env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json&q=';

		var yqlQuery = 'select * from yahoo.finance.quotes where symbol in (';
		    for( var i = 0; i < portfolio.stocks.length; i++){
		        yqlQuery += '"' + portfolio.stocks[i] + '"';
		        yqlQuery += i === (portfolio.stocks.length - 1) ? "" : ",";
		    }
		    yqlQuery += ')';

	    var yqlURL = baseYQLURL + encodeURI(yqlQuery);
	    return yqlURL;
	};

	var createPortfolioFromInput = function (name, strStocks) {
	    var portfolio = {
	        name: name,
	        stocks: [ ]
	    };
	    var space = ' ';
	    var stocks = strStocks.replace(/,/g, space).replace(/;/g, space).split(' ');  //replace all commas and semicolons with spaces (g = global)
		    for (var i = 0; i < stocks.length; i++) {

		        if (stocks[i]) {
		            portfolio.stocks.push(stocks[i]);
		        }
		    }
		    return portfolio;
	};

	var showPortfolio = function(portfolio) {   
		var yqlurl = createYQLURL(portfolio);
		$.ajax({
			url: yqlurl,
			type: "GET",	
			dataType: "json",
			success: function(stocksjson) {
				for (var i = 0; i < numStocks; i++) {
					var stock = stocksjson.query.results.quote[i]; //digs into the layers of the json file and returns only the relevant stock data
					processStock(stock);
					addStocksToTable(stock);				
				}
			} // End success
		}); // End .ajax()
	};

	var createPortfolio = function(portfolio){
		portfolio.id = portfolio.name;
		$.ajax({
			url: '/backliftapp/portfolio/' + name,  //viraj: added '+ name'
			type: "POST",
			data: portfolio,
			dataType: "json",
			success: function() {
	   			showPortfolio(portfolio);
	   		}
	   	});
	};

	var getAndShowPortfolio = function(name){
		$.ajax({
			url: '/backliftapp/portfolio/' + name,
			type: "GET",
			dataType: "json",
			success: function(portfolio) {
	   			showPortfolio(portfolio);
	   		}
	   	});
	};

	var getPortfolioForEdit = function(name){
	$.ajax({
			url: '/backliftapp/portfolio/' + name,
			type: "GET",
			dataType: "json",
			success: function(portfolio) {
	   			$("#name").html(portfolio.name);
	   			$("#tickers").val(portfolio.stocks.join(' '));
	   		}
	   	});
	};

	var	editPortfolio = function(portfolio){
		$.ajax({
			url: '/backliftapp/portfolio/' + portfolio.name,
			type: "PUT",
			data: portfolio,
			dataType: "json",
			success: function() {
	   			showPortfolio(portfolio);
	   		}
	   	});
	};

	var deletePortfolio = function(name) {
		// Get teams from database
		$.ajax({
			url: '/backliftapp/portfolio/' + name,
			type: "DELETE",
			dataType: "json",
			success: function(data) {
				alert('deleted portfolio: ' + name);
			} // End success
		}); // End .ajax()
	};

	var addStocksToTable = function(stock) {
      $('.stockTable').append(
      		"<thead>
              <tr>
                <th>Ticker</th>
                <th>Company</th>
                <th>Mkt Cap</th>
                <th>Fwd P/Earnings</th>
                <th>P/Book Value</th>
                <th>ST Momentum</th>
                <th>LT Momentum</th>
              </tr>
            </thead> 
            <tbody>" +
		      	"<tr class='ticker' id='" + stock.id + "'>" +
		        "<td id='ticker'>" + stock.id + "</td>" +
		        "<td id='name'>" + stock.Name + "</td>" +
		        "<td id='mktcap'>" + stock.MarketCapitalization + "</td>" +
		        "<td id='fwdPE'>" + stock.ForwardPE + "</td>" +
		        "<td id='priceToBook'>" + stock.PriceToBook + "</td>" +
		        "<td id='stMomentum'>" + stock.stMomentum + "</td>" +
		        "<td id='ltMomentum'>" + stock.ltMomentum + "</td>" +
		        "<td>" + "<div class='btn-group'>" + "<a class='btn btn-small btn-inverse dropdown-toggle' data-toggle='dropdown' href='#'> Edit <span class='caret'></span></a>" + "<ul class='dropdown-menu'>" + 
		          "<li>" + "<a href='#editTeam' data-toggle='modal'><i class='icon-edit'></i> Edit</a>" + "</li>" +
		          "<li class='divider'>" + "</li>" +
		          "<li>" + "<a href='#deleteConfirm' data-toggle='modal' onclick='deleteTicker(\"" + stock.id + "\")'><i class='icon-remove'></i> Delete</a>" + "</li>" + 
		        "</ul>" + "</div>" + "</td>" +
		        "</tr> +
	        </tbody>");
        };  


	// BUTTON CLICKS 

	
	$("#createPortfolioBtn").click(function(){
		//var portfolio = { 
		//		name: "viraj", 
		//		stocks: ['YHOO', 'EBAY', 'GS', 'MSFT', 'AAPL'] 
		//};
		// END
		var portfolio = createPortfolioFromInput($("#portfolioName").val(), $("#tickerInput").val());
		createPortfolio(portfolio);
	});

	$("#getPortfolioBtn").click(function(){  // is this a click, or does this load on document ready?
		//var name = "viraj";
		//end
		var name = $("#portfolio").val();
		getAndShowPortfolio(name);
	});

	$("#editPortfolioBtn").click(function(){
		//var portfolio = { 
		//		name: "viraj", 
		//		stocks: ['GOOG', 'EBAY', 'GS', 'MSFT', 'AAPL'] 
		//};
		// END
		var portfolio = createPortfolioFromInput($("#portfolioName").val(), $("#tickerInput").val());
		editPortfolio(portfolio);
	});


	$("#deletePortfolioBtn").click(function(){
		//var name = "viraj"
		// END
		// var name = $("#portfolioNameToBeDeleted").val();
		deletePortfolio(name);
	});
	//$("#process").click(processStocksFromFile);
	
	//$("#editPortfolioBtn").click(addStocksToTable);
	


}); // END DOC .READY() ========================================================= -->



	// var showStocksInDatabase = function() {
	// 	// Get YQL stock data from database
	// 	$.ajax({
	// 		url: '/backliftapp/stocks',
	// 		type: "GET",
	// 		dataType: "json",
	// 		success: function(data) {
	// 			var res = JSON.stringify(data, null, 2);  //why res?

	// 			$("#json-content").html("<div> Number of Stocks: " + data.length + "</div><pre>" + res + "</pre>")

	// 		} // End success
	// 	}); // End .ajax()
	// };

	// var deleteStocksInDatabase = function() {
	// 	// Get teams from database
	// 	$.ajax({
	// 		url: '/backliftapp/stocks',
	// 		type: "GET",
	// 		dataType: "json",
	// 		success: function(data) {
	// 			var showStocksWhenDone = _.after(data.length, showStocksInDatabase);

	// 			for (var i = 0; i < data.length; i++) {
	// 				var o = data[i];

	// 				$.ajax({
	// 					url: "/backliftapp/stocks/" + o.id,
	// 					type: "DELETE",
	// 					dataType: "json",
	// 					success: function() {
	// 						showStocksWhenDone();
	// 					}
	// 				}); // End .ajax()

	// 			}
	// 		} // End success
	// 	}); // End .ajax()
	// };