Ext.define('GasGISApp.controller.MapController',{
	extend: 'Ext.app.Controller',
	
	views:['MapView', 'POIResultView', 'RouteResultView'],
	
	config: {
		refs: {
			mapView: {
				selector: 'mapview',
				xtype: 'mapview',
				autoCreate: true
			},
			poiResultView: {
				selector: 'poiresultview',
				xtype: 'poiresultview',
				autoCreate: true
			},
			routeResultView: {
				selector: 'routeresultview',
				xtype: 'routeresultview',
				autoCreate: true
			},
			backBtn: 'button[id = backBtn_map]',
			mapContainer: 'panel[id = mapContainer]',
			mapToolbar: 'toolbar[id = mapToolbar]',
			poiDistance: 'selectfield[id = poiDistance]',
			poiType: 'selectfield[id = poiType]',
			poiSearch: 'button[id = poiSearch]',
			
			backMapBtn: 'button[action = backMapBtn]',
			poiList: 'list[id = poiList]',
			poiSearchInfoBar: 'toolbar[id = poiSearchInfoBar]',
			routeList: 'list[id = routeList]',
			routeInfoBar: 'toolbar[id = routeInfoBar]',
			backListBtn: 'button[id = backListBtn]' 
//			backPOIMapBtn: 'button[id = backPOIMapBtn]'
		},
		
		control:{
			mapView: {
				'onBack': 'backBtn'
			},
			poiResultView: {
				'onBack': 'backToMap'
			},
			routeResultView: {
				'onBack': 'backToMap'
			},
			backBtn: {
				'tap': 'backBtn'
			},
			backMapBtn: {
				'tap': 'backToMap'
			},
			mapContainer: {
				'initialize': 'addPaintedEvent'
			},
			poiSearch: {
				'tap': 'poiSearch'
			},
			poiList: {
				'initialize': 'initPOIList',
				'itemdoubletap': 'backToPOIMap'
			},
			routeList: {
				'initialize': 'initRouteList'
			},
			backListBtn: {
				'tap': 'backListBtn'
			}
//			backPOIMapBtn: {
//				'tap': 'backToPOIMap'
//			}
		},
		
		routes: {
			'mapview_route/:_action/:_direction': 'showMapView',
			'poiresultview_route/:_direction': 'showPOIResultView',
			'routeresultview_route/:_direction': 'showRouteResultView'
		},
		
		action: null,
		listType: null,
		transportMenu: null,
		
		transportType: null,
		transportDistance: null,
		transportTime: null
	},
	
	poiSearch: function(){
		if(MapObject.currentBMapX == null || MapObject.currentBMapY ==null){
			UtilFunc.msgAlert('提示', '请先进行定位');
			return;
		}
		var poiDistance = this.getPoiDistance().getValue();
		var poiType = this.getPoiType().getValue();
		
//		var ttt = [
//        {
//            "name":"部落情火锅吴泾店",
//            "location":{
//                "lat":31.047878,
//                "lng":121.472886
//            },
//            "address":"闵行区剑川路167号(宝秀路剑川路)",
//            "telephone":"(021)64520777",
//            "uid":"f5f2ee7bf02890440869d9dc",
//            "tag":"本帮江浙菜,本帮菜,老闵行",
//            "detail_url":"http://api.map.baidu.com/place/detail?uid=f5f2ee7bf02890440869d9dc&output=html&source=placeapi"
//        },
//        {
//            "name":"大学路韩国料理(东川路)",
//            "location":{
//                "lat":31.024386,
//                "lng":121.440959
//            },
//            "address":"闵行区东川路811弄23-24号(上海交通大学对面)",
//            "telephone":"(021)34290736",
//            "uid":"1ea811aeae0a139ecf06a46a",
//            "tag":"韩国料理,老闵行",
//            "detail_url":"http://api.map.baidu.com/place/detail?uid=1ea811aeae0a139ecf06a46a&output=html&source=placeapi"
//        }];
//		var poiResultStore = Ext.getStore('POIResultStore');
//		poiResultStore.setData(ttt);
//		this.redirectTo('poiresultview_route');
		
		UtilFunc.showLoadMask('POI搜索中...');
		Ext.Ajax.request({
			scope: this,
			disableCaching: true,
			url : "http://api.map.baidu.com/place/search?&query="
						 + poiType
						 + "&location="
						 + MapObject.currentBMapY
						 + ","
						 + MapObject.currentBMapX
						 +
						 "&output=json&key=ce9b3d0b5a245aa0d25004bef47874a7&radius="
						 + poiDistance,
			callback: function(options, success, response){
				UtilFunc.hideLoadMask();
				MapObject.clearCustomOverlay();
				if(success){
					var jsonObj = Ext.decode(response.responseText);
					if(jsonObj.status=="OK"){
						if(jsonObj.results.length > 0){
							this.getBackListBtn().enable();
							this.setListType("POI");
							if(poiType == '快餐' || poiType == '小吃'){
								MapObject.customOverlayType = 'restaurant';
							}
							else if(poiType == '超市'){
								MapObject.customOverlayType = 'supermarket';
							}
							else if(poiType == '地铁站'){
								MapObject.customOverlayType = 'train';
							}
							else if(poiType == '公交车站'){
								MapObject.customOverlayType = 'bus';
							}
							else if(poiType == '加油站'){
								MapObject.customOverlayType = 'gazstation';
							}
							else if(poiType == '公共厕所'){
								MapObject.customOverlayType = 'toilets';
							}
							var poiResultStore = Ext.getStore('POIResultStore');
							poiResultStore.setData(jsonObj.results);
							this.redirectTo('poiresultview_route/left');
	//						alert(poiResultStore.getCount())
						}
						else{
							MapObject.customOverlayType = null;
							this.getBackListBtn().disable();
							this.setListType(null);
							UtilFunc.msgAlert('提示', '搜索不到相关POI');	
						}
					}
				}
			}
		});
	},
	
	addPaintedEvent: function(_thisContainer){
		_thisContainer.addListener('painted',function(){this.initMapView()}, this);
	},
	
	initMapView: function(){
		if(MapObject.bmap == null){
			MapObject.bmap = new BMap.Map("mapDiv");
			//启用双击放大
			MapObject.bmap.enableDoubleClickZoom();
			//启用地图惯性拖拽
			MapObject.bmap.enableInertialDragging();
			//启用双指操作缩放
			MapObject.bmap.enablePinchToZoom();
			// 初始化地图,设置中心点坐标和地图级别
			MapObject.bmap.centerAndZoom("上海", 12);
			
			Ext.create('Ext.Button', {
						iconCls : 'zoom_in',
						iconMask : true,
						renderTo : 'zoominBtnDiv',
						width : 45,
						height : 45,
						scope: MapObject,
						handler: function() {
							this.bmap.zoomIn();
						}
					});
			Ext.create('Ext.Button', {
						iconCls : 'zoom_out',
						iconMask : true,
						renderTo : 'zoomoutBtnDiv',
						width : 45,
						height : 45,
						margin: '5 0 0 0',
						scope: MapObject,
						handler: function() {
							this.bmap.zoomOut();
						}
					});
			Ext.create('Ext.Button', {
						id: 'locateBtn',
						iconCls : 'locate',
						iconMask : true,
//						disabled: true,
						renderTo : 'locateBtnDiv',
						width : 45,
						height : 45,
						scope: MapObject,
						handler: function(){
							this.locate(false);
						}
					});
		}
//		this.locate();
	},
	
	initPOIList: function(_list){
		_list.setStore(Ext.getStore('POIResultStore'));
		_list.addListener('painted',function(){
			this.getPoiSearchInfoBar().setHtml("范围:"+this.getPoiDistance().getValue()+
			"米&nbsp&nbsp&nbsp&nbsp POI 类别:"+this.getPoiType().getValue()+
			"&nbsp&nbsp&nbsp 共"+Ext.getStore('POIResultStore').getCount()+"条");
		}, this);
	},
	
	initRouteList: function(_list){
		_list.setStore(Ext.getStore('RouteResultStore'));
		_list.addListener('painted',function(){
			this.getRouteInfoBar().setHtml("方式:"+this.getTransportType()+
			"&nbsp&nbsp 路程:"+this.getTransportDistance()+
			"&nbsp&nbsp 时间:"+this.getTransportTime());
		}, this);
	},
	
	backBtn: function(){
		var _action = this.getAction(); 
		if(_action == 'default'){
			//===重置相关参数===
			this.setAction(null);
			MapObject.clearLocOverlay();
			MapObject.clearCustomOverlay();
			this.getBackListBtn().disable();
			this.setListType(null);
			//=================
			this.redirectTo('mainview_route/right');	
		}
		else if(_action == 'device'){
			//===重置相关参数===
			this.setAction(null);
			MapObject.clearDeviceOverlay();
	    	MapObject.clearRouteOverlay();
	    	MapObject.clearLocOverlay();
	    	MapObject.deviceBMapX = null;
			MapObject.deviceBMapY = null;
			this.getBackListBtn().disable();
			this.setListType(null);
			//=================
			this.redirectTo('syncview_route/right');	
		}
		else if(_action == 'search'){
			//===重置相关参数===
			this.setAction(null);
			MapObject.clearDeviceOverlay();
	    	MapObject.clearRouteOverlay();
	    	MapObject.clearLocOverlay();
	    	MapObject.deviceBMapX = null;
			MapObject.deviceBMapY = null;
			this.getBackListBtn().disable();
			this.setListType(null);
			//=================
			this.redirectTo('searchview_route/right');
		}
	},
	
	backToMap: function(){
		if(this.getListType() == "Route"){
			this.redirectTo('mapview_route/device_list/right');
		}else{
			this.redirectTo('mapview_route/default/right');
		}
	},
	
	backToPOIMap: function(_dataView, _index, _target, _record){
		this.redirectTo('mapview_route/poi_'+_index+'/right');
	},
	
	backListBtn: function(){
		if(this.getListType() == "POI"){
			this.redirectTo('poiresultview_route/left');	
		}
		else if(this.getListType() == "Route"){
			this.redirectTo('routeresultview_route/left');
		}
	},
	
	addPOIOverlay: function(_poiObj){
		var point = new BMap.Point(_poiObj.location.lng, _poiObj.location.lat);
		var icon = new BMap.Icon("resources/css/images/" + MapObject.customOverlayType + ".png",new BMap.Size(32, 37));
		var marker = new BMap.Marker(point, {icon: icon});
		MapObject.customOverlay.push(marker);
		MapObject.bmap.addOverlay(marker);
		var content = "名称：" + _poiObj.name + "<br>" + "地址：" + _poiObj.address;
		var infoWindow = new BMap.InfoWindow(content);
		marker.addEventListener("click", function() {
			this.openInfoWindow(infoWindow);
		});
		MapObject.bmap.centerAndZoom(point, 18);
	},
	
	addDeviceOverlay: function(_taskObj, _scope){
		if(MapObject.isLocateSuccess){
			var currentPoint = new BMap.Point(MapObject.currentBMapX, MapObject.currentBMapY);
			MapObject.currentLocOverlay = new BMap.Marker(currentPoint);
			MapObject.bmap.addOverlay(MapObject.currentLocOverlay);
			MapObject.deviceBMapX = _taskObj.lng;
			MapObject.deviceBMapY = _taskObj.lat;
			var devicePoint = new BMap.Point(_taskObj.lng, _taskObj.lat);
			var icon = new BMap.Icon("resources/css/images/device.png",new BMap.Size(32, 37));
			var marker = new BMap.Marker(devicePoint, {icon: icon});
			marker.addEventListener("click", function(){
				_scope.showMenu();
			});
			MapObject.deviceOverlay.push(marker);
			MapObject.bmap.addOverlay(marker);
			MapObject.bmap.setViewport([currentPoint, devicePoint]);
		}else{
			if(!MapObject.isError){
				window.setTimeout(_scope.addDeviceOverlay, 1000, _taskObj, _scope);	
			}
		}
	},
	
	getDrivingRoute: function(){
		var _scope = this;
		var drivingService = new BMap.DrivingRoute('上海', {
			onSearchComplete: searchComplete
		});
		var currentPoint = new BMap.Point(MapObject.currentBMapX, MapObject.currentBMapY);
		var destinationPoint = new BMap.Point(MapObject.deviceBMapX, MapObject.deviceBMapY);
		UtilFunc.showLoadMask('正在生成导航路线...');
		drivingService.search(currentPoint, destinationPoint);
		
		function searchComplete(results){
			UtilFunc.hideLoadMask();
			_scope.getBackListBtn().disable();
			_scope.setListType(null);
			if(results.getNumPlans() > 0){
				var routePlan = results.getPlan(0);
				if(routePlan.getNumRoutes() > 0){
					var route = routePlan.getRoute(0);
					if (route.getDistance(false) > 0) {
						_scope.getBackListBtn().enable();
						_scope.setListType("Route");
						_scope.setTransportType("驾车");
						_scope.setTransportDistance(routePlan.getDistance());
						_scope.setTransportTime(routePlan.getDuration());
						var polyline = new BMap.Polyline(route.getPath(), {
									strokeColor : "green",
									strokeStyle : "solid"
								});
						MapObject.routeOverlay.push(polyline);
						MapObject.bmap.addOverlay(polyline);
						
						MapObject.routeResult = [];
						for(var i=0; i<route.getNumSteps(); i++){
							var step = route.getStep(i);
							var stepObj = new Object();
							stepObj.index = step.getIndex();
							stepObj.description = step.getDescription();
							stepObj.distance = step.getDistance();
							MapObject.routeResult.push(stepObj);
						}
						var routeResultStore = Ext.getStore('RouteResultStore');
						routeResultStore.setData(MapObject.routeResult);
						_scope.redirectTo('routeresultview_route/left');
					}
				}
			};
		}
	},
	
	getWalkingRoute: function(){
		var _scope = this;
		var walkingService = new BMap.WalkingRoute('上海', {
			onSearchComplete: searchComplete
		});
		var currentPoint = new BMap.Point(MapObject.currentBMapX, MapObject.currentBMapY);
		var destinationPoint = new BMap.Point(MapObject.deviceBMapX, MapObject.deviceBMapY);
		UtilFunc.showLoadMask('正在生成导航路线...');
		walkingService.search(currentPoint, destinationPoint);
		
		function searchComplete(results){
			UtilFunc.hideLoadMask();
			_scope.getBackListBtn().disable();
			_scope.setListType(null);
			if(results.getNumPlans() > 0){
				var routePlan = results.getPlan(0);
				if(routePlan.getNumRoutes() > 0){
					var route = routePlan.getRoute(0);
					if (route.getDistance(false) > 0) {
						_scope.getBackListBtn().enable();
						_scope.setListType("Route");
						_scope.setTransportType("步行");
						_scope.setTransportDistance(routePlan.getDistance());
						_scope.setTransportTime(routePlan.getDuration());
						var polyline = new BMap.Polyline(route.getPath(), {
									strokeColor : "green",
									strokeStyle : "solid"
								});
						MapObject.routeOverlay.push(polyline);
						MapObject.bmap.addOverlay(polyline);
						
						MapObject.routeResult = [];
						for(var i=0; i<route.getNumSteps(); i++){
							var step = route.getStep(i);
							var stepObj = new Object();
							stepObj.index = step.getIndex();
							stepObj.description = step.getDescription();
							stepObj.distance = step.getDistance();
							MapObject.routeResult.push(stepObj);
						}
						var routeResultStore = Ext.getStore('RouteResultStore');
						routeResultStore.setData(MapObject.routeResult);
						_scope.redirectTo('routeresultview_route/left');
					}
				}
			};
		}
	},
	
	showMenu: function(){
		if(this.getTransportMenu() == null){
			var tm = Ext.create('Ext.Panel',{
				height: 200,
				width: 150,
				baseCls : 'transportMenu',
				centered: true,
				modal: true,
				layout: 'vbox',
				defaults:{
					margin: '0 0 10 0',
					height: 50
				},
				items: [{
					xtype: 'button',
					icon: 'resources/css/images/walk.png',
					text: '步行',
					scope: this,
					handler: function(){
						this.getTransportMenu().hide();
						MapObject.clearRouteOverlay();
						this.getWalkingRoute();
					}
				},{
					xtype: 'button',
					icon: 'resources/css/images/car.png',
					text: '驾车',
					scope: this,
					handler: function(){
						this.getTransportMenu().hide();
						MapObject.clearRouteOverlay();
						this.getDrivingRoute();
					}
				},{
					xtype: 'button',
					ui: 'confirm',
					text: '取消',
					scope: this,
					handler: function(){
						this.getTransportMenu().hide();
					}
				}]
			});
			this.setTransportMenu(tm);
			Ext.Viewport.add(this.getTransportMenu());
		}
		this.getTransportMenu().show();	
	},
	
	showMapView: function(_action, _direction){
		Ext.Viewport.animateActiveItem(this.getMapView(), {
			type: 'slide',
			direction: _direction
    	});
    	
    	if(_action == 'default'){
    		if(this.getMapToolbar().isHidden()){
    			this.getMapToolbar().show();	
    		}
    		this.setAction('default');
    	}
    	else if(_action.split('_')[0] == 'poi'){
    		if(this.getMapToolbar().isHidden()){
    			this.getMapToolbar().show();	
    		}
    		this.setAction('default');
    		MapObject.clearCustomOverlay();
    		var _scope = this;
    		var poiResultStore = Ext.getStore('POIResultStore');
			var poiObj = poiResultStore.getAt(_action.split('_')[1]).getData(true);
			//UtilFunc.showLoadMask('请稍候...');
			window.setTimeout(_scope.addPOIOverlay, 500, poiObj);    		
    	}
    	else if(_action.split('_')[0] == 'device'){
    		if(_action.split('_')[1] != 'list'){
    			this.getMapToolbar().hide();
    			MapObject.clearDeviceOverlay();
	    		MapObject.clearRouteOverlay();
    			if(_action.split('_')[1] == 'search'){
    				this.setAction('search');
		    		MapObject.locate(true);
		    		var taskStore = Ext.getStore('TaskStore');
					var taskObj = taskStore.getAt(_action.split('_')[2]).getData(true);
		    		this.addDeviceOverlay(taskObj, this);
    			}else{
    				this.setAction('device');
		    		MapObject.locate(true);
		    		var taskStore = Ext.getStore('TaskStore');
					var taskObj = taskStore.getAt(_action.split('_')[1]).getData(true);
		    		this.addDeviceOverlay(taskObj, this);
    			}
    			
    		}
    	}
    	
//    	if(_action == "poi"){
//			var poiResultStore = Ext.getStore('POIResultStore');
//			for(var i=0; i<poiResultStore.getCount(); i++){
//				var poiObj = poiResultStore.getAt(i).getData(true);
//				var point = new BMap.Point(poiObj.location.lng, poiObj.location.lat);
//				var marker = new BMap.Marker(point);
//				MapObject.bmap.addOverlay(marker);
//				(function () {
//					 var content = "名称：" + poiObj.name + "<br>" + "地址：" + poiObj.address;
//					 var infoWindow = new BMap.InfoWindow(content);
//					 marker.addEventListener("click", function() {
//					 	this.openInfoWindow(infoWindow);
//					 })
//				 })();
//			}
//		}
	},
	
	showPOIResultView: function(){
		Ext.Viewport.animateActiveItem(this.getPoiResultView(), {
			type: 'slide',
			direction: 'left'
    	})
	},
	
	showRouteResultView: function(){
		Ext.Viewport.animateActiveItem(this.getRouteResultView(), {
			type: 'slide',
			direction: 'left'
    	})
	}
})

var MapObject = {
	bmap: null,
	currentGPSX: null,
	currentGPSY: null,
	currentBMapX: null,
	currentBMapY: null,
	accuracy: null,
	currentLocOverlay: null,
	currentLocAccuracyOverlay: null,
	customOverlay: [],
	customOverlayType: null,
	deviceOverlay: [],
	deviceBMapX: null,
	deviceBMapY: null,
	routeOverlay: [],
	routeResult: [],
	watchId: null,
	locateOptions: {
		enableHighAccuracy : true,
		maximumAge: 0,
		timeout:30000
	},
	
	//isQuiet为True时将只记录点位，而不在地图上显示
	isQuiet: false,
	isLocateSuccess: false,
	isError: false,
	
	setStatus: function(_txt){
		var statusBar = Ext.fly('mapStatusBar');
		statusBar.setHtml(_txt);
	},
	
	clearRouteOverlay: function(){
		for(var i=0; i<MapObject.routeOverlay.length; i++){
			MapObject.bmap.removeOverlay(MapObject.routeOverlay[i]);
		}
		MapObject.routeOverlay = [];
	},
	
	clearDeviceOverlay: function(){
		for(var i=0; i<MapObject.deviceOverlay.length; i++){
			MapObject.bmap.removeOverlay(MapObject.deviceOverlay[i]);
		}
		MapObject.deviceOverlay = [];
	},
	
	clearCustomOverlay: function(){
		for(var i=0; i<MapObject.customOverlay.length; i++){
			MapObject.bmap.removeOverlay(MapObject.customOverlay[i]);
		}
		MapObject.customOverlay = [];
	},
	
	clearLocOverlay: function(){
		MapObject.setStatus('');
		MapObject.currentBMapX = null;
		MapObject.currentBMapY = null;
		if(MapObject.currentLocOverlay != null){
			MapObject.bmap.removeOverlay(MapObject.currentLocOverlay);
			MapObject.bmap.removeOverlay(MapObject.currentLocAccuracyOverlay);
		}
	},
	
	//=======HTML5定位模块=======
	locate: function(_isQuiet){
		if(MapObject.watchId != null){
			navigator.geolocation.clearWatch(MapObject.watchId);
			MapObject.watchId = null;
		}
		
		MapObject.isError = false;
		MapObject.isLocateSuccess = false;
		MapObject.isQuiet = _isQuiet;
		MapObject.clearLocOverlay();
//		if(MapObject.currentLocOverlay != null){
//			MapObject.bmap.removeOverlay(MapObject.currentLocOverlay);
//			MapObject.bmap.removeOverlay(MapObject.currentLocAccuracyOverlay);
//		}
		MapObject.setStatus('正在定位...');
		navigator.geolocation.getCurrentPosition(MapObject.locateSuccess, MapObject.locateError, MapObject.locateOptions);
	},
	
	locateSuccess: function(_position){
		if(MapObject.watchId != null && _position.coords.accuracy > 20){
			return;
		}
		
		if(MapObject.watchId != null){
			navigator.geolocation.clearWatch(MapObject.watchId);
			MapObject.watchId = null;
			MapObject.clearLocOverlay();
		}
		
		MapObject.currentGPSX = Ext.Number.toFixed(_position.coords.longitude, 4);
		MapObject.currentGPSY = Ext.Number.toFixed(_position.coords.latitude, 4);
		var gpsPoint = new BMap.Point(_position.coords.longitude, _position.coords.latitude);
		MapObject.accuracy = _position.coords.accuracy;
//		BMap.Convertor.translate(gpsPoint, 0, transOperation);
		
		CoordConvertor.translate(gpsPoint, 0, 4, transOperation);
		
		function transOperation(_point){
			MapObject.currentBMapX = _point.lng;
			MapObject.currentBMapY = _point.lat;
			MapObject.isLocateSuccess = true;
			if(!MapObject.isQuiet){
				var icon = new BMap.Icon("resources/css/images/location.png",new BMap.Size(16, 16));
				MapObject.currentLocOverlay = new BMap.Marker(_point,{icon:icon});
				MapObject.bmap.addOverlay(MapObject.currentLocOverlay);
				MapObject.currentLocAccuracyOverlay = new BMap.Circle(_point,MapObject.accuracy,{strokeWeight:1,fillColor:"#F0F8FF",fillOpacity:0.4});
				MapObject.bmap.addOverlay(MapObject.currentLocAccuracyOverlay);
				MapObject.bmap.centerAndZoom(_point, 18);
			}
			MapObject.setStatus('当前位置：&nbsp&nbsp经度:'+MapObject.currentGPSX+',&nbsp&nbsp纬度:'+MapObject.currentGPSY);
			
			if(MapObject.accuracy > 20){
				MapObject.watchId = navigator.geolocation.watchPosition(MapObject.locateSuccess, MapObject.locateError, MapObject.locateOptions);
			}
		}
	},
	
	locateError: function(_error){
		if(MapObject.watchId != null){
			navigator.geolocation.clearWatch(MapObject.watchId);
			MapObject.watchId = null;
		}
		
		if(_error.code == 3){
//			UtilFunc.msgAlert('提示', 'code: ' + _error.code + '\n' + 'message: ' + _error.message + '\n');
			UtilFunc.msgAlert('提示', '定位超时，请稍候再试');
		}
		
		MapObject.isError = true;
		MapObject.isLocateSuccess = false;
		MapObject.currentGPSX = null; 
		MapObject.currentGPSY = null;
		MapObject.currentBMapX = null;
		MapObject.currentBMapY = null;
		MapObject.setStatus('定位失败!');
	}
	//==========================
}