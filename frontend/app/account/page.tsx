"use client"
import Loading from "@/components/Loading"
import { UseAppData } from "@/context/AppContext"
import Info from "./(component)/info"
import Skills from "./(component)/skills"
import Company from "./(component)/company"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const Account = () => {
  const { isAuth, user, loading } = UseAppData()


  const router = useRouter()

  useEffect(() => {
    if (!isAuth && !loading) {
      router.push('/login')
    }
  }, [isAuth, router, loading])


  if (loading) return <Loading />
  return (
    <div>{
      user && <div className="w-[90%] md:w-[60%] m-auto">

        <Info user={user} isYourAccount={true} />
        {
          user.role === 'jobseeker' && <Skills user={user} isYourAccount={true} />
        }
      </div>

    }

      {
        user?.role === "recruiter" && <Company />
      }

    </div>
  )
}

export default Account
