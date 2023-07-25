import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarID.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js";

// Controladores de las peticiones en la api usuarios
const registrarUsuario = async (req, res)=>{
    // Evitar registros duplicados
    const { email } = req.body;
    const existeUsuario = await Usuario.findOne({email})
    if(existeUsuario){
        const error = new Error(`La cuenta ya existe, elige otro email o inicia sesion`)
        return res.status(400).json({msg: error.message})
    }

    // Si no existe el usuario, lo agrega
    try {
        // req.body es el objeto de datos enviado del frontend en la peticion
        const usuario = new Usuario(req.body);
        usuario.token = generarId(); // creacion del token
        await usuario.save();
        // Envio de email de confirmacion de cuenta
        emailRegistro({
            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token
        })
        res.json({msg: 'Usuario creado correctamente, Revisa tu Email para confirmar tu cuenta'});
    } catch (error) {
        console.log(error)
    } 
};

const autenticarUsuario = async (req, res)=>{
    
    const { email, password } = req.body;
    // Validar si existe el usuario
    const usuario = await Usuario.findOne({email})
    if(!usuario){
        const error = new Error('El usuario no existe');
        return res.status(404).json({msg: error.message})
    }

    // Validar si esta confirmado
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({msg: error.message})
    }

    // Validar el password
    // En el schema del model usuario se definio una funcion para validar passwords
    const coincidenLasCredenciales = await usuario.comprobarPassword(password);
    if(coincidenLasCredenciales){
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    }else{
        const error = new Error('El password es incorrecto')
        res.status(403).json({msg: error.message})
    }
};

const confirmarUsuario = async (req, res)=>{
    
    // Extraer el token de la url mediante req.params
    const { token } = req.params;

    // Verificar si existe un usuario con el token proporcionado
    const usuarioConfirmar = await Usuario.findOne({ token });
    if(!usuarioConfirmar){
        const error = new Error('Token no valido');
        return res.status(403).json({msg: error.message})
    }

    // Confirmar usuario
    try {
        // Actualizar el estado del usuario confirmado
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = ''
        // Actualizar los cambios en la BD
        await usuarioConfirmar.save();
        res.json({msg: 'usuario confirmado correctamente'});
        

    } catch (error) {
        console.log(error);
    }
    
}

const olvidePassword = async (req, res)=>{
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });
    if(!usuario){
        const error = new Error('El usuario no existe');
        return res.status(403).json({msg: error.message});
    }

    try {
        // Genera un nuevo token.
        usuario.token = generarId();
        await usuario.save();

        // Enviar el email
        const datosUsuario = {
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        }
        emailOlvidePassword(datosUsuario);

        res.json({msg: 'Hemos enviado un email con las instrucciones'});

    } catch (error) {
        console.log(error)
        
    }


};

const comprobarToken = async (req, res)=>{
    const { token } = req.params;
    const tokenValido = await Usuario.findOne({token});
    
    if(!tokenValido){
        const error = new Error('Token no valido');
        return res.status(403).json({msg:error.message})    
    }

    res.json({msg: 'Token valido y el usuario existe'})

};

const nuevoPassword = async (req, res)=>{
    const { token } = req.params; // Parametros de la url
    const { password } = req.body; // Parametros del JSON

    const usuario = await Usuario.findOne({token});
    if(usuario){
        usuario.password = password;
        usuario.token = '';
        try {
            await usuario.save();
            res.json({msg: 'password actualizado correctamente'});
        } catch (error) {
            console.log(error)
        }
    }else{
        const error = new Error('Token no valido');
        return res.status(404).json({msg:error.message});
    }

};

const perfil = async (req, res)=>{
    const { usuario } = req;
    res.json(usuario)
};

export{
    registrarUsuario,
    autenticarUsuario,
    confirmarUsuario,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
};