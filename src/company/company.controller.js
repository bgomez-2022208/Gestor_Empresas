import { response, request } from "express";
//import bcryptjs from 'bcryptjs';
import Company from '../company/company.model.js';
import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';


export const getCompany = async (req = request, res = response) => {
    const {limite, desde} = req.query;
    const query = {state: true};

    /*const usuarios = await Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite));

    const total = await Usuario.countDocuments(query);*/

    const [total, company] = await Promise.all([
        Company.countDocuments(query),
        Company.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        company
    });
}

export const createCompany = async (req, res) => {
    const {name, level, age, category} = req.body;
    const company = new Company( {name, level, age, category} );

    //verificar si el correo existe
   
    //encriptar password
    //const salt = bcryptjs.genSaltSync(); //por default tiene 10 vueltas
    //usuario.password = bcryptjs.hashSync(password, salt);

    //guardar datos
    await company.save();

    res.status(200).json({
        company
    });
}

export const getCompanyById = async (req, res) => {
    const {id} = req.params;
    const company = await Company.findOne({_id: id});
    
    res.status(200).json({
        company
    })
}

export const companyPut = async (req, res = response) => {
    const { id } = req.params;
    const {_id,  ...resto} = req.body;

    
    await Company.findByIdAndUpdate(id, resto);

    const company = await Company.findOne({_id: id});

    res.status(200).json({
        msg: 'Company update',
        company,
    });
}

export const generarExcel = async (companys) => {
    console.log('generar reporte');
    try {
        console.log('generar reporte');
      const directorio = process.env.ARCHIVOS_DIR;
  
      if (!directorio) {
        throw new Error('La variable de entorno ARCHIVOS_DIR no está definida');
      }
      if (!fs.existsSync(directorio)) {
        fs.mkdirSync(directorio, { recursive: true });
      }
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Companys');
  
      worksheet.addRow(['Name', 'Impact level', 'Years of trayectory', 'Category']);
      
      companys.forEach((companys) => {

        worksheet.addRow([

            companys.name,
            companys.level,
            companys.age,
            companys.category

        ]);

      });
  
      const filePath  = path.join(directorio, 'reporte_de_empresas.xlsx');

      await workbook.xlsx.writeFile(filePath );
  
      return filePath ;

    } catch (error) {
      console.error('Error al generar el reporte de Excel:', error);
      throw error;
    }
  };


  export const obtenerEmpresas = async () => {
    try {
      const companys = await Company.find();
      return companys; 
    } catch (error) {
      console.error('Error no se pueden conseguir las companys en la base de datos', error);
      throw error;
    }
};


export const comcategoriaget = async (req, res) => {
    try {
        const query = {state : true};

        const category = await Company.distinct('category', query);

        category.sort();

        res.status(200).json({
            category: category
        });
    
    } catch (e){
        console.log(e);
        res.status(400).json({
            msg: "No mes posible listar comunicate con el administrador"
        })
    }
}