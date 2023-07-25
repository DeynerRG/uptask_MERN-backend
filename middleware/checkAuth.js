
import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js';

/*  La funcion checkAuth es un middleware que se encarga de verificar que el usuario
este autenticado para poder ejecutar la peticion de la api que en este caso es la 
consulta del perfil del usuario. */

const checkAuth = async (req, res, next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){ 
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.usuario = await Usuario.findById(decoded.id).select("-password -confirmado -token -createdAt -updatedAt -__v");
            return  next();
        } catch (error) {
            return res.status(404).json({msg: 'Hubo un error'});
        }
    }

    if(!token){
        const error = new Error('Token no valido');
        return res.status(401).json({msg: error.message})
    }

    next();
}

export default checkAuth;