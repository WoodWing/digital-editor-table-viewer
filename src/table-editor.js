class TableEditor {
    constructor() {
        this.studioFileId = "";
    }

    set workBook(val){    
        this._workBook = val;
        if (this.workBook && this.sheetName) {
            this._workSheet = this.workBook.Sheets[this.sheetName]
        }
      }
      
    get workBook(){
         return this._workBook;
    }

    set sheetName(val){
        this._sheetName = val;
        if (this.workBook && this.sheetName) {
            this._workSheet = this.workBook.Sheets[this.sheetName]
        }
    }
      
    get sheetName(){
         return this._sheetName;
    }

    get workSheet () {
        return this._workSheet;
    }

    set range (range) {
        if (this._workSheet) {
            this.workSheet['!ref'] = range;
        }        
    }

    get range () {
        if (this._workSheet) {
            return this.workSheet['!ref'];
        }   

        return "";
    }

    set studioFileId (fileId) {
        this._studioFileId = fileId;
    }

    get studioFileId () {
        return this._studioFileId;
    }

    /**
     * Render the html table in the provided container
     * @param {String} containerId Id of the HTML container 
     */
    renderTable(containerId){            
        var html = XLSX.utils.sheet_to_html(this.workSheet, {editable: false, id: 'table" class="table-viewer'});
        
        //set css class
        html = html.replace ("<table", "<table class='pure-table pure-table-bordered'");
        html = html.substring (html.indexOf("<table"), html.length);

        //Create the table
        $(containerId).html(html);
        
        //Convert first row header row
        $( '<thead></thead>' ).insertBefore( containerId + " tbody" );
        $(containerId + " tr:first-child").detach().appendTo(containerId + " thead");
        $(containerId + " thead td").each(function() {
            $(this).replaceWith('<th>' + $(this).text() + '</th>');            
        }); 

        //Set hyperlinks and cell ids
        var r = this.decode_range(this.workSheet['!ref']);
		for(var R = r.s.r; R <= r.e.r; ++R) {
			for(var C = r.s.c; C <= r.e.c; ++C) {
                var coord = this.encode_cell({r:R,c:C});
                $(".table-viewer-" + coord).attr("id", coord)
                if (this.workSheet[coord] && this.workSheet[coord].hasOwnProperty('l') && this.workSheet[coord].l.hasOwnProperty('Rel') && this.workSheet[coord].l.Rel.hasOwnProperty('TargetMode') && this.workSheet[coord].l.Rel.TargetMode == "External") {
                    var target = this.workSheet[coord].l.Rel.Target;
                    $(".table-viewer-" + coord).each(function() {
                        $(this).html('<a href="' + target + '" target="_blank">' + $(this).text() + '</a>');
                    });    
                }

                
            }    
        }    
    }    
    
    encode_cell(cell) {        
        var col = cell.c + 1;
        var s="";
        for(; col; col=((col-1)/26)|0) s = String.fromCharCode(((col-1)%26) + 65) + s;
        return s + (cell.r + 1);
    }    
    
    decode_cell(cstr) {     
        var R = 0, C = 0;
        for(var i = 0; i < cstr.length; ++i) {
            var cc = cstr.charCodeAt(i);
            if(cc >= 48 && cc <= 57) R = 10 * R + (cc - 48);
            else if(cc >= 65 && cc <= 90) C = 26 * C + (cc - 64);
        }
        return { c: C - 1, r:R - 1 };
    }
    
    decode_range(range) {     
        var idx = range.indexOf(":");
        if(idx == -1) return { s: this.decode_cell(range), e: this.decode_cell(range) };
        return { s: this.decode_cell(range.slice(0, idx)), e: this.decode_cell(range.slice(idx + 1)) };
    }
}