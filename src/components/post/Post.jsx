'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import Link from 'next/link';
import{app, db} from "@/lib/firebase";
import Modal from "./Modal"
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
const storage=getStorage(app);
const Post = ({username,profileimg,id,logedinuser,likesnum,commentsnum,caption,comments,img,likes,timestamp,logedinuseruid}) => {
    const [open, setOpen] = React.useState(false);
    const [loading,setLoading] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    
    const [profileimglink,setPorfileimglink]=useState("/userprofile.png")
    const [imglink,setImglink]=useState("/tempimage.png")
    const [commentopen,setCommentopen]=useState(false)
    const [isliked,setLiked]=useState(false);
    const [comment,setComment]=useState("")
    const [commetbuttonname,setCommetbuttonname]=useState("view comments")
    const [currlikesnum,setCurrikesnum]=useState(likesnum)
    const reversecommentbox=()=>{
        setCommentopen(!commentopen);
        if(!commentopen){
            setCommetbuttonname("hide comments")
        }
        else{
            setCommetbuttonname("view comments")
        }

    }
    const commetfn=async(e) => {
        e.preventDefault();
        if(!comment || !username){
            alert("Please fill all the fields");
            return;
        }
        setLoading(true);
        const postRef = doc(db, "posts", id);

        try {
            await updateDoc(postRef, {
            comments: arrayUnion({
                comment:comment,
                username:logedinuser,
                timestamp: new Date(),
            }
            ),
            commentsnum:commentsnum+1
            });
            // alert("Comment added successfully!");
            handleClose()
            setLoading(false);
        } catch (error) {
            console.error("Error adding comment: ", error);
        }
    }
    useEffect(() => {
        const loadimages = async() =>{
            const profileImgUrl = await getDownloadURL(ref(storage, profileimg));
            const imgUrl = await getDownloadURL(ref(storage, img))
            setPorfileimglink(profileImgUrl);
            setImglink(imgUrl);
        }
        loadimages();
    }, []);
    useEffect(() => {
        const loadlikes =async()=>{
            likes.forEach(lik=>{
                if(lik===logedinuseruid){
                    setLiked(true);
                }
            })
        }
        loadlikes();
    }, []);
    const changelinkestate=async()=>{
        if(isliked){
            setLiked(false);
            setCurrikesnum(currlikesnum-1);
            const likeRef = doc(db, "posts", id);
            try {
                await updateDoc(likeRef, {
                    likes: arrayRemove(logedinuseruid),
                    likesnum:currlikesnum-1
                });
            } catch (error) {
                console.log(error);
            }
        }
        else{
            setLiked(true);
            setCurrikesnum(currlikesnum+1);
            const likeRef = doc(db, "posts", id);
            try {
                await updateDoc(likeRef, {
                    likes: arrayUnion(logedinuseruid),
                    likesnum:currlikesnum+1
                });
            } catch (error) {
                console.log(error);
            }
            
        }
    }
  return (
    <>
        <div className='  mx-auto m-2 p-2' >
            <div className=' flex justify-between sm:mx-3 md:mx-3 lg:mx-3 xl:mx-3 my-2'>
                <div className='flex'>
                    <Image src={profileimglink} className='rounded-full' alt='img' width={30} height={30} />
                    &nbsp;
                    <Link href={`/u/${username}`} className='font-bold my-auto hover:underline' style={{fontSize:"15px"}}>{username} </Link>&nbsp;<span className='my-auto ' style={{fontSize:"12px"}}>{timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) }</span>
                </div>
                <div>
                    <MoreHorizIcon className='cursor-pointer'/>
                </div>
            </div>
            <div className='flex justify-center'>
                <Image src={imglink} alt='img' width={400} height={100} />
            </div>
            <div className='flex justify-between p-3'>
                <div className='flex'>
                    <div onClick={changelinkestate}>
                        {
                            isliked? <FavoriteIcon className='m-1 cursor-pointer text-red-600'/>:<FavoriteBorderIcon className='m-1 cursor-pointer' />
                        }
                        
                    </div>
                    <ModeCommentOutlinedIcon onClick={handleOpen} className='m-1 cursor-pointer'/>
                    <Modal isOpen={open} onClose={handleClose}>
                        <>
                            <div className="max-w-sm mx-auto">
                            <div class="mb-5">
                                <label for="caption" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Comment:</label>
                                <textarea id="caption" onChange={e=>setComment(e.target.value)} rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Leave a comment..."></textarea>
                            </div>
                            {
                                loading ?
                                <button disabled type="button" class=" text-white bg-blue-700 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-700 dark:hover:bg-blue-700 dark:focus:ring-blue-700 inline-flex items-center">
                                <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                </svg>
                                Loading...
                                </button>
                                :
                                <button onClick={commetfn}  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Comment</button>
                            }
                            </div>
                        </>
                    </Modal>
                    <SendOutlinedIcon className='m-1 cursor-pointer'/>

                </div>
                <div>
                    <BookmarkBorderOutlinedIcon className='m-1 cursor-pointer' />
                </div>
            </div>
            
            <div className='mx-3'>
                <div>
                    <div className='flex '>
                        <p>{currlikesnum} likes</p>
                        &nbsp;&nbsp;
                        <p>{commentsnum} comments</p>
                    </div>
                    <div>
                        <h1>{caption}</h1>
                    </div>
                    <div>
                        <button onClick={reversecommentbox} className='hover:underline cursor-pointer'>{commetbuttonname}</button>
                        {
                            commentopen ?
                                <div className='p-2'>
                                    {
                                        comments.map((comm, index) => (
                                            <div key={index} className='flex'>
                                                <Link href={`/u/${username}`} className='font-bold hover:underline'>{comm.username}</Link> &nbsp;
                                                <span style={{fontSize:"13px"}} className='my-auto'>{comm.comment}</span> &nbsp;
                                                <span style={{fontSize:"12px"}} className='my-auto'>{comm.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                            </div>
                                        ))
                                    }
                                </div>
                            :
                            <div></div>

                        }
                    </div>
                </div>
            </div>
            
        </div>
    </>
  )
}

export default Post