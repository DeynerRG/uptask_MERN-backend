import Proyecto from '../models/Proyecto.js'
import Tarea from '../models/Tarea.js'
import Usuario from '../models/Usuario.js';

const obtenerProyectos = async (req, res)=>{
    const proyectos = await Proyecto.find({
        '$or': [
            {'colaboradores': { $in: req.usuario}},
            {'creador': { $in: req.usuario}},
        ]
    })
    .select("-tareas");
    res.json(proyectos);
}

const nuevoProyecto = async (req, res)=>{
    const proyecto = new Proyecto(req.body);
    proyecto.creador = req.usuario._id;
    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error);
    }
}

const obtenerProyecto = async (req, res)=>{
    const { id } = req.params;

    try {
        const proyecto = await Proyecto.findById(id)
        .populate({ path: 'tareas', populate: {path: 'completado', select: 'nombre'}})
        .populate('colaboradores', 'nombre email');
        
        if(!proyecto){
            const error = new Error('No encontrado')
            return res.status(404).json({msg: error.message});
        }
        if(proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.colaboradores.some((colaborador)=> colaborador._id.toString() === req.usuario._id.toString() )){
            const error = new Error('Accion no valida')
            return res.status(401).json({msg: error.message});
        }

    
        res.json(proyecto)

    } catch (error) {
        const alert = new Error('error en el servidor')
        res.status(404).json({msg: alert.message});
    }

}

const editarProyecto = async (req, res)=>{
    
    const { id } = req.params;
    
    try {
        const proyecto = await Proyecto.findById(id);
        if(!proyecto){
            const error = new Error('No encontrado')
            return res.status(404).json({msg: error.message});
        }
        if(proyecto.creador.toString() !== req.usuario._id.toString()){
            const error = new Error('Accion no valida')
            return res.status(401).json({msg: error.message});
        }
        // Actualizar el proyecto una vez que paso la validacion
        proyecto.nombre = req.body.nombre || proyecto.nombre;
        proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
        proyecto.cliente = req.body.cliente || proyecto.cliente;
        proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;

        const proyectoActualizado = await proyecto.save();
        res.json(proyectoActualizado);

    } catch (error) {
        const alert = new Error('error en el servidor')
        res.status(404).json({msg: alert.message});
    }
};

const eliminarProyecto = async (req, res)=>{
    const { id } = req.params;
    
    try {
        const proyecto = await Proyecto.findById(id);
        // Buscar el proyecto
        if(!proyecto){
            const error = new Error('No encontrado')
            return res.status(404).json({msg: error.message});
        }
        // Validar que solo el creador tenga acceso al proyecto
        if(proyecto.creador.toString() !== req.usuario._id.toString()){
            const error = new Error('Accion no valida')
            return res.status(401).json({msg: error.message});
        }
        // Eliminar el proyecto una vez que paso la validacion
        await proyecto.deleteOne();
        res.json({msg: 'Proyecto eliminado'});

    } catch (error) {
        const alert = new Error('error en el servidor')
        res.status(404).json({msg: alert.message});
    }
}

const buscarColaborador = async (req, res)=>{
    const { email } = req.body;
    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v')
    if(!usuario){
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({msg: error.message})
    }
    res.json(usuario)


}


const agregarColaborador = async (req, res)=>{
    const proyecto = await Proyecto.findById(req.params.id);

    if(!proyecto){
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({msg: error.message});
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Acción no valida");
        return res.status(404).json({msg: error.message});
    }

    const { email } = req.body;
    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v');
    
    if(!usuario){
        const error = new Error('Usuario no encontrado');
        return res.status(404).json({msg: error.message})
    }

    //  El colaborador no es el admin. del proyecto
    if(proyecto.creador.toString() === usuario._id.toString()){
        const error = new Error('El creador del proyecto no puede ser colaborador');
        return res.status(404).json({msg: error.message})
    }

    //  Revisar que el colaborador aún no este agregado
    if(proyecto.colaboradores.includes(usuario._id)){
        const error = new Error('El usuario ya es colaborador(a)');
        return res.status(404).json({msg: error.message})
    }

    proyecto.colaboradores.push(usuario._id);
    await proyecto.save();
    res.json({msg: 'Colaborador agregado correctamente'});

}

const eliminarColaborador = async (req, res)=>{
    const proyecto = await Proyecto.findById(req.params.id);

    if(!proyecto){
        const error = new Error("Proyecto no encontrado");
        return res.status(404).json({msg: error.message});
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Acción no valida");
        return res.status(404).json({msg: error.message});
    }
    
    proyecto.colaboradores.pull(req.body.id);
    await proyecto.save();
    res.json({msg: 'Colaborador eliminado correctamente'});


}



export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador
    
}


