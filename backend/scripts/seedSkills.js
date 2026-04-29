import Skill from '../models/Skill.js';

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const defaultSkills = [
  { name: 'React', category: 'Frontend', proficiency: 'Advanced', icon: 'SiReact', order: 1 },
  { name: 'JavaScript', category: 'Frontend', proficiency: 'Advanced', icon: 'SiJavascript', order: 2 },
  { name: 'Tailwind CSS', category: 'Frontend', proficiency: 'Advanced', icon: 'SiTailwindcss', order: 3 },
  { name: 'Git', category: 'Frontend', proficiency: 'Intermediate', icon: 'SiGit', order: 4 },
  { name: 'Node.js', category: 'Backend', proficiency: 'Advanced', icon: 'SiNodedotjs', order: 1 },
  { name: 'MongoDB', category: 'Backend', proficiency: 'Intermediate', icon: 'SiMongodb', order: 2 },
  { name: 'SQL', category: 'Backend', proficiency: 'Intermediate', icon: 'SiMysql', order: 3 },
  { name: 'Python', category: 'AI/Core', proficiency: 'Expert', icon: 'SiPython', order: 1 },
  { name: 'Machine Learning', category: 'AI/Core', proficiency: 'Advanced', icon: 'SiTensorflow', order: 2 },
  { name: 'Data Analysis', category: 'AI/Core', proficiency: 'Advanced', icon: 'HiOutlineCpuChip', order: 3 },
  { name: 'Pandas', category: 'AI/Core', proficiency: 'Advanced', icon: 'SiPandas', order: 4 },
  { name: 'NumPy', category: 'AI/Core', proficiency: 'Advanced', icon: 'SiNumpy', order: 5 },
  { name: 'C', category: 'AI/Core', proficiency: 'Intermediate', icon: 'SiC', order: 6 },
];

export const seedDefaultSkills = async () => {
  for (const skill of defaultSkills) {
    const existingSkill = await Skill.findOne({
      category: normalizeText(skill.category),
      name: { $regex: `^${escapeRegExp(normalizeText(skill.name))}$`, $options: 'i' },
    });

    if (!existingSkill) {
      await Skill.create(skill);
    }
  }

  return true;
};

export default {
  defaultSkills,
  seedDefaultSkills,
};