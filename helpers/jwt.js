const jwt = require( 'jsonwebtoken' );

const generateToken = ( name, uid )=>{
    	
    const payload = { name, uid };

    return new Promise( (resolve, reject) =>{

        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h'
        }, (error, token)=>{
            
            if(error){
                console.log(error);
                reject('Ha ocurrido un error al generar el token');
            };

            resolve(token)
        })
    })
};

module.exports = {
    generateToken
}

