const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const userSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        username:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true
        },
        picture:{
            type: String,
            default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        }
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function(username, password){
    const user = await this.findOne({username});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error ('incorrect password');
    }
   throw Error ('incorrect username');
}

const UserModel =  mongoose.model('User',userSchema);

module.exports = UserModel;