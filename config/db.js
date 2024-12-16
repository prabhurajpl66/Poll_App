import mongoose from "mongoose"
 
export const connectDB = async () =>{
       try {
           const conn = await mongoose.connect(process.env.MONGO_URI)
           console.log(`Db connection established ${conn.connection.host} - ${process.env.MONGO_URI}`)
        
       } catch (error) {
           console.log(`Db connecton failed ${error.messages}`)
           process.exit(1)
       }
}