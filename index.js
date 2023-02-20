const express=require("express")
const {connection}=require("./Configs/db")
const {userRouter}=require("./routes/User.routes")
const cors=require("cors")
const { postRouter } = require("./routes/Post.route")
const {authentication}=require("./middleware/authentication.middleare")
const app=express()
app.use(express.json())
app.use(cors({
    origin:"*"
}))
app.get("/",(req,res)=>{
    res.send("Home Page")
})

app.use("/users",userRouter)
app.use(authentication)
app.use("/posts",postRouter)




app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log("connected to db")
    }catch(err){
        console.log(err.message)
    }
    console.log(`running at port${process.env.port}`)
})