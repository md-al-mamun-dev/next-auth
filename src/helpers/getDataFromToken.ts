import jwt from "jsonwebtoken";
import User from "@/models/userModel";

export async function getDataFromToken(token : string){
        const { id:userId }: any  = jwt.verify(token, process.env.TOKEN_SECRET!)
        return await User.findOne({ _id: userId}).select('-_id -__v -password')
}