"use client"

import { User } from "@/type"
import axios from "axios"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import Loading from "@/components/Loading"
import Info from "../(component)/info"
import Skills from "../(component)/skills"

const UserAccount = () => {

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  console.log(id)

  async function fetchUser() {
    const token = Cookies.get("token")


    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_USER_SERVICE}/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setUser(data)
      console.log(data)


    } catch (err: any) {
      console.log(err)

    } finally {
      setLoading(false)
    }


  }

  useEffect(() => {

    fetchUser()
  }, [id])

  if (loading) return <Loading />
  return (

    <div>{
      user && <div className="w-[90%] md:w-[60%] m-auto">

        <Info user={user} isYourAccount={false} />
        {
          user.role === 'jobseeker' && <Skills user={user} isYourAccount={false} />
        }
      </div>

    }  </div>
  )
}

export default UserAccount
