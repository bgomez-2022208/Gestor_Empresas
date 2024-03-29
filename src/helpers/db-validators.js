import Comp from '../company/company.model.js';
import Admin from '../admin/admin.model.js'

export const existenteEmail = async (correo = '') => {
    const existeEmail = await Admin.findOne({correo});
    if (existeEmail){
        throw new Error(`El email ${correo} ya fue registrado`);
    }
}

export const existeAdminById = async (id = '') => {
    const existeAdmin = await Admin.findById(id);
    if (!existeAdmin){
        throw new Error(`El ID: ${correo} No existe`);
    }
}

export const existeCompanyById = async (id = '') => {
    const existeCompany = await Comp.findById(id);
    if (!existeCompany){
        throw new Error(`El ID: ${id} No existe`);
    }
}