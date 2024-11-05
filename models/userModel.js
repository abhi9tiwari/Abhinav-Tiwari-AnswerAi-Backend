const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email : {
        type : String,
        required : [true, "Email in mandatory"],
        unique : [true, "Email must be unique"],
        trim : true,
        minLength : [5, "Email should be atleast 5 characters long"],
        lowercase : true 
    }, 
    password : {
        type : String,
        required : [true, "Password is mandatory"],
        minLength : [8, "Password should be atleast 8 characters long"],
        match : [/^(?=.*[a-z])(?=.*[A-Z])(?=.*d).{8,}$/, 
            "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character"],
        trim : true,
        select : false
    }, 
    verified : {
        type : Boolean,
        default : false
    },
    verificationCode : {
        type : Number,
        select : false
    },
    verificationCodeValidation : {
        type : Number,
        select : false
    },
    forgotPasswordCode : {
        type : String,
        select : false
    },
    forgotPasswordCodeValidation : {
        type : String,
        select : false
    },
    refreshToken:{
        type : String,
        select : false
    }
},{
    timestamps : true
});

module.exports = mongoose.model('user',userSchema); 