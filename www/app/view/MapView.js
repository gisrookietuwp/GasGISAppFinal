Ext.define('GasGISApp.view.MapView', {
	extend : 'Ext.Container',
	xtype : 'mapview',
	config : {
		fullscreen : true,
		layout : 'fit',
		items : [{
					xtype : 'titlebar',
					docked : 'top',
					ui : 'dark',
					title : '<p>' + CONSTANT.MAPTITLE + '</p>',
					items : [{
								text : '返回',
								align : 'left',
								id : 'backBtn_map',
								ui : 'back'
							}, {
								id: 'backListBtn',
								disabled: true,
								iconCls : 'list',
								iconMask : true,
								align : 'right'
							}]
				}, {
					xtype : 'panel',
					layout : 'fit',
					items : [{
								xtype : 'toolbar',
								id: 'mapToolbar',
								docked : 'top',
								style : 'background:#627C9F',
								items : [{
											xtype : 'selectfield',
											id: 'poiDistance',
											width : 110,
											usePicker: false,
											defaultTabletPickerConfig:{
												'minHeight' : '200px'
											},
											padding: '2 2 2 8',
											style:'font-size:16px',
											value: 500,
											options : [{
														text : '500m',
														value : '500'
													}, {
														text : '1km',
														value : '1000'
													}, {
														text : '2km',
														value : '2000'
													}, {
														text : '5km',
														value : '5000'
													}]
										}, {
											xtype : 'selectfield',
											id: 'poiType',
											width : 110,
											usePicker: false,
											defaultTabletPickerConfig:{
												'minHeight' : '250px'
											},
											padding: '2 2 2 8',
											style:'font-size:16px',
											value: '快餐',
											options : [{
														text : '快餐',
														value : '快餐'
													}, {
														text : '小吃',
														value : '小吃'
													}, {
														text : '超市',
														value : '超市'
													}, {
														text : '地铁站',
														value : '地铁站'
													}, {
														text : '公交车站',
														value : '公交车站'
													},{
														text : '加油站',
														value : '加油站'
													},{
														text : '公共厕所',
														value : '公共厕所'
													}]
										}, {
											xtype : 'spacer'
										}, {
											xtype : 'button',
											id: 'poiSearch',
											iconCls : 'search',
											iconMask : true
										}]
							}, {
								xtype : 'panel',
								id : 'mapContainer',
								html : '<div id="mapDiv" class="mapContainer"></div>'
										+ '<div class="zoomWidget">'
										+ '<div id="zoominBtnDiv"></div><div id="zoomoutBtnDiv"></div>'
										+ '</div>'
										+ '<div class="locateWidget">'
										+ '<div id="locateBtnDiv"></div>'
										+ '</div>'
							}]
				}, {
					xtype : 'toolbar',
					docked : 'bottom',
					height : 30,
					ui : 'dark',
					items : [{
						xtype : 'label',
						id: 'mapStatusBar',
						margin : '5 20 5 20',
						cls : 'statusBar'
//						html : '当前位置：&nbsp&nbsp经度:121.4637,&nbsp&nbsp纬度:31.2312'
					}]
				}]
	}
})