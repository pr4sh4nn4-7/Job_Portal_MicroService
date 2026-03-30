"use client"
import { UseAppData } from "@/context/AppContext"
import { AccountProps } from "@/type"
import React, { useState } from "react"
import { toast } from "react-toastify"
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Award, PlusIcon, Sparkle, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const Skills: React.FC<AccountProps> = ({ user, isYourAccount }) => {
  const { addSkill, btnLoading, deleteSkill } = UseAppData()
  const [skill, setSkill] = useState("")

  const addSkillHandler = () => {
    if (!skill.trim()) {
      toast.error("Please enter a skill")
      return

    }
    addSkill(skill)
    setSkill("")
  }
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addSkillHandler()
    }

  }

  const removeSkillHandler = (skilltoremove: string) => {
    if (confirm("Are you sure want to remove " + skilltoremove + "?")) {
      deleteSkill(skilltoremove)
    }
  }

  return (
    <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto py-6 px-4">
      <Card className="shadow-lg border-1 overflow-hidden">
        <div className="bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-400 p-6">
          <div className="flex items-start gap-4">

            {/* Icon */}
            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
              <Award size={20} className="text-yellow-600" />
            </div>

            {/* Text block */}
            <div className="flex flex-col">
              <CardTitle className="text-2xl text-white leading-tight">
                {isYourAccount ? "Your Skills" : "User Skills"}
              </CardTitle>

              {isYourAccount && (
                <CardDescription className="text-sm text-white/80 mt-1">
                  Your Expertise and abilities
                </CardDescription>
              )}
            </div>

          </div>
        </div>
        {/*  add skills input*/}
        {
          isYourAccount && <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Sparkle size={18} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
              <Input type="text" placeholder="React, Nodejs, ....." className="h-11 pl-10 bg-background" value={skill} onChange={(e) => setSkill(e.target.value)} onKeyPress={handleKeyPress} />

            </div>
            <Button onClick={addSkillHandler} className="h-11 gap-2 px-6" disabled={!skill.trim() || btnLoading}>
              <PlusIcon size={18} />Add skills

            </Button>

          </div>
        }

        {/*skills display*/}
        <CardContent className="p-5">
          {user.skills && user.skills.length > 0 ? <div className="flex flex-wrap gap-3">
            {user.skills.map((e, i) => (
              <div className="group relative inline-flex items-center gap-3 border-2 rounded-full hover:shadow-sm duration-200 transititon-all pl-4 pr-3 py-2" key={i}>
                <span className="font-medium text-sm">{e}</span>

                {
                  isYourAccount && <button onClick={() => removeSkillHandler(e)} className="h-6 w-6 rounded-full text-red-600
                    flex items-center justify-evenly transition-all hover:bg-red-300 hover:-scale-y-110

                    ">

                    <X size={14} />
                  </button>
                }

              </div>


            ))}

          </div> : <div>
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Award size={32} className="opacity-40" />

              </div>
              <CardDescription className="text-base">
                {
                  isYourAccount ? "                Your skill list is empty… time to impress us!" : "No skill added yet."
                }
              </CardDescription>

            </div>


          </div>}
        </CardContent>
      </Card>

    </div>
  )
}

export default Skills
