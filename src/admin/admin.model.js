import moongose from 'mongoose';

const AdminSchema = moongose.Schema({
    nombre: {
        type: String,
        required: [true, "The name is required"],
      },
      correo: {
        type: String,
        required: [true, "Email is mandatory"],
        unique: true,
      },
      password: {
        type: String,
        required: [true, "Pasword is required"],
      },
      role: {
        type: String,
        required: true,
        enum: ["ADMIN_ROLE"],
      },
      estado: {
        type: Boolean,
        default: true,
      },
});


AdminSchema.methods.toJSON = function(){
    const { __v, password, _id, ...admin} = this.toObject();
    admin.uid = _id;
    return admin;
  }
  
  export default mongoose.model('Admin', AdminSchema);