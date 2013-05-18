Ext.define('GasGISApp.view.RouteResultView', {
			extend : 'Ext.Container',
			xtype : 'routeresultview',
			config : {
				fullscreen : true,
				layout : 'fit',
				items : [{
							xtype : 'titlebar',
							docked : 'top',
							ui : 'dark',
							title : '<p>' + CONSTANT.ROUTETITLE + '</p>',
							items : [{
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
										id : 'routeInfoBar',
										docked : 'top',
										height : 30,
										padding : '5 0 0 0',
										cls : 'toolBar'
									}, {
										xtype : 'list',
										baseCls : 'routeInfo',
										id : 'routeList',
										itemTpl : '<tpl for=".">'
												+ '<div class="routeId">{index}</div>'
												+ '<div class="routeDescription">'
												+ '{description}' + '</div>'
												+ '<div class="routeDistance">'
												+ '{distance}' + '</div>'
												+ '</tpl>'
									}, {
										xtype : 'toolbar',
										docked : 'bottom',
										ui : 'light',
										items : [{
													xtype : 'label',
													style: 'color:white; margin-left:5px;font-size:14px',
													html : '最少时间'
												},{
													xtype : 'label',
													style: 'color:white; margin-left:10px;font-size:14px',
													html : '方案个数：1个'
												}, {
													xtype : 'spacer'
												}, {
													xtype : 'button',
													disabled: true,
													iconCls: 'arrow_left',
													iconMask : true
												}, {
													xtype : 'button',
													disabled: true,
													iconCls: 'arrow_right',
													iconMask : true
												}]
									}]
						}]
			}
		})