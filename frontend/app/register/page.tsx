
"use client"

import { UseAppData } from "@/context/AppContext"
import axios from "axios"
import { redirect, useRouter } from "next/navigation"
import { FormEvent, useState, useEffect } from "react"
import { toast } from "react-toastify"
import Cookies from "js-cookie"
import { ArrowRight, KeyIcon, Mail, User, Phone } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Loading from "@/components/Loading"
import dynamic from "next/dynamic"
import { RegisterSchema } from '@/validator/register'
import "react-phone-input-2/lib/style.css"
import parsePhoneNumberFromString from "libphonenumber-js"



const PhoneInput = dynamic(() => import("react-phone-input-2"), { ssr: false })

const Register = () => {
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({})
  const [mounted, setMounted] = useState(false)
  const [name, setName] = useState("")
  const [role, setRole] = useState("jobseeker")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [bio, setBio] = useState("")
  const [resume, setResume] = useState<File | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [btnLoading, setBtnLoading] = useState(false)

  const { isAuth, setUser, loading, setIsAuth } = UseAppData()
  const router = useRouter()


  useEffect(() => setMounted(true), [])

  if (loading) return <Loading />
  if (isAuth) return redirect("/")

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const result = RegisterSchema.safeParse({ name, email, password, phoneNumber, role, bio, resume })

    if (!result.success) {
      const fieldErrors: { [key: string]: string } = {}

      // Zod v3+: use .issues
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string
        fieldErrors[key] = issue.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setBtnLoading(true)
    const formData = new FormData()
    formData.append("name", name)
    formData.append("role", role)
    formData.append("email", email)
    formData.append("password", password)

    formData.append("phone_number", phoneNumber)
    if (role === "jobseeker") {
      formData.append("bio", bio)
      if (resume) formData.append("file", resume)
    }

    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_AUTH_SERVICE}/register`, formData

      )



      if (role === "recruiter") {
        router.push("/verify?userId=" + data.user.user_id)
        return
      }


      toast.success(data.message)
      Cookies.set("token", data.token, { expires: 7, secure: true, path: "/" })
      setUser(data.user)
      setIsAuth(true)

    } catch (err: unknown) {
      // safe type narrowing
      const message = axios.isAxiosError(err) ? err.response?.data?.message : "Register failed"
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
          <h1 className="text-4xl font-bold mb-2">Join PCareer</h1>
          <p className="text-sm opacity-70">Create new journey with us</p>
        </div>

        <div className="border border-gray-400 rounded-2xl p-8 shadow-lg backdrop-blur-sm">
          <form onSubmit={submitHandler} className="space-y-5">

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className="pl-10 h-11 w-full border rounded-md" />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10 h-11 w-full border rounded-md" />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="relative">
              <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10 h-11 w-full border rounded-md" />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="relative">
              <PhoneInput
                country="np"
                value={phoneNumber}
                onChange={(phone, data, event, formattedValue) => {
                  // always prepend '+'
                  const formattedPhone = phone.startsWith("+") ? phone : `+${phone}`

                  setPhoneNumber(formattedPhone)

                  // parse for validation
                  const phoneObj = parsePhoneNumberFromString(formattedPhone)

                  setErrors((prev) => ({
                    ...prev,
                    phoneNumber: !phoneObj || !phoneObj.isValid()
                      ? "Phone number is invalid"
                      : undefined,
                  }))
                }}
                inputClass="!w-full !h-11 !pl-14 !border !rounded-md !text-black"
                containerClass="w-full"
              />

              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
            </div>

            <select value={role} onChange={(e) => setRole(e.target.value)} className="h-11 w-full border rounded-md px-3">
              <option value="jobseeker">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>

            {role === "jobseeker" && (
              <div className="flex flex-col gap-4">
                <textarea
                  placeholder="Your Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}

                <label className="w-full border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:border-blue-500 transition-colors relative">
                  {resume ? (
                    <p className="text-sm">{resume.name}</p>
                  ) : (
                    <p className="text-gray-500">Click or drag Resume here to upload</p>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResume(e.target.files ? e.target.files[0] : null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </label>
                {errors.resume && <p className="text-red-500 text-sm mt-1">{errors.resume}</p>}
              </div>
            )}

            <Button disabled={btnLoading} className="w-full">
              {btnLoading ? "Creating account..." : "Register"}
              <ArrowRight size={18} />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-400">
            <p className="text-center text-sm">
              Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
