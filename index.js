import express from 'express';
import dotenv from 'dotenv';
import conectarBD from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js'
import cors from 'cors' 


const app = express();
app.use(express.json()); // Permite procesar informacion json
dotenv.config(); // Permite el acceso a las variables de entorno
conectarBD();

// Configuracion CORS para permitir la comunicacion desde el dominio del frontend
const whiteList = [process.env.FRONTEND_URL]; // Dominio que tiene permitido comunicarse al backend.

const corsOptions = {
    origin: function(origin, callback){
        if(whiteList.includes(origin)){
            // Puede comunicarse con el backend
            callback(null, true);
        }else{
            // No puede comunicarse con el backend
            callback(new Error("Error de cors"));
        }
    }
}

app.use(cors(corsOptions));

// ROUTING
app.use('/api/usuarios', usuarioRoutes); // Usuarios
app.use('/api/proyectos', proyectoRoutes); // Proyectos
app.use('/api/tareas', tareaRoutes); // Tareas

const PORT = process.env.PORT || 4000;
const servidor = app.listen(PORT, ()=>{
    console.log(`Servidor ejecutandose en el puerto ${PORT}...`)
});

// Socket.io
import { Server } from 'socket.io'
const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL,
    },
})

io.on('connection', (socket)=>{
    console.log('conectado a socket.io')

    // Definir los eventos de socket.io
    socket.on('abrir proyecto',(proyecto)=>{
        socket.join(proyecto);
    });

    socket.on('nueva tarea', (tarea)=>{
        socket.to(tarea.proyecto).emit('tarea agregada', tarea)
    });

    

})
