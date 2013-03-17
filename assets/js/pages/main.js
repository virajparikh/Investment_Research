// PORTFOLIO SCRIPT ========================================================= -->
      
  $(document).ready(function() {
    
    // Get tickers from database
    $.ajax({
      url: 'backliftapp/stocks',
      type: "GET",
      dataType: "json",
      success: function (data) {
        portfolio = data;
        for (var i = 0; i < data.length; i++) {
          addstocksToTable(data[i]);
        };
      } // End success
    }); // End .ajax()

  }); // END DOC .READY() ========================================================= -->

    // Add tickers to portolio
    function addTeam() {
      var stockData = {
        name: $("#teamName").val(),
        mgrFirst: $("#firstName").val(),
        mgrLast: $("#lastName").val(),
        mgrPhone: $("#phoneNum").val(),
        mgrZip: $("#zipCode").val(),
        sponsor: $("#sponsor").val(),
        wins: 0,
        losses: 0
      };

      $.ajax({
        url: '/backliftapp/team',
        type: "POST",
        dataType: "json",
        data: team,
        success: function (data) {
          //console.dir(data);
          addTeamToTable(data);
          //populateTeamList(data); 
          clearForm();
          showAlerts();
          }
        });
      }; // end add team