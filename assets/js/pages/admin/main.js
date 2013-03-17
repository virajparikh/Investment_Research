$(document).ready(function() {

	var processStock = function(stock) {

		stock.id = stock.symbol;

		stock.ForwardPE = parseFloat(stock.LastTradePriceOnly, 10) / parseFloat(stock.EPSEstimateNextYear, 10);

		stock.PriceToBook = parseFloat(stock.LastTradePriceOnly, 10) / parseFloat(stock.BookValue, 10);

		stock.stMomentum = function(stock) {
			if (stock.LastTradePriceOnly > stock.FiftydayMovingAverage && stock.FiftydayMovingAverage > stock.TwoHundreddayMovingAverage) {
				stock.stMomentum = "Positive ST Momentum"
			} else if ((stock.LastTradePriceOnly < stock.FiftydayMovingAverage && stock.FiftydayMovingAverage > stock.TwoHundreddayMovingAverage) || 
				(stock.LastTradePriceOnly > stock.FiftydayMovingAverage && stock.FiftydayMovingAverage < stock.TwoHundreddayMovingAverage)) {
				stock.stMomentum = "Neutral ST Momentum"
			} else if (stock.LastTradePriceOnly < stock.FiftydayMovingAverage && stock.FiftydayMovingAverage < stock.TwoHundreddayMovingAverage) {
				stock.stMomentum = "Negative ST Momentum"
			};
		};
	
		stock.ltMomentum = function() {
			if (stock.FiftydayMovingAverage > stock.TwoHundreddayMovingAverage) {
				stock.ltMomentum = "Positive LT Momentum"
			} else {
				stock.ltMomentum = "Negative LT Momentum"
			}
		} //end Momentum function
	};

	var processStocksFromFile = function() {   //onclick of Process
		$.ajax({
			url: '/stocks.json',
			type: "GET",	
			dataType: "json",
			success: function(stocksjson) {
				//alert("straight filesystem / webserver call " + JSON.stringify(data, null, 2));
				var numStocks = stocksjson.query.results.quote.length;
				var showStocksWhenDone = _.after(numStocks, showStocksInDatabase); //after ALL of the stocks in the json file are loaded, run the showStocksInDatabase function
				for (var i = 0; i < numStocks; i++) {

					var stock = stocksjson.query.results.quote[i]; //digs into the layers of the json file and returns only the relevant stock data

					processStock(stock);
					addStocksToTable(stock);

					$.ajax({
						url: '/backliftapp/stocks',
						type: "POST",
						dataType: "json",

						data: stock,
						success: function(data) {
							showStocksWhenDone();
						}
					}); // End .ajax()

				}

			} // End success
		}); // End .ajax()
	};

	var showStocksInDatabase = function() {
		// Get YQL stock data from database
		$.ajax({
			url: '/backliftapp/stocks',
			type: "GET",
			dataType: "json",
			success: function(data) {
				var res = JSON.stringify(data, null, 2);  //why res?

				$("#json-content").html("<div> Number of Stocks: " + data.length + "</div><pre>" + res + "</pre>")

			} // End success
		}); // End .ajax()
	};

	var deleteStocksInDatabase = function() {
		// Get teams from database
		$.ajax({
			url: '/backliftapp/stocks',
			type: "GET",
			dataType: "json",
			success: function(data) {
				var showStocksWhenDone = _.after(data.length, showStocksInDatabase);

				for (var i = 0; i < data.length; i++) {
					var o = data[i];

					$.ajax({
						url: "/backliftapp/stocks/" + o.id,
						type: "DELETE",
						dataType: "json",
						success: function() {
							showStocksWhenDone();
						}
					}); // End .ajax()

				}
			} // End success
		}); // End .ajax()
	};

	function addStocksToTable(stock) {

      $("<tr class='ticker' id='" + stock.id + "'>" +
        
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
          "<li>" + "<a href='#deleteConfirm' data-toggle='modal' onclick='deleteTeam(\"" + stock.id + "\")'><i class='icon-remove'></i> Delete</a>" + "</li>" + 
        "</ul>" + "</div>" + "</td>" +
        "</tr>").appendTo('#stockTable tbody');
        }  

	$("#show").click(showStocksInDatabase);
	$("#process").click(processStocksFromFile);
	$("#delete, #deletePortfolioBtn").click(deleteStocksInDatabase);
	
	$("#updatePortfolioBtn").click(addStocksToTable);
	


}); // END DOC .READY() ========================================================= -->