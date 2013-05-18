Ext.define('GasGISApp.controller.Application',{
	extend: 'Ext.app.Controller',
	
	views:['LoginView', 'IPSettingsView'],
	
	config: {
		refs: {
			ipSettingsView: {
				selector: 'ipsettingsview',
				xtype: 'ipsettingsview',
				autoCreate: true
			},
			
//			btnExitApp: 'button[id = btn_ExitApp]',
			loginViewContainer: 'loginview[id = loginViewContainer]',
			loginAction: 'button[id = loginAction]',
			loginName: 'textfield[id = loginName]',
			loginPwd: 'passwordfield[id = loginPwd]',
			loginInfo: 'checkboxfield[id = loginInfo]',
			login: 'fieldset[id = login]',
			
			ipSettings: 'button[id = ipSettings]',
			ipSettingsCancelBtn: 'button[id = ipSettingsCancelBtn]',
			ipSettingsConfirmBtn: 'button[id = ipSettingsConfirmBtn]',
			ipAddress: 'textfield[id = ipAddress]',
			port: 'textfield[id = port]'
		},
		control: {
//			btnExitApp: {
//				'tap': 'exitApp'
//			},
			
			loginViewContainer: {
				'onBack': 'backBtnHandler'
			},
			loginAction: {
				'tap': 'loginAction'
			},
			login: {
				'initialize': 'initLoginFieldSet'
			},
			ipSettings: {
				'tap': 'showIpInfoWin'
			},
			ipSettingsCancelBtn: {
				'tap': 'closeIpInfoWin'
			},
			ipSettingsConfirmBtn: {
				'tap': 'confirmIpInfoWin'
			}
		},
		isRemLoginInfo: null,
		ipInfoWin: null
	},
	
	init: function(){
		Global.screenWidth = window.screen.width;
		Global.screenHeight = window.screen.height;
		if(window.localStorage.getItem('ipAddress') != null){
			Global.ipAddress = 'http://' + window.localStorage.getItem('ipAddress');
		}
		if(window.localStorage.getItem('port') != null){
			Global.port = window.localStorage.getItem('port');
		}
		//Phonegap代码
		document.addEventListener("deviceready", this.deviceready, false);
	},
	
	deviceready: function(){
		document.addEventListener('backbutton', UtilFunc.onBackKeyDown, true);
		Ext.Viewport.add(Ext.create('GasGISApp.view.LoginView'));
		navigator.splashscreen.hide();
		
		WebDB.initDatabase();
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
	
//	exitApp: function(){
//		UtilFunc.onBackKeyDown();
//	},
	
	showIpInfoWin: function(){
		if(this.getIpInfoWin() == null){
			var win_width = Global.screenWidth < 500 ? Global.screenWidth-20 : 500
			this.setIpInfoWin(this.getIpSettingsView());
			this.getIpInfoWin().setWidth(win_width);
			Ext.Viewport.add(this.getIpInfoWin());
		}
		this.getIpAddress().setValue(Global.ipAddress.substring(7));
		this.getPort().setValue(Global.port);
		this.getIpInfoWin().show();
	},
	
	closeIpInfoWin: function(){
		this.getIpInfoWin().hide();
	},
	
	confirmIpInfoWin: function(){
		var ipReg = /^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
		var portReg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
		if(ipReg.test(this.getIpAddress().getValue()) && (portReg.test(this.getPort().getValue()) || Ext.String.trim(this.getPort().getValue())=='')){
			window.localStorage.setItem('ipAddress', this.getIpAddress().getValue());
			window.localStorage.setItem('port', this.getPort().getValue());
			Global.ipAddress = 'http://' + this.getIpAddress().getValue();
			Global.port = this.getPort().getValue();
			this.closeIpInfoWin();
		}
		else{
			UtilFunc.msgAlert('提示', 'IP地址或端口信息错误,请重新输入');
		}
	},
	
	initLoginFieldSet: function(_fieldset){
		var fs_width = Global.screenWidth < 500 ? Global.screenWidth-50 : 500;
		_fieldset.setWidth(fs_width);
		
		this.setIsRemLoginInfo(window.localStorage.getItem("isRemLoginInfo"));
		if(this.getIsRemLoginInfo() != null && this.getIsRemLoginInfo() === "true"){
			var userStore = Ext.getStore('UserStore');
			userStore.load();
			var userModel = userStore.last();
			this.getLoginName().setValue(userModel.get('groupID'));
			this.getLoginPwd().setValue(userModel.get('groupPwd'));
			this.getLoginInfo().setChecked(true);
		}
	},
	
	loginAction: function(){
//		this.redirectTo('mainview_route/left');
		
		if(Ext.isEmpty(this.getLoginName().getValue())){
			UtilFunc.msgAlert('提示', '帐号名不能为空');
			return;
		}
		if(Ext.isEmpty(this.getLoginPwd().getValue())){
			UtilFunc.msgAlert('提示', '密码不能为空');
			return;
		}
		UtilFunc.showLoadMask('用户验证中,请稍候...');
		
		var userName = this.getLoginName().getValue();
		var pwd_MD5 = hex_md5(this.getLoginPwd().getValue());
		
		Ext.Ajax.request({
			url: Global.ipAddress + ":" + Global.port + CONSTANT.LOGIN_URL,
			method: 'POST',
			disableCaching: true,
			scope: this,
			params: {
				'userName': userName,
				'userPwd': pwd_MD5
			},
			success: function(response){
				UtilFunc.hideLoadMask();
				if(response.status == 200){
					var loginInfo = Ext.decode(response.responseText);
					if(loginInfo.success){
						if(this.getLoginInfo().isChecked()){
							window.localStorage.setItem("isRemLoginInfo", true);
						}
						else{
							window.localStorage.setItem("isRemLoginInfo", false);
						}
						loginInfo.loginInfo[0].groupPwd = this.getLoginPwd().getValue();
						var userStore = Ext.getStore('UserStore');
						userStore.load();
						if(userStore.last() != undefined){
							userStore.removeAll();
							userStore.sync();
							userStore.add(loginInfo.loginInfo);
						}
						else{
							userStore.add(loginInfo.loginInfo);
						}
						userStore.sync();
						var regionDict = Ext.encode(loginInfo.regionDict);
						var deviceDict = Ext.encode(loginInfo.deviceDict);
						window.localStorage.setItem('authID', loginInfo.authID);
						window.localStorage.setItem('date', loginInfo.date);
						window.localStorage.setItem('regionDict', regionDict);
						window.localStorage.setItem('deviceDict', deviceDict);
//						Global.authID = loginInfo.authID;
						this.redirectTo('mainview_route/left');
					}else{
						UtilFunc.msgAlert('提示', loginInfo.msg);
					}
				}
				else{
					UtilFunc.msgAlert('提示', '连接失败, 请检查网络连接');
				}
			},
			failure: function(response){
				UtilFunc.hideLoadMask();
				if(response.status == 500){
					UtilFunc.msgAlert('提示', '服务器端程序错误, 请稍候再试');
				}
				else{
					UtilFunc.msgAlert('提示', '连接超时, 请稍候再试');
				}
			}
		})
		
	}
})