'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import{app} from "@/lib/firebase";
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
const storage=getStorage(app);
const Card = ({profileimg,username}) => {
  const [porfileimgurl, setporfileimgurl] = useState("/userprofile.png");
  useEffect(() => {
    const loaddata=async()=>{
      if(profileimg){
        const profileImgRef = ref(storage, profileimg); 
        const profileImgUrl = await getDownloadURL(profileImgRef);
        setporfileimgurl(profileImgUrl);
      }
    }
    loaddata();
  }, []);
  return (
    <>
        <div className='mx-3  p-2'>
            <div className='flex flex-col overflow-hidden' style={{width:"50px"}}>
                <Image src={porfileimgurl} className='rounded-full border-2 border-red-500 cursor-pointer' alt="logo" width={50} height={50} priority={false}/>
                <Link href={`/u/${username}`} className='hover:underline text-sm'>{username}</Link>
            </div>
        </div>
    </>
  )
}

export default Card