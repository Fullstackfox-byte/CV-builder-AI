import { DEFAULT_ORDER } from './defaultCV';

export const sampleCV = {
  id: 'sample', title: 'Example CV',
  basics: { fullName: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '+91 98765 43210', location: 'Kolkata, India', linkedin: 'linkedin.com/in/aarav-sharma', github: 'github.com/aarav-dev', portfolio: 'aarav.dev', photo: '' },
  career: { status: 'Student', targetRole: 'Frontend Developer', industry: 'Software', years: '0', objective: '' },
  summary: 'Computer Science undergraduate with hands-on experience in frontend development and team-based software projects, proficient in HTML, CSS, JavaScript and React. Experienced in building responsive web interfaces and integrating REST APIs, with a strong interest in full-stack development.',
  education: [{ id: 'e1', degree: 'B.Tech', department: 'Computer Science & Engineering', school: 'Example Institute of Technology', start: '2022', end: '2026', grade: 'CGPA: 8.4/10', coursework: 'Data Structures, DBMS, Operating Systems, Web Technologies' }],
  skills: { technical: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Python', 'Git'], soft: ['Teamwork', 'Communication', 'Problem Solving'] },
  experience: [{ id: 'x1', company: 'BrightSoft Technologies', position: 'Web Development Intern', location: 'Remote', start: '2025-06', end: '2025-08', current: false, responsibilities: '', tech: 'React, Express', achievements: '', bullets: ['Built reusable React components for an internal dashboard used by the support team.', 'Integrated REST APIs and handled loading and error states across 6 screens.', 'Collaborated with two developers through Git-based code reviews.'] }],
  projects: [{ id: 'p1', name: 'Smart Parking System', type: 'IoT project', tech: 'Arduino, Ultrasonic Sensors', github: 'github.com/aarav-dev/smart-parking', demo: '', bullets: ['Developed an Arduino-based smart parking management system using ultrasonic sensors to detect real-time slot availability.', 'Implemented LED occupancy indicators and an entry gate controlled by sensor input.'] },
    { id: 'p2', name: 'StudyHub', type: 'Web application', tech: 'React, Node.js, MongoDB', github: 'github.com/aarav-dev/studyhub', demo: 'studyhub.example.com', bullets: ['Developed a responsive student web platform with React and Node.js to streamline access to academic resources.', 'Built REST APIs and MongoDB schemas for notes, subjects and user bookmarks.'] }],
  achievements: [{ id: 'a1', category: 'Hackathon', text: 'Finalist, college-level hackathon (team of 4)' }, { id: 'a2', category: 'Certification', text: 'Responsive Web Design - freeCodeCamp' }, { id: 'a3', category: 'Leadership role', text: 'Technical team member, college coding club' }],
  interview: [], settings: { template: 'modern', fontSize: 10, spacing: 1.35, order: DEFAULT_ORDER },
};
