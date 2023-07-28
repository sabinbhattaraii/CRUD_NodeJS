const { port,base_url } = require("./config/config.js");


const createFile = (req,res) => {
    if(req.file){
        let fileName = req.file.location
        //let fileName = req.file.filename
        let path = { path: `${base_url}/${fileName}` };
        console.log(port);
        let successJson = {
            status: "success",
            message: "File uploaded successfully.",
            path: path,
          };
          res.json(successJson);
    }else{
        let paths = req.files.map((file) => {
            let fileName = file.filename;
            let path = `http://localhost:${port}/${fileName}`;
            return { path: path };
          });
          let successJson = {
            status: "success",
            message: "Files uploaded successfully.",
            paths: paths,
          };
          res.json(successJson);
    }
}

module.exports = createFile 