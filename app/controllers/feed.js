 var args = arguments[0] || {};

 OS_IOS && $.cameraButton.addEventListener("click", function(_event) {
 	$.cameraButtonClicked(_event);
 });

 $.feedTable.addEventListener("click", processTableClicks);
 function processTableClicks(_event) {
 	if (_event.source.id === "commentButton") {
 		handleCommentButtonClicked(_event);
 	} else if (_event.source.id === "locationButton") {
 		handleLocationButtonClicked(_event);
 	} else if (_event.source.id === "shareButton") {
 		handleShareButtonClicked(_event);
 	}
 }

 function handleCommentButtonClicked(_event) {
 	var collection,
 	    model = null;
 	if (!_event.row) {
 		model = _event.data;
 	} else {
 		collection = Alloy.Collections.instance("Photo");
 		model = collection.get(_event.row.row_id);
 	}
 
 	var controller = Alloy.createController("comment", {
 		photo : model,
 		parentController : $
 	});

 	controller.initialize();
 	Alloy.Globals.openCurrentTabWindow(controller.getView());
 	 }
 	 $.cameraButtonClicked = function(_event) {
	var photoSource;
	Ti.API.debug('Ti.Media.isCameraSupported ' + Ti.Media.isCameraSupported);	
 	
 	if(Titanium.Media.getIsCameraSupported()){
 		photoSource = Titanium.Media.showCamera;
 		@@ -70,15 +69,10 @@ $.cameraButtonClicked = function(_event) {
 		photoSource = Titanium.Media.openPhotoGallery;
 	} 
photoSource({
	+		success : function(_event) {
+			//second argument is the callback
 			processImage(event.media, function(processResponse) {
 
 				if(processResponse.success){
 					//create a row
 					var row = Alloy.createController("feedRow", processResponse.model);
 	
 					//add the controller view, which is a row to the table
 					if ($.feedTable.getData().length === 0) {
 						$.feedTable.setData([]);
 						$.feedTable.appendRow(row.getView(), true);
 					} else {
 						$.feedTable.insertRowBefore(0, row.getView(), true);
 					}
 	
 					//photoObject = photoResp;					
 				} else {
 					alert('Error saving photo ' + processResponse.message);					
 				}
 
 			});
 		},
 		cancel : function() {
 		},
 		error : function(error) {
 			//display alert on error
 			if (error.code == Titanium.Media.NO_CAMERA) {
 				alert("Please run this test on a device");
 			} else {
 				alert("Unexpected error" + error.code);
 			}
 		},
 		saveToPhotoGallery : false,
 		allowEditing : true,
 		mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
 	});
 };

 function processImage(_mediaObject, _callback){
 var photoObject = {
 image: _mediaObject,
 title: "Sample Photo " + new Date()
 };
 _callback(photoObject);
 
 }
 function processImage(_mediaObject, _callback) {
 	var parameters = {
 		"photo" : _mediaObject,
 		"title" : "Sample Photo " + new Date(),
 		"photo_sizes[preview]" : "200x200#",
 		"photo_sizes[iphone]" : "320x320#",
 		// We need this since we are showing the image immediately
 		"photo_sync_sizes[]" : "preview"
 	};
 
 	var photo = Alloy.createModel('Photo', parameters);
 
 	photo.save({}, {
 		success : function(_model, _response) { 
 			Ti.API.debug('success: ' + _model.toJSON());
 			_callback({
 				model : _model,
 				message : null,
 				success : true
 			});
 		},
 		error : function(e) {
 			
 			Ti.API.error('error: ' + e.message);
 			_callback({
 				model : parameters,
 				message : e.message,
 				success : false
 			});
 		}
 	});
 }
 function loadPhotos() {
 	var rows = [];
 
 	// creates or gets the global instance of photo collection
 	var photos = Alloy.Collections.photo || Alloy.Collections.instance("Photo");
 
 	// be sure we ignore profile photos;
 	var where = {
 		title : {
 			"$exists" : true
 		}
 	};
({
 		data : {
 			order : '-created_at',
 			where : where
 		},
 		success : function(model, response) {
 			photos.each(function(photo) {
 				var photoRow = Alloy.createController("feedRow", photo);
 				rows.push(photoRow.getView());
 			});
 			$.feedTable.data = rows;
 			Ti.API.info(JSON.stringify(data));
 		},
 		error : function(error) {
 			alert('Error loading Feed ' + error.message);
 			Ti.API.error(JSON.stringify(error));
 		}
 	});
 }
 $.initialize = function() {
   loadPhotos();
 };