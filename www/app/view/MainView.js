Ext.define('GasGISApp.view.MainView', {
	extend : 'Ext.Container',
	xtype : 'mainview',
	config : {
		fullscreen : true,
		width : '100%',
		height : '100%',
		layout : {
			type : 'vbox'
		},
		items : [{
					xtype : 'toolbar',
					docked : 'top',
					ui : 'dark',
					title : '<p>' + CONSTANT.APPTITLE + '</p>'
				}, {
					xtype : 'panel',
					id: 'menuBtnGroup',
					defaults : {
						xtype : 'panel',
						layout : 'hbox',
						margin : '25 0 0 0'
					},
					items : [{
						defaults : {
							xtype : 'panel',
							flex:0.5,
							width: 100,
							height: 100,
							cls : 'menuBtnContainer'
						},
						items : [{
							action : 'menuBtn',
							margin: '0 20 0 0',
							id : 'menuBtn_map',
							html : '<div class="menuBtn"><div class="menuBtn_map"></div><div class="menuBtn_txt">地  图</div></div>'
						}, {
							action : 'menuBtn',
							margin: '0 0 0 20',
							id : 'menuBtn_sync',
							html : '<div class="menuBtn"><div class="menuBtn_sync"></div><div class="menuBtn_txt">同  步 </div></div>'
						}]
					}, {
						defaults : {
							xtype : 'panel',
							flex:0.5,
							width: 100,
							height: 100,
							cls : 'menuBtnContainer'
						},
						items : [{
							action : 'menuBtn',
							margin: '0 20 0 0',
							id : 'menuBtn_record',
							html : '<div class="menuBtn"><div class="menuBtn_record"></div><div class="menuBtn_txt">录  入</div></div>'
						}, {
							action : 'menuBtn',
							margin: '0 0 0 20',
							id : 'menuBtn_search',
							html : '<div class="menuBtn"><div class="menuBtn_search"></div><div class="menuBtn_txt">查  询</div></div>'
						}]
					}, {
						defaults : {
							xtype : 'panel',
							flex:0.5,
							width: 100,
							height: 100,
							cls : 'menuBtnContainer'
						},
						items : [{
							action : 'menuBtn',
							margin: '0 20 0 0',
							id : 'menuBtn_settings',
							html : '<div class="menuBtn"><div class="menuBtn_settings"></div><div class="menuBtn_txt">设  置</div></div>'
						}, {
							action : 'menuBtn',
							margin: '0 0 0 20',
							id : 'menuBtn_help',
							html : '<div class="menuBtn"><div class="menuBtn_help"></div><div class="menuBtn_txt">帮  助 </div></div>'
						}]
					}]
				}, {
					xtype : 'toolbar',
					docked : 'bottom',
					ui : 'dark'
				}]
	}
})
