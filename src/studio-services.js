class StudioServices {
    constructor(serverUrl) {
        this._serverUrl = serverUrl;
    }

    /**
     * Return the Dossier Ids of the provide file
     * @param fileId Studio object id
     */
    async getDossierIds (fileId) {
        var dossierIds = [];    

        return new Promise((resolve, reject) => {
            try {
                var queryObjectsRequest = {
                    "method":"QueryObjects",
                    "params":[
                        {
                            "Params":[
                                {"Property":"ChildId","Value":fileId,"Operation":"=","__classname__":"QueryParam"},   
                                {"Property":"ChildRelationType","Value":"Contained","Operation":"=","__classname__":"QueryParam"}
                            ]
                            ,"FirstEntry":1,
                            "Order":[
                            ],
                            "RequestProps":["ID", "Name"],
                            "Hierarchical":false,
                            "Ticket":null}
                        ],
                        "id":1,
                        "jsonrpc":"2.0"
                    };

                this.doStudioRequest(this._serverUrl + "?protocol=JSON&method=QueryObjects", queryObjectsRequest, function (result) {    
                    result.result.Rows.forEach(row => dossierIds.push (row[0]));                                                
                    resolve (dossierIds);
                });
            } catch (err) {
                reject(err);
            }
        });
    } 
    
    /**
     * Returns the children (ID, Name) of the provided dossiers ordered by Name
     * @param {Array} dossierIds Array of dossier Ids
     * @param {Array} formats Format filter, array of formats 
     */
    async getFilesFromDossiers (dossierIds, formats) {

        var files = []; 
        return new Promise((resolve, reject) => {
            try {
                var queryObjectsRequest = {
                    "method":"QueryObjects",
                    "params":[
                        {
                            "Params":[                               
                            ]
                            ,"FirstEntry":1,
                            "Order":[
                                {"__classname__":"QueryOrder","Property":"Name","Direction":true}
                            ],
                            "RequestProps":["ID", "Name"],
                            "Hierarchical":false,
                            "Ticket":null}
                        ],
                        "id":1,
                        "jsonrpc":"2.0"
                    };

                dossierIds.forEach(dossierID => 
                    queryObjectsRequest.params[0].Params.push (
                        {"Property":"ParentId","Value":dossierID,"Operation":"=","__classname__":"QueryParam"}
                    )
                );       
                
                if (formats) {
                    formats.forEach(format => 
                        queryObjectsRequest.params[0].Params.push (
                            {"Property":"Format","Value":format,"Operation":"=","__classname__":"QueryParam"}
                        )    
                    );      
                }         
                
                this.doStudioRequest(this._serverUrl + "?protocol=JSON&method=QueryObjects", queryObjectsRequest, function (result) {    
                    files = result.result.Rows;                        
                    resolve (files);
                });
            } catch (err) {
                reject(err);
            }
        });            
    }    

    /**
     * Studio GetObjects request 
     * @param {Array} fileId Array of file ids 
     * @param {String} rendition empty or native
     */
    async getObjects (fileIds, rendition) {
        var spreadSheet = null; 

        return new Promise((resolve, reject) => {
            try {
                var getObjectsRequest = {
                    "method":"GetObjects",
                    "params":[
                        {
                            "Lock":false,
                            "Rendition":rendition,
                            "Areas":["Workflow"],
                            "RequestInfo":[""],
                            "IDs":fileIds,
                            "Ticket":null
                        }],
                    "id":0,
                    "jsonrpc":"2.0"
                };


                this.doStudioRequest(this._serverUrl + "?protocol=JSON&method=GetObjects", getObjectsRequest, function (result) {    
                    spreadSheet = result.result.Objects[0];                        
                    resolve (spreadSheet);
                });
            } catch (err) {
                reject(err);
            }
        });            
    }    

    /**
    * Post request to studio server
    * 
    * @param {*} url 
    * @param {*} request 
    * @param {*} callback 
    */
    doStudioRequest (url, request, callback) {
        $.ajaxSetup({
            headers: {
                'X-WoodWing-Application': 'Content Station'
            }
        });

        $.post(url, JSON.stringify(request),
            function (data) {
                callback(data);
            }
        );
    }    
}