import { NextResponse } from "next/server";
import { getProjects } from "@/services/portfolio";
import { ProjectItem } from "@/common/types/projects";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) => {
  try {
    const { slug } = await params;
    
    const projects = await getProjects();
    const project = projects?.find((p: ProjectItem) => 
      p.title.toLowerCase().replace(/\s+/g, '-') === slug
    );

    if (!project) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};
