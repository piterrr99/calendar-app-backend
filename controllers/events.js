const { response } = require( 'express' );

const Event = require( '../models/Event' );

const getEvents = async( req, res=response )=>{

    try {
        
        const events = await Event.find()
                                  .populate('user', 'name');

        return res.json({
            ok: true,
            events
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador'
        });
    };  
};


const createEvent = async( req, res=response )=>{

    const event = new Event( req.body );

    try {
        // console.log(req.uid)
        event.user = req.uid;
        const savedEvent = await event.save();
        return res.json({
            ok: true,
            event: savedEvent
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el dadministrador'
        })
    };
};


const updateEvent = async( req, res=response )=>{
    
    const eventId = req.params.id;
    
    try {
        
        const event = await Event.findById( eventId )

        if(!event){
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningún evento con ese id'
            });
        };

        
        if( event.user.toString() !== req.uid ){
            return res.status(401).json({
                ok: false,
                msg: 'Usted no tiene privilegios para modificar este evento'
            });
        };


        const updatedEvent = await Event.findByIdAndUpdate( eventId, req.body, {new: true} )

        return res.json({
            ok: true,
            event: updatedEvent
        });

    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador'
        });
    }    
};


const deleteEvent = async( req, res=response )=>{
    
    const eventId = req.params.id;
    
    try {
        
        const event = await Event.findById( eventId )

        if(!event){
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningún evento con ese id'
            });
        };

        
        if( event.user.toString() !== req.uid ){
            return res.status(401).json({
                ok: false,
                msg: 'Usted no tiene privilegios para modificar este evento'
            });
        };


        await Event.findByIdAndDelete( eventId );

        return res.json({
            ok: true
        });

    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador'
        });
    }

};


module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
};