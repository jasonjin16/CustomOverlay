
      var map;
      var regionId=-1;
      var regionList=[], multiRegionList=[];
      var regions=['Acacia Avenues', 'Al Baraha', 'Arabian Ranches', 'Burj Khalifa', 'Business Bay', 'DIFC', 'Dubai Marina', 'Green Community', 'Greens', 'Jumeirah Beach Residence', 'Jumeirah Golf Estates', 'Jumeirah Heights', 'Jumeirah Islands', 'Jumeirah Lake Towers', 'Jumeirah Park', 'Jumeirah', 'Meadows',  'Old Town', 'The Lakes', 'The Springs', 'The Views', 'Jumeirah village circle', 'Jumeirah village triangle', 'Dubai sport city', 'Motor city', 'Barsha Heights', 'Jable Ali Race Course', 'Al Barsha South', 'Academic City', 'Al Barari', 'Al Quoz', 'Al Safa', 'Al Wasl', 'Bur Dubai', 'Dubai Silicon Oasis', 'International City', 'Mudon', 'Nad Al Sheba-1', 'Nad Al Sheba-2', 'Remraam', 'UMM SUQEIM', 'Palm Jumeirah'];

      var stylez = [
         {
            featureType: "all",
            elementType: "all",
            stylers: [
              { saturation: -100 } // <-- THIS
            ]
         }
      ];
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 11,          
        center: {lat:25.122223, lng: 55.251757},
        mapTypeId:'roadmap',
        scrollwheel: true,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false          
      });   
      var mapType = new google.maps.StyledMapType(stylez, { name:"Grayscale" });    
      map.mapTypes.set('GrapMap', mapType);
      map.setMapTypeId('GrapMap');       
      loadingRegionOverlay();   

      for(i=0; i<regions.length; ++i){
        $('#region-list-ul').append("<li>"+regions[i]+"</li>");   
      }
      $("#region-list-ul").toggle();
      $("#region-list-div").click(function(){
        $("#region-list-ul").toggle();
      });     

      function loadingRegionOverlay(){
        for(rr=0; rr<regions.length-1; ++rr){ 
          var layRegion=createOverlay(regionArray[regions[rr].toLowerCase()], rr);
          regionList.push(layRegion);
          layRegion.setMap(map);                  
          google.maps.event.addListener(layRegion, 'click', function (event) { 
              getRegionId(this);
              $('#region-list-select').val(regionId);
              window.open("#");
          });
          google.maps.event.addListener(layRegion, 'mousemove', function (event) {
              //alert the index of the polygon
              getRegionId(this);
              $('#tooltip-div').css("width",regions[regionId].length*8+"px");
              $('#tooltip-div').css("left", event.ua.x-regions[regionId].length*4);
              $('#tooltip-div').css("top", event.ua.y+24);
              $('#tooltip-div').html(regions[regionId]);
              $('#tooltip-div').css("display","block");
          });
          // overlay mouse over event
           google.maps.event.addListener(layRegion, 'mouseover', function (event) {      
              getRegionId(this);
              setSelectedRegionHighlight(0);
          }); 
          // overlay mouse out event
          google.maps.event.addListener(layRegion, 'mouseout', function (event) {                   
              $('#tooltip-div').css("display","none");               
              clearCurrentRegionHighlight();           
          });
        } 

        // Palm Jumeirah
        for(pp=0; pp<palmArray.length; ++pp){          
          var layRegion=createOverlay(palmArray[pp], 2);
          multiRegionList.push(layRegion);
          layRegion.setMap(map);    
          // overlay click event              
          google.maps.event.addListener(layRegion, 'click', function (event) {              
              $('#region-list-select').val(regions.length-1);
              window.open("#");
          });   
          google.maps.event.addListener(layRegion, 'mouseover', function (event) {  
              getRegionId(this);            
              setSelectedRegionHighlight(1);
          }); 
          google.maps.event.addListener(layRegion, 'mousemove', function (event) {              
              $('#tooltip-div').css("left", event.ua.x-50);
              $('#tooltip-div').css("top", event.ua.y+24);
              $('#tooltip-div').html("Palm Jumeirah");
              $('#tooltip-div').css("width", "90px");
              $('#tooltip-div').css("display","block");
          }); 
          // overlay mouse out event
          google.maps.event.addListener(layRegion, 'mouseout', function (event) {                   
              $('#tooltip-div').css("display","none");  
              clearCurrentRegionHighlight();             
          });                
        }

      }

      function getRegionId(currentRegion){
        var curPath=currentRegion.getPath();
        for(i=0; i<regionList.length; ++i){
          var tempPath=regionList[i].getPath();
          if(curPath.length==tempPath.length){
            var ct=0;
            for(j=0; j<tempPath.length; ++j){              
              if(curPath.getAt(j).lat()==tempPath.getAt(j).lat() && curPath.getAt(j).lng()==tempPath.getAt(j).lng()) ++ct;
            }
            if(tempPath.length==ct) regionId=i;
          }
        }
      }

      function setSelectedRegionHighlight(flag){
        if(flag==0){
          // single region
          for(i=0; i<regionList.length; ++i){
            if(i!=regionId){ // other region
              regionList[i].setOptions({fillOpacity:0.2});
            }else{ // current region
              regionList[i].setOptions({fillOpacity:0.6});        
            }
          }
          // multi region
          for(pp=0; pp<multiRegionList.length; ++pp)            
            multiRegionList[pp].setOptions({fillOpacity:0.2});

        }else if(flag==1){
          // single region
          for(i=0; i<regionList.length; ++i)            
              regionList[i].setOptions({fillOpacity:0.2});          
          // multi region
          for(pp=0; pp<multiRegionList.length; ++pp)            
            multiRegionList[pp].setOptions({fillOpacity:0.6});
        }        
      }

      function clearCurrentRegionHighlight(){
         for(i=0; i<regionList.length; ++i)
            regionList[i].setOptions({fillOpacity:0.2});
         for(pp=0; pp<multiRegionList.length; ++pp)            
            multiRegionList[pp].setOptions({fillOpacity:0.2});  
          
      }

      function selectCurrentRegionInDubai(){
        var regionNum=$("#region-list-select").val();         
        if(regionNum==regions.length-1){
          map.panTo(multiRegionList[0].getPath().getAt(0));         
          map.setZoom(14);
          for(pp=0; pp<multiRegionList.length; ++pp){
            getRegionId(multiRegionList[pp]);            
            setSelectedRegionHighlight(1);
          }
        }else if(regionNum<regions.length-1){
          map.panTo(regionList[regionNum].getPath().getAt(0));         
          map.setZoom(14);
          getRegionId(regionList[regionNum]);            
          setSelectedRegionHighlight(0);
        }  
        
      }

      function createOverlay(regionCoord, num){        
        var colors=["#FF0000", "#00FF00", "#0000FF", "#00AAAA", "#AA00AA"];
        var overlayCoord=new Array();
        var processData=regionCoord.split(",0 ");
        for(i=0;i<processData.length-1;++i){
          var xyCoord=processData[i].split(",");
          overlayCoord.push(new google.maps.LatLng(xyCoord[1],xyCoord[0]));            
        }                 
        var regionOverlay=new google.maps.Polygon({
          paths:overlayCoord,
          strokeColor:"#ffffff",
          strokeOpacity:0.6,
          strokeWeight:2,
          fillColor:"#333333",
          fillOpacity:0.2
        });
        return regionOverlay;        
	  } 