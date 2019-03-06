
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

Ext.define('Apps.addPicture',{
	title: 'Add picture',	
	extend:'Ext.window.Window',
	alias: 'widget.addPicture',
	f_id:'',
	initComponent: function(){
		var me = this;	
		var uploadButton =	Ext.create('Ext.ux.upload.Button', {
					text: 'Select files',
					//singleFile: true,
					width:120,
					height:30,
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
						url:'./file_upload',
						params:{fid:me.f_id},
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
	
	
	
		
		Ext.apply(me,{
				items:uploadButton	
		})
		this.callParent();
	
	}
})