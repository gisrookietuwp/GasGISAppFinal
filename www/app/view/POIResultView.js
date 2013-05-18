Ext.define('GasGISApp.view.POIResultView', {
	extend : 'Ext.Container',
	xtype : 'poiresultview',
	config : {
		fullscreen : true,
		layout : 'fit',
		items : [{
					xtype : 'titlebar',
					docked : 'top',
					ui : 'dark',
					title : '<p>' + CONSTANT.POITITLE + '</p>',
					items : [
//							{
//								text : '返回',
//								align : 'left',
//								action : 'backMapBtn',
//								ui : 'back'
//							},
							{
//								id: 'backPOIMapBtn',
								action : 'backMapBtn',
								iconCls : 'maps',
								iconMask : true,
								align : 'right'
							}]
				}, {
					xtype : 'panel',
					layout : 'fit',
					items : [{
								xtype : 'toolbar',
								id: 'poiSearchInfoBar',
								docked : 'top',
								height: 30,
								padding: '5 0 0 0',
								cls: 'toolBar'
							}, {
								xtype : 'list',
								id : 'poiList',
								itemTpl : '<tpl for=".">'
										+ '<div class="resultInfo"><h2>{name}</h2>'
										+ '<h3>电话：{telephone}<br>地址：{address}</h3></div>'
										+ '</tpl>'
							}]
				}]
	}
})