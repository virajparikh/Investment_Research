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
				for (var i = 0; i < stocksjson.query.count; i++) {
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
			url: '/backliftapp/portfolio',
			type: "POST",
			data: portfolio,
			dataType: "json",
			success: function() {
	   			showPortfolio(portfolio);
	   		}
	   	});
	};

	var getAndShowPortfolio = function(portfolio){
		$.ajax({
			url: '/backliftapp/portfolio/' + portfolio.name,
			type: "GET",
			dataType: "json",
			success: function(portfolio) {
	   			showPortfolio(portfolio);
	   		}
	   	});
	};

	var getPortfolioForEdit = function(portfolio){
	$.ajax({
			url: '/backliftapp/portfolio/' + portfolio.name,
			type: "GET",
			dataType: "json",
			success: function(portfolio) {
	   			$("#updatePortfolioName").html(portfolio.name);
	   			$("#updateTickerInput").val(portfolio.stocks.join(' '));
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

	var deletePortfolio = function(portfolio) {
		$.ajax({
			url: '/backliftapp/portfolio/' + id,
			type: "DELETE",
			dataType: "json",
			success: function(data) {
				alert('deleted portfolio: ' + portfolio.name);
				$('#' + id).remove();
			} // End success
		}); // End .ajax()
	};

	// function deleteTeam(id) {
 //      $('#cutTeam').click(function() {
 //        $.ajax({
 //          url: "backliftapp/team/" + id,
 //          type: "DELETE",
 //          dataType: "json",
 //          success: function () {
 //            $('#' + id).remove();
 //          }
 //        }); // End .ajax()
 //      }); // End .click()
 //    }; // End deleteTeam()

	var deleteStock = function(name) {
		// Get teams from database
		$.ajax({
			url: '/backliftapp/portfolio/' + stock.id,
			type: "DELETE",
			dataType: "json",
			success: function(data) {
				alert('deleted stock: ' + stock.Name);
			} // End success
		}); // End .ajax()
	};

	var addStocksToTable = function(stock) {
      $('#stockTable').append(      	
		      	"<tr class='ticker' id='" + stock.id + "'>" +
		        "<td id='ticker'>" + stock.id + "</td>" +
		        "<td id='name'>" + stock.Name + "</td>" +
		        "<td id='mktcap'>" + stock.MarketCapitalization + "</td>" +
		        "<td id='fwdPE'>" + stock.ForwardPE + "</td>" +
		        "<td id='priceToBook'>" + stock.PriceToBook + "</td>" +
		        "<td id='stMomentum'>" + stock.stMomentum + "</td>" +
		        "<td id='ltMomentum'>" + stock.ltMomentum + "</td>" +
		        "<td id='deleteStockIcon'>" + "<a href='#deleteStockModal' data-toggle='modal' onclick='deleteStock(\"" + stock.id + "\")'><i class='icon-remove'></i> </a>" + "</td>" + "</tr>"  
		    );
        };  

    var addPortfolioToTable = function(portfolio) {
      $('#portfolioList').append(      	
	      	'<tr id="' + portfolio.id + '">' + '<td>' + '<a href="*">' + portfolio.name + '</a>' + '</td>' + '<td>' + '<ul class="pull-right">' +
              '<a id="getPortfolioBtn" role="button" class="btn btn-info">View Portfolio</a>' + ' ' +
              '<a id="editPortfolioModalBtn" href="#editPortfolioModal" role="button" class="btn btn-warning" data-toggle="modal">Edit Portfolio</a>' + ' ' +
              '<a id="deletePortfolioModalBtn" href="#deletePortfolioModal" role="button" class="btn btn-danger" data-toggle="modal">Delete Portfolio</a>' + "</ul>" + "</tr>"
		        );
  	};
		        


	// BUTTON CLICKS 
	
	$("#createPortfolioBtn").click(function(){
		//var portfolio = { 
		//		name: "viraj", 
		//		stocks: ['YHOO', 'EBAY', 'GS', 'MSFT', 'AAPL'] 
		//};
		// END
		var portfolio = createPortfolioFromInput($("#createPortfolioName").val(), $("#addTickerInput").val());
		createPortfolio(portfolio);
		addPortfolioToTable(portfolio);  //viraj: added this function
	});

	$("#getPortfolioBtn").click(function(){  // is this a click, or does this load on document ready?
		//var name = "viraj";
		//end
		var name = $("#" + portfolio.id).val();
		getAndShowPortfolio(name);
	});

	$("#editPortfolioBtn").click(function(){
		//var portfolio = { 
		//		name: "viraj", 
		//		stocks: ['GOOG', 'EBAY', 'GS', 'MSFT', 'AAPL'] 
		//};
		// END
		getPortfolioForEdit(portfolio);
		var portfolio = createPortfolioFromInput($("#updatePortfolioName").val(), $("#updateTickerInput").val());
		editPortfolio(portfolio);
	});


	$("#deletePortfolioBtn").click(function(portfolio){
		//var name = "viraj"
		// END
		// var name = $("#portfolioNameToBeDeleted").val();
		deletePortfolio(portfolio.id);
	});

	$("deleteStockIcon").click(function(){
		//var name = "viraj"
		// END
		// var name = $("#portfolioNameToBeDeleted").val();
		deleteStock(id);
	});

}); // END DOC .READY() ========================================================= -->

