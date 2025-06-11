const express= require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const Db = require('./utils/db');
const userRoute = require('./router/userRoutes'); 
const postRoute = require('./router/postRoutes');
const messageRoute = require('./router/conversationRoutes')

const app = express();


require('dotenv').config();


// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // Fixed: express.urlencoded, not just urlencoded

const corsOption = {
    origin : 'https/localhost:5173',
    credentials:true
}

app.use(cors(corsOption));
app.use('/user',userRoute);
app.use('/post',postRoute);
app.use('/message',messageRoute);

app.get('/user',(req,res)=>{
    res.send("This is Home page");
})

app.listen(process.env.Port,()=>{
    Db();
    console.log(`Your App Is Listning On Port ${process.env.Port}`);
})