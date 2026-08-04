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
          <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300" />
            <span className="text-gray-300">Loading projects...</span>
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
            <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.15)] backdrop-blur-md mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
              Featured Work
            </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                AI/ML and Web Development Projects
              </h1>
              <p className="text-gray-400">
                Modern full stack and AI-focused projects built for real-world impact from Lucknow and BBDU
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project) => (
                <motion.article
                  key={project.id}
                  className="group bg-primary-500/10 border border-primary-500/30 rounded-2xl overflow-hidden hover:border-primary-500/60 transition-all duration-300"
                  whileHover={{ y: -8 }}
                >
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}

                  <div className="p-5 flex flex-col gap-4">
                    <h3 className="text-lg font-bold leading-snug">{project.title}</h3>

                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 6).map((tech) => (
                        <span
                          key={`${project.id}-${tech}`}
                          className="px-2.5 py-0.5 rounded-full bg-primary-500/20 text-primary-100 text-xs border border-primary-400/30"
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
                          className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 rounded-lg text-sm text-center font-medium transition-colors duration-300"
                        >
                          GitHub
                        </a>
                      ) : (
                        <span className="flex-1 py-2.5 rounded-lg text-sm text-center font-medium text-slate-500 bg-white/5 border border-white/10 cursor-not-allowed">
                          GitHub
                        </span>
                      )}
                      {project.deployedLink ? (
                        <a
                          href={project.deployedLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 bg-gradient-to-r from-violet-500 to-cyan-500 hover:brightness-110 rounded-lg text-sm text-center font-medium transition-all duration-300"
                        >
                          Live Demo
                        </a>
                      ) : (
                        <span className="flex-1 py-2.5 rounded-lg text-sm text-center font-medium text-slate-500 bg-white/5 border border-white/10 cursor-not-allowed">
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
