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
 

Ext.define('Apps.UserLogin',{
	extend: 'Ext.window.Window',	
	title: 'Login',	
	alias: 'widget.UserLogin',
	height: 170,
	width:310,	
	layout:'vbox',
	map:'',
	initComponent: function(){
	
	var me = this;
	Ext.apply(me,{
		items: {
			xtype: 'form',
			url: './login',
			width: 300,
			bodyPadding: '20 20 20 20',
			
			//defaultType: 'textfield',
			defaults: {
				//anchor: '100%'
				margin: '0 0 15 0',	
			},	
			items: [
				
				{
					xtype:'textfield',
					allowBlank: false,
					fieldLabel: 'User name',
					name: 'username',
					//value:'moperez@namria.gov.ph',
					emptyText: 'user name'
				},
				{
					xtype:'textfield',
					allowBlank: false,
					fieldLabel: 'Password',
					name: 'password',
					emptyText: 'password',
					inputType: 'password',
					//value:'123456',
					style: {
						marginBottom: '20px'
					}
					
				},
				{ 
					xtype:'button',
					width:'50%',
					text:'Login',
					handler: function() {
						var form = this.up('form').getForm();
						if (form.isValid()) {
							
							
							form.submit({
								
								success: function(form, action) {
									pUser=JSON.parse(action.response.responseText);
									console.log(pUser);
									
									me.fireEvent('login',pUser)
									me.close();
										
										
								},
								failure: function(form, action) {
									console.log(action);
									Ext.Msg.alert('Failed', action.result.msg);
									
								}
							});
						}
					}
					
				},
				
				{
					xtype: 'button',
					width:'50%',
					text:'Close',
					handler: function(){
						me.close();
						return
						var win = Ext.create('PGP.view.RegisterUser', { 
							title: 'Register user', 
							
					
						});
						win.show();						
					}
					
				}
				
			]
			
		}
		
	
	
	
	

	
	
	
	})
	this.callParent();
	
	}

})


