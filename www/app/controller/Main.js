Ext.define('GasGISApp.controller.Main',{
	extend: 'Ext.app.Controller',
	
	views:['MainView'],
	
	config: {
		refs: {
			menuBtn: 'panel[action = menuBtn]',
			menuBtnGroup: 'panel[id = menuBtnGroup]',
			mainView: {
				selector: 'mainview',
				xtype: 'mainview',
				autoCreate: true
			}
		},
		
		control:{
			mainView:{
				'onBack': 'backBtnHandler'
			},
			menuBtn:{
				'initialize': 'initMenuBtn'
			},
			menuBtnGroup:{
				'initialize': 'initMenuBtnGroup'
			}
		},
		
		routes: {
			'mainview_route/:_direction': 'showMainView'
		}
	},
	
	backBtnHandler: function(){
		navigator.notification.confirm("是否要退出应用?", confirmCallback, "退出应用", "取消,退出");
		function confirmCallback(index){
			switch (index){
				case 1: break;
    			case 2: navigator.app.exitApp();break;
    		}
		}
	},
	
	initMenuBtn: function(_menuBtn){
		var _scope = this;
		Ext.get(_menuBtn.getId()).dom.ontouchstart = function(){navigator.notification.vibrate(40);_menuBtn.setCls('menuBtnContainer_pressed')};
		Ext.get(_menuBtn.getId()).dom.ontouchend = function(){_menuBtn.setCls('menuBtnContainer');_scope.actionHandler(_menuBtn.getId());};
		
//		var _scope = this;
//		Ext.get(_menuBtn.getId()).dom.onmouseup = function(){_menuBtn.setCls('menuBtnContainer'); _scope.actionHandler(_menuBtn.getId())};
//		Ext.get(_menuBtn.getId()).dom.onmousedown = function(){_menuBtn.setCls('menuBtnContainer_pressed')};
	},
	
	actionHandler: function(_menuBtnID){
		var action = _menuBtnID.split("_")[1];
		switch(action){
			case "map": this.redirectTo('mapview_route/default/left');break;
			case "sync": this.redirectTo('syncview_route/left');break;
			case "search": this.redirectTo('searchview_route/left');break;
			case "record": this.redirectTo('recordview_route/default/default/left');break;
			case "settings": this.redirectTo('settingsview_route/left');break;
		}
	},
	
	initMenuBtnGroup: function(_menuBtnGroup){
		var marginX = (Global.screenWidth - 240)/2;
		var marginY = (Global.screenHeight - 450)/2;
		_menuBtnGroup.setMargin(marginY + ' '+ marginX + ' ' + marginY + ' '+ marginX);
	},
	
	showMainView: function(_direction){
//		this.getApplication().getHistory().add(
//			Ext.create('Ext.app.Action', {
//				url: 'login_route'
//			}
//		));
		Ext.Viewport.animateActiveItem(this.getMainView(), {
			type: 'slide',
			direction: _direction
    	})
	}
})