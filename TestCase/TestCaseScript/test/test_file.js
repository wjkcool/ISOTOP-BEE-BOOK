//const { fs } = require("fs");

describe("test write file", function() {  

    it("test", async function() {     
        
        var fs  = require("fs");

        fs.writeFile("test3.txt","aaaaaaa",{flag:"w"},function(err){
            if(!err){
                console.log("写入成功！");
            }
        });


    });
});