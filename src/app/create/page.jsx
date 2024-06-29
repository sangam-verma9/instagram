'use client'
import React, { useEffect, useState } from 'react'
import{app, db} from "@/lib/firebase";
import { useRouter} from 'next/navigation'
import {getAuth,onAuthStateChanged} from "firebase/auth";
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, doc, getDoc} from 'firebase/firestore';
const storage=getStorage(app);
const auth =getAuth(app);
const page = () => {
    const router = useRouter();
    const [image ,setImage]=useState(null);
    const [caption, setCaption]=useState("");
    const [username, setUsername]=useState("");
    const [loading, setLoading]=useState(false);
    const [profileimg, setProfileimg]=useState("");
    const [uid, setUid] = useState("")
    const createfn=async()=>{
        if(!image || !caption ){
            alert("Please fill all the fields");
            return;
        }
        try {
            setLoading(true);
            const imgref=ref(storage,`upload/posts/${Date.now()}-${image.name}`);
            const uploadimg= await uploadBytes(imgref,image);
            const docRef = await addDoc(collection(db, "posts"), {
                username:username,
                caption:caption,
                img:uploadimg.ref.fullPath,
                timestamp: new Date(),
                likesnum:0,
                commentsnum:0,
                user_id: uid,
                profileimg: profileimg,
                likes:[],
                comments:[]
            });
            alert("posted successfully")
            console.log("Document written with ID: ", docRef.id);
            setLoading(false);
            router.push("/");

        } catch (error) {
            console.log(error)
        }
        
    }
    useEffect(() => {
        onAuthStateChanged(auth,(userp)=>{
            if(!userp){
                router.push("/login")
                return;
            }
            const docRef = doc(db, "users", userp.uid);
            setUid(userp.uid);
            const docSnap =  getDoc(docRef).then((doc)=>{
                const data=doc.data();
                // console.log(data)
                setUsername(data.username);
                setProfileimg(data.profileimg);
            });
        })
    }, []);

  return (
    <>
        <div className='bg-black py-10 px-5 h-screen'>
        <div class="max-w-sm mx-auto">
        <div class="mb-5">
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="user_avatar">Upload file:</label>
            <input onChange={e=>setImage(e.target.files[0])} class="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar" type="file"/>
        </div>
        <div class="mb-5">
            <label for="caption" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your caption:</label>
            <textarea id="caption" onChange={e=>setCaption(e.target.value)} rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Leave a comment..."></textarea>
        </div>
        {
            loading ?
                <button disabled type="button" class=" text-white bg-blue-700 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-700 dark:hover:bg-blue-700 dark:focus:ring-blue-700 inline-flex items-center w-full">
                    <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                    </svg>
                    Loading...
                </button>
            :
            <button onClick={createfn} class="text-white  float-right w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm   px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
        }
        
        </div>
        </div>
    </>
  )
}

export default page