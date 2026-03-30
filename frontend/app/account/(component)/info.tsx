import React, { ChangeEvent, useRef, useState, useMemo } from "react";
import { AccountProps } from "@/type";
import {
  Camera, FileText, Mail, NotepadText, Phone,
  UserIcon, Globe, Calendar, Pencil, Loader2
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { UseAppData } from "@/context/AppContext";
import {
  Dialog, DialogContent, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"; // Assuming you use shadcn's utility

const AccountInfo: React.FC<AccountProps> = ({ user, isYourAccount }) => {
  const [imgError, setImgError] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    bio: ""
  });

  const inputRef = useRef<HTMLInputElement | null>(null);
  const resumeRef = useRef<HTMLInputElement | null>(null);

  const { updateProfilePic, updateResume, btnLoading, updateUser } = UseAppData();

  // Memoized Initials
  const initials = useMemo(() => {
    if (!user.name) return "?";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user.name]);

  // Handlers
  const handleEditOpen = () => {
    setFormData({
      name: user.name ?? "",
      phoneNumber: user.phone_number ?? "",
      bio: user.bio ?? ""
    });
    setIsEditDialogOpen(true);
  };

  const handleProfileUpdate = async () => {
    try {
      await updateUser(formData.name, formData.phoneNumber, formData.bio);
      setIsEditDialogOpen(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'image' | 'pdf') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'pdf' && file.type !== "application/pdf") {
      return toast.error("Only PDF files are allowed");
    }

    const data = new FormData();
    data.append('file', file);

    if (type === 'image') updateProfilePic(data);
    else updateResume(data);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <div className="rounded-3xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all">

        {/* Banner Section */}
        <div className="relative h-48 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

          {/* Avatar Positioned on overlap */}
          <div className="absolute -bottom-16 left-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl border-4 border-white dark:border-zinc-950 shadow-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center transition-transform group-hover:scale-[1.02]">
                {user.profile_pic && !imgError ? (
                  <img
                    src={user.profile_pic}
                    alt={user.name ?? "Profile"}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <span className="text-4xl font-bold text-zinc-400">{initials}</span>
                )}

                {isYourAccount && (
                  <div
                    onClick={() => inputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                  >
                    <Camera className="text-white" size={28} />
                  </div>
                )}
              </div>
              <input type="file" hidden accept="image/*" ref={inputRef} onChange={(e) => handleFileChange(e, 'image')} />
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-20 pb-8 px-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {user.name || "Anonymous User"}
              </h1>
              <p className="text-zinc-500 font-medium flex items-center gap-2">
                @{user.name?.toLowerCase().replace(/\s/g, "")}
                <span className="h-1 w-1 rounded-full bg-zinc-300" />
                <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-600 dark:text-zinc-400 capitalize">
                  {user.role}
                </span>
              </p>
            </div>

            {isYourAccount && (
              <Button variant="outline" onClick={handleEditOpen} className="rounded-xl gap-2 hover:bg-zinc-50">
                <Pencil size={14} /> Edit Profile
              </Button>
            )}
          </div>

          {user.bio && (
            <p className="mt-6 text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <InfoCard icon={<Mail size={18} />} label="Email Address" value={user.email} />
            <InfoCard icon={<Phone size={18} />} label="Phone Number" value={user.phone_number || "Not provided"} />
          </div>

          {/* Resume Section */}
          {user.role === "jobseeker" && user.resume && (
            <div className="mt-8 p-1 rounded-2xl bg-gradient-to-r from-zinc-100 to-transparent dark:from-zinc-900">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-950 rounded-[14px] border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl">
                    <NotepadText className="text-red-500" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Professional Resume</h4>
                    <Link href={user.resume} target="_blank" className="text-xs text-blue-500 hover:underline">
                      View PDF Document
                    </Link>
                  </div>
                </div>
                {isYourAccount && (
                  <Button variant="ghost" size="sm" onClick={() => resumeRef.current?.click()}>
                    Update
                  </Button>
                )}
                <input type="file" hidden ref={resumeRef} accept="application/pdf" onChange={(e) => handleFileChange(e, 'pdf')} />
              </div>
            </div>
          )}

          {/* Footer Meta */}
          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-900 flex flex-wrap gap-6 text-sm text-zinc-400">
            {user.website && (
              <a href={user.website} className="flex items-center gap-2 hover:text-indigo-500 transition-colors">
                <Globe size={14} /> {user.website.replace(/^https?:\/\//, "")}
              </a>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={14} /> Joined {user.created_at || "Recently"}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Update Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phoneNumber}
                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
              />
            </div>
            {user.role === 'jobseeker' && (
              <div className="grid gap-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Input
                  id="bio"
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              className="w-full rounded-xl py-6"
              onClick={handleProfileUpdate}
              disabled={btnLoading}
            >
              {btnLoading ? <Loader2 className="animate-spin mr-2" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value?: string }) => (
  <div className="group flex items-center gap-4 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-900 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all hover:shadow-sm bg-zinc-50/50 dark:bg-zinc-900/30">
    <div className="text-zinc-400 group-hover:text-indigo-500 transition-colors">
      {icon}
    </div>
    <div className="overflow-hidden">
      <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">{label}</p>
      <p className="text-sm font-medium truncate text-zinc-700 dark:text-zinc-300">{value || "N/A"}</p>
    </div>
  </div>
);

export default AccountInfo;
