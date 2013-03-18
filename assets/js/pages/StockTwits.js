
      $("#go").on("click", function(){
        $("#stocktwits-widget-news").html("");
        STWT.Widget({
            container: 'stocktwits-widget-news',
            symbol: $("#ticker").val(),
            width: '300',
            height: '300',
            limit: '15',
            scrollbars: 'true',
            streaming: 'true',
            title: $("#ticker").val() + ' Ideas',
            style: {
              link_color: '4871a8',
              link_hover_color: '4871a8',
              header_text_color: '000000',
              border_color: 'cecece',
              divider_color: 'cecece',
              divider_color: 'cecece',
              divider_type: 'solid',
              box_color: 'f5f5f5',
              stream_color: 'ffffff',
              text_color: '000000',
              time_color: '999999'
              }
          });
      });
  