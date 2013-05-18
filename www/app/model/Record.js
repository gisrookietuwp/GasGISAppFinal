Ext.define('GasGISApp.model.Record', {
			extend : 'Ext.data.Model',
			config : {
				fields : ['sequence', 'deviceID', 'placeName', 'reportDate', 'lat', 'lng', 'isUpload', 'eventType', 'picPath', 
					'loop1_value1','loop1_value2','loop1_value3','loop1_value4',
					'loop2_value1','loop2_value2','loop2_value3','loop2_value4']
			}
		})