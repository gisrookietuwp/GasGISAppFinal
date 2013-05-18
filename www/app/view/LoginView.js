Ext.define('GasGISApp.view.LoginView', {
			extend : 'Ext.Container',
			id: 'loginViewContainer',
			xtype : 'loginview',
			config : {
				fullscreen : true,
				width : '100%',
				height : '100%',
				layout : {
					type : 'vbox',
					align : 'center',
					pack : 'center'
				},
				items : [{
							xtype : 'toolbar',
							docked : 'top',
							ui : 'dark',
							title : '<p>' + CONSTANT.APPTITLE + '</p>'
						}, {
							xtype : 'fieldset',
							id : 'login',
							title : '系统登录',
							instructions : '请注意区分大小写',
							margin : '-60 0 0 0',
							width : 300,
							minWidth : 300,
							defaults : {
								width : '100%'
							},
							items : [{
										xtype : 'textfield',
										id : 'loginName',
										label : '帐号',
										required : true,
										useClearIcon : true
									}, {
										xtype : 'passwordfield',
										id : 'loginPwd',
										label : '密码',
										required : true,
										useClearIcon : true
									}, {
										xtype : 'checkboxfield',
										id : 'loginInfo',
										label : '是否记住登录信息',
										labelWidth : 240
									}]
						}, {
							xtype : 'button',
							id : 'loginAction',
							text : '登 录',
							width : 200,
							margin : '20 0 0 0',
							ui : 'confirm'
						}, {
							xtype : 'toolbar',
							docked : 'bottom',
							ui : 'dark',
							items : [{
										xtype : 'spacer'
									}, {
										xtype : 'button',
										id: 'ipSettings',
										iconCls : 'settings',
										iconMask : true
									}
							// {
							// xtype : 'button',
							// id: 'btn_ExitApp',
							// iconCls: 'power_on',
							// iconMask: true
							// }
							]
						}]
			}
		})