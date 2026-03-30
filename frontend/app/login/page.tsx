"use client"

import { UseAppData } from "@/context/AppContext"
import axios from "axios"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { toast } from "react-toastify"
import Cookies from "js-cookie"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, KeyIcon, Mail } from "lucide-react"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [btnLoading, setBtnLoading] = useState(false)

  const { isAuth, setUser, setIsAuth } = UseAppData()
  const router = useRouter()

  useEffect(() => {
    if (isAuth) {
      router.push("/")
    }
  }, [isAuth, router])

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBtnLoading(true)

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE}/login`,
        {
          email,
          password,
        }
      )

      Cookies.set("token", data.token, {
        expires: 7,
        secure: true,
        path: "/",
      })

      setUser(data.user)
      setIsAuth(true)

      toast.success(data.message)

      router.push("/")
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Login failed"

      toast.error(message)
      setIsAuth(false)
    } finally {
      setBtnLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back</h1>
          <p className="text-sm opacity-70">Login to continue</p>
        </div>

        <div className="border rounded-2xl p-8 shadow-lg">
          <form onSubmit={submitHandler} className="space-y-5">

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 h-11 w-full border rounded-md"
              />
            </div>

            <div className="relative">
              <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 h-11 w-full border rounded-md"
              />
            </div>

            <div className="flex justify-end">
              <Link href="/forgot" className="text-sm text-blue-500">
                forgot password?
              </Link>
            </div>

            <Button disabled={btnLoading} className="w-full">
              {btnLoading ? "Signing in..." : "Sign In"}
              <ArrowRight size={18} />
            </Button>

          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-center text-sm">
              Don’t have an account?{" "}
              <Link href="/register" className="text-blue-500">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
