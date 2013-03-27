$(document).ready(function() {

	var createPortfolioFromInput = function (name, strStocks) { 
	    var portfolio = {
	        name: name,
	        stocks: []
	    };
	   
	    //replace all commas and semicolons with spaces (g = global)
	    var space = ' ';
	    var stocks = strStocks.replace(/,/g, space).replace(/;/g, space).split(' ');  
		    for (var i = 0; i < stocks.length; i++) {
		        if (stocks[i]) {
		            portfolio.stocks.push(stocks[i]);
		        }
		    }
	    return portfolio;
	};

	var createYQLURL = function(portfolio){
	    var baseYQLURL = 'https://query.yahooapis.com/v1/public/yql?env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json&q=';
	    //.stocks = portfolio.stock.split("', '");
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
		$('#portfolioNameInHeader').html("Portfolio Analysis: <em>" + portfolio.name + "</em>");	
		
		var yqlurl = createYQLURL(portfolio);

		$.ajax({
			url: yqlurl,
			type: "GET",	
			dataType: "json",
			success: function(stocksjson) {
				if ( stocksjson.query.results && stocksjson.query.results.quote ) {
						for (var i = 0; i < stocksjson.query.count; i++) {  
							var stock = stocksjson.query.results.quote[i]; //digs into the layers of the json file and returns only the relevant stock data
							processStock(stock);
							addStocksToTable(stock);	
							$("#portfolioAnalysisTable").tablesorter();	//not working properly	
						}
				} else {
					alert("Unfortunately Yahoo's YQL server is not dependable.  Please try again later.");
				}
			} // End success
		}); // End .ajax()
	};

	//load portfolios created on document.ready
	var getPortfolios = function(){
		$.ajax({
			url: '/backliftapp/portfolios',
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
		$.ajax({
			url: '/backliftapp/portfolios',
			type: "POST",
			data: JSON.stringify(portfolio),
			contentType:'application/json',
			success: function(portfolio) {    
	   			showPortfolio(portfolio);
	   			addPortfolioToTable(portfolio);  
	   		}
	   	});
	};
	
	//to fix Backlift stringify array issues
	var fixPortfolio = function(portfolio){
	    var stocks_w_brackets = portfolio["stocks[]"];
	    if( stocks_w_brackets ){
	        if ( typeof stocks_w_brackets === "string" ){
	            portfolio.stocks = JSON.parse(stocks_w_brackets);
	        } else{
	            portfolio.stocks = stocks_w_brackets;
	        }
	        delete portfolio["stocks[]"];
	    }
	    return portfolio;
	};

	var getAndShowPortfolio = function(id){
		$.ajax({
			url: '/backliftapp/portfolios/' + id,  
			type: "GET",
			dataType: "json",
			success: function(portfolio) {
				fixPortfolio(portfolio);
	   			showPortfolio(portfolio);
	   		}
	   	});
	};

	var getPortfolioForEdit = function(id){
		$.ajax({
			url: '/backliftapp/portfolios/' + id,   
			type: "GET",
			dataType: "json",
			success: function(portfolio) {
				fixPortfolio(portfolio);
				$("#updatePortfolioName").attr("data-portfolioId", id);
	   			$("#updatePortfolioName").html(portfolio.name);
	   			$("#updateTickerInput").val(portfolio.stocks.join(' '));
	   		}
	   	});
	};

	var	updatePortfolio = function(portfolio){	
		var id = $("#updatePortfolioName").attr("data-portfolioId");
		portfolio.id = id;	
		$.ajax({
			url: '/backliftapp/portfolios/' + portfolio.id,
			type: "PUT",
			data: JSON.stringify(portfolio),
			contentType:'application/json',
			success: function() {
				fixPortfolio(portfolio);
	   			showPortfolio(portfolio);
	   		}
	   	});
	};

	var deletePortfolio = function(id) {
		$.ajax({
			url: '/backliftapp/portfolios/' + id,
			type: "DELETE",
			dataType: "json",
			success: function() {   
				alert('deleted portfolio: ' + $("#" + id + " td h5").html());  
				$('#' + id).remove();  
			} // End success
		}); // End .ajax()
	};

	// var deleteStock = function(stock) {
	// 	$.ajax({
	// 		url: '/backliftapp/portfolios/' + name,
	// 		type: "DELETE",
	// 		dataType: "json",
	// 		success: function() {
	// 			fixPortfolio(portfolio);
	// 			alert('deleted stock: ' + stock);
	// 			$('#' + stock).remove(); 
	// 		} // End success
	// 	}); // End .ajax()
	//};

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
		        //"<td class='deleteStockIcon'>" + "<i class='icon-remove'></i>" + "</td>"
		        "</tr>"  
		    );
        };  

    //creates Portfolio List    
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
      $(".clearInputs").val("")
    };

    //form validation
    $("#createPortfolioForm").validate();   //not working properly	


	// BUTTON CLICKS ============================================== >
	
	//Create Portfolio button
	$("#createPortfolioBtn").click(function(){
		
		var portfolio = createPortfolioFromInput($("#createPortfolioName").val(), $("#addTickerInput").val());
		//var portfolio = { 
		//		name: "Tech", 
		//		stocks: ['YHOO', 'EBAY', 'GS', 'MSFT', 'AAPL'] 
		//};
		// END

		createPortfolio(portfolio);
		clearForm();
	});

	//View Portfolio button
	$("body").on("click", ".viewPortfolioBtn", function() {
		var p_id = $(this).closest("tr").attr('id')
		getAndShowPortfolio(p_id);
	})

	//Edit Portfolio button
	$("body").on("click", ".editPortfolioBtn", function() {
		var p_id = $(this).closest("tr").attr('id')
		getPortfolioForEdit(p_id);
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
		var p_id = $(this).closest("tr").attr('id')
		deletePortfolio(p_id);
	})

	//Delete individual stocks from the table and the displayed portfolio
	$("body").on("click", ".deleteStockIcon", function(stock) {
		var st = $(this).closest("tr").attr('id')
		deleteStock(stock);
	})

	//Cancel and 'x' button
	$(".cancelBtn").click(function(){
		clearForm();
	});

}); // END DOC .READY() ========================================================= -->

