const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config()
module.exports = {
    getToken: async(req) => {
        return req.headers.authorization?.replace('Bearer',' ').trim()
    },
    isLogin: async(req,res,next) => {
        const token = req.headers.authorization?.replace('Bearer ',' ').trim();
        const secret = process.env.SECRET;
        if(!token){
            res.status(401).json({
                message: 'Unauthorized'
            })
        }else{
            try {
                const decodedToken = jwt.decode(token,{complete: true});
                if(decodedToken.payload.exp <= Date.now() /1000){
                    res.status(401).json({
                        message: 'Token has expired'
                    })
                }else{
                    const verify = await jwt.verify(token,secret);
                    if(verify != null){
                       req.member= verify.id;
                       next();
                    }else{
                        res.status(401).json({
                            message: 'Unauthorized'
                        })
                    }

                }
            } catch (error) {
                return res.status(400).json({
                    message: error.message ||'server error'
                })
            }
            
        }
        
        
    },
    isLoginAdmin: async(req,res,next) => {
        try {

            next()
            // const token = req.headers.authorization.replace('Bearer','').trim();
            // const secret = process.env.SECRET;
            // if(!token){
            //     res.status(401).json({
            //         message: 'Unauthorized'
            //     })
            // }else{
            //     const decodedToken = jwt.decode(token,{complete: true});
            //     if(decodedToken.payload.exp <= Date.now() /1000){
            //         res.status(401).json({
            //             message: 'Token has expired'
            //         })
            //     }else{
            //         const verify = await jwt.verify(token,secret);
            //         if(verify != null){
            //            req.admin= verify.id;
            //            next();
            //         }else{
            //             res.status(401).json({
            //                 message: 'Unauthorized'
            //             })
            //         }

            //     }
                
            // }
        } catch (error) {
            return res.status(400).json({
                message: error.message ||'server error'
            })
        }
    }
}