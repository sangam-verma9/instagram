'use client'
import React, { useEffect, useState } from 'react'
import "./page.css"
import Story from '@/components/story/Story'
import Left from '@/components/left/Left'
import Bottom from '@/components/bottom/Bottom'
import Right from '@/components/right/Right'
import Post from '@/components/post/Post'
import{app, db} from "@/lib/firebase";
import { collection, doc, getDoc, getDocs  } from "firebase/firestore";
import { useRouter} from 'next/navigation'
import {getAuth,onAuthStateChanged} from "firebase/auth";
import {getStorage,ref,getDownloadURL} from "firebase/storage"

const auth =getAuth(app);
const storage=getStorage(app);
const page = () => {
  const router = useRouter()
  const [username,setUsername]=useState("username");
  const [uid,setUid]=useState("");
  const [profileimgurl, setProfileimgurl] = useState("/userprofile.png")
  const [fullName,setFullname]=useState("fullname");
  const [allposts,setAllPosts] = useState([]);
  const [allusers,setAllUsers] = useState([])
  useEffect(() => {
  const checkAuthState = async () => {
    onAuthStateChanged(auth, async (userp) => {
      if (!userp) {
        router.push("/login");
        return;
      }
      setUid(userp.uid);
      const docRef = doc(db, "users", userp.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // const profileImgUrl = await getDownloadURL(ref(storage, data.profileimg));
        if (data.profileimg) {
            const profileImgRef = ref(storage, data.profileimg); // Create a non-root reference
            const profileImgUrl = await getDownloadURL(profileImgRef);
            setProfileimgurl(profileImgUrl);
        }
        // setProfileimgurl(profileImgUrl);
        setUsername(data.username);
        setFullname(data.fullName);
      }
    });
  };

  checkAuthState();
}, [router, setUsername, setFullname]);

useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const posts = [];
      querySnapshot.forEach((doc) => {
        const postData = doc.data();
        postData.id = doc.id;
        posts.push(postData);
      });
      setAllPosts(posts);
    };

    fetchPosts();
  }, [setAllPosts]);
  useEffect(() => {
    const fetchusers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const allsuser = [];
      querySnapshot.forEach((doc) => {
        const postData = doc.data();
        postData.id = doc.id;
        allsuser.push(postData);
      });
      setAllUsers(allsuser);
    };

    fetchusers();
  }, [setAllUsers]);
  return (
    <>
      <div className="  flex justify-center">
        <div className=" container grid grid-cols-1 sm:grid-cols-4 md:grid-col-4 lg:grid-col-4 gap-2">
            <div className=" col-span-1 h-screen box1 hidden sm:block md:block lg:block">
              <Left username={username} profilepic={profileimgurl}/>
            </div>
            <div className=" col-span-2 p-3 h-screen overflow-auto no-scrollbar box2">
              <Story allusers={allusers}/>
              <hr/>
              <div className='container mx-4 sm:mx-8 md:mx-8 lg:mx-8 xl:mx-8' style={{height:"400px", width:"auto"}}>
                {allposts.map((post)=>{
                    return (
                      <Post username={post.username} logedinuser={username} profileimg={post.profileimg} likesnum={post.likesnum} commentsnum={post.commentsnum} id={post.id}
                      caption={post.caption} comments={post.comments} img={post.img} likes={post.likes} timestamp={post.timestamp.toDate()} logedinuseruid={uid}/>
                    )
                })}
              </div> 
            </div>
            <div className=" col-span-1 h-screen box3 hidden sm:block md:block lg:block">
              <Right username={username} fullName={fullName} profilepic={profileimgurl} allusers={allusers} uid={uid}/>
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

export default page