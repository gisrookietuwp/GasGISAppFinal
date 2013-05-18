Ext.define('GasGISApp.store.RouteResultStore', {
			extend : 'Ext.data.Store',
			config : {
				model : 'GasGISApp.model.RouteResult',
				proxy : {
					type: 'memory',
					reader: {
						type: 'json'
					}
				}
			}
		})