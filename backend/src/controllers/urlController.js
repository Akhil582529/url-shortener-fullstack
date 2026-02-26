import Url from '../models/Url.js'
import generateShortCode from '../utils/helper.js';
export const urlController = async(req, res) => {
    const {url} = req.body;
    try {
        
        console.log("Url Controller is running");
        const existingUrl = await Url.findOne({originalUrl: url});
        if(existingUrl){
            return res.json({
                message: "Url already present",
                shortCode: `Short Code of the url is ${existingUrl.shortCode}`,
                shortUrl : `http://localhost:${process.env.PORT}/api/${existingUrl.shortCode}`,
                clicks: `No. of clicks are: ${existingUrl.clicks}`
            })
        }

        let short_code;
        let unique = false;
        
        while(!unique){
            short_code = generateShortCode();
            const existingShortCode = await Url.findOne({shortCode: short_code});
            if(!existingShortCode){
                unique = true;
            }
        }  

        const newUrl = new Url({
            originalUrl: url,
            shortCode: short_code
        });

        await newUrl.save();

        console.log("Url Controller completes running");
        const baseUrl = `http://localhost:${process.env.PORT}`
        return res.json({
            message: "Short Url Generated",
            // shortCode: `Short Code of the url is ${short_code.shortCode}`,
            shortCode: short_code,
            shortUrl : `${baseUrl}/api/${short_code}`,
        })


    } catch (error) {
        
        console.error("Error in createShortUrl:", error);
        res.status(500).json({
            error: "Failed to create short URL",
            details: error.message
         });        
    }
}