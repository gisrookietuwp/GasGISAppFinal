Ext.define('GasGISApp.view.RecordView', {
	extend : 'Ext.Container',
	xtype : 'recordview',
	config : {
		fullscreen : true,
		layout : 'fit',
		items : [{
					xtype : 'titlebar',
					docked : 'top',
					ui : 'dark',
					title : '<p>' + CONSTANT.RECORDTITLE + '</p>',
					items : [{
								text : '返回',
								align : 'left',
								id : 'backMainBtn_record',
								ui : 'back'
							}]
				}, {
					xtype : 'panel',
					layout : 'fit',
					items : [{
								xtype : 'toolbar',
								docked : 'top',
								style : 'background:#627C9F',
								items : [{
											xtype : 'textfield',
											id : 'deviceID',
											width : 180,
											label : '设备编号:',
											labelWidth : 70,
											clearIcon : false,
											padding : '2 2 2 10',
											style : 'font-size:16px'
										}, {
											xtype : 'button',
											id : 'saveReportBtn',
											text : '保存'
										}, {
											xtype : 'button',
											id : 'locateBtn_report',
											text : '定位'
										}]

							}, {
								xtype : 'carousel',
								id : 'reportCarousel',
								items : [{
									xtype : 'panel',
									defaults : {
										xtype : 'panel',
										layout : 'hbox',
										margin : '0 0 25 0',
										style : 'font-size: 14px'
									},
									items : [{
										xtype : 'label',
										style : 'text-align:center; color: white; background-color: #627C9F',
										height : 25,
										width : 50,
										html : '抄表'
									}, {
										defaults : {
											xtype : 'panel',
											margin : '0 10 0 0'
										},
										items : [{
													xtype : 'label',
													flex : 0.24,
													margin : '10 10 0 0',
													html : '进口压力:'
												}, {
													xtype : 'numberfield',
													id : 'loop1_value1',
													clearIcon : false,
													flex : 0.38

												}, {
													xtype : 'numberfield',
													id : 'loop2_value1',
													clearIcon : false,
													flex : 0.38
												}]
									}, {
										defaults : {
											xtype : 'panel',
											margin : '0 10 0 0'
										},
										items : [{
													xtype : 'label',
													flex : 0.24,
													margin : '10 10 0 0',
													html : '出口压力:'
												}, {
													xtype : 'numberfield',
													id : 'loop1_value2',
													clearIcon : false,
													flex : 0.38
												}, {
													xtype : 'numberfield',
													id : 'loop2_value2',
													clearIcon : false,
													flex : 0.38
												}]
									}, {
										defaults : {
											xtype : 'panel',
											margin : '0 10 0 0'
										},
										items : [{
													xtype : 'label',
													flex : 0.24,
													margin : '10 10 0 0',
													html : '关闭压力:'
												}, {
													xtype : 'numberfield',
													id : 'loop1_value3',
													clearIcon : false,
													flex : 0.38
												}, {
													xtype : 'numberfield',
													id : 'loop2_value3',
													clearIcon : false,
													flex : 0.38

												}]
									}, {
										defaults : {
											xtype : 'panel',
											margin : '0 10 0 0'
										},
										items : [{
													xtype : 'label',
													flex : 0.24,
													margin : '10 10 0 0',
													html : '切断压力:'
												}, {
													xtype : 'numberfield',
													id : 'loop1_value4',
													clearIcon : false,
													flex : 0.38
												}, {
													xtype : 'numberfield',
													id : 'loop2_value4',
													clearIcon : false,
													flex : 0.38
												}]
									}, {
										defaults : {
											xtype : 'panel',
											margin : '0 10 0 0',
											style : 'text-align:center'
										},
										items : [{
													xtype : 'label',
													flex : 0.24,
													html : ''
												}, {
													xtype : 'label',
													flex : 0.38,
													html : '回路1'
												}, {
													xtype : 'label',
													flex : 0.38,
													html : '回路2'
												}]
									}]
								}, {
									xtype : 'panel',
									scrollable : {
										direction : 'vertical',
										directionLock : true
									},
									items : [{
										xtype : 'label',
										style : 'text-align:center; color: white; background-color: #627C9F',
										height : 25,
										width : 50,
										html : '事件'
									}, {
										xtype : 'fieldset',
										defaults : {
											xtype : 'radiofield',
											name : 'eventType',
											labelWidth : 120
										},
										items : [{
													label : '巡视',
													action : 'eventRadio',
													value : 1
												}, {
													label : '中修',
													action : 'eventRadio',
													value : 2
												}, {
													label : '出口压低',
													action : 'eventRadio',
													value : 3
												}, {
													label : '切断阀跳',
													action : 'eventRadio',
													value : 4
												}, {
													label : '出口压波动',
													action : 'eventRadio',
													value : 5
												}, {
													label : '调压漏气',
													action : 'eventRadio',
													value : 6
												}, {
													label : '滤芯状况',
													action : 'eventRadio',
													value : 7
												}, {
													label : '停用',
													action : 'eventRadio',
													value : 8
												}, {
													label : '关闭压力高',
													action : 'eventRadio',
													value : 9
												}]
									}]

								}, {
									xtype : 'panel',
									scrollable : {
										direction : 'vertical',
										directionLock : true
									},
									items : [{
										xtype : 'label',
										style : 'text-align:center; color: white; background-color: #627C9F',
										height : 25,
										width : 50,
										html : '照片'
									}, {
										xtype : 'panel',
										margin : '-20 0 0 0',
										layout : {
											type : 'hbox',
											pack : 'end'
										},
										items : [{
													xtype : 'button',
													id : 'takePhotoBtn',
													margin : '2 5 2 10',
													ui : 'confirm',
													text : '拍照',
													iconCls : 'photo1',
													iconMask : true
												}, {
													xtype : 'button',
													id : 'deletePhotoBtn',
													margin : '2 10 2 5',
													ui : 'normal',
													disabled : true,
													text : '删除',
													iconCls : 'delete',
													iconMask : true
												}]
									}, {
										xtype : 'panel',
										id : 'picturePanel',
										margin : '10 0 10 0'
									}]
								}]
							}, {
								xtype : 'toolbar',
								docked : 'bottom',
								height : 30,
								ui : 'dark',
								items : [{
											xtype : 'label',
											id : 'locationInfoBar',
											margin : '5 20 5 20',
											cls : 'statusBar'
										}]
							}]
				}]
	}
})