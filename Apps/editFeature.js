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
 

Ext.define('Apps.editFeature',{
	extend: 'Ext.window.Window',	
	title: 'Edit Feature',	
	alias: 'widget.editFeature',
	//anchor:'100%',
	height: 300,
	width:380,	
	featureID:'',
	//layout:'vbox',
	map:'',
	feature:'',
	modal:true,
	loadStore:function(ftype){
		var me = this;
		Ext.Ajax.request({
			url:'./getFeatureTypes/' + ftype, 
				success:function(res){
				var obj = Ext.decode(res.responseText);
				
				var list = [];
				for(var item in obj){
					console.log(obj[item].feature_name);
					list.push(obj[item].feature_name);
					
				}
				console.log(list);
				list.push('Others')
				me.down('#attribute').bindStore(list);
				//console.log(list);
				//return list;
				
				
			},
			failure:function(res){
				console.log('FAILED',res)
			}
		})
		//grid.getStore().loadData(me.loadGrid())
	},
	loadFeature:function(row){
				var vectorLayer=map.getLayersByName('Features Layer')[0];				
				var feature;
				if (row.structure_type=='point'){
					switch(row.structure_type){
						case 'School':
							img='img/school.png'
							break;
						case 'Hospital':
							img='img/Hospital.png'
							break;
					}
					
					
					feature = new OpenLayers.Feature.Vector(
						new OpenLayers.Geometry.Point(row.extent.geometry.coordinates[0], row.extent.geometry.coordinates[1]),
						{userid:row.user_id, feature_type:row.structure_type, feature_name:row.structure_name,description:row.description},
						{externalGraphic: img, graphicHeight: 25, graphicWidth: 20, graphicXOffset:-12, graphicYOffset:-25 }
					)
					//vectorLayer.addFeatures(feature);
					
				}else if(row.structure_type=='line'){
					
					//create points array
					var row_coordinates=row.extent.geometry.coordinates;
					var line = new OpenLayers.Geometry.LineString();
					for(var rec in row_coordinates){
						var point= new OpenLayers.Geometry.Point(row_coordinates[rec][0], row_coordinates[rec][1])
						line.addPoint(point);
					}
					
					feature = new OpenLayers.Feature.Vector(
						line,{fid:row.feature_id, user:row.user_id,user_name:row.name, feature_type:row.feature_type, feature_name:row.feature_name,description:row.description, structure_type:row.structure_type}
					);
					//vectorLayer.addFeatures(feature)		
					
				}else{
			
					//create points array
					
					var row_coordinates=row.extent.geometry.coordinates[0];
					
					var points=[];
					for(var rec in row_coordinates){
						var point= new OpenLayers.Geometry.Point(row_coordinates[rec][0], row_coordinates[rec][1])
						points.push(point);
						
					}
					
					var ring = new OpenLayers.Geometry.LinearRing(points);
					var polygon = new OpenLayers.Geometry.Polygon([ring]);

					feature = new OpenLayers.Feature.Vector(
						polygon, {fid:row.feature_id, user:row.user_id,user_name:row.name, feature_type:row.feature_type, feature_name:row.feature_name,description:row.description, structure_type:row.structure_type}
					);
					
					//vectorLayer.addFeatures(feature);
				}
				
				vectorLayer.addFeatures(feature);
			//}	
				
		//}
				

	},
	feature_type:'',
	initComponent: function(){
		
	var me = this;
	var feature=this.feature;
	var userID=Ext.getCmp('mappanel').user.ID;
	//alert(userID);
	
			
	//
			var uploadButton =	Ext.create('Ext.ux.upload.Button', {
					text: 'Select files',
					//singleFile: true,
					//width:120,
					//height:30,
					anchor:'50%',
					style: 'position:absolute; left:105px; top:185px;',
					plugins: [{
								  ptype: 'ux.upload.window',
								  title: 'Upload',
								  width: 520,
								  height: 350
							  }
					],
					uploader: 
					{
						//url: './saveImages',
						url:'./file_upload2/' + me.featureID ,
						method:'POST',
						enctype: 'multipart/form-data',
						uploadpath: './files',
						autoStart: false,
						max_file_size: '2020mb',			
						drop_element: 'dragload',
						statusQueuedText: 'Ready to upload',
						statusUploadingText: 'Uploading ({0}%)',
						statusFailedText: '<span style="color: red">Error</span>',
						statusDoneText: '<span style="color: green">Complete</span>',
						statusInvalidSizeText: 'File too large',
						statusInvalidExtensionText: 'Invalid file type'
					},
					listeners: 
					{
						filesadded: function(uploader, files)								
						{
							console.log('filesadded');
							return true;
						},
						
						beforeupload: function(uploader, file)								
						{
							console.log('beforeupload');			
						},

						fileuploaded: function(uploader, file)								
						{
							console.log('fileuploaded');
							
						},
						
						uploadcomplete: function(uploader, success, failed)								
						{
							console.log('uploadcomplete');	
							me.close();
							Ext.Msg.alert('Success', 'Picture(s) successfully uploaded');		
							
						},
						scope: this
					}
							
					
				});
	//
	
	feature_type=this.feature_type;
	Ext.apply(me,{
		items: {
			xtype: 'form',
			url: './updateFeatureDetails',
			frame:true,
			height:250,
			width: 370,
			//bodyPadding: '20 20 20 20',
			//params:{test:'this is a test'},
			//defaultType: 'textfield',
			defaults: {
				anchor: '96%',
				//margin: '0 0 15 0',	
			},	
			items: [
				
				{
							xtype: 'combo',
							itemId: 'attribute',
							store: me.list,
							fieldLabel: 'Structure Type',
							editable: false,
							name: 'structure_type',
							listeners: {
								select: function(){
									if (this.getValue()=='Others'){
										this.select(this.getStore().getAt(-1)); //set item index
										var dlg = Ext.MessageBox.prompt('Input', 'Please enter Structure type:', function(btn, text){
										if (btn == 'ok'){
											Ext.Ajax.request({
												url:'./addStructure_type',
												method:'POST',
												params:{feature_type:me.feature_type.toUpperCase(), feature_name:text},
												success:function(res){
													me.loadStore(me.feature_type.toUpperCase());
												}
												
											})
										}
									});

									}
								}
							}
						},
						//end comb
				
				{
					xtype:'textfield',
					allowBlank: false,
					fieldLabel: 'Structure Name',
					name: 'structure_name',
					itemId: 'structure_name',
				},
				{
					xtype:'textarea',
					allowBlank: false,
					fieldLabel: 'Description',
					name: 'description',
					itemId:'description'
					
				},
				{
					xtype:'textarea',
					allowBlank: false,
					fieldLabel: 'Status',
					name: 'status',
					itemId: 'status',
					
					
				},
				
				{
					xtype:'textfield',
					allowBlank: false,
					fieldLabel: 'Hidden',
					name: 'fid',
					itemId: 'fid',
					hidden:true
				},
				uploadButton
			],
			buttons:[	
				{ 
					xtype:'button',
					//left:10,
					//width:100,
					text:'Ok',
					handler: function() {
						var form = this.up('form').getForm();
						console.log(form.isValid());
						console.log(form);
						if (form.isValid()) {
							form.submit({
								success:function(form, action) {
									Ext.Msg.alert('Success', action.result.msg);
									me.fireEvent('featureUpdated');
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
					//width:100,
					text:'Close',
					handler: function(){
						//var vectorLayer=map.getLayersByName('Features Layer')[0]
						//vectorLayer.removeFeatures(vectorLayer.getFeatureById(me.featureID))
						me.close();				
					}
					
				},
				/*
				{
					xtype:'label',
					text:'Login existing account or register to download datasets in machine-processable format'
				},
				*/
			],
		loadData:function(feature_id){
				var me=this;
				Ext.Ajax.request({
					url:'./editFeature/' + feature_id,
					//method:'POST',
					success:function(res){
						var obj=Ext.decode(res.responseText);
						console.log(obj);	
						me.setData(obj[0]);
					},
					failure:function(res, action){
						//Ext.Msg.alert('Failed', action.msg);
					}
				})
		},
		setData:function(record){
			var me = this;
			console.log(record.feature_name);
			me.down('#structure_name').setValue(record.feature_name);
			me.down('#description').setValue(record.description);
			me.down('#status').setValue(record.status);
			var structure_type=record.structure_type;
			var combo=me.down('#attribute');
			var store=combo.getStore();
			console.log(store);
			for (var key in store.data.items){
				console.log('aaaa', (store.data.items[key].raw[0]));
				
				if (store.data.items[key].raw[0]==structure_type){
					combo.select(combo.getStore().getAt(key));
					break;
				}
				
			}
			
		},
			listeners: {
				afterrender: function(){	
					var me=this.up();
					this.loadData(me.featureID);
					me.down('#fid').setValue(me.featureID);
					
				},
			}				
		}		
	
	})
	this.callParent();
	
	}

})


