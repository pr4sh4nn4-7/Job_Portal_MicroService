"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { AppProviderProps, IAppContextType, IApplication, User } from "@/type"
import Cookies from "js-cookie"
import axios from "axios"
import { toast } from "react-toastify"
import { usePathname } from "next/navigation"
import { useRouter } from 'next/navigation'

const Appcontext = createContext<IAppContextType | undefined>(undefined)

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const [btnLoading, setBtnLoading] = useState(false)
  const [applications, setApplications] = useState<IApplication[] | null>(null)
  const router = useRouter()

  const pathname = usePathname()
  async function logoutUser() {
    Cookies.remove("token")
    setUser(null)
    setIsAuth(false)
    setLoading(false)
    router.push('/login')
    toast.error("Logout successful")
  }
  // fetch appplications

  async function fetchApplications() {
    const token = Cookies.get("token")
    if (!token) return

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_USER_SERVICE}/application/readall`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setApplications(Array.isArray(data.data) ? data.data : [])

    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to fetch applications"
      )
    }
  }

  useEffect(() => {
    if (isAuth) {
      fetchApplications()
    }
  }, [isAuth])

  // apply job

  async function applyJob(job_id: number) {

    const token = Cookies.get("token")
    setBtnLoading(true)
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_USER_SERVICE}/application/apply`, {
        job_id
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast.success(data.message)

    } catch (err: any) {
      toast.error(err.response.data.message)

    } finally {
      setBtnLoading(false)
    }

  }

  async function updateProfilePic(fromData: any) {
    setLoading(true)
    try {

      const token = Cookies.get("token")
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_USER_SERVICE}/profile/pic`,
        fromData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message)
      fetchUser()

    } catch (error: any) {
      toast.error(error?.response.data.message)

    } finally {
      setLoading(false)
    }


  }

  async function updateResume(fromData: any) {
    setLoading(true)
    try {

      const token = Cookies.get("token")
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_USER_SERVICE}/profile/resume`,
        fromData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message)
      fetchUser()

    } catch (error: any) {
      toast.error(error?.response.data.message)

    } finally {
      setLoading(false)
    }


  }

  async function addSkill(skill: string) {
    setBtnLoading(true)

    const token = Cookies.get("token")

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_USER_SERVICE}/profile/skill/add`,
        { skillName: skill },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      toast.success(data.message)

      setUser((prev: any) => ({
        ...prev,
        skills: [...(prev.skills || []), skill],
      }))

    } catch (err: any) {
      toast.error(err.response?.data?.message)
    } finally {
      setBtnLoading(false)
    }
  }

  // delete skill


  async function deleteSkill(skill: string) {

    const token = Cookies.get("token")

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_USER_SERVICE}/profile/skill/delete`,
        { skillName: skill },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      toast.success(data.message)

      setUser((prev: any) => ({
        ...prev,
        skills: (prev.skills || []).filter((s: string) => s !== skill),
      }))

    } catch (err: any) {
      toast.error(err.response?.data?.message)
    }
  }



  async function updateUser(
    name: string,
    phoneNumber: string,
    bio: string
  ): Promise<void> {
    setBtnLoading(true)
    const token = Cookies.get("token")

    try {
      const body: { name?: string; phoneNumber?: string; bio?: string } = {}
      if (name) body.name = name
      if (phoneNumber) body.phoneNumber = phoneNumber
      if (bio) body.bio = bio

      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_USER_SERVICE}/profile/info`,
        body,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      toast.success(data.message)
      fetchUser() // refresh user info after update
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong")
    } finally {
      setBtnLoading(false)
    }
  }

  async function fetchUser() {
    setLoading(true)
    const token = Cookies.get("token")
    if (!token) {
      setUser(null)
      setIsAuth(false)
      setLoading(false)
      return
    }

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_USER_SERVICE}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setUser(data)
      setIsAuth(true)
    } catch (err: any) {
      console.log(err)
      setUser(null)
      setIsAuth(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])
  return (
    <Appcontext.Provider
      value={{
        applications,
        fetchApplications,
        user,
        logoutUser,
        loading,
        isAuth,
        btnLoading,
        setBtnLoading,
        setIsAuth,
        setUser,
        setLoading,
        updateProfilePic,
        updateResume,
        updateUser,
        addSkill,
        fetchUser,
        deleteSkill
        , applyJob
      }}
    >
      {children}
    </Appcontext.Provider>
  )
}

export const UseAppData = (): IAppContextType => {
  const context = useContext(Appcontext)
  if (!context) throw new Error("UseAppData must be within AppProvider")
  return context
}
