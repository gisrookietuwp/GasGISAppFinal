Ext.define('GasGISApp.model.User', {
			extend : 'Ext.data.Model',
			config : {
				fields : ['groupID', 'groupName', 'groupPwd', 'regionDM',
						'deviceDM']
			}
		})