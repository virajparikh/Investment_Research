$(document).ready(function() {

	var processStock = function(stock){

		stock.id = stock.symbol;
		stock.ForwardPE = parseFloat(stock.Open,10) / parseFloat(stock.EPSEstimateNextYear,10);

	};

    var processStocksFromFile = function(){
		$.ajax({
			url: '/stocks.json',
			type: "GET",
			dataType: "json",
			success: function(stksjsn) {
		     //alert("straight filesystem / webserver call " + JSON.stringify(data, null, 2));
			 var numStocks = stksjsn.query.results.quote.length;
			 var showStocksWhenDone = _.after(numStocks, showStocksInDatabase);
		     for( var i = 0; i < numStocks; i++){
		     	
		     	var stock = stksjsn.query.results.quote[i];
				
				processStock(stock);

		 	    $.ajax({
			        url: '/backliftapp/stocks',
			        type: "POST",
			        dataType: "json",
			        data: stock,
			        success: function (data) {
			        	showStocksWhenDone();
			        }
			    }); // End .ajax()

		 	 }

			} // End success
		}); // End .ajax()
	};

   
    var showStocksInDatabase = function(){
		// Get teams from database
		$.ajax({
			url: '/backliftapp/stocks',
			type: "GET",
			dataType: "json",
			success: function(data) {
			    var res = JSON.stringify(data,null,2);

		     	$("#json-content").html("<div> Number of Stocks: " + data.length + "</div><pre>" + res + "</pre>")

			} // End success
		}); // End .ajax()
	};


    var deleteStocksInDatabase = function(){
		// Get teams from database
		$.ajax({
			url: '/backliftapp/stocks',
			type: "GET",
			dataType: "json",
			success: function(data) {
				var showStocksWhenDone = _.after(data.length, showStocksInDatabase);
						 	
		     	for (var i = 0; i < data.length; i++){
	  				var o = data[i];
	  				
					$.ajax({
					  url: "/backliftapp/stocks/" + o.id,
					  type: "DELETE",
					  dataType: "json",
					  success: function(){
					  	showStocksWhenDone();
					  }
					}); // End .ajax()

				}
			} // End success
		}); // End .ajax()
	};

	$("#show").click(showStocksInDatabase);
	$("#process").click(processStocksFromFile);
	$("#delete").click(deleteStocksInDatabase);



//   $.ajax({
//     url: '/backliftapp/team/' + team.id,
//     type: "PUT",
//     dataType: "json",
//     data: team,
//     success: function (data) {          
//       getNewTeamRecord(data);
//     } // End success
//   }); // End .ajax()
// };


   

}); // END DOC .READY() ========================================================= -->

