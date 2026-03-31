"use client"
import { useParams } from "next/navigation"
import Cookies from 'js-cookie'
import { UseAppData } from "@/context/AppContext"
import { useEffect, useRef, useState } from "react"
import { ICompany, IJob } from "@/type"
import axios from "axios"
import Loading from "@/components/Loading"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Briefcase, Building2, CheckCircle, Clock, DollarSignIcon, Eye, FileText, Globe, Laptop, MapPin, Pencil, Plus, Trash2, Users, XCircle, ExternalLink } from "lucide-react"
import { toast } from "react-toastify"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const ComapnySingle = () => {
  const { id } = useParams()
  const token = Cookies.get('token')
  const { user } = UseAppData()
  const [loading, setLoading] = useState(false)
  const [btnLoaging, setBtnLoading] = useState(false)
  const [company, setCompany] = useState<ICompany | null>(null)
  const [isUpdatedModalOpen, setIsUpdatedModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null)

  const addModalRef = useRef<HTMLButtonElement>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [role, setRole] = useState("")
  const [salary, setSalary] = useState("")
  const [location, setLocation] = useState<string>("")
  const [openings, setOpenings] = useState("")
  const [job_type, setJobType] = useState("")
  const [work_location, setWorkLocation] = useState("")
  const [is_active, setIsActive] = useState(true)

  const clearInput = () => {
    setTitle(""); setDescription(""); setRole(""); setSalary(""); setLocation("");
    setOpenings(""); setJobType(""); setWorkLocation(""); setIsActive(true);
  }

  const addJobHandler = async () => {
    setBtnLoading(true)
    try {
      const jobData = { title, description, role, salary: Number(salary), location, openings: Number(openings), job_type, work_location, company_id: id }
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_JOB_SERVICE}/create`, jobData, { headers: { Authorization: `Bearer ${token}` } })
      toast.success(data.message)
      fetchCompany(); clearInput(); addModalRef.current?.click()
    } catch (err: any) {
      toast.error(err.response.data.message)
    } finally { setBtnLoading(false) }
  }

  const deleteHandler = async (jobId: number) => {
    if (confirm("Are you sure you want to delete this job?")) {
      setBtnLoading(true)
      try {
        const { data } = await axios.delete(`${process.env.NEXT_PUBLIC_JOB_SERVICE}/delete/${jobId}`, { headers: { "Authorization": `Bearer ${token}` } })
        toast.success(data.message)
        fetchCompany()
      } catch (err: any) {
        toast.error(err.response.data.message)
      } finally { setBtnLoading(false) }
    }
  }

  const handleOpenUpdateModal = (job: IJob) => {
    setSelectedJob(job); setTitle(job.title); setDescription(job.description); setRole(job.role);
    setSalary(String(job.salary || "")); setOpenings(String(job.openings)); setJobType(job.job_type);
    setWorkLocation(job.work_location); setLocation(job?.location as string); setIsActive(job.is_active);
    setIsUpdatedModalOpen(true)
  }

  const updateJobHandler = async () => {
    if (!selectedJob) return
    setBtnLoading(true)
    try {
      const updateData = { title, description, role, salary: Number(salary), location, openings: Number(openings), job_type, work_location, is_active, company_id: id }
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_JOB_SERVICE}/update/${selectedJob?.job_id}`, updateData, { headers: { Authorization: `Bearer ${token}` } })
      toast.success(data.message)
      fetchCompany(); setIsUpdatedModalOpen(false); setSelectedJob(null); clearInput();
    } catch (err: any) {
      toast.error(err.response.data.message)
    } finally { setBtnLoading(false) }
  }

  async function fetchCompany() {
    try {
      setLoading(true)
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_COMPANY_SERVICE}/read/${id}`)
      setCompany(data.data)
    } catch (err: any) {
      console.log(err)
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchCompany() }, [id])

  if (loading) return <Loading />

  const isRecruiterOwner = user && company && user.user_id === company?.recruiter_id;

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {company && (
        <div className="max-w-6xl mx-auto px-6 py-12">
          {/* --- HERO SECTION --- */}
          <section className="relative mb-16">
            <div className="absolute inset-0 h-64 bg-[#1a1a1a] rounded-[2rem] -z-10 overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            </div>

            <div className="pt-24 px-8 flex flex-col md:flex-row items-end gap-8">
              <div className="w-40 h-40 rounded-3xl border-[6px] border-white shadow-2xl bg-white overflow-hidden shrink-0">
                <img src={company?.logo} alt={company.name} className="w-full h-full object-contain p-4" />
              </div>

              <div className="flex-1 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-md">Verified Employer</Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">{company.name}</h1>
                <div className="flex items-center gap-6 text-stone-300 text-sm">
                  <Link href={company.website} target="_blank" className="flex items-center gap-2 hover:text-white transition-colors">
                    <Globe size={16} /> {company.website.replace('https://', '')}
                  </Link>
                  <span className="flex items-center gap-2"><Building2 size={16} /> Technology Sector</span>
                </div>
              </div>

              <div className="pb-4">
                <Link href={company.website} target="_blank">
                  <Button className="rounded-full bg-white text-black hover:bg-stone-200 px-8 h-12 shadow-lg">
                    Visit Website <ExternalLink size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-8 px-8 max-w-4xl">
              <p className="text-stone-600 leading-relaxed text-lg">{company.description}</p>
            </div>
          </section>

          {/* --- JOBS SECTION --- */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-serif text-stone-900">Open <span className="italic text-stone-400">Opportunities</span></h2>
                <p className="text-stone-500 text-sm mt-1">Join the team at {company.name}</p>
              </div>

              {isRecruiterOwner && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="rounded-full bg-[#1a1a1a] hover:bg-stone-800 text-white h-12 px-6 shadow-md gap-2">
                      <Plus size={18} /> Post New Job
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] rounded-3xl border-none p-0 overflow-hidden shadow-2xl">
                    <div className="bg-[#1a1a1a] p-8 text-white">
                      <DialogTitle className="text-2xl font-serif">Post a New Role</DialogTitle>
                      <p className="text-stone-400 text-xs mt-1 uppercase tracking-widest">Global Talent Acquisition</p>
                    </div>
                    <div className="p-8 grid gap-4 max-h-[70vh] overflow-auto bg-white">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase text-stone-500 tracking-tighter">Job Title</Label>
                          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior UX Designer" className="rounded-xl h-11 border-stone-200" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase text-stone-500">Department/Role</Label>
                          <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Engineering" className="rounded-xl h-11 border-stone-200" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase text-stone-500">Description</Label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-stone-200 p-3 text-sm focus:outline-none focus:ring-1 focus:ring-stone-400 h-24" placeholder="Briefly describe the responsibilities..." />
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase text-stone-500">Salary Range</Label>
                          <Input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="120000" className="rounded-xl h-11 border-stone-200" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase text-stone-500">Openings</Label>
                          <Input type="number" value={openings} onChange={(e) => setOpenings(e.target.value)} className="rounded-xl h-11 border-stone-200" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase text-stone-500">Location</Label>
                          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="London, UK" className="rounded-xl h-11 border-stone-200" />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase text-stone-500">Job Type</Label>
                          <Select value={job_type} onValueChange={setJobType}>
                            <SelectTrigger className="rounded-xl h-11 border-stone-200"><SelectValue placeholder="Type" /></SelectTrigger>
                            <SelectContent><SelectItem value="full-time">Full Time</SelectItem><SelectItem value="part-time">Part Time</SelectItem></SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase text-stone-500">Work Model</Label>
                          <Select value={work_location} onValueChange={setWorkLocation}>
                            <SelectTrigger className="rounded-xl h-11 border-stone-200"><SelectValue placeholder="Model" /></SelectTrigger>
                            <SelectContent><SelectItem value="onsite">On-site</SelectItem><SelectItem value="remote">Remote</SelectItem><SelectItem value="hybrid">Hybrid</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter className="p-8 bg-stone-50 border-t border-stone-100">
                      <DialogClose asChild><Button variant="ghost" ref={addModalRef}>Cancel</Button></DialogClose>
                      <Button disabled={btnLoaging} onClick={addJobHandler} className="bg-black hover:bg-stone-800 text-white px-8 rounded-xl h-12">
                        {btnLoaging ? "Processing..." : "Publish Job Listing"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {company.jobs && company.jobs.length > 0 ? (
                company.jobs.map(j => (
                  <Card key={j.job_id} className="group p-0 border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 rounded-3xl overflow-hidden bg-white">
                    <div className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-stone-900 group-hover:text-stone-600 transition-colors">{j.title}</h3>
                          <Badge className={`${j.is_active ? "bg-stone-100 text-stone-600" : "bg-red-50 text-red-500"} border-none shadow-none text-[10px] uppercase font-bold tracking-widest`}>
                            {j.is_active ? "Active" : "Closed"}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                          <div className="flex items-center gap-2 text-stone-400 text-sm font-medium">
                            <MapPin size={14} className="text-stone-300" /> {j.location}
                          </div>
                          <div className="flex items-center gap-2 text-stone-400 text-sm font-medium">
                            <Clock size={14} className="text-stone-300" /> {j.job_type}
                          </div>
                          <div className="flex items-center gap-2 text-stone-400 text-sm font-medium">
                            <DollarSignIcon size={14} className="text-stone-300" /> {j.salary ? `$${j.salary.toLocaleString()}` : "Competitive"}
                          </div>
                          <div className="flex items-center gap-2 text-stone-400 text-sm font-medium">
                            <Users size={14} className="text-stone-300" /> {j.openings} Positions
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link href={`/jobs/${j.job_id}`}>
                          <Button variant="ghost" className="rounded-full hover:bg-stone-100 text-stone-600 px-6">View Details</Button>
                        </Link>

                        {isRecruiterOwner && (
                          <div className="flex gap-2 border-l border-stone-100 pl-4 ml-2">
                            <Button size="icon" variant="ghost" onClick={() => handleOpenUpdateModal(j)} className="h-10 w-10 rounded-full hover:bg-stone-100">
                              <Pencil size={16} className="text-stone-400" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => deleteHandler(Number(j.job_id))} className="h-10 w-10 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                              <Trash2 size={16} className="text-stone-400 hover:text-red-500" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-stone-200">
                  <Briefcase size={40} className="mx-auto text-stone-200 mb-4" />
                  <h3 className="text-xl font-serif text-stone-800">No active positions</h3>
                  <p className="text-stone-500 mt-2">Check back later or follow the company for updates.</p>
                </div>
              )}
            </div>
          </section>

          {/* Update Modal (Shared Logic) */}
          <Dialog open={isUpdatedModalOpen} onOpenChange={setIsUpdatedModalOpen}>
            <DialogContent className="sm:max-w-[600px] rounded-3xl border-none p-0 overflow-hidden">
              {/* Structure similar to Create Modal for consistency */}
              <div className="bg-[#1a1a1a] p-8 text-white">
                <DialogTitle className="text-2xl font-serif text-white">Update Listing</DialogTitle>
              </div>
              <div className="p-8 space-y-4 bg-white max-h-[70vh] overflow-auto">
                {/* (Same fields as Add Job...) */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-stone-500 uppercase">Status</Label>
                  <Select value={is_active ? "true" : "false"} onValueChange={v => setIsActive(v === "true")}>
                    <SelectTrigger className="rounded-xl h-11 border-stone-200"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="true">Active Listing</SelectItem><SelectItem value="false">Inactive / Hidden</SelectItem></SelectContent>
                  </Select>
                </div>
                {/* Add inputs back here */}
              </div>
              <DialogFooter className="p-8 bg-stone-50 border-t">
                <Button disabled={btnLoaging} onClick={updateJobHandler} className="w-full h-12 bg-black text-white rounded-xl">Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

export default ComapnySingle
