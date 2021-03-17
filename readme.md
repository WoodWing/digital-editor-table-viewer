# WoodWing Digital Editor - Table Viewer POC
The table viewer is a POC to visualise excel tables in the digital editor. The excel files are loaded from the Dossier of the digital article. 


![Table Editor in action](https://github.com/WoodWing/digital-editor-table-viewer/blob/master/table-editor-poc.gif "Table Editor in action")

## Feedback
* Check out & in excel file
* Create new excel file
* Style individual cells


## Todo
* ContentStation SDK should be available within interactive component to access the server url
* ID of the digital article should be available within interactive component
* Look & feel, because of the iframe it is not possible to accesss the look & feel of the article 

## Installation & Configuration
* Copy the src folder to public accessible web folder
* Add the files from component-set to your component set
* Add the following to your components-definition.json, update the view and edit urls, compile the component set and upload it into your server  

"components":[
        {
            "name": "table-viewer",
            "icon": "icons/components/table-viewer.svg",
            "label": { "key": "COMPONENT_TABLE_VIEWER_LABEL" },
            "selectionMethod":"handle",
            "showToolbar": "always",
            "properties": [
                { "name": "table-viewer-data", "directiveKey": "table-viewer" }
            ]
        }                          
]

 "componentProperties": [
     {
            "name": "table-viewer-data",
            "label": "Edit table",
            "control": {
                "type": "interactive",
                "defaultConfig": {
                    "options": {
                        "tableData": "",
                        "tableHTML": ""
                    }
                },
                "viewLink": "http://docker.for.mac.localhost/integrations/table-viewer/src/view.html",
                "editLink": "http://docker.for.mac.localhost/integrations/table-viewer/src/edit.html"
            },            
            "dataType": "doc-interactive"
        }
 ]    


"groups": [
    {
            "label": { "key": "GROUP_MEDIA_LABEL" },
            "name": "media",
            "components": [
                "slideshow",                
                "image",
                "embed",
                "product",
                "social-media",
                "video",
                "table-viewer"
            ]
    }
]


