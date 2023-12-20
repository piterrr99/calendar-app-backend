const jwt = require( 'jsonwebtoken' );
const { request, response } = require( 'express' );


const validateJWT = ( req=request, res=response , next )=>{

    const token = req.header('x-token');

    if(!token){
        res.status(401).json({
            ok: false,
            msg: 'Usuario no autenticado'
        })
    };

    try {
        
        const payload = jwt.verify( 
            token, 
            process.env.SECRET_JWT_SEED 
        );

        const { name, uid } = payload;

        req.uid = uid;
        req.name = name


        next();



    } catch (error) {
        console.log(error)
        res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }


};

module.exports = {
    validateJWT
}