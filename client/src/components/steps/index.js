import { User, Target, GraduationCap, Wrench, FolderGit2, Briefcase, Trophy } from 'lucide-react';
import StepBasic from './StepBasic';
import StepCareer from './StepCareer';
import StepEducation from './StepEducation';
import StepSkills from './StepSkills';
import StepProjects from './StepProjects';
import StepExperience from './StepExperience';
import StepAchievements from './StepAchievements';
import { profileOf } from '../../utils/defaultCV';
import { validateBasics, validateCareer, validateEducation, validateProjects, validateExperience } from '../../utils/validators';

// Single source of truth for the wizard AND the editor's "Content" tab.
// Profession comes first because every other step adapts to it.
export const STEPS = [
  {
    id: 'career', title: 'Profession', desc: 'Choose your field - the CV format adapts to it', Icon: Target, Comp: StepCareer,
    validate: (cv) => ({ ...validateCareer(cv.career), ...(cv.career.profession ? {} : { profession: 'Please choose your profession' }) }),
  },
  { id: 'basic', title: 'Basic Info', desc: 'How can employers reach you?', Icon: User, Comp: StepBasic, validate: (cv) => validateBasics(cv.basics) },
  { id: 'education', title: 'Education', desc: 'Your academic background', Icon: GraduationCap, Comp: StepEducation, validate: (cv) => validateEducation(cv.education) },
  { id: 'skills', title: 'Skills', desc: 'Technical and soft skills', Icon: Wrench, Comp: StepSkills, validate: () => ({}) },
  { id: 'projects', title: 'Projects', desc: 'AI turns your notes into bullet points', Icon: FolderGit2, Comp: StepProjects, validate: (cv) => validateProjects(cv.projects) },
  { id: 'experience', title: 'Experience', desc: 'Internships and jobs (optional)', Icon: Briefcase, Comp: StepExperience, validate: (cv) => validateExperience(cv.experience) },
  { id: 'achievements', title: 'Achievements', desc: 'Awards, certifications, leadership', Icon: Trophy, Comp: StepAchievements, validate: () => ({}) },
];

// Returns the step with a title/description that matches the chosen profession.
export const stepMeta = (s, cv) => {
  const p = profileOf(cv);
  const m = {
    education: [p.labels.education, p.desc.education],
    skills: [p.labels.skills, p.desc.skills],
    projects: [p.labels.projects, p.desc.projects],
    experience: [p.labels.experience, p.desc.experience],
    achievements: [p.ach.title, p.desc.achievements],
  }[s.id];
  return m ? { ...s, title: m[0], desc: m[1] } : s;
};