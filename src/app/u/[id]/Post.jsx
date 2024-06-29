'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import{app, db} from "@/lib/firebase";
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import "./post.css"
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
const storage=getStorage(app);
const Post = ({commentsnum,likesnum,img}) => {
  const [imglink, setimglink] = useState("/tempimage.png");
  useEffect(() => {
    const loaddata=async()=>{
      if (img) {
        const profileImgRef = ref(storage, img);
        const profileImgUrl = await getDownloadURL(profileImgRef);
        setimglink(profileImgUrl);
      }
    }
    loaddata();
  }, []);
  return (
    <>
        <div className='pcard my-auto'>
            <Image src={imglink} width={150} height={200} alt='post' />
            <div className="overlay">
                <div className="flex justify-center  h-full" >
                    <div className=" my-auto" >
                        <div>
                          <FavoriteBorderIcon  /> &nbsp;{likesnum}
                        </div>
                        <div>
                          <ModeCommentOutlinedIcon />&nbsp;{commentsnum}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Post