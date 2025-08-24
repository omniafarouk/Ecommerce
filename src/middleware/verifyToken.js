import jwt from "jsonwebtoken"

export const verifyToken = (req,res,next) => {

    // prefered that secret key of jwt is different from the email encoding key
    jwt.verify(req.headers.token , 'NTI-intern' , (error , decoded) => { // the 2nd argument is the Secret Key of the token formation
        if(error) return res.status(401).json({message : "unauthorized access inavlid token"}, error)
        // else
        req.decoded = decoded // add a decoded value that was decoded from the token value to the request
        next()   // call then the next step , the function definition after the middleware
    })

}