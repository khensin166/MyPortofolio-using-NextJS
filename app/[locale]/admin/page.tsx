"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/common/services/apiClient";
import { Loader2, Users, LayoutTemplate, Briefcase, MousePointerClick, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { useAdminAuth } from "@/hooks/useAdminAuth";

interface DashboardAnalytics {
  totalVisitors: number;
  totalPageviews: number;
  totalProjects: number;
  totalSkills: number;
  totalInquiries: number;
  inquiriesByStatus: {
    NEW: number;
    CONTACTED: number;
    DEAL: number;
    REJECTED: number;
  };
}

export default function AdminDashboardPage() {
  const { token, isLoading: authLoading } = useAdminAuth();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || authLoading) return;
    
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        // Note: You can replace this with actual endpoints depending on your backend
        // For now, we fetch from /analytics and manually aggregate others if needed
        const { data, error: fetchError } = await apiClient("/analytics");
        
        if (fetchError) throw new Error(fetchError);
        
        // Mock fallback if the RPC get_visitor_analytics isn't returning everything we need
        setAnalytics({
          totalVisitors: data?.totalVisitors || 0,
          totalPageviews: data?.totalPageviews || 0,
          totalProjects: data?.totalProjects || 0, // In reality, we could do Promise.all and fetch /projects, /skills, /inquiry
          totalSkills: data?.totalSkills || 0,
          totalInquiries: data?.totalInquiries || 0,
          inquiriesByStatus: data?.inquiriesByStatus || {
            NEW: 0, CONTACTED: 0, DEAL: 0, REJECTED: 0
          }
        });
        
        // Since we don't know the exact structure of your analytics RPC yet, 
        // let's fetch the counts directly from the endpoints as a robust backup
        const [projectsRes, skillsRes, inquiriesRes] = await Promise.all([
          apiClient("/projects"),
          apiClient("/skills"),
          apiClient("/inquiry")
        ]);
        
        setAnalytics(prev => {
          if (!prev) return prev;
          
          const inqData = inquiriesRes.data?.inquiries || inquiriesRes.data || [];
          const newCount = inqData.filter((i: any) => i.status === 'NEW').length;
          const dealCount = inqData.filter((i: any) => i.status === 'DEAL').length;
          
          return {
            ...prev,
            totalProjects: (projectsRes.data || []).length,
            totalSkills: (skillsRes.data || []).length,
            totalInquiries: inqData.length,
            inquiriesByStatus: {
              NEW: newCount,
              CONTACTED: inqData.filter((i: any) => i.status === 'CONTACTED').length,
              DEAL: dealCount,
              REJECTED: inqData.filter((i: any) => i.status === 'REJECTED').length,
            }
          };
        });

      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [token, authLoading]);

  if (isLoading || authLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your portfolio today.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Failed to load metrics: {error}
        </div>
      )}

      {analytics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard 
              title="Total Visitors" 
              value={analytics.totalVisitors.toString()} 
              icon={<Users className="h-5 w-5" />} 
              delay={0.1}
            />
            <DashboardCard 
              title="Pageviews" 
              value={analytics.totalPageviews.toString()} 
              icon={<MousePointerClick className="h-5 w-5" />} 
              delay={0.2}
            />
            <DashboardCard 
              title="Active Projects" 
              value={analytics.totalProjects.toString()} 
              icon={<LayoutTemplate className="h-5 w-5" />} 
              delay={0.3}
            />
            <DashboardCard 
              title="Tech Stack Skills" 
              value={analytics.totalSkills.toString()} 
              icon={<Cpu className="h-5 w-5" />} 
              delay={0.4}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold mb-4">Inquiry Pipeline</h2>
              <div className="space-y-4">
                <PipelineItem label="New Leads" count={analytics.inquiriesByStatus.NEW} color="bg-blue-500" total={analytics.totalInquiries} />
                <PipelineItem label="In Communication" count={analytics.inquiriesByStatus.CONTACTED} color="bg-amber-500" total={analytics.totalInquiries} />
                <PipelineItem label="Deals Closed" count={analytics.inquiriesByStatus.DEAL} color="bg-emerald-500" total={analytics.totalInquiries} />
                <PipelineItem label="Rejected" count={analytics.inquiriesByStatus.REJECTED} color="bg-red-500" total={analytics.totalInquiries} />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}

function DashboardCard({ title, value, icon, delay }: { title: string; value: string; icon: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <span className="text-3xl font-bold">{value}</span>
      </div>
    </motion.div>
  );
}

function PipelineItem({ label, count, color, total }: { label: string; count: number; color: string; total: number }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{count}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div 
          className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
