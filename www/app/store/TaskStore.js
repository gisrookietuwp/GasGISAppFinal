Ext.define('GasGISApp.store.TaskStore', {
			extend : 'Ext.data.Store',
			config : {
				model : 'GasGISApp.model.Task',
				proxy : {
					type: 'memory',
					reader: {
						type: 'json'
					}
				}
			}
		})