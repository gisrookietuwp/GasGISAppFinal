Ext.define('GasGISApp.controller.Record',{
	extend: 'Ext.app.Controller',
	views:['RecordView'],
	config: {
		refs: {
			recordView: {
				selector: 'recordview',
				xtype: 'recordview',
				autoCreate: true
			},
			backMainBtn: 'button[id = backMainBtn_record]',
			reportCarousel: 'carousel[id = reportCarousel]',
			reportLocBtn: 'button[id = locateBtn_report]',
			locationInfoBar: 'label[id = locationInfoBar]',
			saveReportBtn: 'button[id = saveReportBtn]',
			eventRadio: 'radiofield[action = eventRadio]',
			deviceID: 'textfield[id = deviceID]',
			
			picturePanel: 'panel[id = picturePanel]',
			takePhotoBtn: 'button[id = takePhotoBtn]',
			deletePhotoBtn: 'button[id = deletePhotoBtn]'
		},
		control:{
			recordView: {
				'onBack': 'backToMain'
			},
			backMainBtn: {
				'tap': 'backToMain'
			},
			reportCarousel: {
				'initialize': 'addCarouselPaintedEvent'
			},
			reportLocBtn: {
				'tap': 'getLocation'
			},
			saveReportBtn: {
				'tap': 'saveReport'
			},
			eventRadio: {
				'uncheck': 'selectEvent' //bug?
			},
			picturePanel: {
				'initialize': 'initPicturePanel'
			},
			takePhotoBtn: {
				'tap': 'takePhoto'
			},
			deletePhotoBtn: {
				'tap': 'deletePhoto'
			}
		},
		routes: {
			'recordview_route/:_action/:_recordID/:_direction': 'showRecordView'
		},
		
		currentGPSX: null,
		currentGPSY: null,
		currentEventRadio: null,
		picPath: '',
		action: null
	},
	
	initPicturePanel: function(_panel){
		_panel.setHtml('<img id="largeImage" src="resources/css/images/picture.png" width='+ Global.screenWidth +' />');
	},
	
	addCarouselPaintedEvent: function(_carousel){
		_carousel.addListener('painted',function(){this.restoreReportInfo(_carousel)}, this);
	},
	
	restoreReportInfo: function(_carousel){
		for(var i=1; i<=2; i++){
			for(var j=1; j<=4; j++){
				Ext.getCmp('loop'+i+'_value'+j).reset();
			}
		}
		if(this.getCurrentEventRadio() != null){
			this.getCurrentEventRadio().uncheck();
			this.setCurrentEventRadio(null);
		}
		if(this.getPicPath() != ''){
			var largeImage = document.getElementById('largeImage');
			largeImage.src = 'resources/css/images/picture.png';
			this.setPicPath('');
			this.getDeletePhotoBtn().disable();
			this.getDeletePhotoBtn().setUi('normal');
		}
		_carousel.setActiveItem(0);
		this.getLocation();
	},
	
	deletePhoto: function(){
		var largeImage = document.getElementById('largeImage');
		largeImage.src = 'resources/css/images/picture.png';
		this.setPicPath('');
		this.getDeletePhotoBtn().disable();
		this.getDeletePhotoBtn().setUi('normal');
	},
	
	takePhoto: function(){
		var _scope = this;
		navigator.camera.getPicture(
			function(imageURI) {
				var largeImage = document.getElementById('largeImage');
				largeImage.src = imageURI;
				_scope.setPicPath(imageURI);
				_scope.getDeletePhotoBtn().enable();
				_scope.getDeletePhotoBtn().setUi('decline');
			}, 
			function(message) {
				if(message != 'Camera cancelled.')
					UtilFunc.msgAlert('提示', message);
			}, 
			{
				quality : 50,
				targetWidth: 768,
				targetHeight: 1280,
				encodingType: Camera.EncodingType.JPEG,
				destinationType : navigator.camera.DestinationType.FILE_URI,
				sourceType : navigator.camera.PictureSourceType.CAMERA,
				saveToPhotoAlbum: false
			});
	},
	
	selectEvent: function(_checkbox){
		this.setCurrentEventRadio(_checkbox);
	},
	
	saveReport: function(){
		var _scope = this;
		if(Ext.String.trim(this.getDeviceID().getValue()) == ""){
			UtilFunc.msgAlert('提示', '未填写设备编号');
			return;
		}
		if(this.getCurrentEventRadio() == null){
			UtilFunc.msgAlert('提示', '未填写相关事件');
			return;
		}
		if(this.getCurrentGPSX()==null || this.getCurrentGPSY()==null){
			UtilFunc.msgAlert('提示', '未获得当前位置信息');
			return;
		}
		var reportObj = new Object();
		reportObj.deviceID = Ext.String.trim(this.getDeviceID().getValue());
		reportObj.taskDate = window.localStorage.getItem('date');
		reportObj.reportDate = Ext.Date.format(new Date(), 'Y-m-d H:i:s');
		reportObj.lat = this.getCurrentGPSY();
		reportObj.lng = this.getCurrentGPSX();
		reportObj.eventType = this.getCurrentEventRadio().getValue();
		reportObj.picPath = this.getPicPath();
		reportObj.loop1_value1 = Ext.getCmp('loop1_value1').getValue();
		reportObj.loop1_value2 = Ext.getCmp('loop1_value2').getValue();
		reportObj.loop1_value3 = Ext.getCmp('loop1_value3').getValue();
		reportObj.loop1_value4 = Ext.getCmp('loop1_value4').getValue();
		reportObj.loop2_value1 = Ext.getCmp('loop2_value1').getValue();
		reportObj.loop2_value2 = Ext.getCmp('loop2_value2').getValue();
		reportObj.loop2_value3 = Ext.getCmp('loop2_value3').getValue();
		reportObj.loop2_value4 = Ext.getCmp('loop2_value4').getValue();
		
		WebDB.insertReport(reportObj, function(_context){
			Ext.Msg.alert('<p>提示</p>', _context, function(){
				_scope.redirectTo('searchview_route/left');
			});
		});
	},
	
	getLocation: function(){
		var _scope = this;
		var options = {
			enableHighAccuracy : true,
			maximumAge: 0,
			timeout:30000
		};
		this.getLocationInfoBar().setHtml('正在定位...');

		_scope.setCurrentGPSX(null);
		_scope.setCurrentGPSY(null);
		navigator.geolocation.getCurrentPosition(locateSuccess, locateError, options);
		
		function locateSuccess(_position){
			_scope.setCurrentGPSX(Ext.Number.toFixed(_position.coords.longitude, 4));
			_scope.setCurrentGPSY(Ext.Number.toFixed(_position.coords.latitude, 4));
			_scope.getLocationInfoBar().setHtml('当前位置：&nbsp&nbsp经度:'+_scope.getCurrentGPSX()+',&nbsp&nbsp纬度:'+_scope.getCurrentGPSY());
		}
		
		function locateError(_error){
			if(_error.code == 3){
				_scope.getLocationInfoBar().setHtml('定位超时，请稍候再试');
			}
		}
	},
	
	backToMain: function(){
		this.redirectTo('mainview_route/right');
//		var _action = this.getAction();
//		if(_action == 'default'){
//			this.redirectTo('mainview_route/right');
//		}
//		else if(_action == 'search'){
//			this.redirectTo('searchview_route/right');
//		}
//		else if(_action == 'sync'){
//			this.redirectTo('syncview_route/right');
//		}
		
		this.setAction(null);
	},
	
	showRecordView: function(_action, _recordID, _direction){
		if(_action == 'default'){
			Ext.Viewport.animateActiveItem(this.getRecordView(), {
				type: 'slide',
				direction: _direction
	    	});
	    	this.getDeviceID().reset();
	    	this.getDeviceID().setReadOnly(false);
		}
		else{
			Ext.Viewport.animateActiveItem(this.getRecordView(), {
				type: 'slide',
				direction: _direction
	    	});
	    	this.getDeviceID().setValue(_recordID);
	    	this.getDeviceID().setReadOnly(true);
		}
		this.setAction(_action);
	}
})