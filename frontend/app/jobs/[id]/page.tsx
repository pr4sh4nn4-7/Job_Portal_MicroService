"use client"

import Loading from "@/components/Loading"
import { Button } from "@/components/ui/button"
import { UseAppData } from "@/context/AppContext"
import { IApplication, IJob } from "@/type"
import axios from "axios"
import { ArrowLeft, Briefcase, MapPin, Building2, DollarSign, Users, Clock, FileText, User, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import Cookies from 'js-cookie'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

const statusOptions = ['submitted', 'rejected', 'hired']
const filterOptions = ['ALL', ...statusOptions]

const statusStyles: Record<string, string> = {
  submitted: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  rejected: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  hired: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
}

const SJob = () => {
  const { user } = UseAppData()
  const [job, setJob] = useState<IJob | null>(null)
  const [loading, setLoading] = useState(true)
  const [jobApplications, setJobApplications] = useState<IApplication[]>([])
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({})
  const [selectedStatuses, setSelectedStatuses] = useState<Record<string, string>>({})
  const router = useRouter()
  const { id } = useParams()
  const token = Cookies.get('token')

  async function fetchSingleJob() {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_JOB_SERVICE}/read/${id}`)
      setJob(data)
    } catch (err: any) {
      console.error(err)
      toast.error("Failed to load job details")
    } finally {
      setLoading(false)
    }
  }

  async function fetchJobApplications() {
    if (!user || user.role !== 'recruiter') return
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_JOB_SERVICE}/application/readall/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setJobApplications(data.data)
    } catch (err: any) {
      console.error(err)
      toast.error("Failed to load applications")
    }
  }

  const updateApplicationHandler = async (app: IApplication) => {
    const status = selectedStatuses[app.application_id]
    if (!status) return toast.error("Please select a status first")

    setUpdatingIds(prev => ({ ...prev, [app.application_id]: true }))
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_JOB_SERVICE}/application/update/${app.application_id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setJobApplications(prev =>
        prev.map(a => a.application_id === app.application_id ? data.updatedApplication[0] : a)
      )
      toast.success("Application updated successfully")
      setSelectedStatuses(prev => { const n = { ...prev }; delete n[app.application_id]; return n })
      fetchJobApplications()
    } catch (err: any) {
      console.error(err)
      toast.error("Failed to update application")
    } finally {
      setUpdatingIds(prev => ({ ...prev, [app.application_id]: false }))
    }
  }

  useEffect(() => { fetchSingleJob() }, [])
  useEffect(() => { if (user && job && user.role === 'recruiter') fetchJobApplications() }, [user, job])

  const filteredApplications = filterStatus === 'ALL'
    ? jobApplications
    : jobApplications.filter(app => app.status === filterStatus)

  if (loading) return <Loading />
  if (!job) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f6f3]">
      <p className="text-[#9b9590] font-medium tracking-wide">Job not found.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f7f6f3]" style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');

        .card-hover {
          transition: box-shadow 0.25s ease, transform 0.2s ease;
        }
        .card-hover:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.10);
          transform: translateY(-2px);
        }
        .chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .update-btn {
          position: relative;
          overflow: hidden;
          transition: background 0.2s ease, opacity 0.2s ease;
        }
        .update-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }
        .section-card {
          background: #ffffff;
          border: 1px solid #ebebeb;
          border-radius: 20px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.04);
        }
        .detail-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid #f0efed;
          font-size: 14px;
          color: #3d3b38;
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { color: #9b9590; min-width: 120px; font-size: 13px; }
        .filter-pill {
          padding: 6px 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.18s ease;
        }
        .filter-pill.active {
          background: #1a1816;
          color: #fff;
          border-color: #1a1816;
        }
        .filter-pill:not(.active) {
          background: #fff;
          color: #6b6966;
          border-color: #e4e3e1;
        }
        .filter-pill:not(.active):hover {
          border-color: #1a1816;
          color: #1a1816;
        }
        .app-card {
          background: #fff;
          border: 1px solid #ebebeb;
          border-radius: 16px;
          padding: 20px;
          transition: box-shadow 0.2s ease, transform 0.18s ease;
        }
        .app-card:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          transform: translateY(-1px);
        }
        .ghost-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid #e4e3e1;
          border-radius: 8px;
          cursor: pointer;
          background: #fafafa;
          color: #3d3b38;
          transition: border-color 0.18s, background 0.18s, color 0.18s;
          text-decoration: none;
        }
        .ghost-btn:hover {
          border-color: #1a1816;
          background: #1a1816;
          color: #fff;
        }
        .primary-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          font-size: 13px;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          background: #1a1816;
          color: #fff;
          border: none;
          transition: background 0.18s, opacity 0.18s;
          letter-spacing: 0.01em;
        }
        .primary-btn:hover:not(:disabled) { background: #2f2c29; }
        .primary-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #6b6966;
          cursor: pointer;
          padding: 8px 0;
          border: none;
          background: transparent;
          transition: color 0.15s;
        }
        .back-btn:hover { color: #1a1816; }
        select, [data-radix-select-trigger] {
          border-radius: 10px !important;
          border-color: #e4e3e1 !important;
          font-size: 13px !important;
        }
      `}</style>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Back Button */}
        <button className="back-btn mb-8" onClick={() => router.back()}>
          <ArrowLeft size={15} /> Back to Jobs
        </button>

        {/* Hero Card */}
        <div className="section-card p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {job.company_logo ? (
              <img
                src={job.company_logo}
                alt={job.company_name}
                className="w-20 h-20 object-contain rounded-xl border border-[#ebebeb] bg-[#fafafa] p-2 flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl border border-[#ebebeb] bg-[#f3f2f0] flex items-center justify-center flex-shrink-0">
                <Building2 size={28} className="text-[#c4c1bb]" />
              </div>
            )}

            <div className="flex-1">
              <h1
                className="text-3xl font-bold text-[#1a1816] mb-1 leading-tight"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                {job.title}
              </h1>
              <p className="text-[#6b6966] text-base mb-3">{job.company_name}</p>

              <div className="flex flex-wrap gap-2">
                <span className="chip bg-[#f3f2f0] text-[#4a4845]">
                  <MapPin size={12} /> {job.location || 'Remote'}
                </span>
                <span className="chip bg-[#f3f2f0] text-[#4a4845]">
                  <Briefcase size={12} /> {job.job_type}
                </span>
                <span className="chip bg-[#f3f2f0] text-[#4a4845]">
                  <Clock size={12} /> Posted {new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="md:text-right">
              <p className="text-2xl font-bold text-[#1a1816]">
                {job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable'}
              </p>
              <p className="text-[#9b9590] text-sm mt-0.5">per year</p>
            </div>
          </div>
        </div>

        {/* Job Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {[
            { icon: <Briefcase size={16} />, label: 'Job Type', value: job.job_type },
            { icon: <User size={16} />, label: 'Role', value: job.role },
            { icon: <MapPin size={16} />, label: 'Work Location', value: job.work_location },
            { icon: <DollarSign size={16} />, label: 'Salary', value: job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable' },
            { icon: <Users size={16} />, label: 'Openings', value: `${job.openings} position${Number(job.openings) !== 1 ? 's' : ''}` },
          ].map(({ icon, label, value }) => (
            <div key={label} className="section-card p-5 flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-[#f3f2f0] flex items-center justify-center text-[#6b6966] flex-shrink-0">
                {icon}
              </div>
              <div>
                <p className="text-[11px] font-medium text-[#9b9590] uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-[#1a1816] font-semibold text-sm">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="section-card p-8 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[#f3f2f0] flex items-center justify-center">
              <FileText size={15} className="text-[#6b6966]" />
            </div>
            <h2 className="text-lg font-semibold text-[#1a1816]">Job Description</h2>
          </div>
          <p className="text-[#4a4845] leading-relaxed whitespace-pre-line text-sm">{job.description}</p>
        </div>

        {/* Applications Section — Recruiter only */}
        {user?.role === 'recruiter' && (
          <div className="section-card p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-[#1a1816]">Applications</h2>
                <p className="text-[#9b9590] text-sm mt-0.5">{jobApplications.length} total applicants</p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                {filterOptions.map(status => (
                  <button
                    key={status}
                    className={`filter-pill ${filterStatus === status ? 'active' : ''}`}
                    onClick={() => setFilterStatus(status)}
                  >
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {filteredApplications.length === 0 ? (
              <div className="text-center py-16 text-[#9b9590]">
                <Users size={32} className="mx-auto mb-3 opacity-40" />
                <p className="font-medium">No applications found</p>
                <p className="text-sm mt-1">Try changing the filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredApplications.map(app => {
                  const isUpdating = updatingIds[app.application_id]
                  const chosenStatus = selectedStatuses[app.application_id]
                  return (
                    <div key={app.application_id} className="app-card">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-[11px] text-[#9b9590] font-mono mb-1">#{app.application_id}</p>
                          <p className="text-[#3d3b38] font-medium text-sm">{app.applicant_email}</p>
                        </div>
                        <span className={`chip text-[11px] ${statusStyles[app.status] || 'bg-gray-100 text-gray-600'}`}>
                          {app.status}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mb-4">
                        <button
                          className="ghost-btn"
                          onClick={() => window.open(`/account/${app.applicant_id}`, '_blank')}
                        >
                          <User size={12} /> Profile
                        </button>
                        <button
                          className="ghost-btn"
                          onClick={() => window.open(app.resume, '_blank')}
                        >
                          <FileText size={12} /> Resume
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-[#f0efed] mb-4" />

                      {/* Status Select */}
                      <p className="text-[11px] font-medium text-[#9b9590] uppercase tracking-widest mb-2">Update Status</p>
                      <Select
                        value={chosenStatus || ''}
                        onValueChange={val => setSelectedStatuses(prev => ({ ...prev, [app.application_id]: val }))}
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="mb-3 h-9 text-sm rounded-xl border-[#e4e3e1]">
                          <SelectValue placeholder="Choose new status…" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map(status => (
                            <SelectItem key={status} value={status} className="text-sm">
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* Update Button */}
                      <button
                        className="primary-btn w-full justify-center"
                        disabled={isUpdating || !chosenStatus}
                        onClick={() => updateApplicationHandler(app)}
                      >
                        {isUpdating ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Updating…
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={14} />
                            Update Status
                          </>
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SJob
