$(document).ready(function() {

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

	var createYQLURL = function(portfolio){
	    var baseYQLURL = 'https://query.yahooapis.com/v1/public/yql?env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json&q=';

		var yqlQuery = 'select * from yahoo.finance.quotes where symbol in (';
		    for( var i = 0; i < portfolio.stocks.length; i++){
		        yqlQuery += '"' + portfolio.stocks[i] + '"';
		        yqlQuery += i === (portfolio.stocks.length - 1) ? "" : ",";		        
		    }
		    yqlQuery += ')';

	    var yqlURL = baseYQLURL + encodeURI(yqlQuery);
	    return yqlURL;
	};

	var processStock = function(stock) {
		var sdo = new StockDomainObject(stock);
		stock.id = stock.symbol;
		stock.ForwardPE = sdo.calcForwardPE();
		stock.PriceToBook = sdo.calcPriceToBook();
		stock.stMomentum = sdo.calcSTMomentum();
		stock.ltMomentum = sdo.calcLTMomentum();
	};

	var showPortfolio = function(portfolio) { 

		var yqlurl = createYQLURL(portfolio);

		$.ajax({
			url: yqlurl,
			type: "GET",	
			dataType: "json",
			success: function(stocksjson) {
				for (var i = 0; i < stocksjson.query.count; i++) {  //how did you come up with 'stocksjson.query.count'?
					var stock = stocksjson.query.results.quote[i]; //digs into the layers of the json file and returns only the relevant stock data
					processStock(stock);
					addStocksToTable(stock);			
				}
			} // End success
		}); // End .ajax()
	};

	var createPortfolio = function(portfolio){

		portfolio.id = portfolio.name;  //need help understanding this line better; what would happen if it were absent; do I need it on other functions?
		
		$.ajax({
			url: '/backliftapp/portfolio',
			type: "POST",
			data: portfolio,
			dataType: "json",
			success: function() {    //why not 'portfolio' as an argument?
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

	var deletePortfolio = function(name) {
		$.ajax({
			url: '/backliftapp/portfolio/' + name,
			type: "DELETE",
			dataType: "json",
			success: function(data) {   //why data here?
				alert('deleted portfolio: ' + name);  
				$('#' + id).remove();  //does this make sense?
			} // End success
		}); // End .ajax()
	};

	var deleteStock = function(stock) {
		$.ajax({
			url: '/backliftapp/portfolio/' + stock,
			type: "DELETE",
			dataType: "json",
			success: function(data) {
				alert('deleted stock: ' + stock);
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
	      	'<tr id="' + portfolio.id + '">' + '<td id="portfolioName">' + portfolio.name + '</td>' + '<td>' + '<ul class="pull-right">' +
              '<a id="getPortfolioBtn" role="button" class="btn btn-info">View Portfolio</a>' + ' ' +
              '<a id="editPortfolioModalBtn" href="#editPortfolioModal" role="button" class="btn btn-warning" data-toggle="modal">Edit Portfolio</a>' + ' ' +
              '<a id="deletePortfolioModalBtn" href="#deletePortfolioModal" role="button" class="btn btn-danger" data-toggle="modal">Delete Portfolio</a>' + "</ul>" + "</tr>"
		        );
  	};

  	//clear fields in form
  	var clearForm = function() {
      $(".clearInputs").each(function () {
        $(this).val("");
      });
    };

    //form validation
    $("#createPortfolioForm").validate();   //not working properly	

    //tablesorter
    $("#portfolioAnalysisTable").tablesorter();  //semi-working; highest portfolio set not sorting properly


	// BUTTON CLICKS ============================================== >
	
	$("#createPortfolioBtn").click(function(){
		
		var portfolio = createPortfolioFromInput($("#createPortfolioName").val(), $("#addTickerInput").val());
		//var portfolio = { 
		//		name: "viraj", 
		//		stocks: ['YHOO', 'EBAY', 'GS', 'MSFT', 'AAPL'] 
		//};
		// END

		createPortfolio(portfolio);
		addPortfolioToTable(portfolio);  //viraj: added this function
		$(".tablesorter").tablesorter(); 
		clearForm();
	});

	$("#getPortfolioBtn").click(function(){  

		var name = $('#portfolioName').val();  //how do we associate this id with a unique portfolio name?

		getAndShowPortfolio(name);
	});

	$("#editPortfolioBtn").click(function(){
		
		getPortfolioForEdit(portfolio);

		var portfolio = createPortfolioFromInput($("#updatePortfolioName").val(), $("#updateTickerInput").val());  //how do we associate these ids with a unique portfolio name and a unique basket of stocks?
		//var portfolio = { 
		//		name: "viraj", 
		//		stocks: ['GOOG', 'EBAY', 'GS', 'MSFT', 'AAPL'] 
		//};
		// END

		editPortfolio(portfolio);
	});


	$("#deletePortfolioBtn").click(function(portfolio){

		var name = $('#portfolioName').val();  //how do we associate this id with a unique portfolio name?
		
		deletePortfolio(name);
	});

	$("#deleteStockBtn").click(function(){

		var stock = $('#tickerSymbol').val();  //how do we associate this id with a unique stock ticker?

		deleteStock(stock);
	});

}); // END DOC .READY() ========================================================= -->

