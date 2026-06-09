import dotenv from "dotenv/config"
import express from "express"
import cors from "cors"
import {textValidator,signinValidator} from "./Validator.mjs";
import {validationResult,checkSchema,matchedData} from "express-validator"
import mongoose from "mongoose"
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo"
import { Emailrecord,user } from "./Mbschemas.mjs";
import {hashpassword,compare} from "./Helper.mjs";
import dns from "dns"
dns.setServers(["8.8.8.8","1.1.1.1"])

const app = express();

app.use(express.json())
app.use(cors())
app.listen(process.env.PORT || 3000,()=>{
    console.log(`Server Connected `)
} )
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Mongo Db Connected")
}).catch((err)=>{console.log("MongoDB Failed to connect",err)})
app.post("/sendmail",checkSchema(textValidator),async(req,res)=>{
 const result = validationResult(req)
 
 if(! result.isEmpty()){
    return res.status(400).send({error:result.array()[0].msg})
 }
     console.log("Validation passed");
 const body=matchedData(req)
const emaillist=req.body.emaillist
console.log("Before email")
const apiInstance = new TransactionalEmailsApi()
apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_KEY)

new Promise (async function(resolve,reject){
    try{
      for(var i=0;i<emaillist.length;i++)
{
await apiInstance.sendTransacEmail({
  sender: { email: "ak.d.luffy2026@gmail.com", name: "BulkMail" },
  to: [{ email: emaillist[i] }],
  subject: body.subject,
  textContent: body.msg
})
console.log(`Email sent to : ${emaillist[i]}`)

}

resolve("success")
console.log("After sendMail");
}
catch(err){
 console.log(err)
 reject("Failed")

}
})
.then(async()=>{res.send(true)
  await Emailrecord.create({
  subject:body.subject,
  recipient:emaillist,
  status:"Success"
})
  
})
.catch(async()=>{res.send(false)
   await Emailrecord.create({
  subject:body.subject,
  recipient:emaillist,
  status:"Failed"
})
})
})


app.get("/api/history",async(req,res)=>{
  const list= await Emailrecord.find().sort({sentAt:-1})
  console.log(list)
  res.json(list)
})
app.delete("/api/history",async(req,res)=>{
  const deletelist = await Emailrecord.deleteMany()
  res.json({msg:"History cleared"})
})
app.post("/api/signin",checkSchema(signinValidator),async(req,res)=>{
  const result = validationResult(req)
  if(!result.isEmpty()){
   return  res.status(400).send({error:result.array()[0].msg})
  }
  const body = matchedData(req)
  body.password=hashpassword(body.password)
  const euser = await user.findOne({username:body.username})
  if(euser){
    return res.status(409).send({error:"User already Exist"})
  }
  await user.create({
    username:body.username,
    password:body.password
  })
  
  res.status(201).send(true)

})
app.post("/api/login",checkSchema(signinValidator),async(req,res)=>{
  const result = validationResult(req)
  if(!result.isEmpty()){
    return  res.status(400).send({error:result.array()[0].msg})
  }
  const body = matchedData(req)
  const muser = await user.findOne({username:body.username})
  if(!muser){
  return res.status(400).json({error:"User not found , Sign up first"})
  }
    const isMatch =await compare(body.password, muser.password)
  if(!isMatch){
    return res.status(400).json({ error: "Wrong password" })
  }
   return res.status(200).send(true)
})
