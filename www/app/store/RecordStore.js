Ext.define('GasGISApp.store.RecordStore', {
			extend : 'Ext.data.Store',
			config : {
				model : 'GasGISApp.model.Record',
				proxy : {
					type: 'memory',
					reader: {
						type: 'json'
					}
				}
			}
		})