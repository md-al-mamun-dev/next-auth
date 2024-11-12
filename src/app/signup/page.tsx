"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"


export default function SignUpPage() {
    const router = useRouter()
    const [user, setUser] = useState({
                                        email:"",
                                        password:"",
                                        username:""
                                    })
    const [control, setControl] = useState({
                                                isButtonDisable: false,
                                                loading: false
                                            })
    async function onSubmit() {
        try {
            setControl(state => ({...state, loading:true }))
            const response = await axios.post("/api/users/signup", user)
            console.log("signup success...!", response.data)
            router.push("/login")
        } catch (error: any) {
            console.log(error)
        }
    }

    // useEffect(()=>{
    //     if(user.email.len)
    // },[])
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1>{ control["loading"] ? "Processing..." :  "Signup"}</h1>
        <hr/>
        <div>
            <label htmlFor="username">Username</label>
            <hr/>
            <input 
                className="p-2 border border-gray-300 rounded-lg mb-4 focus: outline-none focus: border-gray-600 text-black"
                type="text" name="username" id="username" value={user["username"]} 
                onChange={e => setUser(state => ({...state, username: e.target.value}))}/>
        </div>
        
        <div>
            <label htmlFor="username">Email</label>
            <hr/>
            <input 
            className="p-2 border border-gray-300 rounded-lg mb-4 focus: outline-none focus: border-gray-600 text-black"
                type="text" name="email" id="email" value={user["email"]} 
                onChange={e => setUser(state => ({...state, email: e.target.value}))}/>
        </div>

        <div>
            <label htmlFor="username">Password</label>
            <hr/>
            <input 
            className="p-2 border border-gray-300 rounded-lg mb-4 focus: outline-none focus: border-gray-600 text-black"
                type="password" name="password" id="password" value={user["password"]} 
                onChange={e => setUser(state => ({...state, password: e.target.value}))}/>
        </div>
        
        <button 
            onClick={onSubmit}
            className="p-2 border border-gray-300 rounded-lg mb-4 focus: outline-none focus: border-gray-600 text-black"        >
            {"sign up"}
        </button>
        
    </div>
  )
}
