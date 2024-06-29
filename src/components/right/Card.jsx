'use client'
import { Button } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter} from 'next/navigation'
import React, { useEffect, useState } from 'react'
import{app} from "@/lib/firebase";
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
const storage=getStorage(app);
const Card = ({username,fullname,profileimg}) => {
  const router = useRouter()
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
  const navigat = () => {
    router.push(`/u/${username}`)
  }
  return (
    <>
        <div className='flex justify-between'>
            <div className=' my-auto flex'>
                <Image src={porfileimgurl} alt="logo" className='m-3 rounded-full' width={40} height={40} priority={false}/>
                <div className='my-auto flex flex-col'>
                    <Link  href={`/u/${username}`} className='font-bold hover:underline' style={{fontSize:"12px"}}>{username}</Link>
                    <p className=''style={{fontSize:"12px"}}>{fullname}</p>
                </div>
            </div>
            <div className='mx-2 my-auto'>
                <Button variant="outlined" onClick={navigat} className='px-2 py-1 capitalize font-bold'>Profile</Button>
            </div>
        </div>
    </>
  )
}

export default Card