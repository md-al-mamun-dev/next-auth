import mongoose from "mongoose";

export async function connect() {
    try {
        // const mongodbUri = process.env.MONGODB_URI as string;
        // mongoose.connect(mongodbUri)
        //
        // mongoose.connect(process.env.MONGODB_URI as string)
        
        mongoose.connect(process.env.MONGODB_URI!)
        const connection = mongoose.connection
        connection.on("connected", function () {
            console.log("mongoDB connected")
        })
        connection.on("error", function (error) {
            console.log("mongoDB connection Error, pls make sure db is up and running" + error)
            process.exit()
        })        
    } catch (error) {
        console.log("something went wroong in connecting to DB ");
        console.log(error)
    }    
}