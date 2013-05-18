Ext.define('GasGISApp.store.POIResultStore', {
			extend : 'Ext.data.Store',
			config : {
				model : 'GasGISApp.model.POIResult',
				proxy : {
					type: 'memory',
					reader: {
						type: 'json'
					}
				}
			}
		})