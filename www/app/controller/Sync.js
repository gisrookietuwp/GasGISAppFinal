Ext.define('GasGISApp.controller.Sync',{
	extend: 'Ext.app.Controller',
	views:['SyncView'],
	config: {
		refs: {
			syncView: {
				selector: 'syncview',
				xtype: 'syncview',
				autoCreate: true
			},
			backMainBtn: 'button[id = backMainBtn_sync]',
			downloadPanel: 'panel[id = downloadPanel]',
			tasksList: 'selectfield[id = tasksList]',
			taskDownloadBtn: 'button[id = taskDownloadBtn]',
			taskInfoList: 'list[id = taskInfoList]',
			
			uploadPanel: 'panel[id = uploadPanel]',
			recordInfoList: 'list[id = recordInfoList]',
			singleUploadBtn: 'button[id = singleUploadBtn]',
			allUploadBtn: 'button[id = allUploadBtn]'
		},
		control:{
			syncView: {
				'onBack': 'backToMain'
			},
			backMainBtn: {
				'tap': 'backToMain'
			},
			downloadPanel: {
				'initialize': 'initTaskList'
			},
			taskDownloadBtn: {
				'tap': 'downloadTask'
			},
			taskInfoList: {
//				'itemdoubletap': 'showMenu'
			},
			uploadPanel: {
				'initialize': 'initRecordList'
			},
			recordInfoList: {
				'itemtap': 'chooseRecordUploadObj'
			},
			singleUploadBtn: {
				'tap': 'uploadSingleRecord'
			},
			allUploadBtn: {
				'tap': 'uploadAllRecord'
			}
		},
		routes: {
			'syncview_route/:_direction': 'showSyncView'
		},
		regionType: null,
		deviceType: null,
		userId: null,
		actionSheet: null,
		taskIndex: null,
		isInit: null,
		isUploadInit: null,
		recordUploadObj: null
	},
	
	showMenu: function(_list, _index, _target, _record){
		this.setTaskIndex(_index);
		if(this.getActionSheet() == null){
			var as = Ext.create('Ext.ActionSheet',{
				showAnimation : {
					type : 'slideIn',
					duration : 250
				},
				hideAnimation : {
					type : 'slideOut',
					duration : 250
				},
				items:[{
					text: '地图',
					scope: this,
					handler: function(){
						this.getActionSheet().hide();
						this.redirectTo('mapview_route/device_'+this.getTaskIndex()+'/left');
					}
				},
				{
					text: '录入',
					scope: this,
					handler: function(){
						var _scope = this;
						this.getActionSheet().hide();
						window.setTimeout(function(){
							_scope.redirectTo('recordview_route/sync/'+_record.getData().deviceID +'/left')}, 500);
						}
//						console.log(this.getTaskIndex());
				},
				{
					text: '取消',
					ui: 'confirm',
					scope: this,
					handler: function(){
						this.getActionSheet().hide();
					}
				}]
			});
			this.setActionSheet(as);
			Ext.Viewport.add(this.getActionSheet());
		}
		this.getActionSheet().show();
	},
	
	chooseRecordUploadObj: function(_list, _index, _target, _record){
		this.setRecordUploadObj(_record);
	},
	
	
	uploadLocalFile: function(_localFileURL, _deviceID){
		var options = new FileUploadOptions();
		options.fileKey = 'file';
		options.fileName = _localFileURL.substr(_localFileURL.lastIndexOf('/') + 1);
		options.mimeType = "text/plain";
		options.params = {
			UploadType: "UPLOAD_ALL"
		};
		options.headers = {
			Authorization: 	window.localStorage.getItem('authID')				
		};
		
		var userStore = Ext.getStore('UserStore');
		userStore.load();
		var userModel = userStore.last();
		var date = window.localStorage.getItem('date');
		var tasks_url = Ext.String.format(CONSTANT.RecordUpload_URL,userModel.get('groupID'),
		date.split('-')[0], date.split('-')[1], date.split('-')[2], userModel.get('deviceDM'));
		
		var ft = new FileTransfer();
		ft.upload(_localFileURL, encodeURI(Global.ipAddress + ":" + Global.port + tasks_url),
			function(result){
				if(result.responseCode == 200){
					WebDB.updateUploadStatusEx(date, _deviceID, function(_context){
						UtilFunc.msgAlert('提示', _context);
						var recordStore = Ext.getStore('RecordStore');
						recordStore.removeAll();
					});
				}
			},
			function(error){
				if(error.http_status == 500){
					UtilFunc.msgAlert('提示', '巡检记录上传失败');	
				}
			},
			options);
	},
	
	writeToLocalFile: function(_jsonArrStr, _deviceID){
		var _scope = this;
		var localFileName = Ext.Date.format(new Date(), 'YmdHis');
		window.requestFileSystem(LocalFileSystem.TEMPORARY, 0, function(fileSystem){
			newFuckFile = fileSystem.root.getFile(localFileName+".txt", {create:true, exclusive : false}, function(fileEntry){
				var localFileURL = fileEntry.fullPath;
				fileEntry.createWriter(function(fileWriter){
					fileWriter.onwrite = function(evt) {
						_scope.uploadLocalFile(localFileURL, _deviceID);
				    };					
		    		fileWriter.write(_jsonArrStr);
		    	})
			});
		}, function(error){
			alert(error.code);
		});
	},
	
	getLocalPicByBase64: function(_paramsArr, _picIndexArr, _picURLArr,_index){
		var _scope = this;
		if(_index < _picURLArr.length){
			window.resolveLocalFileSystemURI(_picURLArr[_index], function(fileEntry){
				fileEntry.file(function(file){
					var fileReader = new FileReader();
					fileReader.onload = function(e){
		    			_paramsArr[_picIndexArr[_index]].PicContent = e.target.result;
		    			_index++;
		    			_scope.getLocalPicByBase64(_paramsArr, _picIndexArr, _picURLArr, _index);
	//	    			mainFileWriter.write(e.target.result);
		    		}
		    		fileReader.readAsDataURL(file);
				})
			},function(error){
				alert(error.code);
			});
		}
		else{
			var jsonArrStr = "";
			var deviceID = [];
			for(var i=0; i<_paramsArr.length; i++){
				deviceID[i] = _paramsArr[i].DeviceID;
				var jsonObjStr = Ext.JSON.encode(_paramsArr[i]);
				jsonArrStr += jsonObjStr + ",";
			}
			jsonArrStr = jsonArrStr.substring(0, jsonArrStr.length-1);
			jsonArrStr = "[" + jsonArrStr + "]";
			
			_scope.writeToLocalFile(jsonArrStr, deviceID);
		}
	},
	
	uploadAllRecord: function(){
		
		var _scope = this;
		var userStore = Ext.getStore('UserStore');
		userStore.load();
		var userModel = userStore.last();
		var recordStore = _scope.getRecordInfoList().getStore();
		var date = window.localStorage.getItem('date');
		
		var paramsArr = [];
		var picIndexArr = [];
		var picURLArr = [];
		var index = 0;
		for(var i=0; i<recordStore.getCount(); i++){
			var data = recordStore.getAt(i).getData(true);
			var picPath = data.picPath;
			paramsArr[i] = {
				GroupID: userModel.get('groupID'),
				DeviceID: data.deviceID,
				ReportDate: data.reportDate,
				Position: data.lng + '#' + data.lat,
				EventType: data.eventType,
				PicPath: '',
				PicContent: '',
				Loop1: data.loop1_value1 + '#' + data.loop1_value2 + '#' + data.loop1_value3 + '#' + data.loop1_value4,
				Loop2: data.loop2_value1 + '#' + data.loop2_value2 + '#' + data.loop2_value3 + '#' + data.loop2_value4
			};
			if(picPath != ''){
				paramsArr[i].PicPath = data.deviceID + "_" +date.split('-')[0] + date.split('-')[1] + date.split('-')[2];
				picIndexArr[index] = i;
				picURLArr[index] = picPath;
				index++;
			}
			else{
				paramsArr[i].PicPath = picPath;
			}
		}
		
		_scope.getLocalPicByBase64(paramsArr, picIndexArr, picURLArr, 0);
		
	},
	
	uploadSingleRecord: function(){
		var _scope = this;
		var record = this.getRecordUploadObj();
		if(record != null){
			var data = record.getData();
			var userStore = Ext.getStore('UserStore');
			userStore.load();
			var userModel = userStore.last();
			var date = window.localStorage.getItem('date');
			var tasks_url = Ext.String.format(CONSTANT.RecordUpload_URL, userModel.get('groupID'),
				date.split('-')[0], date.split('-')[1], date.split('-')[2], userModel.get('deviceDM'));
			
			var picPath = data.picPath;
			var params = {
				UploadType: "UPLOAD_SINGLE",
				GroupID: userModel.get('groupID'),
				DeviceID: data.deviceID,
				ReportDate: data.reportDate,
				Position: data.lng + '#' + data.lat,
				EventType: data.eventType,
				PicPath: data.deviceID + "_" +date.split('-')[0] + date.split('-')[1] + date.split('-')[2],
				Loop1: data.loop1_value1 + '#' + data.loop1_value2 + '#' + data.loop1_value3 + '#' + data.loop1_value4,
				Loop2: data.loop2_value1 + '#' + data.loop2_value2 + '#' + data.loop2_value3 + '#' + data.loop2_value4
			};
			
			if(picPath == ''){
				params.PicPath = picPath;
//				window.plugins.myTestPlugin.activityStart();
				Ext.Ajax.request({
					url: Global.ipAddress + ":" + Global.port + tasks_url,
					scope: _scope,
					method: 'POST',
					params: params,
					disableCaching: true,
					headers:{
						'Authorization': window.localStorage.getItem('authID')
					},
					success: function(response){
						if(response.status == 200){
							WebDB.updateUploadStatus(date, data.deviceID, function(_context){
								UtilFunc.msgAlert('提示', _context);
								_scope.updateRecordList(_scope, record);
							});
						}
					},
					failure: function(response){
						if(response.status == 500){
							UtilFunc.msgAlert('提示', response.responseText);
						}
					}
				});
			}
			else{
				var options = new FileUploadOptions();
				options.fileKey = 'file';
				options.fileName = picPath.substr(picPath.lastIndexOf('/') + 1);
				options.mimeType = "image/jpeg";
				options.params = params;
				options.headers = {
					Authorization: 	window.localStorage.getItem('authID')				
				}
				
				var ft = new FileTransfer();
				ft.upload(picPath, encodeURI(Global.ipAddress + ":" + Global.port + tasks_url),
					function(result){
						if(result.responseCode == 200){
							WebDB.updateUploadStatus(date, data.deviceID, function(_context){
								UtilFunc.msgAlert('提示', _context);
								_scope.updateRecordList(_scope, record);
							});
						}
					},
					function(error){
						if(error.http_status == 500){
							UtilFunc.msgAlert('提示', '巡检记录上传失败');	
						}
					},
					options);	
			}
		}
		else{
			UtilFunc.msgAlert('提示', '请先选择需要上传的巡检记录');
		}
	},
	
	downloadTask: function(){
		var taskId = this.getTasksList().getValue();
		var tasks_url = Ext.String.format(CONSTANT.TaskInfo_URL, this.getRegionType(), this.getDeviceType(), taskId);
		
		Ext.Ajax.request({
			url: Global.ipAddress + ":" + Global.port + tasks_url,
			scope: this,
			method: 'GET',
			disableCaching: true,
			headers:{
				'Authorization': window.localStorage.getItem('authID')
			},
			success: function(response){
//				alert(response.responseText);
				if(response.status == 200){
					var jsonObj = Ext.decode(response.responseText);
					var taskStore = Ext.getStore('TaskStore');
					taskStore.setData(jsonObj);
					var _scope = this;
					WebDB.insertTask(jsonObj, function(){
						_scope.getTaskInfoList().setStore(taskStore);
						_scope.getTasksList().disable();
						_scope.getTaskDownloadBtn().disable();
						UtilFunc.msgAlert('提示', '下载完成！');
					})
				}
			},
			failure: function(response){
				if(response.status == 500){
					UtilFunc.msgAlert('提示', response.responseText);
				}
			}
		})
	},
	
	updateRecordList: function(_scope, _record){
		var recordStore = Ext.getStore('RecordStore');
		recordStore.remove(_record);
		_scope.setRecordUploadObj(null);
	},
	
	initRecordList: function(_panel){
		var _scope = this;
		var date = window.localStorage.getItem('date');
		_panel.addListener('painted', function(){
			window.setTimeout(getRecordList, 500);
		});
		
		function getRecordList(){
			if(_scope.getIsUploadInit()){
				_scope.setIsUploadInit(false);
				_scope.setRecordUploadObj(null);
				if(_scope.getRecordInfoList().hasSelection()){
					_scope.getRecordInfoList().deselectAll();
				}
				WebDB.getRecord(date, function(jsonObj){
					if(jsonObj.length > 0){
						var recordStore = Ext.getStore('RecordStore');
						recordStore.setData(jsonObj);
						_scope.getRecordInfoList().setStore(recordStore);
						_scope.getSingleUploadBtn().enable();
						_scope.getAllUploadBtn().enable();
					}
					else{
						UtilFunc.msgAlert('提示', '尚没有巡检信息需要上传');
						_scope.getSingleUploadBtn().disable();
						_scope.getAllUploadBtn().disable();
					}
				})
			}
		}
	},
	
	initTaskList: function(_panel){
		var _scope = this;
		var date = window.localStorage.getItem('date');
		
		var userStore = Ext.getStore('UserStore');
		userStore.load();
		var userModel = userStore.last();
		_scope.setRegionType(userModel.get('regionDM'));
		_scope.setDeviceType(userModel.get('deviceDM'));
		_scope.setUserId(userModel.get('groupID'));
		var tasks_url = Ext.String.format(CONSTANT.TasksList_URL, _scope.getUserId(), date.split('-')[0], date.split('-')[1], date.split('-')[2]);
		Ext.Ajax.request({
			url: Global.ipAddress + ":" + Global.port + tasks_url,
			scope: _scope,
			method: 'GET',
			disableCaching: true,
			headers:{
				'Authorization': window.localStorage.getItem('authID')
			},
			success: function(response){
				if(response.status == 200){
					var jsonObj = Ext.decode(response.responseText)
					var tasksStore = Ext.getStore('TasksStore');
					tasksStore.setData(jsonObj);
					this.getTasksList().setStore(tasksStore);
				}
			},
			failure: function(response){
				if(response.status == 500){
					UtilFunc.msgAlert('提示', response.responseText);
				}
			}
		});
		
		_panel.addListener('painted',function(){
			if(_scope.getIsInit()){
				window.setTimeout(checkDownloadTask, 500);	
			}
		});
		
		function checkDownloadTask(){
			WebDB.getLocalTask(date, function(jsonObj){
				if(jsonObj.length > 0){
					_scope.getTasksList().disable();
					_scope.getTaskDownloadBtn().disable();
					var taskStore = Ext.getStore('TaskStore');
					taskStore.setData(jsonObj);
					_scope.getTaskInfoList().setStore(taskStore);
				}
			});
		}
	},
	
	backToMain: function(){
		if(this.getTaskInfoList().hasSelection()){
			this.getTaskInfoList().deselectAll();
		}
		this.redirectTo('mainview_route/right');
	},
	
	showSyncView: function(_direction){
		if(_direction == 'right'){
			this.setIsInit(false);
		}else{
			this.setIsInit(true);
		}
		Ext.Viewport.animateActiveItem(this.getSyncView(), {
			type: 'slide',
			direction: _direction
    	});
    	this.setIsUploadInit(true);
	}
})