Ext.define('GasGISApp.view.IPSettingsView', {
			extend : 'Ext.Panel',
			xtype : 'ipsettingsview',
			config : {
				baseCls : 'customWin',
				centered : true,
				modal : true,
				items : [{
							xtype : 'fieldset',
							title : '网络连接信息',
							items : [{
										xtype : 'textfield',
										id: 'ipAddress',
										label : 'IP地址',
										required : true,
										useClearIcon : true
									}, {
										xtype : 'textfield',
										id: 'port',
										label : '端口号',
										useClearIcon : true
									}]
						}, {
							xtype : 'panel',
							margin : '20 0 0 0',
							layout : {
								type : 'hbox',
								pack : 'center'
							},
							items : [{
										xtype : 'button',
										id : 'ipSettingsConfirmBtn',
										width : 100,
										ui : 'action',
										margin : '0 10 10 0',
										text : '确定'
									}, {
										xtype : 'button',
										id : 'ipSettingsCancelBtn',
										width : 100,
										ui : 'action',
										margin : '0 0 10 10',
										text : '取消'
									}]
						}]
			}
		})