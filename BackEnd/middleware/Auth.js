const jwt = require('jsonwebtoken');

module.exports.isAuthencaicated = (req,res,next)=>{
    try{
        const token = req.cookies.token;
        if(!token){
        res.status(401).json({
            message:'user not auhorize',
            success:false
        })
        }

        const decode = jwt.verify(token,process.env.SECRETKEY);
        if(!decode){
            res.status(401).json({
                    message:'Invalid',
                    success:false
                })
        }
        req.id  =  decode.userId;
        next()


    }catch(err){
        console.log(err);
    }
}