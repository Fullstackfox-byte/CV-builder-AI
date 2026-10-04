import { uid } from './helpers';

export const BASE_SECTIONS = ['summary', 'education', 'skills', 'experience', 'projects', 'achievements', 'certifications', 'leadership'];
export const DEFAULT_ORDER = BASE_SECTIONS;
export const SECTION_LABELS = {
  summary: 'Professional Summary', education: 'Education', skills: 'Skills', experience: 'Experience', projects: 'Projects',
  achievements: 'Achievements', certifications: 'Certifications', leadership: 'Leadership & Activities',
};
export const STATUSES = ['Student', 'Fresher', 'Working Professional', 'Freelancer', 'Career Switcher'];
export const ACH_CATEGORIES = ['Hackathon', 'Competition', 'Certification', 'Award', 'Scholarship', 'Leadership role', 'Publication', 'Patent', 'Other'];
export const CV_PRESETS = ['Frontend Developer CV', 'Software Engineer CV', 'Internship CV', 'General CV'];

/* ---------------- Profession profiles ---------------- */
const ex = (id, label, titleLabel, titlePh, orgLabel, orgPh, detailPh = '') => ({ id, label, titleLabel, titlePh, orgLabel, orgPh, detailPh });

// BASE = Engineering / IT. Every other profession overrides only what differs.
const BASE = {
  label: 'Engineering / IT',
  blurb: 'Software, electronics, mechanical, civil and other engineering roles',
  template: 'modern',
  order: BASE_SECTIONS,
  labels: SECTION_LABELS,
  desc: {
    education: 'Your academic background', skills: 'Technical and soft skills', projects: 'AI turns your notes into bullet points',
    experience: 'Internships and jobs (optional)', achievements: 'Awards, certifications, leadership',
  },
  statuses: { Student: 'Student', Fresher: 'Fresher', 'Working Professional': 'Working Professional', Freelancer: 'Freelancer', 'Career Switcher': 'Career Switcher' },
  career: { rolePh: 'Frontend Developer', industryPh: 'Software / IT' },
  license: null,
  confid: '',
  edu: {
    degreeLabel: 'Degree', degreePh: 'B.Tech', degrees: ['B.Tech', 'B.E.', 'M.Tech', 'BCA', 'MCA', 'Diploma', 'Class 12', 'Class 10'],
    schoolLabel: 'University / College', deptLabel: 'Department', deptPh: 'Computer Science', gradeLabel: 'CGPA / Percentage', gradePh: '8.4 CGPA',
    courseLabel: 'Relevant Coursework (optional)', coursePh: 'Data Structures, DBMS, Operating Systems', courseDoc: 'Coursework',
  },
  skills: {
    techLabel: 'Technical Skills', techDoc: 'Technical', tech: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Python', 'C/C++', 'Git', 'SQL'],
    softLabel: 'Soft Skills', softDoc: 'Soft Skills', soft: ['Leadership', 'Communication', 'Teamwork', 'Problem Solving', 'Time Management'],
  },
  proj: {
    add: 'Add Project', item: 'Project', nameLabel: 'Project Name', namePh: 'Smart Parking System',
    types: ['Web application', 'Mobile app', 'Game', 'IoT / Hardware project', 'Automation / Script', 'Machine learning project', 'Academic project', 'Other'],
    typeLabel: 'Project Type', typePh: 'Web application', techLabel: 'Technologies Used', techDoc: 'Tech', techPh: 'React, Node.js, MongoDB',
    problemLabel: 'What problem does it solve?', problemPh: 'Drivers waste time searching for free parking slots',
    builtLabel: 'What did you personally build?', builtPh: 'I made a parking system using Arduino and ultrasonic sensors',
    featLabel: 'Important features', featPh: 'Real-time slot detection, LED indicators, admin dashboard', featHint: 'Separate features with commas',
    linkA: 'GitHub URL', linkAPh: 'github.com/you/project', linkADoc: 'GitHub', linkB: 'Live Demo URL', linkBPh: 'project.vercel.app', linkBDoc: 'Live Demo',
  },
  exp: {
    add: 'Add Experience / Internship', item: 'Experience',
    empty: 'No internship or job yet? That is completely fine - skip this step and your CV will highlight projects instead.',
    companyLabel: 'Company Name', positionLabel: 'Position', positionPh: 'Web Development Intern', locationPh: 'Remote / City',
    techLabel: 'Technologies Used', techPh: 'React, Express', techDoc: 'Tech', respLabel: 'Responsibilities',
    respPh: 'Worked on the dashboard UI. Helped fix bugs.', achLabel: 'Achievements', achPh: 'Reduced page load time, delivered a feature used by the team...',
  },
  ach: { title: 'Achievements', cats: ACH_CATEGORIES, ph: 'e.g. Finalist, Smart India Hackathon 2025' },
  extras: [],
};

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
const mk = (o) => Object.fromEntries(Object.entries(BASE).map(([k, b]) => [k, o[k] === undefined ? b : isObj(b) && isObj(o[k]) ? { ...b, ...o[k] } : o[k]]));

const defs = {
  engineering: {},

  doctor: {
    label: 'Doctor / Medical', blurb: 'MBBS, MD/MS, BDS, interns, residents and consultants', template: 'clinical',
    order: ['summary', 'education', 'experience', 'skills', 'publications', 'projects', 'cme', 'achievements', 'certifications', 'memberships', 'leadership'],
    labels: { summary: 'Professional Profile', education: 'Education & Training', skills: 'Clinical Skills', experience: 'Clinical Experience', projects: 'Research Projects', achievements: 'Awards & Honours', certifications: 'Certifications & Licenses', leadership: 'Leadership & Volunteering' },
    desc: { education: 'MBBS, postgraduate and other training', skills: 'Clinical skills, procedures and professional skills', projects: 'Research, case reports and audits (optional)', experience: 'Internship, residency, house jobs and clinics', achievements: 'Publications, CME, memberships and awards' },
    statuses: { Student: 'Medical Student', Fresher: 'Intern / Fresh Graduate', 'Working Professional': 'Resident / Doctor / Consultant', Freelancer: 'Locum / Independent Practice', 'Career Switcher': 'Changing Specialty' },
    career: { rolePh: 'Junior Resident - General Medicine', industryPh: 'Hospital / Healthcare' },
    license: { label: 'Medical Registration No.', ph: 'e.g. WBMC 12345 (State Medical Council)', doc: 'Medical Reg. No.' },
    confid: 'Never include patient names, hospital IDs or any identifying details.',
    edu: { degreeLabel: 'Degree / Training', degreePh: 'MBBS', degrees: ['MBBS', 'MD', 'MS', 'DM', 'MCh', 'DNB', 'BDS', 'MDS', 'BAMS', 'BHMS', 'Internship (CRRI)', 'Class 12'], schoolLabel: 'Medical College / Institution', deptLabel: 'Specialty', deptPh: 'General Medicine', gradeLabel: 'Marks / Class / Rank', gradePh: 'First Class with Distinction', courseLabel: 'Thesis / Key Rotations (optional)', coursePh: 'Thesis topic; rotations in Medicine, Surgery, Paediatrics', courseDoc: 'Thesis / Rotations' },
    skills: { techLabel: 'Clinical Skills & Procedures', techDoc: 'Clinical', tech: ['History Taking & Examination', 'ECG Interpretation', 'BLS', 'ACLS', 'Suturing', 'IV Cannulation', 'Lumbar Puncture', 'Ultrasound (FAST)', 'Ventilator Management', 'Electronic Medical Records', 'Evidence-Based Medicine'], softLabel: 'Professional Skills', softDoc: 'Professional', soft: ['Patient Communication', 'Empathy', 'Teamwork', 'Decision Making Under Pressure', 'Leadership', 'Medical Ethics'] },
    proj: { add: 'Add Research / Case', item: 'Research', nameLabel: 'Title', namePh: 'Prevalence of Anaemia in Pregnancy: A Cross-sectional Study', types: ['Original research', 'Case report', 'Case series', 'Review article', 'Audit / Quality improvement', 'Thesis / Dissertation', 'Community health project', 'Other'], typeLabel: 'Type', typePh: 'Original research', techLabel: 'Methods / Tools', techDoc: 'Methods', techPh: 'Cross-sectional study, SPSS', problemLabel: 'Objective / Research question', problemPh: 'To estimate how common anaemia is among pregnant women', builtLabel: 'Your role', builtPh: 'Collected data, analysed results and wrote the first draft', featLabel: 'Key findings', featPh: 'Main result, conclusion, recommendation', featHint: 'Separate findings with commas', linkA: 'Publication / DOI link', linkAPh: 'doi.org/...', linkADoc: 'Publication', linkB: 'Poster / Presentation link', linkBPh: 'Link to slides or poster', linkBDoc: 'Presentation' },
    exp: { add: 'Add Clinical Posting', item: 'Posting', empty: 'No clinical posting yet? That is fine - skip this step, your CV will highlight education and research instead.', companyLabel: 'Hospital / Clinic', positionLabel: 'Role / Designation', positionPh: 'Intern / Junior Resident', locationPh: 'City, State', techLabel: 'Department / Procedures', techPh: 'Emergency Medicine, Suturing', techDoc: 'Dept / Procedures', respLabel: 'Clinical duties', respPh: 'Managed OPD patients, did ward rounds, assisted in surgeries', achLabel: 'Highlights', achPh: 'Presented a case at the departmental meeting...' },
    ach: { title: 'Publications & Achievements', cats: ['Award', 'Scholarship', 'Certification', 'Publication', 'Conference Presentation', 'Leadership role', 'Volunteering', 'Other'], ph: 'e.g. Gold Medal in Anatomy, MBBS 1st Year' },
    extras: [
      ex('publications', 'Publications & Presentations', 'Title', 'Title of paper / poster', 'Journal / Conference', 'Journal or conference name', 'Authorship, DOI (optional)'),
      ex('cme', 'Conferences, CME & Workshops', 'Event', 'CME on Critical Care', 'Organiser', 'Organising body', 'Your role (delegate / speaker)'),
      ex('memberships', 'Professional Memberships', 'Society / Body', 'Indian Medical Association', 'Membership type / ID', 'Life member'),
    ],
  },

  nurse: {
    label: 'Nursing', blurb: 'GNM, B.Sc / M.Sc Nursing, staff nurses and nurse educators', template: 'clinical',
    order: ['summary', 'education', 'experience', 'clinical', 'skills', 'certifications', 'cme', 'achievements', 'memberships', 'projects', 'leadership'],
    labels: { summary: 'Professional Summary', education: 'Education & Qualifications', skills: 'Clinical Skills', experience: 'Work Experience', projects: 'Research & Quality Projects', achievements: 'Awards & Achievements', certifications: 'Certifications & Licenses', leadership: 'Volunteering & Leadership' },
    desc: { education: 'Nursing diploma / degree and other qualifications', skills: 'Nursing skills, procedures and soft skills', projects: 'Community health, quality or research work (optional)', experience: 'Hospitals, clinics and home care', achievements: 'Clinical placements, training, certifications and awards' },
    statuses: { Student: 'Nursing Student', Fresher: 'Newly Qualified Nurse', 'Working Professional': 'Staff Nurse / Senior Nurse', Freelancer: 'Private Duty / Home-care Nurse', 'Career Switcher': 'Changing Specialty' },
    career: { rolePh: 'Staff Nurse - ICU', industryPh: 'Hospital / Healthcare' },
    license: { label: 'Nursing Registration No.', ph: 'e.g. WBNC 12345 (State Nursing Council)', doc: 'Nursing Reg. No.' },
    confid: 'Never include patient names, hospital IDs or any identifying details.',
    edu: { degreeLabel: 'Qualification', degreePh: 'B.Sc Nursing', degrees: ['GNM', 'ANM', 'B.Sc Nursing', 'Post Basic B.Sc Nursing', 'M.Sc Nursing', 'Diploma', 'Class 12'], schoolLabel: 'College / School of Nursing', deptLabel: 'Specialty (optional)', deptPh: 'Medical-Surgical Nursing', gradeLabel: 'Marks / Grade', gradePh: 'First Class', courseLabel: 'Key Subjects / Postings (optional)', coursePh: 'Medical-Surgical, Paediatric, Community Health Nursing', courseDoc: 'Key Subjects' },
    skills: { techLabel: 'Clinical Skills & Procedures', techDoc: 'Clinical', tech: ['Patient Assessment', 'Vital Signs Monitoring', 'IV Cannulation', 'Medication Administration', 'Wound Care', 'Catheterization', 'BLS', 'ACLS', 'Infection Control', 'Electronic Health Records', 'Patient Education', 'Triage', 'Ventilator Care'], softLabel: 'Professional Skills', softDoc: 'Professional', soft: ['Compassion', 'Communication', 'Teamwork', 'Time Management', 'Critical Thinking', 'Patient Advocacy'] },
    proj: { add: 'Add Project', item: 'Project', nameLabel: 'Project Title', namePh: 'Hand Hygiene Compliance Audit', types: ['Community health project', 'Quality improvement', 'Research study', 'Health education programme', 'Case study', 'Other'], typeLabel: 'Type', typePh: 'Quality improvement', techLabel: 'Methods / Tools', techDoc: 'Methods', techPh: 'Checklist audit, health teaching', problemLabel: 'Objective', problemPh: 'To improve hand hygiene practice on the ward', builtLabel: 'Your role', builtPh: 'Prepared the checklist, collected data and presented the results', featLabel: 'Outcomes', featPh: 'Main outcomes, recommendations', featHint: 'Separate outcomes with commas', linkA: 'Reference link (optional)', linkAPh: 'Link', linkADoc: 'Reference', linkB: 'Presentation link (optional)', linkBPh: 'Link', linkBDoc: 'Presentation' },
    exp: { add: 'Add Work Experience', item: 'Experience', empty: 'No work experience yet? Skip this step and add your clinical placements in the last step.', companyLabel: 'Hospital / Institution', positionLabel: 'Designation', positionPh: 'Staff Nurse', locationPh: 'City, State', techLabel: 'Ward / Department', techPh: 'ICU, Emergency', techDoc: 'Ward', respLabel: 'Nursing responsibilities', respPh: 'Monitored vitals, administered medication, prepared patients for procedures', achLabel: 'Highlights', achPh: 'Trained new staff on infection control...' },
    ach: { title: 'Placements & Achievements', cats: ['Certification', 'Award', 'Scholarship', 'Leadership role', 'Volunteering', 'Publication', 'Other'], ph: 'e.g. Best Student Nurse Award, 2025' },
    extras: [
      ex('clinical', 'Clinical Placements', 'Ward / Department', 'Paediatric Ward', 'Hospital', 'Hospital name', 'What you did and learned'),
      ex('cme', 'Training, Workshops & CNE', 'Programme', 'Workshop on Infection Control', 'Organiser', 'Organising body', 'Your role (optional)'),
      ex('memberships', 'Professional Memberships', 'Association', 'Trained Nurses Association of India', 'Membership type / ID', 'Member'),
    ],
  },

  lawyer: {
    label: 'Law / Legal', blurb: 'Advocates, law graduates, corporate counsel and legal interns', template: 'legal',
    order: ['summary', 'education', 'experience', 'cases', 'projects', 'publications', 'skills', 'certifications', 'achievements', 'memberships', 'leadership'],
    labels: { summary: 'Professional Profile', education: 'Education', skills: 'Legal Skills', experience: 'Legal Experience', projects: 'Moot Courts & Research', achievements: 'Awards & Achievements', certifications: 'Certifications & Bar Admissions', leadership: 'Leadership & Pro Bono' },
    desc: { education: 'Law degrees and other qualifications', skills: 'Legal skills, research tools and soft skills', projects: 'Moot courts, research papers and legal aid work', experience: 'Chambers, law firms, courts, in-house and internships', achievements: 'Notable matters, publications, memberships and awards' },
    statuses: { Student: 'Law Student', Fresher: 'Fresh Law Graduate', 'Working Professional': 'Practicing Advocate / Counsel', Freelancer: 'Independent Practitioner', 'Career Switcher': 'Changing Practice Area' },
    career: { rolePh: 'Associate Advocate - Civil Litigation', industryPh: 'Litigation / Corporate Law' },
    license: { label: 'Bar Council Enrolment No.', ph: 'e.g. WB/1234/2024 (State Bar Council)', doc: 'Bar Enrolment No.' },
    confid: 'Never include client names, case numbers or any confidential details.',
    edu: { degreeLabel: 'Degree', degreePh: 'LL.B', degrees: ['LL.B', 'B.A. LL.B (Hons)', 'B.B.A. LL.B (Hons)', 'B.Com LL.B', 'LL.M', 'Ph.D (Law)', 'Class 12'], schoolLabel: 'Law School / University', deptLabel: 'Specialisation (optional)', deptPh: 'Corporate Law', gradeLabel: 'CGPA / Percentage / Class', gradePh: 'First Class', courseLabel: 'Key Subjects (optional)', coursePh: 'Constitutional Law, Contract Law, Criminal Law', courseDoc: 'Key Subjects' },
    skills: { techLabel: 'Legal Skills & Research Tools', techDoc: 'Legal Skills', tech: ['Legal Research', 'Legal Drafting', 'Pleadings', 'Contract Review', 'Due Diligence', 'Case Law Analysis', 'Court Procedure', 'Negotiation', 'Mediation', 'Manupatra', 'SCC Online', 'Westlaw', 'LexisNexis'], softLabel: 'Professional Skills', softDoc: 'Professional', soft: ['Advocacy', 'Analytical Thinking', 'Communication', 'Attention to Detail', 'Client Handling', 'Time Management'] },
    proj: { add: 'Add Moot / Research', item: 'Moot / Research', nameLabel: 'Moot / Research Title', namePh: 'National Moot Court Competition', types: ['Moot court', 'Research paper', 'Legal aid clinic', 'Legal awareness campaign', 'Case comment', 'Dissertation', 'Other'], typeLabel: 'Type', typePh: 'Moot court', techLabel: 'Areas of Law', techDoc: 'Areas', techPh: 'Constitutional Law, Arbitration', problemLabel: 'Issue / Question', problemPh: 'Whether the law restricting ... is constitutional', builtLabel: 'Your role', builtPh: 'Researched and drafted the memorial; argued as Speaker 1', featLabel: 'Outcome / Key arguments', featPh: 'Quarter-finalist, Best Memorial...', featHint: 'Separate points with commas', linkA: 'Published link (optional)', linkAPh: 'Link', linkADoc: 'Published', linkB: 'Document link (optional)', linkBPh: 'Link', linkBDoc: 'Document' },
    exp: { add: 'Add Legal Experience', item: 'Experience', empty: 'No legal experience yet? Skip this step - moot courts and research will carry your CV.', companyLabel: 'Firm / Chambers / Court', positionLabel: 'Role', positionPh: 'Legal Intern / Associate', locationPh: 'City, State', techLabel: 'Practice Areas', techPh: 'Civil Litigation, Contracts', techDoc: 'Practice areas', respLabel: 'Work done', respPh: 'Drafted plaints and written statements, assisted in hearings, prepared research notes', achLabel: 'Highlights', achPh: 'Prepared a research memo used in ...' },
    ach: { title: 'Matters & Achievements', cats: ['Award', 'Moot court', 'Scholarship', 'Certification', 'Publication', 'Leadership role', 'Volunteering', 'Other'], ph: 'e.g. Best Oralist, State Moot Court 2025' },
    extras: [
      ex('cases', 'Notable Matters', 'Matter (no client names)', 'Commercial dispute on contract breach', 'Court / Forum', 'High Court / Tribunal', 'Your role (drafting, research, appearance)'),
      ex('publications', 'Publications', 'Title', 'Title of article / case comment', 'Journal / Publisher', 'Journal or website', 'Co-authors, link (optional)'),
      ex('memberships', 'Bar & Professional Memberships', 'Association', 'High Court Bar Association', 'Membership type / ID', 'Member'),
    ],
  },

  teacher: {
    label: 'Teaching / Education', blurb: 'Teachers, lecturers, professors and trainers', template: 'academic',
    order: ['summary', 'education', 'experience', 'skills', 'projects', 'publications', 'workshops', 'certifications', 'achievements', 'leadership'],
    labels: { summary: 'Professional Profile', education: 'Education & Qualifications', skills: 'Teaching Skills', experience: 'Teaching Experience', projects: 'Academic Projects & Research', achievements: 'Awards & Achievements', certifications: 'Certifications (TET / NET etc.)', leadership: 'Leadership & Activities' },
    desc: { education: 'Degrees, B.Ed and eligibility exams', skills: 'Teaching skills and tools', projects: 'Academic projects and research (optional)', experience: 'Schools, colleges and tutoring', achievements: 'Publications, workshops and awards' },
    statuses: { Student: 'Student / B.Ed Trainee', Fresher: 'Fresher', 'Working Professional': 'Working Teacher / Lecturer', Freelancer: 'Private Tutor / Trainer', 'Career Switcher': 'Changing to Teaching' },
    career: { rolePh: 'Mathematics Teacher', industryPh: 'School / College Education' },
    edu: { degreeLabel: 'Degree', degreePh: 'B.Ed', degrees: ['B.Ed', 'M.Ed', 'D.El.Ed', 'B.A.', 'M.A.', 'B.Sc', 'M.Sc', 'Ph.D', 'Class 12'], schoolLabel: 'University / College', deptLabel: 'Subject', deptPh: 'Mathematics', gradeLabel: 'CGPA / Percentage', gradePh: '75%', courseLabel: 'Key Subjects (optional)', coursePh: 'Pedagogy, Educational Psychology', courseDoc: 'Key Subjects' },
    skills: { techLabel: 'Teaching Skills & Tools', techDoc: 'Teaching', tech: ['Lesson Planning', 'Curriculum Design', 'Classroom Management', 'Assessment & Evaluation', 'Google Classroom', 'Smart Board', 'Differentiated Instruction', 'Student Counselling'], softLabel: 'Soft Skills', softDoc: 'Soft Skills', soft: ['Communication', 'Patience', 'Leadership', 'Creativity', 'Time Management'] },
    proj: { add: 'Add Project', item: 'Project', nameLabel: 'Project / Research Title', namePh: 'Activity-based Learning in Class 8 Science', types: ['Academic project', 'Research study', 'Action research', 'Curriculum project', 'Community programme', 'Other'], typeLabel: 'Type', typePh: 'Action research', techLabel: 'Methods / Tools', techDoc: 'Methods', techPh: 'Survey, classroom observation', problemLabel: 'Objective', problemPh: 'To improve student participation', builtLabel: 'Your role', builtPh: 'Designed activities and collected feedback', featLabel: 'Key outcomes', featPh: 'Outcomes, learnings', featHint: 'Separate outcomes with commas', linkA: 'Link (optional)', linkAPh: 'Link', linkADoc: 'Link', linkB: 'Another link (optional)', linkBPh: 'Link', linkBDoc: 'Document' },
    exp: { add: 'Add Teaching Experience', item: 'Experience', empty: 'No teaching experience yet? Skip this step - your education and projects will lead the CV.', companyLabel: 'School / College / Institute', positionLabel: 'Designation', positionPh: 'Mathematics Teacher', locationPh: 'City, State', techLabel: 'Subjects / Classes', techPh: 'Mathematics, Classes 8-10', techDoc: 'Subjects', respLabel: 'Responsibilities', respPh: 'Planned lessons, taught Classes 8-10, evaluated answer scripts', achLabel: 'Achievements', achPh: 'Introduced activity-based learning...' },
    ach: { title: 'Publications & Achievements', cats: ['Certification', 'Award', 'Publication', 'Scholarship', 'Leadership role', 'Volunteering', 'Other'], ph: 'e.g. CTET qualified, 2025' },
    extras: [
      ex('publications', 'Publications', 'Title', 'Title of paper / article', 'Journal / Publisher', 'Journal or conference', 'Link or details (optional)'),
      ex('workshops', 'Workshops, FDPs & Training', 'Programme', 'Workshop on Digital Teaching', 'Organiser', 'Organising body', 'Your role (optional)'),
    ],
  },

  business: {
    label: 'Business / Commerce', blurb: 'Finance, accounting, marketing, HR, sales and management', template: 'corporate',
    order: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements', 'leadership'],
    labels: { summary: 'Professional Summary', skills: 'Skills & Tools', experience: 'Work Experience', projects: 'Projects & Case Studies' },
    desc: { skills: 'Business skills and software tools', projects: 'Case studies, internships and live projects', experience: 'Jobs and internships', achievements: 'Awards, certifications, competitions' },
    career: { rolePh: 'Marketing Executive', industryPh: 'Finance / Marketing / HR' },
    edu: { degreeLabel: 'Degree', degreePh: 'B.Com', degrees: ['B.Com', 'BBA', 'MBA', 'M.Com', 'CA', 'CS', 'CMA', 'B.A.', 'Class 12'], schoolLabel: 'University / College', deptLabel: 'Specialisation', deptPh: 'Finance', gradeLabel: 'CGPA / Percentage', gradePh: '8.0 CGPA', courseLabel: 'Key Subjects (optional)', coursePh: 'Accounting, Marketing, Business Law', courseDoc: 'Key Subjects' },
    skills: { techLabel: 'Skills & Tools', techDoc: 'Skills & Tools', tech: ['MS Excel', 'MS PowerPoint', 'Tally', 'SAP', 'Financial Analysis', 'Accounting', 'Budgeting', 'Digital Marketing', 'CRM', 'Power BI', 'Market Research'], softLabel: 'Soft Skills', softDoc: 'Soft Skills', soft: ['Communication', 'Negotiation', 'Leadership', 'Teamwork', 'Time Management'] },
    proj: { add: 'Add Project', item: 'Project', nameLabel: 'Project / Case Study', namePh: 'Market Research for a Local Brand', types: ['Internship project', 'Case study', 'Live project', 'Academic project', 'Other'], typeLabel: 'Type', typePh: 'Case study', techLabel: 'Tools / Methods', techDoc: 'Tools', techPh: 'Excel, Survey, SWOT', problemLabel: 'Objective / Problem', problemPh: 'To find out why sales were falling', builtLabel: 'Your contribution', builtPh: 'Ran the survey and analysed the data in Excel', featLabel: 'Key results', featPh: 'Findings, recommendations', featHint: 'Separate results with commas', linkA: 'Link (optional)', linkAPh: 'Link', linkADoc: 'Link', linkB: 'Another link (optional)', linkBPh: 'Link', linkBDoc: 'Document' },
    exp: { add: 'Add Work Experience', item: 'Experience', empty: 'No job or internship yet? Skip this step - your projects will lead the CV.', companyLabel: 'Company Name', positionLabel: 'Position', positionPh: 'Sales Executive', locationPh: 'City / Remote', techLabel: 'Tools / Software', techPh: 'Excel, Tally, CRM', techDoc: 'Tools', respLabel: 'Responsibilities', respPh: 'Handled client accounts, prepared monthly reports', achLabel: 'Achievements', achPh: 'Increased monthly sales, reduced costs...' },
    ach: { title: 'Achievements', cats: ['Award', 'Certification', 'Competition', 'Scholarship', 'Leadership role', 'Volunteering', 'Other'], ph: 'e.g. Winner, Inter-college Business Quiz 2025' },
  },

  other: {
    label: 'Other / General', blurb: 'Any other field - a clean, general-purpose CV', template: 'modern',
    order: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements', 'leadership'],
    labels: { skills: 'Skills', experience: 'Work Experience' },
    desc: { skills: 'Your key skills', projects: 'Projects and activities (optional)', experience: 'Jobs, internships and volunteering', achievements: 'Awards, certifications, activities' },
    career: { rolePh: 'Your target role', industryPh: 'Your industry' },
    edu: { degreeLabel: 'Degree / Course', degreePh: 'B.A.', degrees: ['B.A.', 'B.Sc', 'B.Com', 'M.A.', 'M.Sc', 'Diploma', 'Certificate', 'Class 12', 'Class 10'], schoolLabel: 'School / College / Institute', deptLabel: 'Subject / Field', deptPh: 'Your subject', gradeLabel: 'Marks / Grade', gradePh: '80%', courseLabel: 'Key Subjects (optional)', coursePh: 'Key subjects or modules', courseDoc: 'Key Subjects' },
    skills: { techLabel: 'Key Skills', techDoc: 'Key Skills', tech: ['MS Office', 'Data Entry', 'Customer Service', 'Typing', 'Social Media'], softLabel: 'Soft Skills', softDoc: 'Soft Skills', soft: ['Communication', 'Teamwork', 'Time Management', 'Adaptability'] },
    proj: { add: 'Add Project', item: 'Project', nameLabel: 'Project Name', namePh: 'Project or activity name', types: ['Academic project', 'Volunteer work', 'Personal project', 'Other'], typeLabel: 'Type', typePh: 'Academic project', techLabel: 'Tools / Methods', techDoc: 'Tools', techPh: 'Tools or methods used', problemLabel: 'Purpose', problemPh: 'What was it for?', builtLabel: 'Your contribution', builtPh: 'What did you personally do?', featLabel: 'Key results', featPh: 'Results or outcomes', featHint: 'Separate results with commas', linkA: 'Link (optional)', linkAPh: 'Link', linkADoc: 'Link', linkB: 'Another link (optional)', linkBPh: 'Link', linkBDoc: 'Document' },
    exp: { add: 'Add Work Experience', item: 'Experience', empty: 'No experience yet? Skip this step.', companyLabel: 'Organisation', positionLabel: 'Position', positionPh: 'Your job title', locationPh: 'City / Remote', techLabel: 'Tools / Skills Used', techPh: 'Tools or skills', techDoc: 'Tools', respLabel: 'Responsibilities', respPh: 'What did you do day to day?', achLabel: 'Achievements', achPh: 'Results you are proud of...' },
    ach: { title: 'Achievements', cats: ['Award', 'Certification', 'Scholarship', 'Leadership role', 'Volunteering', 'Other'], ph: 'e.g. First prize, district-level competition 2025' },
  },
};

export const PROFESSIONS = Object.fromEntries(Object.entries(defs).map(([key, o]) => [key, { ...mk(o), key }]));

// Old CVs (saved before professions existed) behave like Engineering.
export const profileOf = (cv) => PROFESSIONS[cv?.career?.profession] || PROFESSIONS.engineering;
export const sectionIds = (p) => [...BASE_SECTIONS, ...p.extras.map((x) => x.id)];
export const sectionOrder = (cv) => {
  const ids = sectionIds(profileOf(cv));
  return [...new Set([...(cv.settings?.order || []), ...ids])].filter((k) => ids.includes(k));
};
export const sectionLabel = (cv, id) => {
  const p = profileOf(cv);
  return p.labels[id] || p.extras.find((x) => x.id === id)?.label || id;
};
export const applyProfession = (d, key) => {
  const p = PROFESSIONS[key];
  if (!p) return;
  d.career.profession = key;
  d.settings.template = p.template;
  d.settings.order = [...p.order];
};

/* ---------------- Empty entries ---------------- */
export const emptyEducation = () => ({ id: uid(), degree: '', school: '', department: '', start: '', end: '', grade: '', coursework: '' });
export const emptyProject = () => ({ id: uid(), name: '', type: '', tech: '', problem: '', built: '', features: '', github: '', demo: '', bullets: [] });
export const emptyExperience = () => ({ id: uid(), company: '', position: '', location: '', start: '', end: '', current: false, responsibilities: '', tech: '', achievements: '', bullets: [] });
export const emptyAchievement = () => ({ id: uid(), category: 'Hackathon', text: '' });
export const emptyExtra = (section) => ({ id: uid(), section, title: '', org: '', year: '', detail: '' });

export const newCV = (title = 'My CV') => ({
  id: uid(), title, createdAt: Date.now(), updatedAt: Date.now(),
  basics: { fullName: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '', photo: '', license: '' },
  career: { profession: '', status: '', targetRole: '', industry: '', years: '', objective: '' },
  education: [emptyEducation()], skills: { technical: [], soft: [] },
  projects: [emptyProject()], experience: [], achievements: [], extras: [], summary: '', interview: [],
  settings: { template: 'modern', fontSize: 10, spacing: 1.35, order: DEFAULT_ORDER },
  meta: { step: 0, stage: 'form' },
});