import React from 'react'
import Card from './Card'

const Story = ({allusers}) => {
  return (
    <>
        <div className='flex justify-center'>
            <div className='container flex m-1 overflow-auto no-scrollbar'>
                {
                  allusers.map((user,id)=>{
                    return(
                      <Card id={id} username={user.username} profileimg={user.profileimg}/>
                    )
                  })
                }
            </div>
        </div>
    </>
  )
}

export default Story