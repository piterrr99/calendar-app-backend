/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/


const express = require ( 'express' )

const { check } = require( 'express-validator' )
const { createUser, renewToken, userLogin } = require( '../controllers/auth' );
const { fieldsValidator } = require('../middlewares/fields-validator');
const { validateJWT } = require('../middlewares/jwt-validator');
const router = express.Router()


router.post(
    '/new',
    [ // Middlewares
        check('name', 'El campo nombre es obligatorio').notEmpty(),
        check('email', 'El campo email es obligatorio').isEmail(),
        check('password', 'La contraseña debe tener un mínimo de 6 caracteres').isLength({min: 6}),
        fieldsValidator
    ],
    createUser
);

router.post( 
    '/',
    [ // Middlewares
        check('email', 'El campo email es obligatorio').isEmail(),
        check('password', 'La contraseña debe tener un mínimo de 6 caracteres').isLength({min: 6}),
        fieldsValidator
    ], 
    userLogin )

router.get('/renew', validateJWT, renewToken)

module.exports = router