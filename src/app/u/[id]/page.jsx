'use client'
import Bottom from '@/components/bottom/Bottom'
import Left from '@/components/left/Left'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import "./page.css"
import { useParams } from 'next/navigation';
import { useRouter} from 'next/navigation'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import Post from './Post';
import{app, db} from "@/lib/firebase";
import { arrayRemove, arrayUnion, collection, doc, getDoc,getDocs,query,updateDoc, where  } from "firebase/firestore";
import Modal from "./Modal";
import {getAuth,onAuthStateChanged} from "firebase/auth";
import {getStorage,ref,uploadBytes,getDownloadURL} from "firebase/storage"
const storage=getStorage(app);
const auth =getAuth(app);
const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const [loading,setLoading] = useState(false);
  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState("")
  const [logedinuseruid, setlogedinuserUid] = useState("")
  const [useruid, setUseruid] = useState("")
  const [bio, setBio] = useState("")
  const [followersnum, setFollowersnum] = useState(0)
  const [followingnum, setFollowingnum] = useState(0)
  const [postsnum, setPostsnum] = useState(0)
  const [profileimgurl, setProfileimgurl] = useState("/userprofile.png")
  const [profileimg, setProfileimg] = useState(null)
  const [owner, setOwner] = useState(false)
  const [ownusername, setOwnusername] = useState("")
  const [ownprofileimg, setOwnprofileimg] = useState("/userprofile.png")
  const [allposts, setAllposts] = useState([]);
  const [isfollowed, setFollowed] = useState(false);
  useEffect(() => {
  const checkAuthState = async () => {
    onAuthStateChanged(auth, async (userp) => {
      if (!userp) {
        router.push("/login");
        return;
      }
      setUsername(params.id)
      setlogedinuserUid(userp.uid);
      const docRef = doc(db, "users", userp.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.profileimg) {
          const profileImgRef = ref(storage, data.profileimg);
          const profileImgUrl = await getDownloadURL(profileImgRef);
          setOwnprofileimg(profileImgUrl);
        }
        setOwnusername(data.username);
        if(data.username == params.id){
          setOwner(true);
        }
      }
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", params.id));
      try {
        const querySnapshot = await getDocs(q);
        const users = [];
        querySnapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() });
        });
        setUseruid(users[0].id)
        setFullName(users[0].fullName);
        setBio(users[0].bio);
        setFollowersnum(users[0].followers.length);
        setFollowingnum(users[0].following.length);
        if(users[0].profileimg){
          getDownloadURL(ref(storage,users[0].profileimg)).then(url=>{
            setProfileimgurl(url)
          })
        }
        users[0].followers.forEach((f)=>{
          if(f===userp.uid){
            setFollowed(true);
          }
        })
        } catch (error) {
        console.error("Error getting documents:", error);
      }
    });
  };

  checkAuthState();
}, [router, setOwnusername]);
  // useEffect(() => {
  //   const loadprofiledata=async()=>{
  //     const usersRef = collection(db, "users");
  //     const q = query(usersRef, where("username", "==", params.id));
  //     try {
  //       const querySnapshot = await getDocs(q);
  //       const users = [];
  //       querySnapshot.forEach((doc) => {
  //         users.push({ id: doc.id, ...doc.data() });
  //       });
  //       setUseruid(users[0].id)
  //       setFullName(users[0].fullName);
  //       setBio(users[0].bio);
  //       setFollowersnum(users[0].followers.length);
  //       setFollowingnum(users[0].following.length);
  //       setFollowers(users[0].followers);
  //       if(users[0].profileimg){
  //         getDownloadURL(ref(storage,users[0].profileimg)).then(url=>{
  //           setProfileimgurl(url)
  //         })
  //       }
        
  //     } catch (error) {
  //       console.error("Error getting documents:", error);
  //     }
  //   }
  //   loadprofiledata();
  // }, [setlogedinuserUid]);
  useEffect(() => {
    const loadpostsdata=async()=>{
      const postref = collection(db, "posts");
      const q = query(postref, where("username", "==", params.id));
      try {
        const querySnapshot = await getDocs(q);
        const posts = [];
        querySnapshot.forEach((doc) => {
          posts.push({ id: doc.id, ...doc.data() });
        });
        setAllposts(posts);
        setPostsnum(posts.length);
      } catch (error) {
        console.log(error)
      }
    }
    loadpostsdata();
  }, []);
  const updatefn=async(e)=>{
    e.preventDefault();
    if(!fullName || !bio){
      alert("Please fill all the fields");
      return;
    }
    setLoading(true);
    if(profileimg){
      try {
        const imgref=ref(storage,`upload/profile/${Date.now()}-${profileimg.name}`);
        const uploadimg= await uploadBytes(imgref,profileimg);
        const docRef = doc(db, "users", logedinuseruid);
        await updateDoc(docRef, {
          "fullName": fullName,
          "bio": bio,
          "profileimg": uploadimg.ref.fullPath
        });
        handleClose();
        alert("updated successfully");
        setLoading(false);
        
      } catch (error) {
        console.log(error)
      }
    }
    else{
      try {
        const docRef = doc(db, "users", logedinuseruid);
        await updateDoc(docRef, {
          "fullName": fullName,
          "bio": bio
        });
        handleClose();
        alert("updated successfully");
      } catch (error) {
        console.log(error)
      }
    }

  }
  const unfollowUser=async()=>{
    setFollowed(false);
    setFollowersnum(followersnum-1)
    const followRef = doc(db, "users", useruid);
    const followRef2 = doc(db, "users",logedinuseruid);
    try {
      await updateDoc(followRef, {
        followers: arrayRemove(logedinuseruid)
      });
      await updateDoc(followRef2, {
        following: arrayRemove(useruid)
      });
    } catch (error) {
      console.log(error);
    }
  }
  const followUser=async()=>{
    setFollowed(true)
    setFollowersnum(followersnum+1)
    const followRef = doc(db, "users", useruid);
    const followRef2 = doc(db, "users",logedinuseruid);
    try {
      await updateDoc(followRef, {
          followers: arrayUnion(logedinuseruid)
      });
      await updateDoc(followRef2, {
          following: arrayUnion(useruid)
      });
    } catch (error) {
        console.log(error);
    }
    setFollowersnum(followersnum+1)
  }
  
  return (
    
    <>
        
      <div className="  flex justify-center no-scrollbar">
        <div className=" container grid grid-cols-1 sm:grid-cols-4 md:grid-col-4 lg:grid-col-4 gap-2">
            <div className=" col-span-1 h-screen box1 hidden sm:block md:block lg:block ">
              <Left username={ownusername} profilepic={ownprofileimg} />
            </div>
            <div className=" col-span-3 h-screen overflow-auto no-scrollbar m-2 sm:m-5 ms:m-5 lg:m-5 xl:m-5 p-2 sm:p-5 ms:p-5 lg:p-5 xl:p-5">
              <div className='flex flex-col'>
                <div className='grid grid-cols-8'>
                    <div className='col-span-2 my-auto flex justify-center flex-col'>
                        <div className='flex justify-center'>
                            <Image src={profileimgurl} className='rounded-full' alt='profile img' width={100} height={100}/>
                        </div>
                        <div className='m-2 flex justify-center'>{postsnum} posts</div>
                    </div>
                    <div className='col-span-6 my-auto'>
                        <div className=' grid grid-rows-3 m-2 sm:m-5 ms:m-5 lg:m-5 xl:m-5'>
                            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 m-1 sm:m-3 ms:m-3 lg:m-3 xl:m-3'>
                                <div className='flex flex-col' >
                                  <div className='font-bold col-span-1'>{username}</div>
                                  <div style={{fontSize:"12px"}}> {fullName}</div>
                                </div>
                                <div className='col-span-1'>
                                  {
                                    !owner ? <div>
                                      {
                                        isfollowed? <button onClick={unfollowUser} className='bg-gray-100 font-bold py-2 px-4 rounded'>Unfollow</button>
                                        : <button onClick={followUser} className='bg-gray-200 font-bold py-2 px-4 rounded'>Follow</button>
                                      }
                                    </div>
                                    :
                                    <div>
                                      <button onClick={handleOpen}  className='bg-gray-100 font-bold py-2 px-4 rounded'>Edit profile</button>
                                  <Modal isOpen={open} onClose={handleClose}>
                                    <>
                                      <form className="max-w-sm mx-auto">
                                        <div className="mb-5">
                                          <label for="fullName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fullname:</label>
                                          <input type="text" id="fullName" value={fullName} onChange={(e)=>setFullName(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  required />
                                        </div>
                                        <div className="mb-5">
                                          <label for="Bio" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Bio:</label>
                                          <input type="text" id="Bio" value={bio} onChange={(e)=>setBio(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                                        </div>
                                        <div className='mb-5'>
                                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="user_avatar">Upload file:</label>
                                          <input onChange={(e)=>setProfileimg(e.target.files[0])} className="block w-full text-sm p-2.5 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar" type="file"></input>
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
                                          <button onClick={updatefn} type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update</button>

                                        }
                                      </form>
                                    </>
                                  </Modal>
                                    </div>
                                  }
                                </div>
                            </div>
                            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 m-1 sm:m-3 ms:m-3 lg:m-3 xl:m-3'>
                                <div className='col-span-1'>{followersnum} Followers</div>
                                <div className='col-span-1'>{followingnum} Following</div>
                            </div>
                            <div className='m-1 sm:m-3 ms:m-3 lg:m-3 xl:m-3'>
                                {bio}
                            </div>
                        </div>
                    </div>
                </div>
                <hr/>
                <div className=''>
                    <div className='flex justify-around m-2'>
                        <div className='font-bold cursor-pointer hover:bg-slate-100 px-3 py-1 rounded'><LibraryBooksIcon/>&nbsp;posts</div>
                        <div className='cursor-pointer hover:bg-slate-100 px-3 py-1 rounded'><BookmarkIcon/>&nbsp;saved</div>
                        <div className='cursor-pointer hover:bg-slate-100 px-3 py-1 rounded'><PermContactCalendarIcon/>&nbsp;taged</div>
                    </div>
                    <div className='p-2 sm:p-5 md:p-5 lg:p-5 xl:p-8'>
                        <div className='grid gap-1 grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 '>
                            {
                              allposts.map((p ,index)=>{
                                return(
                                  <Post key={index} commentsnum={p.commentsnum} likesnum={p.likesnum} img={p.img}/>
                                )
                              })
                            }
                            
                        </div>
                    </div>
                    
                </div>
              </div>
            </div>
        </div>
        <div className='absolute bottom-0 left-0 right-0 block sm:hidden md:hidden lg:hidden'>
          <div className='container p-3 bg-white'>
            <Bottom profilepic={profileimgurl} username={username}/>
          </div>
        </div>

      </div>
        
    </>
  )
}

export default Page