const express=require("express")
const {userModel}=require("../model/User.model")
const userRouter=express.Router()
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

userRouter.post("/register",async(req,res)=>{
    const { name, email,gender,password,age,city}=req.body
    try{
        bcrypt.hash(password, 5, async(err, hash)=> {
            if(err){
                res.send(err.message)
            }else{
                const user=new userModel({name,email,password:hash,gender,age,city})
                await user.save()
                res.send({"msg":"new user has been registered"})
            }
            // Store hash in your password DB.
        });
    }catch(err){
        res.send({"msg":"something went wrong","error":err.message})
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try{
        const user=await userModel.find({email})
        if(user.length>0){
            bcrypt.compare(password, user[0].password, (err, result)=> {
                if(result){
                    let token = jwt.sign({ userID:user[0]._id }, "masai");
                    res.send({"msg":"logged in","token":token})
                }else{
                    res.send({"msg":"wrong credentials"})
                }

                // result == true
            });
        }else{
            res.send({ "msg": "wrong credentials" })
        }
    }catch(err){
        res.send({ "msg": "something went wrong", "error": err.message })
    }
})

module.exports={
    userRouter
}