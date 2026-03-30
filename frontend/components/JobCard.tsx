"use client"

import { UseAppData } from "@/context/AppContext"
import { IJob } from "@/type"
import React, { useEffect, useState } from "react"
import { Card } from "./ui/card"
import {
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

interface IJobCardProps {
  job: IJob
}


const JobCard: React.FC<IJobCardProps> = ({ job }) => {


  const { user, btnLoading, applyJob, applications } = UseAppData()
  console.log(applications)

  const applyJobHandler = (id: number) => {
    applyJob(id)
  }
  const canApply = user?.role === "jobseeker" && job.is_active
  console.log(job.is_active)

  const [applied, setApplied] = useState(false)

  useEffect(() => {
    if (applications && job.job_id) {
      applications.forEach((item) => {
        if (item.job_id == Number(job.job_id)) setApplied(true)
      })
    }
  }, [applications, job.job_id])

  return (
    <Card
      className="w-full max-w-[380px] p-5 rounded-2xl  mt-4 border border-border 
      bg-gradient-to-br from-background to-muted/40 
      hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group hover:ring-blue-500"
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {job.title}
          </h3>

          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <Building2 size={15} />
            <span className="truncate">{job.company_name}</span>
          </div>
        </div>

        <Link href={`/company/${job.company_id}`}>
          <div
            className="w-14 h-14 rounded-xl overflow-hidden border bg-background shadow-sm 
            group-hover:scale-105 transition"
          >
            <img
              src={job.company_logo}
              alt={job.company_name}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </div>

      {/* DIVIDER */}
      <div className="my-4 h-px bg-border" />

      {/* META INFO */}
      <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin size={14} />
          <span className="truncate">
            {job.location || job.work_location}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Briefcase size={14} />
          <span className="capitalize">{job.job_type}</span>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign size={14} />
          <span>
            {job.salary ? `$${job.salary}` : "Not disclosed"}
          </span>
        </div>

        <div>
          <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-600 capitalize">
            {job.work_location}
          </span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-5 flex items-center justify-between gap-3">
        {/* Date */}
        <span className="text-xs text-muted-foreground">
          {new Date(job.created_at).toLocaleDateString()}
        </span>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          {/* Easy Apply */}
          {
            applied ? <div className="flex-1 flex items-center justify-center gap-2 text-green-600 font-medium text-sm bg-green-100
              dark:bg-green-800/30 rounded-md px-3 py-2

              ">
              <CheckCircle size={18} />Applied

            </div> : <>

              {canApply ? (
                <button
                  disabled={btnLoading}
                  onClick={() => applyJobHandler(Number(job.job_id))}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg 
              bg-blue-600 text-white hover:bg-blue-700 
              disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {btnLoading && job.job_id ? "Applying..." : "Easy Apply"}
                </button>
              ) : job.is_active === false ? (
                <span className="px-3 py-1.5 text-xs rounded-lg bg-gray-200 text-gray-600">
                  Closed
                </span>
              ) : null}

            </>
          }

          {/* View Details */}
          <Link href={`/jobs/${job.job_id}`}>
            <button
              className="px-3 py-1.5 text-sm font-medium rounded-lg 
              border border-border hover:bg-muted transition"
            >
              View Details
            </button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default JobCard
