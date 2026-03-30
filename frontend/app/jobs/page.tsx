"use client"

import { IJob } from "@/type"
import { useEffect, useRef, useState } from "react"
import Cookies from "js-cookie"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Briefcase, Filter, MapPin, Search, X } from "lucide-react"
import Loading from "@/components/Loading"
import { toast } from "react-toastify"
import JobCard from "@/components/JobCard"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const locations: string[] = [
  "Kathmandu",
  "Dharan",
  "Itahari",
  "Biratnagar",
  "Jhapa",
  "Remote",
]

const Jobs = () => {
  const [loading, setLoading] = useState(false)
  const [jobs, setJobs] = useState<IJob[]>([])
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")

  const token = Cookies.get("token")
  const ref = useRef<HTMLButtonElement>(null)

  const hasActiveFilters = Boolean(title || location)

  //  FETCH JOBS
  async function fetchJob() {
    setLoading(true)
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_JOB_SERVICE}/readall/?title=${title}&location=${location}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setJobs(Array.isArray(data.data) ? data.data : [])
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to fetch jobs"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchJob()
    }, 400)

    return () => clearTimeout(delay)
  }, [title, location])

  // open dialog
  const openFilter = () => {
    ref.current?.click()
  }

  // clear filters
  const clearFilter = () => {
    setTitle("")
    setLocation("")
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Explore <span className="text-red-500">Opportunities</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              {jobs.length} Jobs Available
            </p>
          </div>

          {/* FILTER BUTTON */}
          <Button
            className="gap-2 h-11 rounded-xl shadow-sm hover:shadow-md transition"
            onClick={openFilter}
          >
            <Filter size={18} />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-xs animate-pulse">
                Active
              </span>
            )}
          </Button>
        </div>

        {/* ACTIVE FILTERS */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="text-sm text-muted-foreground">
              Active Filters:
            </span>

            {title && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full 
              bg-blue-50 text-blue-600 border border-blue-200 shadow-sm">
                <Search size={14} />
                <span className="truncate max-w-[120px]">{title}</span>
                <button
                  onClick={() => setTitle("")}
                  className="hover:bg-blue-100 rounded-full p-1"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            {location && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full 
              bg-purple-50 text-purple-600 border border-purple-200 shadow-sm">
                <MapPin size={14} />
                <span>{location}</span>
                <button
                  onClick={() => setLocation("")}
                  className="hover:bg-purple-100 rounded-full p-1"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* JOB LIST */}
        {loading ? (
          <Loading />
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <JobCard job={job} key={job.job_id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full 
            bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 mb-4">
              <Briefcase size={36} className="opacity-50" />
            </div>

            <h3 className="text-xl font-semibold mb-2">
              No Jobs Found
            </h3>

            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your filters
            </p>

            <Button variant="outline" onClick={clearFilter}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* FILTER MODAL */}
        <Dialog>
          <DialogTrigger asChild>
            <Button ref={ref} className="hidden"></Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Filter className="text-blue-600" />
                Filter Jobs
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-5 py-4">
              {/* TITLE */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Search size={16} />
                  Job Title
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Search job..."
                />
              </div>

              {/* LOCATION */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <MapPin size={16} />
                  Location
                </Label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full h-11 px-3 border rounded-md bg-transparent"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={clearFilter}>
                Clear All
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default Jobs
