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
 

Ext.define('Apps.uploadPicture',{
	extend: 'Ext.window.Window',	
	title: 'Upload picture',	
	alias: 'widget.uploadPicture',
	height: 150,
	width:310,	
	layout:'vbox',
	map:'',
	initComponent: function(){
	
	var me = this;
	Ext.apply(me,{
		items: {
			xtype: 'form',
			url: '/login',
			width: 300,
			bodyPadding: '20 20 20 20',
			
			//defaultType: 'textfield',
			defaults: {
				//anchor: '100%'
				margin: '0 0 15 0',	
			},	
			items: [
				
				{
					xtype:'imageuploadfield',
					height:500,
					widget:3000,
					//allowBlank: false,
					//fieldLabel: 'User name',
					//name: 'username',
					//value:'moperez',
					//emptyText: 'user name'
				}
				
			]
			
		}
		
	
	
	
	

	
	
	
	})
	this.callParent();
	
	}

})


