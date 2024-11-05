const jwt = require('jsonwebtoken');

exports.identifier = (req,res,next) =>{
    let token;
    if(req.headers.client === 'not-browser'){
        token = req.headers.authorization
    }else{
        token = req.cookies['authorization']
    }

    if(!token){
        return res.status(401).json({
            success: false,
            error : "Unauthorized"
        })
    }

    try{
        const userToken = token.split(' ')[1];
        const jwtVerified = jwt.verify(userToken,process.env.TOKEN_SECRET);
        if(jwtVerified){
            req.user = jwtVerified;
            next();
        }else{
            throw new Error('error in the token');
        }
    }catch(error){
        console.log(error);
        return res.status(401).json({
            success: false,
            error: "Unauthorized - Invalid token"
        });
    }

}