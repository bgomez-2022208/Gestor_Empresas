import jwt from 'jsonwebtoken';

export const generarJWT = (uid = ' ') => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(
            payload,
            process.env.Est03sMyPub1cK3y1609,
            {
                expiresIn: '1h'
            },
            (err, token) => {
                err ? (console.log(err),reject('No se pudo generar el token')) : resolve(token);
            }
        )
    })
}