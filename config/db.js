import mongoose from "mongoose";

export default async function conectarBD(){
    try {
        
        const connectionOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
        const connection = await mongoose.connect(process.env.MONGO_URI, connectionOptions);
        
        const host = connection.connection.host;
        const port = connection.connection.port;

        const url = `${host}:${port}`
        
        
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1); // forza la finalizacion del proceso
    }
}