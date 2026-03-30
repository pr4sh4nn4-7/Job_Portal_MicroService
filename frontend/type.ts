import React, { ReactNode } from "react";

export interface JobOptions {
  title: string;
  responsibilities: string;
  why: string
}

export interface ISkillToLearn {
  title: string;
  why: string;
  how: string
}

export interface ISkillcategory {
  category: string,
  skills: ISkillToLearn[]
}
export interface ILearningApproach {
  title: string;
  points: string[]
}

export interface ICarreerGuidResponse {
  summary: string;
  jobOptions: JobOptions[],
  skillsToLearn: ISkillcategory[]
  learningApproach: ILearningApproach
}

// resume analyzer types


/* "atsScore": 85,
"scoreBreakdown": {
"formatting": {
"score": 90,
"feedback": "Brief feedback on formatting"
},
"keywords": {
"score": 80,
"feedback": "Brief feedback on keyword usage"
},
"structure": {
"score": 85,
"feedback": "Brief feedback on resume structure"
},
"readability": {
"score": 88,
"feedback": "Brief feedback on readability"
}
},
"suggestions": [
{
"category": "Category name (e.g., 'Formatting', 'Content', 'Keywords',
'Structure')",
"issue": "Description of the issue found",
"recommendation": "Specific actionable recommendation to fix it",
"priority": "high/medium/low"
}
],
"strengths": [
"List of things the resume does well for ATS"
],
"summary": "A brief 2-3 sentence summary of the overall ATS performance"
}
Focus on:
- File format and structure compatibility
- Proper use of standard section headings
- Keyword optimization
- Formatting issues (tables, columns, graphics, special characters)
- Contact information placement
- Date formatting
- Use of action verbs and quantifiable achievements
- Section organization and flow
`;
*/



export interface ScoreBreakDown {
  formatting: {
    score: number;
    feedback: string
  };
  keywords: {
    score: number;
    feedback: string;
  },
  structure: {
    score: number;
    feedback: string;
  },
  readability: {
    score: number;
    feedback: string
  }
}

export interface Suggestions {
  category: string,
  issue: string,
  recommendation: string;
  priority: "high" | "medium" | "low"

}




export interface ResumeAnalysisResponse {
  atsScore: number,
  scoreBreakdown: ScoreBreakDown,
  suggestions: Suggestions[],
  strengths: string[]
  summary: string



}

export interface User {
  user_id?: number
  name?: string
  email?: string
  phone_number?: string
  role?: "jobseeker" | "recruiter"
  bio?: string | null
  resume?: string | null
  resume_public_id?: string | null
  profile_pic?: string | null
  profile_pic_public_id?: string | null
  skills?: string[]
  subscription?: string | null
  website: string | null,
  created_at: string | null
}

export interface IAppContextType {
  user: User | null,
  loading: boolean;
  btnLoading: boolean;
  isAuth?: boolean
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  setBtnLoading: React.Dispatch<React.SetStateAction<boolean>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  setIsAuth: React.Dispatch<React.SetStateAction<boolean>>
  logoutUser: () => Promise<void>
  updateProfilePic: (fromData: any) => Promise<void>
  updateResume: (fromData: any) => Promise<void>

  updateUser: (name: string, phoneNumber: string, bio: string,) => Promise<void>

  addSkill: (skill: string) => Promise<void>
  applyJob: (job_id: number) => Promise<void>
  deleteSkill: (skill: string) => Promise<void>
  fetchUser: () => Promise<void>
  applications: IApplication[] | null
  fetchApplications: () => Promise<void>

}

export interface AppProviderProps {
  children: ReactNode
}

export interface AccountProps {
  user: User;
  isYourAccount: boolean;
}

export interface IJob {
  job_id: string,
  title: string;
  description: string;
  salary: number | null,
  location: string | null
  job_type: "full-time" | "part-time" | "contract" | "internship";
  openings: string;
  role: string
  work_location: "onsite" | "hybrid" | "remote"
  company_id: number,
  posted_by_recruiter_id: number,
  created_at: string,
  is_active: boolean
  company_name: string,
  company_logo: string
}

export interface ICompany {
  company_id: number;
  name: string;
  description: string;
  website: string,
  logo: string,
  logo_public_id: string,
  recruiter_id: number,
  created_at: string,
  jobs?: IJob[]
}

type ApplicationStatus = "submitted" | "rejected" | "hired"

export interface IApplication {
  application_id: number;
  job_id: number,
  applicant_id: number,
  applicant_email: string,
  status: ApplicationStatus,
  resume: string,
  applied_at: string,
  subscribed: string,
  job_title: string,
  job_salary: number | null,
  job_location: string
}
