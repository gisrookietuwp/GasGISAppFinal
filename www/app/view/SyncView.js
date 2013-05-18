Ext.define('GasGISApp.view.SyncView', {
	extend : 'Ext.Container',
	xtype : 'syncview',
	config : {
		fullscreen : true,
		layout : 'fit',
		items : [{
					xtype : 'titlebar',
					docked : 'top',
					ui : 'dark',
					title : '<p>' + CONSTANT.SYNCTITLE + '</p>',
					items : [{
								text : '返回',
								align : 'left',
								id : 'backMainBtn_sync',
								ui : 'back'
							}]
				}, {
					xtype : 'panel',
					layout : 'fit',
					items : [{
						xtype : 'tabpanel',
						tabBarPosition : 'bottom',
						items : [{
							xtype : 'panel',
							layout : 'fit',
							id : 'downloadPanel',
							title : '下载',
							iconCls : 'sync_download',
							items : [{
										xtype : 'toolbar',
										docked : 'top',
										style : 'background:#627C9F',
										items : [{
													xtype : 'selectfield',
													id : 'tasksList',
													defaultTabletPickerConfig : {
														'minHeight' : '250px'
													},
													width : 180,
													padding : '2 2 2 20',
													usePicker : false,
													style : 'font-size:16px',
													displayField : 'routeName',
													valueField : 'routeCode'
												}, {
													xtype : 'button',
													id : 'taskDownloadBtn',
													iconCls : 'download',
													iconMask : true
												}, {
													xtype : 'button',
													iconCls : 'trash',
													iconMask : true
												}]
									}, {
										xtype : 'list',
										id : 'taskInfoList',
										baseCls : 'taskInfo',
										selectedCls : 'taskInfo-item-selected',
										itemTpl : '<tpl for=".">'
												+ '<div class="taskId">{sequence}</div>'
												+ '<div class="taskContent">'
												+ '<h2>{deviceID}</h2>'
												+ '<h3>名称：{placeName}</h3>'
												+ '<h3>地址：{address}</h3>'
												+ '</div>' + '</tpl>'

									}]
						}, {
							xtype : 'panel',
							layout : 'fit',
							id : 'uploadPanel',
							title : '上传',
							iconCls : 'sync_upload',
							items : [{
										xtype : 'toolbar',
										docked : 'top',
										style : 'background:#627C9F',
										items : [{
													xtype : 'spacer'
												}, {
													xtype : 'button',
													id: 'singleUploadBtn',
													text : '单个上传'
												}, {
													xtype : 'button',
													id: 'allUploadBtn',
													text : '全部上传'
												}]
									}, {
										xtype : 'list',
										id: 'recordInfoList',
										baseCls: 'taskInfo',
										selectedCls: 'taskInfo-item-selected',
										itemTpl : '<tpl for=".">'
												+ '<div class="taskId">{sequence}</div>'
												+ '<div class="taskContent">'
												+ '<h2>{deviceID}</h2>'
												+ '<h3>名称：{placeName}</h3>'
												+ '<h3>录入时间：{reportDate}</h3>'
												+ '</div>' + '</tpl>'
									}]
						}]
					}]
				}]
	}
})