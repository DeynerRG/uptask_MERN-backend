import nodemailer from 'nodemailer'

export async function emailRegistro(datos){
    const { nombre, email, token } = datos;
    
    
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    // Informacion del email
    const info = await transport.sendMail({
        from: '"upTask - Administrador de proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "upTask - Confirma tu cuenta",
        text: "Confirma tu cuenta para comenzar en upTask",
        html: `
        
        <div style="margin: 0 auto; width: 95%; max-width: 600px; text-align: center; border-radius: 10px; overflow: hidden; font-family: Arial, Helvetica, sans-serif; border:solid .1px #e1e1e1;">
            <p style="font-size: 30px; margin: 0; padding: 10px; font-weight: bold; background-color: #6366F1; color: #fff;">Up<span>Task</span></p>
            <div style="margin-top: 2rem;">
                <img style="width: 180px; margin:0 auto" src="https://res.cloudinary.com/dcvpvpuma/image/upload/v1685051066/undraw_Mail_sent_re_0ofv_cnxgqf.png" alt="email logo">
            </div>
            <p style="margin: 0; padding: 10px; font-size: 24px; font-weight: bold; color: #1F2937; margin-top: 10px;">¡Hola ${nombre}! <span style="display: block; font-size: 16px; padding: 5px; color: #445973;">Por favor, confirma tu dirección de correo</span></p>
            <p style="width: 80%; margin: 5px auto; color: #9CA3AF;">Gracias por registrarte en UpTask, estamos felices de tenerte.</p>
            <a style="text-decoration: none; background-color: #445973; color: #fff; padding: 10px 20px; font-weight: bold; display: inline-block; margin-top: 10px; border-radius: 5px;" href="${process.env.FRONTEND_URL}/confirmar/${token}">Verificar Cuenta</a>
            <p style="font-size: 14px; color: #9CA3AF;" >Si no creaste esta cuenta, puedes ignorar el mensaje</p>
        </div>
        `

    });

}


export async function emailOlvidePassword(datos){
    const { nombre, email, token } = datos;
    
    
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    // Informacion del email
    const info = await transport.sendMail({
        from: '"upTask - Administrador de proyectos" <cuentas@uptask.com>',
        to: email,
        subject: "upTask - Restablece tu Password",
        text: "Restablece tu Password",
        html: `
        <div style="margin: 0 auto; width: 95%; max-width: 600px; text-align: center; border-radius: 10px; overflow: hidden; font-family: Arial, Helvetica, sans-serif; border:solid .1px #e1e1e1;">
            <p style="font-size: 30px; margin: 0; padding: 10px; font-weight: bold; background-color: #6366F1; color: #fff;">Up<span>Task</span></p>
            <div style="margin-top: 2rem;">
                <img style="width: 180px; margin:0 auto" src="https://res.cloudinary.com/dcvpvpuma/image/upload/v1685051066/undraw_Mail_sent_re_0ofv_cnxgqf.png" alt="email logo">
            </div>
            <p style="margin: 0; padding: 10px; font-size: 24px; font-weight: bold; color: #1F2937; margin-top: 10px;">¡Hola ${nombre}! <span style="display: block; font-size: 16px; padding: 5px; color: #445973;">Has solicitado el restablecimiento de tu contraseña</span></p>
            <p style="width: 80%; margin: 5px auto; color: #9CA3AF;">Gracias por formar parte de UpTask, estamos felices de tenerte.</p>
            <a style="text-decoration: none; background-color: #445973; color: #fff; padding: 10px 20px; font-weight: bold; display: inline-block; margin-top: 10px; border-radius: 5px;" href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Contraseña</a>
            <p style="font-size: 14px; color: #9CA3AF;" >Si no solicitaste el restablecimiento de tu contraseña, puedes ignorar el mensaje</p>
        </div>
        `

    });

}