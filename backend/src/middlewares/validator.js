import express from 'express'
const app = express();

// app.use(express.json());

const validator = async (req, res, next) => {
    console.log("Validator is running");
    let {url} = req.body;

    if(!url){
        return res.status(400).json({error: "URL is not entered"});
    }

    url = url.trim();

    if(!url.startsWith("https://") && !url.startsWith("http://")){
        url = "https://"+url;
    }

    let parsed; 
    try {
        parsed = new URL(url);
    } catch (error) {
        return res.status(400).json({error: "URL is in wrong format"});
    }

    if(!['https:', 'http:'].includes(parsed.protocol.toLowerCase())){
        return res.status(400).json({error: "only HTTPs and HTTP protocols are allowed"})
    }

    let parsedHostname = parsed.hostname.toLowerCase();
    let parsedProtocol = parsed.protocol.toLowerCase();

    const extensions = ['.rar', 'exe', '.bat', '.zip', '.cmd' , '.sh'];
    const pathName = parsed.pathname.toLowerCase();
    for(const ext of extensions){
        if(pathName.endsWith(ext)){
            return res.status(400).json({error: "Executable files are not allowed"});
        }
    }

    req.body.url = parsed.toString();
    console.log("Validator completes running");
    next();

}

export default validator;