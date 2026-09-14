"use client";

import { motion } from "framer-motion";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminLayoutClientProps {
  children: React.ReactNode;
}

export function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="flex flex-1 flex-col md:ml-64 w-full">
        <AdminHeader />
        
        <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mx-auto w-full max-w-5xl"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
