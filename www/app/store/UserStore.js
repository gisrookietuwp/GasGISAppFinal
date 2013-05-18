Ext.define('GasGISApp.store.UserStore', {
			extend : 'Ext.data.Store',
			config : {
				model : 'GasGISApp.model.User',
				proxy : {
					type : 'localstorage',
					id : 'User'
				}
			}
		})