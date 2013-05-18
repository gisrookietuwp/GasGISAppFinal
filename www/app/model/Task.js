Ext.define('GasGISApp.model.Task', {
			extend : 'Ext.data.Model',
			config : {
				fields : ['sequence', 'deviceID', 'address', 'placeName', 'lat', 'lng', 'messageRFID']
			}
		})