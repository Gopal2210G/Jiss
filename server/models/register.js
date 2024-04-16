const mongoose=require('mongoose');

const registerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    loginType: [{
        type: String,
        enum: ['registrar', 'judge', 'lawyer'],
        required: true
    }],
    count:{
        type:Number,
        default:0
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    }
})

//model
const Register=new mongoose.model("Register",registerSchema);

module.exports=Register;