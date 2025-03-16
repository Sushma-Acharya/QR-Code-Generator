import express from "express";
import bodyParser from "body-parser";
import qr from "qr-image";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

function isvalid(url) {
    try {
        if (!/^https?:\/\//i.test(url)) {
            url = "https://" + url;
        }
        new URL(url);
        const parsedUrl = new URL(url);
        if (!/\.[a-z]{2,}$/i.test(parsedUrl.hostname)) {
            return false; 
        }
        return true; 
    } catch (e) {
        return false; 
    }
}

app.get("/",(req,res)=>{
    let valid="your URL";
    res.render("index.ejs",{
        valid:valid
    });
});

app.post("/generate",(req,res)=>{
    const url = req.body.url;
    if(isvalid(url)){
        const upath=path.join(__dirname, 'public', 'url.txt');
        fs.appendFile(upath, `${url}\n`, (err) => {
            if (err) throw err;
          });
        const qrimg = qr.image(url, { type: 'png' });
        const ipath=path.join(__dirname, 'public', 'qr_image.png');
        qrimg.pipe(fs.createWriteStream(ipath));
        let name="qr_image.png";
        res.render('index.ejs', { 
            qrCode:name
        });
    }else{
        let valid="a valid url";
        res.render('index.ejs', { 
            valid:valid
        });
    }

});

app.listen(port,()=>{
    console.log("Listening at "+ port);
});
