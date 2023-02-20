const express=require("express")
const {postModel}=require("../model/Post.model")
const postRouter=express.Router()



postRouter.get("/",async(req,res)=>{
    const userID_making_req = req.body.userID
    try{
        const post = await postModel.find({ userID: userID_making_req })
        if(post.length>0){
            res.send(post)
        }else{
            res.send({"msg": "no post available"})
        }  
    }catch(err){
        res.send({"error":err.message})
    }
    
})


postRouter.post("/create",async(req,res)=>{
    const payload=req.body
    try{
        const post=new postModel(payload)
        await post.save()
        res.send({"msg":"post created"})
    }catch(err){
        res.send({"msg":"something went wrong","error":err.message})
    }
})

postRouter.delete("/delete/:id",async(req,res)=>{
    const postID=req.params.id
    const post=await postModel.findOne({"_id":postID})
    const userID_in_post=post.userID
    const userID_making_req=req.body.userID
    try{
        if(userID_making_req!==userID_in_post){
            res.send({"msg":"you are not authorized"})
        }else{
            await postModel.findByIdAndDelete({_id:postID})
            res.send({"msg":`post with id:${postID} has been deleted`})
        }
    }catch(err){
        res.send({ "msg": "something went wrong", "error": err.message })
    }
})

postRouter.patch("/update/:id", async (req, res) => {
    const postID = req.params.id
    const payload=req.body
    const post = await postModel.findOne({ "_id": postID })
    const userID_in_post = post.userID
    const userID_making_req = req.body.userID
    try {
        if (userID_making_req !== userID_in_post) {
            res.send({ "msg": "you are not authorized" })
        } else {
            await postModel.findByIdAndUpdate({ _id: postID },payload)
            res.send({ "msg": `post with id:${postID} has been updated` })
        }
    } catch (err) {
        res.send({ "msg": "something went wrong", "error": err.message })
    }
})

module.exports={
    postRouter
}