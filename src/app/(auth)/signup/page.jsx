'use client'
import React,{useEffect, useState} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter} from 'next/navigation'
import { collection, query, where, getDocs,doc, setDoc, Timestamp  } from "firebase/firestore";
import FacebookIcon from '@mui/icons-material/Facebook';
import{app, db} from "@/lib/firebase";

import {getAuth,createUserWithEmailAndPassword,onAuthStateChanged} from "firebase/auth"; 

const auth =getAuth(app);
const Page = () => {
    const router = useRouter();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [fullName,setFullName]=useState("");
    const [loading,setLoading]=useState(false);
    const [username,setUsername]=useState("");
    const createUser=async(e)=>{
      e.preventDefault();
      setLoading(true);
      if(!email || !password || !fullName || !username){
        alert("Please fill all the fields");
        return;
      }
      try {
        const quer = query(collection(db, "users"), where("email", "==", email));
        const useremailexitst = await getDocs(quer);
        if(!useremailexitst){
          alert("Email already exists");
          return;
        }
        const q = query(collection(db, "users"), where("username", "==", username));
        const usernameExists = await getDocs(q);
        if(!usernameExists.empty){
          alert("Sorry this Username already taken");
          return;
        }
        const usercredential=await createUserWithEmailAndPassword(auth,email,password)
        const user=usercredential.user;
        // console.log(user)
        // set user
        await setDoc(doc(db, "users",user.uid),{
          uid:user.uid,
          email:user.email,
          username:username,
          fullName:fullName,
          createdAt:Timestamp.now(),
          followers:[],
          following:[],
          bio:"update your bio from edit profile",
        });
        setLoading(false);
      } catch (error) {
        alert(error.message);
        console.log(error)
      }
    }
    useEffect(() => {
    onAuthStateChanged(auth,(user)=>{
      if(user){
        router.push("/")
      }
    })
  }, [])
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2   m-5 gap-3' id="wrapper">
        <div className=' justify-center hidden sm:flex lg:flex md:flex xl:flex'>
          <Image src={"/loginimg.png"} width={400} height={500}/>
        </div>
        <div className="p-2 flex  flex-col justify-center " style={{width:"400px"}}>
          <div className='flex flex-col m-3 border-2 border-gray-500 p-4'>
              <div className="  flex justify-center">
                <Image src="/logo.png" alt="logo" width={200} height={100} priority={false} />
              </div>
              <div className='m-2'>
                <div className='flex justify-center m-1'>
                  <button className='bg-sky-500 mb-5 py-2 px-4 border-gray-400 border-1 rounded'><FacebookIcon /> Sign up with Facebook</button>
                </div>
                <div className='grid grid-cols-7'>
                  <hr className='m-2 col-span-3 bg-black'/>
                  <p className='text-center col-span-1' style={{fontSize:"13px"}}>OR</p>
                  <hr className='m-2 col-span-3'/>
                </div>
              </div>
              <div className=" flex flex-col  justify-center px-4" >
                <input type="email" placeholder="Mobile Number or Email" value={email} className='mb-5 py-2 px-4 border-gray-400 border-1 rounded bg-gray-100' onChange={(e)=>setEmail(e.target.value)}/>
                <input type="text" placeholder="Full Name" value={fullName} className='mb-5 py-2 px-4 border-gray-400 border-1 rounded bg-gray-100'  onChange={(e)=>setFullName(e.target.value)}/>
                <input type="text" placeholder="Username" value={username} className='mb-5 py-2 px-4 border-gray-400 border-1 rounded bg-gray-100'  onChange={(e)=>setUsername(e.target.value)}/>
                <input type="password" placeholder="Password" value={password} className='mb-5 py-2 px-4 border-gray-400 border-1 rounded bg-gray-100' onChange={(e)=>setPassword(e.target.value)}/>
                {
                  loading ?
                    <button disabled type="button" class=" text-white bg-blue-500 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-500 dark:hover:bg-blue-500 dark:focus:ring-blue-500 inline-flex items-center">
                    <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                    </svg>
                    Loading...
                    </button>
                  :
                  <button className="bg-sky-500 mb-5 py-2 px-4 border-gray-400 border-1 rounded" onClick={createUser}>Sign up</button>

                }
              </div>
          </div>
          <div className='m-3 border-2 border-gray-600 p-4'>
            <div className="flex justify-center ">
              Have an account? &nbsp;<Link href="/login" className='hover:underline'>{" "} Login</Link>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Page