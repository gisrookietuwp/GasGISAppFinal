Ext.define('GasGISApp.controller.Search',{
	extend: 'Ext.app.Controller',
	views:['SearchView'],
	config: {
		refs: {
			searchView: {
				selector: 'searchview',
				xtype: 'searchview',
				autoCreate: true
			},
			backMainBtn: 'button[id = backMainBtn_search]',
			undoneTaskInfoList: 'list[id = undoneTaskInfoList]'
		},
		control:{
			searchView: {
				'onBack': 'backToMain'
			},
			backMainBtn: {
				'tap': 'backToMain'
			},
			undoneTaskInfoList: {
				'initialize': 'initUndoneTaskList',
				'itemdoubletap': 'showMenu'
			}
		},
		routes: {
			'searchview_route/:_direction': 'showSearchView'
		},
		actionSheet: null,
		taskIndex: null,
		deviceID: null,
		isInit: null
	},
	
	initUndoneTaskList: function(_list){
		var _scope = this;
		var date = window.localStorage.getItem('date');
		
		_list.addListener('painted',function(){
			if(_scope.getIsInit()){
				window.setTimeout(getLocalUndoneTask, 500);
			}
		});
		
		function getLocalUndoneTask(){
			WebDB.getLocalUndoneTask(date, function(jsonObj){
				if(jsonObj.length > 0){
					var taskStore = Ext.getStore('TaskStore');
					taskStore.setData(jsonObj);
					_scope.getUndoneTaskInfoList().setStore(taskStore);
				}
			});
		}
	},
	
	showMenu: function(_list, _index, _target, _record){
		this.setTaskIndex(_index);
		this.setDeviceID(_record.getData().deviceID);
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
						this.redirectTo('mapview_route/device_search_'+this.getTaskIndex()+'/left');
					}
				},{
					text: '录入',
					scope: this,
					handler: function(){
						var _scope = this;
						this.getActionSheet().hide();
						window.setTimeout(function(){
							_scope.redirectTo('recordview_route/search/'+ _scope.getDeviceID() +'/left')}, 500);
//						console.log(this.getTaskIndex());
					}
				},{
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
	
	backToMain: function(){
		if(this.getUndoneTaskInfoList().hasSelection()){
			this.getUndoneTaskInfoList().deselectAll();	
		}
		this.redirectTo('mainview_route/right');
	},
	
	showSearchView: function(_direction){
		if(_direction == 'right'){
			this.setIsInit(false);
		}else{
			this.setIsInit(true);
		}
		Ext.Viewport.animateActiveItem(this.getSearchView(), {
			type: 'slide',
			direction: _direction
    	})
	}
})