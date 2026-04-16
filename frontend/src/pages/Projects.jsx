import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import projectService from '../services/projectService';
import { generatedProjects } from '../data/portfolioContent';

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

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-4 text-center">
        <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-3">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300" />
          <span className="text-gray-300">Loading projects...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="space-y-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">My Projects</h1>
            <p className="text-gray-400">
              Modern full stack and AI-focused projects built for real-world impact
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

                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    {project.source === 'demo' && (
                      <span className="shrink-0 rounded-full border border-cyan-400/35 bg-cyan-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-200">
                        Demo
                      </span>
                    )}
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed">{project.description}</p>

                  {project.keyFeatures.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.14em] text-primary-300">Key Features</p>
                      <ul className="space-y-1.5 text-sm text-gray-300 list-disc list-inside">
                        {project.keyFeatures.slice(0, 3).map((feature) => (
                          <li key={`${project.id}-${feature}`}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 6).map((tech) => (
                      <span
                        key={`${project.id}-${tech}`}
                        className="px-2.5 py-1 rounded-full bg-primary-500/20 text-primary-100 text-xs border border-primary-400/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 bg-primary-500 hover:bg-primary-600 rounded-lg text-sm text-center font-medium transition-colors"
                      >
                        GitHub
                      </a>
                    )}
                    {project.deployedLink && (
                      <a
                        href={project.deployedLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 bg-primary-500/15 border border-primary-500 hover:bg-primary-500/30 rounded-lg text-sm text-center font-medium transition-colors"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
