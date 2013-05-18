Ext.define('GasGISApp.view.SearchView', {
	extend : 'Ext.Container',
	xtype : 'searchview',
	config : {
		fullscreen : true,
		layout : 'fit',
		items : [{
					xtype : 'titlebar',
					docked : 'top',
					ui : 'dark',
					title : '<p>' + CONSTANT.SEARCHTITLE + '</p>',
					items : [{
								text : '返回',
								align : 'left',
								id : 'backMainBtn_search',
								ui : 'back'
							}]
				}, {
					xtype : 'panel',
					layout : 'fit',
					items : [{
								xtype : 'tabpanel',
								items : [{
											xtype : 'list',
											title : '仍未巡检',
											id: 'undoneTaskInfoList',
											baseCls : 'taskInfo',
											selectedCls : 'taskInfo-item-selected',
											itemTpl : '<tpl for=".">'
												+ '<div class="taskId">{sequence}</div>'
												+ '<div class="taskContent">'
												+ '<h2>{deviceID}</h2>'
												+ '<h3>名称：{placeName}</h3>'
												+ '<h3>地址：{address}</h3>'
												+ '</div>'
												+ '</tpl>'
										}, {
											xtype : 'list',
											title : '已经巡检',
											baseCls : 'taskInfo',
											selectedCls : 'taskInfo-item-selected'
										}]
							}]
				}]
	}
})