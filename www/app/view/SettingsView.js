Ext.define('GasGISApp.view.SettingsView', {
	extend : 'Ext.Container',
	xtype : 'settingsview',
	config : {
		fullscreen : true,
		layout : 'fit',
		items : [{
					xtype : 'titlebar',
					docked : 'top',
					ui : 'dark',
					title : '<p>' + CONSTANT.SETTINGSTITLE + '</p>',
					items : [{
								text : '返回',
								align : 'left',
								id : 'backMainBtn_settings',
								ui : 'back'
							}]
				}, {
					xtype : 'panel',
					scrollable : {
						direction : 'vertical',
						directionLock : true
					},
					layout : {
						type : 'vbox',
						align : 'center',
						pack : 'center'
					},
					id : 'settingsPanel',
					items : [{
								xtype : 'fieldset',
								id : 'xjSettingsFieldset',
								title : '巡检信息设置：',
								items : [{
											xtype : 'textfield',
											id : 'userName',
											readOnly : true,
											label : '帐号'
										}, {
											xtype : 'textfield',
											id : 'groupName',
											label : '组名'
										}, {
											xtype : 'textfield',
											id : 'userPwd',
											label : '密码'
										}, {
											xtype : 'selectfield',
											label : '所属站点',
											id : 'regionSelectField',
											usePicker : false,
											displayField : 'regionMC',
											valueField : 'regionDM',
											defaultTabletPickerConfig : {
												'minHeight' : '250px'
											}
										}, {
											xtype : 'selectfield',
											label : '设备类型',
											id : 'deviceSelectField',
											usePicker : false,
											displayField : 'deviceMC',
											valueField : 'deviceDM',
											defaultTabletPickerConfig : {
												'minHeight' : '200px'
											}
										}]

							}, {
								xtype : 'fieldset',
								id : 'cameraSettingsFieldset',
								title : '相机设置：',
								items : [{
											xtype : 'selectfield',
											label : '照片尺寸',
											usePicker : false,
											defaultTabletPickerConfig : {
												'minHeight' : '250px'
											},
											options : [{
														text : '640*384',
														value : '640*384'
													}, {
														text : '(1M) 1280*768',
														value : '1280*768'
													}, {
														text : '(3M) 2048*1216',
														value : '2048*1216'
													}, {
														text : '(5M) 2592*1552',
														value : '2592*1552'
													}]
										}, {
											xtype : 'sliderfield',
											label : '照片质量',
											value : 50,
											minValue : 0,
											maxValue : 100
										}]
							}, {
								xtype : 'panel',
								items : [{
											xtype : 'button',
											text : '确定更改',
											width : 150
										}]
							}]
				}]
	}
})