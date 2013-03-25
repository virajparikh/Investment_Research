$(document).ready(function() {

	var createPortfolioFromInput = function (name, strStocks) { 
	    var portfolio = {
	        name: name,
	        stocks: []
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
		// replace the old stock table with the new stock table		
		$("#stockTable").empty();
		$("#portfolioNameInHeader").empty();
		$('#portfolioNameInHeader').html("Portfolio Analysis: " + portfolio.name);	
		
		var yqlurl = createYQLURL(portfolio);

		$.ajax({
			url: yqlurl,
			type: "GET",	
			dataType: "json",
			success: function(stocksjson) {
				if ( stocksjson.query.results.quote === "null") {
						for (var i = 0; i < stocksjson.query.count; i++) {  //how did you come up with 'stocksjson.query.count'?
							var stock = stocksjson.query.results.quote[i]; //digs into the layers of the json file and returns only the relevant stock data
							processStock(stock);
							addStocksToTable(stock);			
						}
				} else {
					alert("Unfortunately Yahoo's YQL is not dependable and is currently broken. Please try again later.");
				}
			} // End success
		}); // End .ajax()
	};

	//load portfolios created on document.ready
	var getPortfolios = function(){
		$.ajax({
			url: '/backliftapp/portfolio',
			type: "GET",			
			dataType: "json",
			success: function(portfolios) {   			 
	   			for (var i = 0; i < portfolios.length; i ++) {	   
	   				addPortfolioToTable(portfolios[i]);
	   			}
	   		}
	   	});
	}
	getPortfolios();

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
	
	var fixPortfolio = function(portfolio){
		portfolio.stocks = portfolio["stocks[]"];
	};

	var getAndShowPortfolio = function(name){
		$.ajax({
			url: '/backliftapp/portfolio/' + name,  
			type: "GET",
			dataType: "json",
			success: function(portfolio) {
				fixPortfolio(portfolio);
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
				fixPortfolio(portfolio);
	   			$("#updatePortfolioName").html(portfolio.name);
	   			$("#updateTickerInput").val(portfolio.stocks.join(' '));
	   		}
	   	});
	};

	var	updatePortfolio = function(portfolio){		
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
				$('#' + name).remove();  
			} // End success
		}); // End .ajax()
	};

	var deleteStock = function(stock) {
		$.ajax({
			url: '/backliftapp/portfolio/' + name,
			type: "DELETE",
			dataType: "json",
			success: function(data) {
				fixPortfolio(portfolio);
				alert('deleted stock: ' + stock);
				$('#' + stock).remove(); 
			} // End success
		}); // End .ajax()
	};

	//creates Portfolio Analysis table
	var addStocksToTable = function (stock) {
      $('#stockTable').append(      	
		      	"<tr class='stockRow' id='" + stock.id + "'>" +
		        "<td class='ticker'>" + stock.id + "</td>" +
		        "<td class='name'>" + stock.Name + "</td>" +
		        "<td align='right' class='right mktcap'>" + stock.MarketCapitalization + "</td>" +
		        "<td align='center' class='fwdPE'>" + stock.ForwardPE.toFixed(2) + "x</td>" +
		        "<td align='center' class='priceToBook'>" + stock.PriceToBook.toFixed(2) + "x</td>" +
		        "<td class='stMomentum'>" + stock.stMomentum + "</td>" +
		        "<td class='ltMomentum'>" + stock.ltMomentum + "</td>" +
		        "<td class='deleteStockIcon'>" + "<i class='icon-remove'></i>" + "</td>" + "</tr>"  
		    );
        };  

    //creates Portflio List    
    var addPortfolioToTable = function(portfolio) {
      $('#portfolioList').append(      	
	      	'<tr class="portfolioRow" id="' + portfolio.id + '">' + '<td class="portfolioName">' + '<h5>' + portfolio.name + '</h5>' + '</td>' + '<td>' + '<div class="pull-right">' +
              '<button role="button" class="viewPortfolioBtn btn btn-info" >View Portfolio</button>' + '  ' +
              '<a href="#editPortfolioModal" role="button" data-toggle="modal" class="editPortfolioBtn btn btn-warning">Edit Portfolio</a>' + '  ' +
              '<button role="button" class="deletePortfolioBtn btn btn-danger" >Delete Portfolio</button></div>' + "</tr>"
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
	
	//Create Portfolio button
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

	//View Portfolio button
	$("body").on("click", ".viewPortfolioBtn", function() {
		var pn = $(this).closest("tr").attr('id')
		getAndShowPortfolio(pn);
	})

	//Edit Portfolio button
	$("body").on("click", ".editPortfolioBtn", function() {
		var pn = $(this).closest("tr").attr('id')
		getPortfolioForEdit(pn);
	})
	  //in Edit Portfolio modal, Update Portfolio button
	$("#submitUpdatePortfolioBtn").click(function(){
		
		getPortfolioForEdit(portfolio);

		var portfolio = createPortfolioFromInput($("#updatePortfolioName").html(), $("#updateTickerInput").val());  //

		updatePortfolio(portfolio);
		clearForm();
	});

	//Delete Portfolio button
	$("body").on("click", ".deletePortfolioBtn", function() {
		var pn = $(this).closest("tr").attr('id')
		deletePortfolio(pn);
	})

	//Delete individual stocks from the table and the displayed portfolio
	$("body").on("click", ".deleteStockIcon", function(stock) {
		var st = $(this).closest("tr").attr('id')
		deleteStock(stock);
	})


	// $("#deleteStockBtn").click(function(){

	// 	var stock = $('#tickerSymbol').val();  //how do we associate this id with a unique stock ticker?

	// 	deleteStock(stock);
	// });

}); // END DOC .READY() ========================================================= -->

