import { Router } from "express";
import { check } from "express-validator";
import excel from 'exceljs';

import {
    getCompanyById,
    createCompany,
    companyPut,
    obtenerEmpresas,
    generarExcel,
    comcategoriaget
    
} from "../company/company.controller.js";

import {
    existeCompanyById,
  } from "../helpers/db-validators.js";


  import { validarCampos } from "../middlewares/validar-campos.js";
  //import { tieneRole } from "../middlewares/validar-roles.js";
  import { validarJWT } from "..//middlewares/validar-jwt.js";
  
  const router = Router();
  
  router.get("/list", comcategoriaget);
  
  router.get(
    "/:id",
    [
      check("id", "No es un ID válido").isMongoId(),
      check("id").custom(existeCompanyById),
      validarCampos,
    ],
    getCompanyById
  );
  
  router.post(
    "/",
    [
      validarJWT,
      check("name", "El nombre es obligatorio").not().isEmpty(),
      check("level", "El nivel de impacto es obligatorio").not().isEmpty(),
      check("age", "La edad de la empresa es obligatoria").not().isEmpty(),
      check("category", "A que se dedica la empresa").not().isEmpty(),
      validarCampos,
    ],
    createCompany
  );

  router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("id").custom(existeCompanyById),
        validarCampos,
    ],
    companyPut
  );



  router.post('/generar-reporte', async (req, res) => {
    try{
      const company = await obtenerEmpresas();
  
      const directorioDeReportes = './reporte';
  
      const filePath  = await generarExcel(company, directorioDeReportes);
  
      res.download(filePath , 'reporte_de_empresas.xlsx', (err) => {
  
        if(err){
          console.error('Error al enviar el archivo:', err);
          res.status(500).json({mensaje: 'Error al enviar el archivo'});
  
        }else{
  
          console.log('archivo enviado correctamente')
  
        }
      });
  
    }catch(error){
  
      console.log('Error al generar el reporte de empresas:', error);
      res.status(500).json({ mensaje: 'Error al generar el reporte de empresas' });
  
    }
  });

  

  
  export default router;