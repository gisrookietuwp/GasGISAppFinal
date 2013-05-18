

var CONSTANT = {
	APPTITLE: '浦东燃气管线设施巡检系统',
	MAPTITLE: '地图',
	POITITLE: 'POI列表',
	ROUTETITLE: '导航结果',
	SYNCTITLE: '数据同步',
	SEARCHTITLE: '任务查询',
	RECORDTITLE: '数据录入',
	SETTINGSTITLE: '系统设置',
	
	DEFAULT_IPADDRESS: '58.198.183.117',
	DEFAULT_PORT: '8088',
	
//	LOGIN_URL: '/GasGISApp/Authorization',
	
	//===>  /GasGISApp/Authorization
	LOGIN_URL: '/GasGISApp/Authorization',
	//===>  /GasGISApp/User/{UserName}/Task/{Year}/{Month}/{Day}
	TasksList_URL: '/GasGISApp/Rest/User/{0}/Task/{1}/{2}/{3}',
	//===>  /GasGISApp/Tasks/{RegionType}/{DeviceType}/{TaskId}
	TaskInfo_URL: '/GasGISApp/Rest/Tasks/{0}/{1}/{2}',
	//===>  /GasGISApp/User/{UserName}/Record/{Year}/{Month}/{Day}/{DeviceType}
	RecordUpload_URL: '/GasGISApp/Rest/User/{0}/Record/{1}/{2}/{3}/{4}'
}


var Global = {
	screenWidth: 0,
	screenHeight: 0,
	
	ipAddress: 'http://' + CONSTANT.DEFAULT_IPADDRESS,
	port: CONSTANT.DEFAULT_PORT
	
//	authID: null
}


/**
 * Ext.Msg.alert以及自定义的loadMask
 * 
 */
var UtilFunc = {
	//private param
	loadMask: null,
	
	showLoadMask: function(_content){
		if(this.loadMask == null){
			this.loadMask = Ext.create('Ext.Panel',{
				baseCls : 'loadMask',
				styleHtmlContent: true,
				html: '<div class="loadingPic"><div></div></div>' +
						'<div class="loadingMsg">'+_content+'</div>',
				centered: true,
				modal: true
			});
			Ext.Viewport.add(this.loadMask);
		}
		this.loadMask.show();
	},
	
	hideLoadMask: function(_content){
		if(this.loadMask != null){
			this.loadMask.hide();
			this.loadMask = null;
		}
	},
	
	msgAlert: function(_title, _content){
		Ext.Msg.alert("<p>"+_title+"</p>" , _content);
	},
	
	onBackKeyDown: function(){
		
		Ext.Viewport.getActiveItem().fireEvent('onBack');
		
//		navigator.notification.confirm("是否要退出应用?", confirmCallback, "退出应用", "取消,退出");
//		function confirmCallback(index){
//			switch (index){
//				case 1: break;
//    			case 2: navigator.app.exitApp();break;
//    		}
//		}
	}
}

var Base64 = {
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	
	decode: function(_base64Str){
		var output = "";  
        var chr1, chr2, chr3;  
        var enc1, enc2, enc3, enc4;  
        var i = 0;  
        _base64Str = _base64Str.replace(/[^A-Za-z0-9\+\/\=]/g, "");  
        while (i < _base64Str.length) {  
            enc1 = this._keyStr.indexOf(_base64Str.charAt(i++));  
            enc2 = this._keyStr.indexOf(_base64Str.charAt(i++));  
            enc3 = this._keyStr.indexOf(_base64Str.charAt(i++));  
            enc4 = this._keyStr.indexOf(_base64Str.charAt(i++));  
            chr1 = (enc1 << 2) | (enc2 >> 4);  
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);  
            chr3 = ((enc3 & 3) << 6) | enc4;  
            output = output + String.fromCharCode(chr1);  
            if (enc3 != 64) {  
                output = output + String.fromCharCode(chr2);  
            }  
            if (enc4 != 64) {  
                output = output + String.fromCharCode(chr3);  
            }  
        }  
        output = this.utf8_decode(output);  
        return output;
	},
	
	utf8_decode: function(utftext){
		var string = "";  
        var i = 0;  
        var c = c1 = c2 = 0;  
        while ( i < utftext.length ) {  
            c = utftext.charCodeAt(i);  
            if (c < 128) {  
                string += String.fromCharCode(c);  
                i++;  
            } else if((c > 191) && (c < 224)) {  
                c2 = utftext.charCodeAt(i+1);  
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));  
                i += 2;  
            } else {  
                c2 = utftext.charCodeAt(i+1);  
                c3 = utftext.charCodeAt(i+2);  
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));  
                i += 3;  
            }  
        }  
        return string;
	}
}

//var CoordConvertor = {
//	_callbackFunc: {},
//	
//	translate: function(point, fromType, toType, callbackFunc){
//		var callbackName = 'cbk_' + Math.round(Math.random() * 1000);
//		CoordConvertor._callbackFunc[callbackName] = function(result){
//			delete CoordConvertor._callbackFunc[callbackName];
//			var point = new BMap.Point(Base64.decode(result.x), Base64.decode(result.y));
//			callbackFunc(point);
//		}
//		var url = "http://api.map.baidu.com/ag/coord/convert?from="+ fromType + "&to=" + toType + 
//				"&x=" + point.lng + "&y=" + point.lat + "&callback=CoordConvertor._callbackFunc." +callbackName;
//		this.loadUrl(url);
//	},
//	
//	loadUrl: function(url){
//		var head = document.getElementsByTagName('head')[0];
//		var script = document.createElement('script');
//		script.type = 'text/javascript';
//    	script.src = url;
//    	script.onload = function(){
//    		if((!this.readyState || this.readyState === "loaded" || this.readyState === "complete")){
//				script.onload = null;
//	            if (head && script.parentNode) {
//	                head.removeChild(script);
//	            }    			
//    		}
//    	}
//    	head.insertBefore(script, head.firstChild);
//	}
//}

var CoordConvertor = {
	_callbackFunc: null,
	
	translate: function(point, fromType, toType, callbackFunc){
		this._callbackFunc = function(_result){
			var point = new BMap.Point(Base64.decode(_result.x), Base64.decode(_result.y));
			callbackFunc(point);
		}
		var url = "http://api.map.baidu.com/ag/coord/convert?from="+ fromType + "&to=" + toType + 
				"&x=" + point.lng + "&y=" + point.lat + "&callback=CoordConvertor._callbackFunc";
		this.loadUrl(url);
	},
	
	loadUrl: function(url){
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.type = 'text/javascript';
    	script.src = url;
    	script.onload = function(){
    		if (head && script.parentNode) {
                head.removeChild(script);
            } 
    	}
    	head.insertBefore(script, head.firstChild);
	}
}


var WebDB = {
	//private param
	db: null,
	taskObj: null,
	taskObjIndex: null,
	taskObjDate: null,
	
	successCallbackFunc: null,
	
	SQL_TASK: "CREATE TABLE IF NOT EXISTS t_task (sequence integer, deviceID nvarchar(6), address nvarchar(40), placeName nvarchar(20), lat numeric(7, 4), lng numeric(7, 4), isFinished integer ,taskDate datetime)",
	SQL_TYQREPORT: "CREATE TABLE IF NOT EXISTS t_report (deviceID nvarchar(6), taskDate datetime, reportDate datetime, lat numeric(7, 4), lng numeric(7, 4), isUpload integer, eventType integer, picPath nvarchar(255)," +
				   "loop1_value1 numeric(18, 2), loop1_value2 numeric(18, 2), loop1_value3 numeric(18, 2), loop1_value4 numeric(18, 2), loop2_value1 numeric(18, 2), loop2_value2 numeric(18, 2), loop2_value3 numeric(18, 2), loop2_value4 numeric(18, 2))",
	//	SQL_CHECKTASK: "SELECT count(*) as count FROM t_task WHERE taskDate = ?",
	SQL_INSERTTASK: "INSERT INTO t_task VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
	SQL_CHECKDEVICEID: "SELECT count(*) AS count FROM t_task WHERE deviceID = ? AND taskDate = ?",
	SQL_INSERTREPORT: "INSERT INTO t_report VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
	SQL_UPDATETASKSTATUS: "UPDATE t_task SET isFinished = 1 WHERE deviceID = ? AND taskDate = ?",
	SQL_GETLOCALTASK: "SELECT * FROM t_task WHERE taskDate = ?",
	SQL_GETLOCALUNDONETASK: "SELECT * FROM t_task WHERE isFinished = '0' AND taskDate = ?",
	SQL_GETRECORD: "SELECT rpt.deviceID, rpt.reportDate, rpt.lat, rpt.lng, rpt.isUpload, rpt.eventType, rpt.picPath, " +
				"rpt.loop1_value1, rpt.loop1_value2, rpt.loop1_value3, rpt.loop1_value4, rpt.loop2_value1, rpt.loop2_value2, "+
				"rpt.loop2_value3, rpt.loop2_value4, tsk.placeName, tsk.sequence FROM t_report AS rpt INNER JOIN t_task AS tsk ON rpt.deviceID = tsk.deviceID "+
				"WHERE rpt.taskDate = ? AND rpt.isUpload = 0 ORDER BY rpt.reportDate",
	SQL_UPDATEUPLOADSTATUS: "UPDATE t_report SET isUpload = 1 WHERE taskDate = ? AND deviceID = ?",
	
	initDatabase: function(){
		this.db = window.openDatabase("GasGISDB", "1.0", "GasGISDB", 10*1024*1024);
		if(this.db != null){
			this.db.transaction(createTableHandler, WebDB.errorDB);
		}
		
		function createTableHandler(tx){
			tx.executeSql(WebDB.SQL_TASK);
			tx.executeSql(WebDB.SQL_TYQREPORT);
		}
	},
	
//	checkDownloadTask: function(_date, _successFunc){
//		if(this.db != null){
//			this.db.transaction(checkHandler, WebDB.errorDB);
//		}
//		
//		function checkHandler(tx){
//			tx.executeSql(WebDB.SQL_CHECKTASK, [_date], _successFunc, WebDB.errorDB);
//		}
//	},
	
	
	//============InsertTask=============
	insertTask: function(_taskObj, _successFunc){
		WebDB.taskObj = _taskObj;
		WebDB.taskObjIndex = -1;
		WebDB.taskObjDate = Ext.Date.format(new Date(), 'Y-m-d');
		WebDB.successCallbackFunc = _successFunc;
		if(this.db != null){
			this.db.transaction(WebDB.insertTaskHandler, WebDB.errorDB);
		}
	},
	
	insertTaskHandler: function(tx){
		WebDB.taskObjIndex++;
		var _obj = WebDB.taskObj[WebDB.taskObjIndex];
		if(WebDB.taskObjIndex < (WebDB.taskObj.length -1)){
			tx.executeSql(WebDB.SQL_INSERTTASK, [_obj.sequence, _obj.deviceID, _obj.address, _obj.placeName, _obj.lat, _obj.lng, 0, WebDB.taskObjDate], WebDB.insertTaskHandler, WebDB.errorDB);
		}else{
			tx.executeSql(WebDB.SQL_INSERTTASK, [_obj.sequence, _obj.deviceID, _obj.address, _obj.placeName, _obj.lat, _obj.lng, 0, WebDB.taskObjDate], WebDB.successCallbackFunc, WebDB.errorDB);
		}
	},
	//====================================
	
	//============InsertReport=============
	insertReport: function(_reportObj, _successFunc){
		if(this.db != null){
			this.db.transaction(checkDeviceID, WebDB.errorDB);
		}
		
		function checkDeviceID(tx){
			tx.executeSql(WebDB.SQL_CHECKDEVICEID, [_reportObj.deviceID, _reportObj.taskDate], insertReportHandler, WebDB.errorDB);
		}
		
		function insertReportHandler(tx, results){
			if(results.rows.item(0).count > 0){
				tx.executeSql(WebDB.SQL_INSERTREPORT, [_reportObj.deviceID, _reportObj.taskDate, _reportObj.reportDate, _reportObj.lat, _reportObj.lng,
				0, _reportObj.eventType, _reportObj.picPath, _reportObj.loop1_value1, _reportObj.loop1_value2, _reportObj.loop1_value3, _reportObj.loop1_value4,
				_reportObj.loop2_value1, _reportObj.loop2_value2, _reportObj.loop2_value3, _reportObj.loop2_value4], successFunc, WebDB.errorDB)
			}
			else{
				_successFunc("本地保存失败：设备编号错误");
			}
		}
		
		function successFunc(tx){
			tx.executeSql(WebDB.SQL_UPDATETASKSTATUS, [_reportObj.deviceID, _reportObj.taskDate], function(){_successFunc("本地保存成功")}, WebDB.errorDB);
		}
	},
	//====================================
	
	getRecord: function(_date, _successFunc){
		var resultArr = [];
		if(this.db != null){
			this.db.transaction(getRecordHandler, WebDB.errorDB);
		}
		
		function getRecordHandler(tx){
			tx.executeSql(WebDB.SQL_GETRECORD, [_date], successFunc, WebDB.errorDB);
		}
		
		function successFunc(tx, results){
			var len = results.rows.length;
			for(var i=0; i<len; i++){
				var resultObj = new Object();
				resultObj.deviceID = results.rows.item(i).deviceID;
				resultObj.reportDate = results.rows.item(i).reportDate;
				resultObj.lat = results.rows.item(i).lat;
				resultObj.lng = results.rows.item(i).lng;
				resultObj.isUpload = results.rows.item(i).isUpload;
				resultObj.eventType = results.rows.item(i).eventType;
				resultObj.picPath = results.rows.item(i).picPath;
				resultObj.placeName = results.rows.item(i).placeName;
				resultObj.sequence = results.rows.item(i).sequence;
				resultObj.loop1_value1 = results.rows.item(i).loop1_value1;
				resultObj.loop1_value2 = results.rows.item(i).loop1_value2;
				resultObj.loop1_value3 = results.rows.item(i).loop1_value3;
				resultObj.loop1_value4 = results.rows.item(i).loop1_value4;
				resultObj.loop2_value1 = results.rows.item(i).loop2_value1;
				resultObj.loop2_value2 = results.rows.item(i).loop2_value2;
				resultObj.loop2_value3 = results.rows.item(i).loop2_value3;
				resultObj.loop2_value4 = results.rows.item(i).loop2_value4;
				resultArr.push(resultObj);
			}
			_successFunc(resultArr);
		}
	},
	
	updateUploadStatus: function(_date, _deviceID, _successFunc){
		if(this.db != null){
			this.db.transaction(updateUploadStatusHandler, WebDB.errorDB);
		}
		
		function updateUploadStatusHandler(tx){
			tx.executeSql(WebDB.SQL_UPDATEUPLOADSTATUS, [_date, _deviceID], function(){_successFunc("上传记录成功")}, WebDB.errorDB);
		}
	},
	
	updateUploadStatusEx: function(_date, _deviceID, _successFunc){
		if(this.db != null){
			this.db.transaction(updateUploadStatusHandler, WebDB.errorDB);
		}
		
		function updateUploadStatusHandler(tx){
			var SQL_UPDATEUPLOADSTATUSEX = "UPDATE t_report SET isUpload = 1 WHERE taskDate = ? AND deviceID IN ";
			
			var queryArr = [];
			queryArr.push(_date);
			var tempStr = "";
			for(var i=0; i<_deviceID.length; i++){
				tempStr += '?, '
				queryArr.push(_deviceID[i]);
			}
			tempStr = tempStr.substring(0, tempStr.length-2);
			tempStr = "(" + tempStr + ")";
			SQL_UPDATEUPLOADSTATUSEX += tempStr;
			tx.executeSql(SQL_UPDATEUPLOADSTATUSEX, queryArr, function(){_successFunc("上传记录成功")}, WebDB.errorDB);
		}
	},
	
	getLocalTask: function(_date, _successFunc){
		var resultArr = [];
		if(this.db != null){
			this.db.transaction(getLocalTaskHandler, WebDB.errorDB);
		}
		
		function getLocalTaskHandler(tx){
			tx.executeSql(WebDB.SQL_GETLOCALTASK, [_date], successFunc, WebDB.errorDB);
		}
		
		function successFunc(tx, results){
			var len = results.rows.length;
			for(var i=0; i<len; i++){
				var resultObj = new Object();
				resultObj.sequence = results.rows.item(i).sequence;
				resultObj.deviceID = results.rows.item(i).deviceID;
				resultObj.address = results.rows.item(i).address;
				resultObj.placeName = results.rows.item(i).placeName;
				resultObj.lat = results.rows.item(i).lat;
				resultObj.lng = results.rows.item(i).lng;
				resultArr.push(resultObj);
			}
			_successFunc(resultArr);
		}
	},
	
	getLocalUndoneTask: function(_date, _successFunc){
		var resultArr = [];
		if(this.db != null){
			this.db.transaction(getLocalUndoneTaskHandler, WebDB.errorDB);
		}
		
		function getLocalUndoneTaskHandler(tx){
			tx.executeSql(WebDB.SQL_GETLOCALUNDONETASK, [_date], successFunc, WebDB.errorDB);
		}
		
		function successFunc(tx, results){
			var len = results.rows.length;
			for(var i=0; i<len; i++){
				var resultObj = new Object();
				resultObj.sequence = results.rows.item(i).sequence;
				resultObj.deviceID = results.rows.item(i).deviceID;
				resultObj.address = results.rows.item(i).address;
				resultObj.placeName = results.rows.item(i).placeName;
				resultObj.lat = results.rows.item(i).lat;
				resultObj.lng = results.rows.item(i).lng;
				resultArr.push(resultObj);
			}
			_successFunc(resultArr);
		}
	},
	
	errorDB: function(error){
		UtilFunc.msgAlert('提示', '数据库操作错误:' + error.message);
	}
	
}


/**
 * 功能：修改 window.setTimeout，使之可以传递参数和对象参数 
 * 使用方法：setTimeout(回调函数,时间,参数1,,参数n)  
 */
var __sto = setTimeout;     
window.setTimeout = function(callback,timeout,param){     
    var args = Array.prototype.slice.call(arguments,2);     
    var _cb = function(){     
        callback.apply(null,args);     
    }     
    __sto(_cb,timeout);     
} 


Ext.application({
    name: 'GasGISApp',
	
    controllers: ['Application', 'Main', 'MapController', 'Sync', 'Search', 'Record', 'Settings'],
    views: ['LoginView', 'MainView', 'MapView', 'POIResultView', 'RouteResultView', 'SyncView',
    		'SearchView', 'RecordView', 'IPSettingsView', 'SettingsView'],
    models: ['User', 'POIResult', 'RouteResult', 'Tasks', 'Task', 'Record'],
    stores: ['UserStore', 'POIResultStore', 'RouteResultStore', 'TasksStore', 'TaskStore', 'RecordStore'],
    
    phoneStartupScreen: 'resources/loading/Homescreen.jpg',
    tabletStartupScreen: 'resources/loading/Homescreen~ipad.jpg'
    
    //部署Phonegap时需将其注释
    //launch: function(){
    //	WebDB.initDatabase();
    //	Ext.Viewport.add(Ext.create('GasGISApp.view.LoginView'));
    //}
});

//function myTestPlugin(){
//	
//}
//
//myTestPlugin.prototype.activityStart = function(){
//	cordova.exec(null, null, "Notification", "activityStart", ["Busy", "Please wait..."]);
//}
//
//cordova.addConstructor(function(){
//	if(!window.plugins){
//		window.plugins = {};
//	}
//	window.plugins.myTestPlugin = new myTestPlugin();
//})
