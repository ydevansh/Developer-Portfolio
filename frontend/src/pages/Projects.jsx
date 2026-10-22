import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Seo from '../components/Seo';
import projectService from '../services/projectService';
import { generatedProjects } from '../data/portfolioContent';
import { buildBreadcrumbSchema, buildCollectionSchema, buildProjectSchema } from '../data/seoSchemas';

const projectsSeo = {
  title: 'Projects | Devansh Yadav Portfolio of MERN, Python & AI Work',
  description:
    'Explore full stack, React, Python, and AI projects built by Devansh Yadav, a developer from Lucknow and BBDU.',
  keywords: ['Devansh Yadav projects', 'MERN Stack Projects', 'Python Projects', 'AI Projects', 'React', 'Node.js', 'BBDU'],
};

const normalizeProject = (project, index, source = 'api') => ({
  id: project._id || `demo-project-${index + 1}`,
  title: project.title,
  description: project.description || project.shortDescription || '',
  image: project.image || project.imageUrl || null,
  technologies: Array.isArray(project.technologies) ? project.technologies : [],
  keyFeatures: Array.isArray(project.keyFeatures) ? project.keyFeatures : [],
  githubLink: project.githubLink || null,
  deployedLink: project.deployedLink || project.liveDemoLink || null,
  source,
});

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const structuredData = React.useMemo(() => {
    const normalizedItems = projects.map((project) => ({
      name: project.title,
      url: project.deployedLink || project.githubLink || '/projects',
    }));

    return [
      buildBreadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects' },
      ], '/projects'),
      buildCollectionSchema({
        name: 'Devansh Yadav Projects',
        description: projectsSeo.description,
        currentPath: '/projects',
        items: normalizedItems,
      }),
      ...projects.map((project, index) => buildProjectSchema({ project, currentPath: '/projects', position: index + 1 })),
    ];
  }, [projects]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getAllProjects();
        const apiProjects = response?.data?.projects || [];

        if (apiProjects.length > 0) {
          setProjects(apiProjects.map((project, index) => normalizeProject(project, index, 'api')));
        } else {
          setProjects(generatedProjects.map((project, index) => normalizeProject(project, index, 'demo')));
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects(generatedProjects.map((project, index) => normalizeProject(project, index, 'demo')));
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="pt-32 pb-20">
      <Seo
        title={projectsSeo.title}
        description={projectsSeo.description}
        keywords={projectsSeo.keywords}
        canonicalPath="/projects"
        structuredData={structuredData}
      />

      {loading ? (
        <div className="pt-32 pb-20 px-4 text-center">
          <div className="font-mono inline-flex items-center gap-3 border border-[#00E5FF]/30 bg-[#00E5FF]/5 px-5 py-3" style={{ borderRadius: '0px' }}>
            <span className="h-2.5 w-2.5 animate-pulse bg-[#00E5FF]" />
            <span className="text-[#00E5FF]">$ loading projects...</span>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="space-y-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Header */}
            <div>
              <div
                className="font-mono inline-flex items-center gap-2 border border-[#00E5FF]/35 bg-[#00E5FF]/5 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00E5FF] mb-4"
                style={{ borderRadius: '0px' }}
              >
                <span className="h-1.5 w-1.5 bg-[#00E5FF] shadow-[0_0_8px_rgba(0,229,255,0.8)] animate-pulse" />
                $ ls ./projects
              </div>
              <h1 className="font-mono text-4xl md:text-5xl font-bold mb-4 text-white">
                AI/ML <span className="text-[#00E5FF]">&</span> Web Dev Projects
              </h1>
              <p className="font-mono text-[#A1A1AA]">
                Modern full stack and AI-focused projects built for real-world impact from Lucknow and BBDU
              </p>
            </div>

            {/* Projects grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {projects.map((project, idx) => (
                <motion.article
                  key={project.id}
                  className="group relative border border-[#00E5FF]/20 bg-black/80 overflow-hidden hover:border-[#00E5FF]/50 transition-all duration-300"
                  style={{ borderRadius: '0px' }}
                  whileHover={{ y: -4 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.07 }}
                >
                  {/* Top accent line */}
                  <div className="absolute inset-x-0 top-0 h-px bg-[#00E5FF]/30 group-hover:bg-[#00E5FF]/70 transition-colors" />
                  {/* Corner decorators */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#00E5FF]/40 group-hover:border-[#00E5FF]/80 transition-colors" />
                  <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#00E5FF]/40 group-hover:border-[#00E5FF]/80 transition-colors" />

                  {project.image && (
                    <div className="overflow-hidden h-44 border-b border-[#00E5FF]/10">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:grayscale-[20%]"
                        style={{ filter: 'grayscale(30%) contrast(110%)' }}
                      />
                    </div>
                  )}

                  <div className="p-5 flex flex-col gap-4">
                    <h3 className="font-mono text-lg font-bold leading-snug text-white">{project.title}</h3>

                    {project.description && (
                      <p className="font-mono text-xs text-[#A1A1AA] leading-relaxed line-clamp-3">{project.description}</p>
                    )}

                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 6).map((tech) => (
                        <span
                          key={`${project.id}-${tech}`}
                          className="font-mono px-2 py-0.5 border border-[#00E5FF]/25 bg-[#00E5FF]/5 text-[#00E5FF] text-xs"
                          style={{ borderRadius: '0px' }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-auto">
                      {project.githubLink ? (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono flex-1 py-2.5 border border-white/20 text-white/70 text-sm text-center font-medium transition-all duration-300 hover:border-[#00E5FF]/50 hover:text-[#00E5FF]"
                          style={{ borderRadius: '0px' }}
                        >
                          GitHub
                        </a>
                      ) : (
                        <span
                          className="font-mono flex-1 py-2.5 text-sm text-center font-medium text-slate-600 border border-white/5 cursor-not-allowed"
                          style={{ borderRadius: '0px' }}
                        >
                          GitHub
                        </span>
                      )}
                      {project.deployedLink ? (
                        <a
                          href={project.deployedLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono flex-1 py-2.5 border border-[#00E5FF]/60 text-[#00E5FF] text-sm text-center font-medium transition-all duration-300 hover:bg-[#00E5FF] hover:text-black"
                          style={{ borderRadius: '0px' }}
                        >
                          Live Demo
                        </a>
                      ) : (
                        <span
                          className="font-mono flex-1 py-2.5 text-sm text-center font-medium text-slate-600 border border-white/5 cursor-not-allowed"
                          style={{ borderRadius: '0px' }}
                        >
                          Live Demo
                        </span>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
