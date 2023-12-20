/* 
    Event Routes 
    /api/events

*/

const { Router } = require( 'express' );
const { check } = require( 'express-validator' );

const { validateJWT } = require('../middlewares/jwt-validator');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { fieldsValidator } = require('../middlewares/fields-validator');
const { isDate } = require('../helpers/isDate');

const router = Router();

// Middleware que se aplica a todas las funciones de abajo
router.use( validateJWT )

// Obtener eventos
router.get('/', getEvents);

// Crear evento
router.post(
    '/', 
    [// middlewares
        check('title', 'El campo title es obligatorio').notEmpty(),
        check('start', 'La fecha inicial es obligatoria').custom( isDate ),
        check('end', 'La fecha de finalización es obligatoria').custom( isDate ),
        fieldsValidator
    ],
    createEvent);

// Actualizar evento
router.put(
    '/:id',
    [// middlewares
    check('title', 'El campo title es obligatorio').notEmpty(),
    check('start', 'La fecha inicial es obligatoria').custom( isDate ),
    check('end', 'La fecha de finalización es obligatoria').custom( isDate ),
    fieldsValidator
    ], 
    updateEvent);

// Eliminar evento
router.delete('/:id', deleteEvent);

module.exports = router
