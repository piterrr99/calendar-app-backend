const { response } = require( 'express' )
const bcrypt = require( 'bcrypt' )
const User = require('../models/User');
const { generateToken } = require('../helpers/jwt');


const createUser = async(req, res = response)=>{

    const { email, password } = req.body    
    try {

        let user = await User.findOne({ email });

        if(user){
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese correo'
            })
        }

        user = new User( req.body );

        // Encriptar la contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        // Guardar usuario
        await user.save()

         // Generar el JWT
         const token = await generateToken(user.name, user.id)
    
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })
        
    } catch (error) {
        
        res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador'
        })

    }

};



const renewToken = async(req, res = response)=>{

    const name = req.name;
    const uid = req.uid;

    const token = await generateToken(name, uid)

    res.json({
        ok: true,
        token,
        name,
        uid
    })
};




const userLogin = async(req, res = response)=>{
    const { email, password } = req.body    

    const stringifiedPassword = password.toString();

    try {
        
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningún usuario con ese email'
            });
        };
      
        // Comparar la contraseña
        const isPasswordValid = await bcrypt.compare(stringifiedPassword, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        };

        // Generar el JWT
        const token = await generateToken(user.name, user.id)

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })
        
    } catch (error) {

        console.log(error);
        
        res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador'
        });    
    };


    
};



module.exports = {
    createUser,
    renewToken,
    userLogin
}