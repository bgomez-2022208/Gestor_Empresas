import bcryptjs from 'bcryptjs';
import Admin from '..//admin/admin.model.js'
import { generarJWT } from '../helpers/generate-jwt.js'; 

export const login = async (req, res) => {
    const { correo, password } = req.body;

  try {
    //verificar si el email existe:
    const admin = await Admin.findOne({ correo });

    if (!admin) {
      return res.status(400).json({
        msg: "Incorrect credentials, Email does not exist in the database",
      });
    }
    console.log("dasdasdsa");
    //verificar si el ususario está activo
    if (!admin.estado) {
      return res.status(400).json({
        msg: "The user does not exist in the database",
      });
    }
    // verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, admin.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Password is incorrect",
      });
    }
    //generar el JWT
    const token = await generarJWT(admin.id);

    res.status(200).json({
      msg: 'Login Ok!!!',
      admin,
      token
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "Contact administrator",
    });
  }
}