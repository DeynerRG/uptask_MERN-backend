import express from "express";
import checkAuth from "../middleware/checkAuth.js";
import { 
    registrarUsuario, 
    autenticarUsuario, 
    confirmarUsuario, 
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
} from "../controllers/usuarioController.js";

const router = express.Router();

// Autenticacion, registro y confirmacion de usuarios
router.post('/', registrarUsuario);
router.post('/login', autenticarUsuario);
router.get('/confirmar/:token', confirmarUsuario); // Rutas dinamicas
router.post('/olvide-password', olvidePassword);
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);

router.get('/perfil', checkAuth, perfil);

export default router