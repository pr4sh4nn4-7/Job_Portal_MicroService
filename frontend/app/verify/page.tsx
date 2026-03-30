"use client"

import { useState, useRef } from "react"
import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"

const Verify = () => {
  const [otp, setOtp] = useState(Array(6).fill(""))
  const [btnLoading, setBtnLoading] = useState(false)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const user_id = searchParams.get("userId")
  console.log(user_id)

  const handleChange = (value: string, index: number) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return // allow numbers and letters
    const newOtp = [...otp]
    newOtp[index] = value; setOtp(newOtp)
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp]
      newOtp[index] = ""
      setOtp(newOtp)
      if (!otp[index] && index > 0) {
        inputsRef.current[index - 1]?.focus()
      }
    }
  }

  console.log(otp.join(""))

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setBtnLoading(true)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_AUTH_SERVICE}/verify`, {
        verify_otp: otp.join(""), user_id,
      })
      toast.success("Verified successfully")
      router.push("/login")
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Verification failed")
    } finally {
      setBtnLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border p-8 rounded-2xl shadow-lg" style={{ height: "450px" }}>
        <h1 className="text-2xl font-bold mb-6 text-center">Verify Your Account</h1>
        <form onSubmit={submitHandler} className="flex flex-col items-center space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputsRef.current[idx] = el)}
                type="text"
                inputMode="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-12 h-12 text-center border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            ))}
          </div>
          <Button type="submit" className="w-full" disabled={btnLoading}>
            {btnLoading ? "Verifying..." : "Verify"}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Verify
