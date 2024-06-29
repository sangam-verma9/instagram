import Image from 'next/image'
import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ForumIcon from '@mui/icons-material/Forum';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Link from 'next/link';
const Bottom = ({profilepic ,username}) => {
  return (
    <>
        <div className='grid grid-cols-6'>
          <div className=' flex justify-center my-auto'>
            <Link href={"/"}>
              <HomeIcon />
            </Link>
          </div>
          <div className=' flex justify-center my-auto'>
            <ExploreOutlinedIcon />
          </div>
          <div className=' flex justify-center my-auto'>
            <VideoLibraryIcon />
          </div>
          <div className=' flex justify-center my-auto'>
            <Link href={"/create"}> 
              <AddCircleOutlineIcon />
            </Link>
          </div>
          <div className=' flex justify-center my-auto'>
            <ForumIcon />
          </div>
          <div className=' flex justify-center my-auto'>
            <Link href={`/u/${username}`}>
              <Image src={profilepic} alt="logo" className='m-3 rounded-full' width={20} height={20} priority={false}/>
            </Link>
          </div>
        </div>
      
    </>
  )
}

export default Bottom