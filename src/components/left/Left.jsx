'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ForumIcon from '@mui/icons-material/Forum';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';
import{app} from "@/lib/firebase";
import { getAuth, signOut } from "firebase/auth";
const auth = getAuth(app);
const Left = ({username,profilepic}) => {
    const logout=()=>{
        signOut(auth).then(() => {
        // Sign-out successful.
            alert("logout successful")
        }).catch((error) => {
        // An error happened.
            console.log(error);
        });
    }
  return (
        
        <div className='container  grid grid-rows-12 gap-2 h-screen '>
            <div className='row-span-1  flex'>
                <Image src="/logo.png" alt="logo" width={200} height={100} priority={false}/>
            </div>
            <div className='row-span-10  '>
                <div className=' m-1 hover:bg-slate-100 rounded cursor-pointer'>
                    <Link href={"/"}>
                    <HomeIcon className='m-3' style={{width:"30px", height:"30px"}}/>
                    &nbsp;&nbsp;
                    <span className='font-bold'> {" "}Home</span>
                    </Link>
                </div>
                <div className=' m-1 hover:bg-slate-100 rounded cursor-pointer'>
                    <SearchIcon className='m-3' style={{width:"30px", height:"30px"}}/>
                    &nbsp;&nbsp;
                    <span className='font-bold'> {" "}Search</span>
                </div>
                <div className=' m-1 hover:bg-slate-100 rounded cursor-pointer'>
                    <ExploreOutlinedIcon className='m-3' style={{width:"30px", height:"30px"}}/>
                    &nbsp;&nbsp;
                    <span className='font-bold'> {" "}Explore</span>
                </div>
                <div className=' m-1 hover:bg-slate-100 rounded cursor-pointer'>
                    <VideoLibraryIcon className='m-3' style={{width:"30px", height:"30px"}}/>
                    &nbsp;&nbsp;
                    <span className='font-bold'> {" "}Reels</span>
                </div>
                <div className=' m-1 hover:bg-slate-100 rounded cursor-pointer'>
                    <ForumIcon className='m-3' style={{width:"30px", height:"30px"}}/>
                    &nbsp;&nbsp;
                    <span className='font-bold'> {" "}Messages</span>
                </div>
                <div className=' m-1 hover:bg-slate-100 rounded cursor-pointer'>
                    <FavoriteBorderIcon className='m-3' style={{width:"30px", height:"30px"}}/>
                    &nbsp;&nbsp;
                    <span className='font-bold'> {" "}Notification</span>
                </div>
                <Link href={"/create"} className=' m-1 flex hover:bg-slate-100 rounded cursor-pointer'>
                    <AddCircleOutlineIcon className='m-3' style={{width:"30px", height:"30px"}}/>
                    &nbsp;&nbsp;
                    <span className='font-bold my-auto'> {" "}Create</span>
                </Link>
                <Link href={`/u/${username}`} className=' m-1 flex hover:bg-slate-100 rounded cursor-pointer'>
                    <Image src={profilepic} alt="logo" className='m-3 rounded-full' width={30} height={30} priority={false}/>
                    &nbsp;&nbsp;
                    <span className='font-bold my-auto'> {" "}Profile</span>
                </Link>
                
            </div>
            <div className='row-span-1 cursor-pointer  '>
                <div onClick={logout}>
                    <LogoutIcon className='mx-3' style={{width:"30px", height:"30px"}}/>
                    &nbsp;&nbsp;
                    <span className='font-bold'> {" "}Logout</span>
                </div>
            </div>

        </div>
        
  )
}

export default Left