const Boom = require('Boom');

const getError = (err)=>{
    let name = err.name || err;
    if (err.isBoom || err.force){
        return err;
    }
    else {
        switch (name) {
            case 'ValidationError':
                return Boom.badRequest(name, err);
                break;
            case 'NotFound':
                return Boom.notFound(name);
                break;
            case 'CastError':
                return Boom.badRequest(name, err);
                break;
            case 'MongoError':
                return (err.code == 11000) ? Boom.conflict() : Boom.badImplementation();
                break;
            default:
                return Boom.badImplementation();
                break;
        }
    }
};

const errorsHandler = (uncleanError, req, res, next)=>{
    let boomError = getError(uncleanError);
    res.status(boomError.output.statusCode).json({
        errors : {},
        ...boomError.data,
        ...boomError.output.payload
    });
};

module.exports = errorsHandler;