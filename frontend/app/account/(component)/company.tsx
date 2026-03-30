"use client"
import { UseAppData } from "@/context/AppContext"
import { useEffect, useRef, useState } from "react"
import Cookies from 'js-cookie'
import axios from "axios"
import { toast } from "react-toastify"
import Loading from "@/components/Loading"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Briefcase, Building2, Eye, FileText, Globe, Image, Plus, Trash2, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ICompany } from "@/type"
import Link from "next/link"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const Company = () => {
  const { loading } = UseAppData()
  const addRef = useRef<HTMLButtonElement | null>(null)
  const openDialog = () => addRef.current?.click()

  const [companyloading, setCompanyLoading] = useState(true)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [website, setWebsite] = useState("")
  const [logo, setLogo] = useState<File | null>(null)
  const [btnLoading, setBtnLoading] = useState(false)
  const [companies, setCompanies] = useState<ICompany[]>([])

  const clearData = () => {
    setName(""); setDescription(""); setWebsite(""); setLogo(null);
  }

  const token = Cookies.get("token")

  async function fetchCompanies() {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_COMPANY_SERVICE}/readall`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCompanies(data.data)
    } catch (err: any) {
      console.log(err)
    } finally {
      setCompanyLoading(false)
    }
  }

  async function addCompany() {
    if (!name || !description || !website || !logo) return toast.error("Please provide all required fields")
    const formData = new FormData()
    formData.append("name", name); formData.append("description", description);
    formData.append("website", website); formData.append("file", logo);

    try {
      setBtnLoading(true)
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_COMPANY_SERVICE}/create`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success(data.message)
      clearData(); fetchCompanies()
    } catch (err: any) {
      toast.error(err.response.data.message)
    } finally {
      setBtnLoading(false)
    }
  }

  async function deleteCompany(id: number) {
    setBtnLoading(true)
    try {
      if (confirm("Are you sure you want to delete this company?")) {
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_COMPANY_SERVICE}/delete/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
        toast.success(data.message)
        fetchCompanies()
      }
    } catch (err: any) {
      toast.error(err.response.data.message)
    } finally {
      setBtnLoading(false)
    }
  }

  useEffect(() => { fetchCompanies() }, [])

  if (loading) return <Loading />

  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-stone-100 text-[10px] font-bold tracking-widest uppercase mb-3 text-stone-600 border border-stone-200">
            Employer Dashboard
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight">
            Manage <span className="text-stone-400 italic">Companies</span>
          </h1>
          <p className="text-stone-500 mt-3 max-w-md">
            Showcase your brand to 70K+ job seekers. You have used {companies.length} of 3 slots.
          </p>
        </div>

        {companies.length < 3 && (
          <Button
            onClick={openDialog}
            className="rounded-full bg-[#1a1a1a] hover:bg-stone-800 text-white px-8 h-12 gap-2 shadow-xl transition-all hover:-translate-y-1"
          >
            <Plus size={18} />
            Create Company
          </Button>
        )}
      </div>

      {companyloading ? (
        <div className="h-64 flex items-center justify-center"><Loading /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.length > 0 ? (
            companies.map((c) => (
              <Card
                key={c.company_id}
                className="group border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden bg-white flex flex-col"
              >
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-16 w-16 rounded-2xl border border-stone-100 overflow-hidden shadow-sm bg-stone-50 p-1">
                      <img src={c.logo} alt={c.name} className="w-full h-full object-contain rounded-xl" />
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/company/${c.company_id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-stone-100">
                          <Eye size={16} className="text-stone-600" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-600"
                        onClick={() => deleteCompany(c.company_id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl text-stone-900 mb-2 group-hover:text-stone-700 transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-sm text-stone-500 line-clamp-3 leading-relaxed mb-4">
                    {c.description}
                  </p>
                </div>

                <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <a
                    href={c.website}
                    target="_blank"
                    className="text-xs font-semibold text-stone-400 hover:text-stone-900 flex items-center gap-1.5 transition-colors uppercase tracking-wider"
                  >
                    <Globe size={14} />
                    Website
                  </a>
                  <ExternalLink size={14} className="text-stone-300" />
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-stone-200 rounded-3xl">
              <Building2 size={48} className="mx-auto text-stone-200 mb-4" />
              <h3 className="text-xl font-serif text-stone-800">No companies found</h3>
              <p className="text-stone-500 mt-2">Start by creating your first company profile.</p>
            </div>
          )}
        </div>
      )}

      {/* Premium Styled Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="hidden" ref={addRef}></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] border-none shadow-2xl p-0 overflow-hidden rounded-3xl">
          <div className="bg-[#1a1a1a] p-8 text-white">
            <DialogTitle className="text-3xl font-serif">Add New Company</DialogTitle>
            <p className="text-stone-400 text-sm mt-2">Fill in the details to establish your presence.</p>
          </div>

          <div className="p-8 space-y-6 bg-white">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-stone-500">Name</Label>
                <Input id="name" placeholder="Acme Corp" className="border-stone-200 focus:border-stone-900 focus:ring-0 rounded-xl h-12"
                  value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-xs font-bold uppercase tracking-widest text-stone-500">Website URL</Label>
                <Input id="website" placeholder="https://..." className="border-stone-200 focus:border-stone-900 focus:ring-0 rounded-xl h-12"
                  value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-stone-500">About the Company</Label>
                <textarea
                  id="description"
                  rows={3}
                  className="w-full p-3 text-sm border border-stone-200 focus:border-stone-900 focus:outline-none rounded-xl transition-all"
                  placeholder="Describe your company's mission..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo" className="text-xs font-bold uppercase tracking-widest text-stone-500">Brand Logo</Label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-stone-200 rounded-2xl cursor-pointer hover:bg-stone-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Image className="w-8 h-8 text-stone-300 mb-2" />
                      <p className="text-xs text-stone-500">Click to upload logo</p>
                    </div>
                    <input id="logo" type="file" className="hidden" accept="image/*"
                      onChange={(e) => setLogo(e.target.files?.[0] || null)} />
                  </label>
                </div>
              </div>
            </div>

            <Button
              disabled={btnLoading}
              onClick={addCompany}
              className="w-full h-14 bg-[#1a1a1a] hover:bg-black text-white rounded-2xl text-lg font-medium transition-all"
            >
              {btnLoading ? "Processing..." : "Register Company"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Company
