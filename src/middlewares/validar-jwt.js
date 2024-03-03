import jwt from 'jsonwebtoken'
import Admin from '../admin/admin.model.js'

export const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la petición",
    });
  }

  try {
    //verificación de token
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    //leer el admin que corresponde al uid
    const admin = await Admin.findById(uid);
    //verificar que el admin exista.
    if(!admin){
      return res.status(401).json({
        msg: 'User does not exist in the database'
      })
    }
    //verificar si el uid está habilidato.
    if(!admin.estado){
      return res.status(401).json({
        msg: 'Invalid token - user with status:false'
      })
    }

    req.admin = admin;

    next();
  } catch (e) {
    console.log(e),
      res.status(401).json({
        msg: "Token no válido",
      });
  }
}