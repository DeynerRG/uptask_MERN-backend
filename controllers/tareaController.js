import Tarea from "../models/Tarea.js";
import Proyecto from "../models/Proyecto.js";


const agregarTarea = async (req, res)=>{
    // Comprobar si existe el proyecto al que pertenece la tarea
    const proyecto = await Proyecto.findById(req.body.proyecto);
    if(!proyecto){
        const error = new Error('El proyecto no existe');
        return res.status(404).json({msg: error.message});
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error('No tienes los permisos para añadir tareas');
        return res.status(404).json({msg: error.message});
    }

    try {
        const tareaAlmacenada = await Tarea.create(req.body);
    
        //  Almacenar el id en el proyecto
        proyecto.tareas.push(tareaAlmacenada._id);
        await proyecto.save();
        
        res.json(tareaAlmacenada);

    } catch (error) {
        console.log(error)
    }
};

const obtenerTarea = async (req, res)=>{
    
    const { id } = req.params;
    try {
        const tarea = await Tarea.findById(id).populate("proyecto");
    
        if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
            const error = new Error('No tienes los permisos para acceder a las tareas')
            return res.status(403).json({msg: error.message})
        };
    
        res.json(tarea);
    } catch (error) {
        const e = new Error('No se encontro la tarea')
        return res.status(404).json({msg: e.message})
    }

};

const actualizarTarea = async (req, res)=>{
    const { id } = req.params;
    try {
        const tarea = await Tarea.findById(id).populate("proyecto");
    
        if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
            const error = new Error('No tienes los permisos para acceder a las tareas')
            return res.status(403).json({msg: error.message})
        };
    
        tarea.nombre = req.body.nombre || tarea.nombre;
        tarea.descripcion = req.body.descripcion || tarea.descripcion;
        tarea.prioridad = req.body.prioridad || tarea.prioridad;
        tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;
        
        const tareaActualizada = await tarea.save();
        res.json(tareaActualizada)

    } catch (error) {
        const e = new Error('No se encontro la tarea')
        return res.status(404).json({msg: e.message})
    }
};

const eliminarTarea = async (req, res)=>{
    const { id } = req.params;
    try {
        const tarea = await Tarea.findById(id).populate("proyecto");
    
        if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
            const error = new Error('No tienes los permisos para acceder a las tareas')
            return res.status(403).json({msg: error.message})
        };
    
        const proyecto = await Proyecto.findById(tarea.proyecto);
        proyecto.tareas.pull(tarea._id);
        await Promise.allSettled([await proyecto.save(), await tarea.deleteOne() ])
        res.json({msg: "Tarea eliminada"});

    } catch (error) {
        const e = new Error('No se encontro la tarea')
        return res.status(404).json({msg: e.message})
    }
};

const cambiarEstadoTarea = async (req, res)=>{
    
    const { id } = req.params;
    try {
        const tarea = await Tarea.findById(id)
        .populate("proyecto")
        .populate('completado');
        
        if(!tarea){
            const error = new Error("Tarea no encontrada")
            return res.status(404).json({msg: error.message})
        }

        if(tarea.proyecto.creador.toString() !== req.usuario._id.toString() && !tarea.proyecto.colaboradores.some((colaborador)=> colaborador._id.toString() === req.usuario._id.toString())){
            const error = new Error('Accion no valida')
            return res.status(403).json({msg: error.message})
        };
    
        tarea.estado = !tarea.estado;
        tarea.completado = req.usuario._id;
        await tarea.save();
        const tareaAlmacenada = await Tarea.findById(id)
        .populate("proyecto")
        .populate('completado');
        res.json(tareaAlmacenada)

    } catch (error) {
        const e = new Error('No se encontro la tarea')
        return res.status(404).json({msg: e.message})
    }


};

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstadoTarea
}

