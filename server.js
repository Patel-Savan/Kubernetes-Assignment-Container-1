const express = require('express')
const axios = require('axios')
const fs = require('fs') 

const app = express()

app.use(express.json())

app.listen(6000)

app.post("/store-file", async (req,res) => {

    const body = req.body;

    const fileName = body.file;
    var data = body.data;

    if(fileName == null || fileName == ""){
        const response = {
            file:null,
            error:"Invalid JSON input."
        }

        res.status(400).json(response)
    }

    data = data.split('\n').map(line => 
        line.split(',').map(field => field.trim()).join(',')
      ).join('\n');

    const filePath = "../Savan_PV_dir/" + fileName;

    fs.writeFile(filePath, data, "utf-8", (err) => {

        if(err){
            const response = {
                file: fileName,
                error: "Error while storing the file to the storage."
            }

            res.status(500).json(response)
        }

        const response = {
            file:fileName,
            message:"Success."
        }

        res.status(200).json(response)
    })
})

app.post("/calculate",async (req,res)=>{

    const body = req.body;

    const fileName = body.file;

    if(fileName == null || fileName == ""){
        const response = {
            file: null,
            error: "Invalid JSON input."
        }
        console.log("File Not Found")

        res.status(400).json(response)
    }else{
        
        const filePath = "../Savan_PV_dir/" + fileName;

        if(fs.existsSync(filePath)){
            
            try{
                const result = await axios.post("http://container2-service:81/result",body)

                res.json(result.data)
                
            }catch(error){
                console.log(error)
                if(error.response){
                    res.status(error.response.status).json(error.response.data);
                }else{
                    res.status({error:"Internal Server error"})
                }
                  
            }
          
        }else{
            const response = {
                file:fileName,
                error:"File not found."
            }
            res.status(404).json(response)
        }
    }
})