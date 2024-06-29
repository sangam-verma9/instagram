'use client'
import { Button } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Card from './Card'
import{app} from "@/lib/firebase";
import { getAuth, signOut } from "firebase/auth";
const auth = getAuth(app);
const Right = ({username,fullName,profilepic,allusers,uid}) => {
    const logout=()=>{
        signOut(auth).then(() => {
        // Sign-out successful.
        }).catch((error) => {
        // An error happened.
            console.log(error);
        });
    }
  return (
    <>
        <div className='container  grid grid-rows-12 gap-2 h-screen'>
            <div className='row-span-2  p-1 flex justify-between '>
                <div className=' my-auto flex'>
                    <Image src={profilepic} alt="logo" className='m-3 rounded-full' width={50} height={50} priority={false}/>
                    <div className='my-auto flex flex-col'>
                        <Link  href={`/u/${username}`} className='font-bold hover:underline' style={{fontSize:"12px"}}>{username}</Link>
                        <Link  href={`/u/${username}`}  className=''style={{fontSize:"12px"}}>{fullName}</Link>
                    </div>
                </div>
                <div className='mx-2 my-auto'>
                    <Button variant="outlined" onClick={logout} className='px-2 py-1 capitalize font-bold'>Switch</Button>
                </div>
            </div>
            <div className='row-span-7  p-1'>
                <div className='flex justify-between px-2'>
                    <p>Suggested for you</p>
                    <Link href={"/"} className='font-bold'>See All</Link>
                </div>
                <div>
                    {
                        allusers.map((u,index)=>{
                            if(index>=5)return;
                            return (
                                <Card username={u.username} fullname={u.fullName} profileimg={u.profileimg} />
                            )
                        })
                    }
                </div>
            </div>
            <div className='row-span-3  p-1'>
                <Link href={"/"} className='hover:text-blue-500 hover:underline'>About</Link> . <Link href={"/"} className='hover:text-blue-500 hover:underline'>Help</Link> . <Link href={"/"} className='hover:text-blue-500 hover:underline'>Press</Link> . <Link href={"/"} className='hover:text-blue-500 hover:underline'>Api</Link> . <Link href={"/"} className='hover:text-blue-500 hover:underline'>Jobs</Link> . <Link href={"/"} className='hover:text-blue-500 hover:underline'>Privacy</Link> . <Link href={"/"} className='hover:text-blue-500 hover:underline'>Terms</Link> .
                <br/>
                <Link href={"/"} className='hover:text-blue-500 hover:underline'>Locations</Link> . <Link href={"/"} className='hover:text-blue-500 hover:underline'>Languages</Link> . <Link href={"/"} className='hover:text-blue-500 hover:underline'>Meta verified</Link> 
                <br/>
                &copy; 2024 INSTAGRAM FROM META
            </div>
        </div>
    </>
  )
}

export default Right