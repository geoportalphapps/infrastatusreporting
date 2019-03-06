/*
This file is part of PG Infrastructure Status Reporting

Copyright (c) 2013 National Mapping and Resource Information Authority

PG Infrastructure Status Reporting is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

PG Infrastructure Status Reporting is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with PG Infrastructure Status Reporting.  If not, see <http://www.gnu.org/licenses/>.
*/

var pUser='test1111';
Ext.Loader.setConfig({
disableCaching: false,
enabled: true,
paths: {   
    Apps:'../../Apps',
	GeoExt: "../../lib/GeoExt",		
	'Ext.ux': 'http://extjs.cachefly.net/extjs-4.1.1-gpl/examples/ux/',
	'Ext.ux.upload': '../../lib/uploader/ux/upload'
	} 
});

Ext.application({
    name: 'OL3EXT4',	
 	requires:[
		'Apps.mappanel', 
		'Apps.RegisterUser', 
		'Apps.UserLogin',
		'Apps.addFeatures',
		'Apps.ImageUploadField', 
		'Apps.optionsPanel',
		'Apps.uploadPicture', 
		'Apps.RegisterwitheEmail', 
		'Apps.editFeature',
		
		'Ext.grid.*',
        'Ext.data.*',
        'Ext.util.*',
        'Ext.state.*',
        'Ext.ux.upload.Button',
        'Ext.ux.upload.plugin.Window'	
		
		], 
    launch: function () {
		
		var optionsPanel = Ext.create('Apps.optionsPanel', {
            region: "east",
            title: "Options",
            //width: 250,
           
            });
			
		//email verified	
		if (verified){
			alertify.success('Email successfully verified, you can now login using your email and password.');
		}		
		
		
        Ext.create('Ext.container.Viewport', {	
            layout: 'border',						
            items:[			
				 Ext.create('Apps.mappanel'),
				// optionsPanel
				//labelForm
				
            ]
        });	
    }
});


