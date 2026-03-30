
"use client"
import CareerGuide from "@/components/Career-Guide";
import Hero from "@/components/Hero";
import Loading from "@/components/Loading";
import ResumeAnalyzer from "@/components/ResumeAnalyzer";
import { UseAppData } from "@/context/AppContext";


export default function Home() {

  const { loading } = UseAppData()
  if (loading) return <Loading />
  return (
    <div>
      <Hero />
      <CareerGuide />
      <ResumeAnalyzer />

    </div>
  );
}
