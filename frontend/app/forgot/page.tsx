"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UseAppData } from "@/context/AppContext"
import axios from "axios"
import { redirect } from "next/navigation"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { toast } from "react-toastify"

const Forgot = () => {
  const [email, setEmail] = useState("")
  const [btnLoading, setbtnLoading] = useState(false)
  const { isAuth } = UseAppData()
  const router = useRouter()
  if (isAuth) redirect('/')
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setbtnLoading(true)
    try {


      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_AUTH_SERVICE}/forgot`, {
        email
      })
      toast.success(data.message)
      setEmail("")


    } catch (err: any) {

      console.log(err)
      toast.error(err.response.data.message)
    } finally {
      setbtnLoading(false)
    }

  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl space-y-6">

        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Forgot Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive a reset link
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={btnLoading}
          >
            {btnLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        {/* Message */}

        {/* Back to login */}
        <div className="text-center">
          <a
            href="/login"
            className="text-sm text-primary hover:underline"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default Forgot
