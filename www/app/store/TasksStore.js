Ext.define('GasGISApp.store.TasksStore', {
			extend : 'Ext.data.Store',
			config : {
				model : 'GasGISApp.model.Tasks',
				proxy : {
					type: 'memory',
					reader: {
						type: 'json'
					}
				}
			}
		})