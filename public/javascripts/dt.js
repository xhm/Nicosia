var map;
var markersArray = [];
var markerBounds = new google.maps.LatLngBounds();
var panoramioLayer;
var panoramioId;

function initialize() {
    var mapOptions = {
        zoom: 2,
        center: new google.maps.LatLng(-34.397, 147.644),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
		noClear: true,
        panControl: true,
        panControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        zoomControl: true,
        zoomControlOptions: {
            sytle: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.RIGHT_TOP
        },
		overviewMapControl: true
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

	var photoDiv = document.createElement("div");
	photoDiv.style.width = '640px';
	photoDiv.style.height = '500px';

	var photoWidgetOptions = {
		'width': parseFloat(photoDiv.style.width),
		'height': parseFloat(photoDiv.style.height)
	};
	var photoWidget = new panoramio.PhotoWidget(photoDiv, null, photoWidgetOptions);

	var photoWindow = new google.maps.InfoWindow();
	var panoramioOptions = { suppressInfoWindows: true }
	panoramioLayer = new google.maps.panoramio.PanoramioLayer(panoramioOptions);
    
	panoramioLayer.setUserId("7300081");
	//panoramioLayer.setMap(map);

	google.maps.event.addListener(panoramioLayer, 'click', function(event) {
		var photoRequestOptions = {
			ids: [{'photoId': event.featureDetails.photoId,
					'userId': event.featureDetails.userId}]
			}
		photoWidget.setRequest(photoRequestOptions);
		photoWidget.setPosition(0);
	
		photoWindow.setPosition(event.latLng);
		photoWindow.open(map);
		photoWindow.setContent(photoDiv);
	});

	var controlDiv = document.createElement('div');
	customControl(controlDiv, panoramioLayer);

	controlDiv.index = 1;

	map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlDiv);
}

function customControl(controlDiv, panoramioLayer) {

	var controlDate = document.createElement('div');
	setControlStyle(controlDate);
	$(controlDate).attr('class', 'datepicker');
	controlDate.innerHTML = 'Date';

	controlDiv.appendChild(controlDate);

	$(controlDate).datePicker(
			{
				createButton:false, 
				startDate: '01/01/1990'
			}
		).bind(
			'click',
			function() {
				$(this).dpDisplay();
				this.blur();
				return false;
			}
		).bind(
			'dateSelected',
			function(e, selectedDate, $td) {
			}
		);
	
	$('.datepicker').dpSetOffset(10, 30);

	var controlPanoramio = document.createElement('div');
	setControlStyle(controlPanoramio);
	controlPanoramio.style.cursor = 'pointer';
	controlPanoramio.innerHTML = 'Panoramio';
	$(controlPanoramio).click(function() { 
		panoramioLayer.setMap(map);
	});
	controlDiv.appendChild(controlPanoramio);

	var controlFlickr = document.createElement('div');
	setControlStyle(controlFlickr);
	controlFlickr.style.cursor = 'pointer';
	controlFlickr.innerHTML = 'Flickr';
	controlDiv.appendChild(controlFlickr);

	var controlSearch = document.createElement('input');
	setControlStyle(controlSearch);
	controlSearch.style.width = '240px';
	$(controlSearch).click (function() { $(this).select(); });
	var autocomplete = new google.maps.places.Autocomplete(controlSearch);
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		var place = autocomplete.getPlace();
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);
		}
		map.setCenter(place.geometry.location);
		$(controlSearch).blur();
	});
	controlDiv.appendChild(controlSearch);
}

function setControlStyle(control) {
	control.style.fontSize = '13px';
	control.style.fontFamily = 'Arial, sans-serif';
	control.style.color = '#333';
	control.style.margin = '5px';
	control.style.backgroundColor = 'white';
	control.style.borderStyle = 'solid';
	control.style.borderColor = 'grey';
	control.style.borderWidth = '1px';
	control.style.position = 'relative';
	control.style.float = 'left';
	$(control).css('-webkit-box-shadow', 'rgba(0, 0, 0, 0.4) 0px 2px 4px');

	control.style.padding = '1px 6px';
}

function addMarker(location) {
  marker = new google.maps.Marker({
	position: location,
	map: map
	});
  marker.setAnimation(google.maps.Animation.DROP);
  markersArray.push(marker);
}

$(function() {
		/*
	$('.datePicker').datePicker().bind(
		'dateSelected',
		function(e, selectedDate, $td)
		{
		   var ran1 = Math.random();
		   var ran2 = Math.random();
		   var point = new google.maps.LatLng(-34 + ran1, 147 + ran2);
		   addMarker(point);
		   markerBounds.extend(point);
		   //getPhotoDetail(selectedDate);
		   //if (markersArray.length > 1) 
		     map.fitBounds(markerBounds);
		});
		*/
	//$('.dp-popup').draggable({ containment: $('#map_canvas') });
});

function getPhotoDetail(date) {
	$.ajax({
        url: "/photoDetail",
		type: "POST",
		contentType: 'application/json',
        data: '{"dateString" : "' + date.getTime() + '"}',
        dataType: 'json',
        success: function(point) {
		    //var location = new google.maps.LatLng(point.Lat, point.Lng);
            //addMarker(location);
            //markerBounds.extend(location);
			alert(point.date);
        }
    })
}

/*
function photoOverlay(bounds, image, map) {
	this.bounds_ = bounds;
	this.image_ = image;
	this.map_ = map;

	this.div_ = null;

	this.setMap(map);
}

photoOverlay.prototype = new google.maps.OverlayView();

photoOverlay.prototype.onAdd = function() {
	var div = document.createElement('div');
	div.style.border = "none";
	div.style.borderWidth = "0px";
	div.style.position = "absolute";

	var img = document.createElement("img");
	img.src = this.image_;
	img.style.width = "10%";
	img.style.height = "10%";
	div.appendChild(img);

	this.div_ = div;

	var panes = this.getPanes();
	panes.overlayLayer.appendChild(div);
}

photoOverlay.prototype.draw = function() {
	var overlayProjection = this.getProjection();

	var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
	var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

	var div = this.div_;
	div.style.left = sw.x + 'px';
	div.style.top = ne.y + 'px';
	div.style.width = (ne.x - sw.x) + 'px';
	div.style.height = (sw.y - ne.y) + 'px';
}
*/
/*
function loadScript() {
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyBFuCvqI3XmOgm7f-q5OF6bqpsubgmH2RE&sensor=false";
	document.body.appendChild(script);
}

window.onload = loadScript;
*/
