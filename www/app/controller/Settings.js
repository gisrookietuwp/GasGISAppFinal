Ext.define('GasGISApp.controller.Settings',{
	extend: 'Ext.app.Controller',
	
	views:['SettingsView'],
	
	config: {
		refs: {
			settingsView: {
				selector: 'settingsview',
				xtype: 'settingsview',
				autoCreate: true
			},
			settingsPanel: 'panel[id = settingsPanel]',
			xjSettingsFieldset: 'fieldset[id = xjSettingsFieldset]',
			cameraSettingsFieldset: 'fieldset[id = cameraSettingsFieldset]',
			userName: 'textfield[id = userName]',
			userPwd: 'textfield[id = userPwd]',
			groupName: 'textfield[id = groupName]',
			regionSelectField: 'selectfield[id = regionSelectField]',
			deviceSelectField: 'selectfield[id = deviceSelectField]',
			backMainBtn: 'button[id = backMainBtn_settings]'
		},
		
		control:{
			settingsView: {
				'onBack': 'backToMain'
			},
			settingsPanel: {
				'initialize': 'initSettingsPanel'
			},
			backMainBtn: {
				'tap': 'backToMain'
			}
		},
		
		routes: {
			'settingsview_route/:_direction': 'showSettingsView'
		}
	},
	
	initSettingsPanel: function(_panel){
		var win_width = Global.screenWidth < 500 ? Global.screenWidth-20 : 500
		this.getXjSettingsFieldset().setWidth(win_width);
		this.getCameraSettingsFieldset().setWidth(win_width);
		_panel.addListener('painted', function(){
			var userStore = Ext.getStore('UserStore');
			userStore.load();
			var userModel = userStore.last();
			this.getUserName().setValue(userModel.get('groupID'));
			this.getUserPwd().setValue(userModel.get('groupPwd'));
			this.getGroupName().setValue(userModel.get('groupName'));
			
			var regionDictObj = Ext.decode(window.localStorage.getItem('regionDict'));
			var deviceDictObj = Ext.decode(window.localStorage.getItem('deviceDict'));
			this.getRegionSelectField().setOptions(regionDictObj);
			this.getDeviceSelectField().setOptions(deviceDictObj);
			this.getRegionSelectField().setValue(userModel.get('regionDM'));
			this.getDeviceSelectField().setValue(userModel.get('deviceDM'));
		}, this);
	},
	
	backToMain: function(){
		this.redirectTo('mainview_route/right');
	},
	
	showSettingsView: function(_direction){
		Ext.Viewport.animateActiveItem(this.getSettingsView(), {
			type: 'slide',
			direction: _direction
    	})
	}
})