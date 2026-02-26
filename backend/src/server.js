import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import urlRoutes from "./routes/urlRoutes.js"
import redirectRoute from "./routes/redirectRoute.js"


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB')
    
}).catch((err) => {
    console.error("MongoDB Connection Error", err)
});


app.use('/api', urlRoutes);
app.use('/api', redirectRoute);

app.get('/', (req, res) => {
    res.send("Server is running");
});

app.listen(port, (req, res)=>{
    console.log(`App is listening on : http://localhost:${port}`);
})