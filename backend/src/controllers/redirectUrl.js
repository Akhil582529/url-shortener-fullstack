import Url from "../models/Url.js";
export const redirectUrl = async (req, res) =>{
    try {

        const {shortCode} = req.params;
        console.log("Received Shortcode: ", shortCode);

        const urlDoc = await Url.findOne({shortCode});
        console.log("found doc: ", urlDoc);


        if(!urlDoc){
            res.status(400).json({
                message: "Short URL not found (redirectUrl controller)"
            })
        }

        urlDoc.clicks+=1;
        await urlDoc.save();

        return res.redirect(urlDoc.originalUrl);
    } catch (error) {
        console.error("Redirect error:", error);
        return res.status(500).json({
            message: "Server error"
        });
    }
    
}