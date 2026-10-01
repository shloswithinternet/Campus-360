const campusData = {
  stats: [
    { label: 'Events This Week', value: 14, icon: '🎉' },
    { label: 'New Announcements', value: 9, icon: '📢' },
    { label: 'Library Resources', value: 1280, icon: '📚' },
    { label: 'Campus Facilities', value: 18, icon: '🏫' },
    { label: 'Active Clubs', value: 12, icon: '👥' },
    { label: 'Lost & Found', value: 7, icon: '🔎' },
    { label: 'Canteen Specials', value: 5, icon: '🍴' },
    { label: 'Student Interactions', value: 24, icon: '💬' }
  ],
  today: [
    { time: '09:00 AM', title: 'AI & ML Department Seminar', location: 'Seminar Hall' },
    { time: '11:30 AM', title: 'Coding Club Workshop', location: 'Lab 204' },
    { time: '01:00 PM', title: 'Canteen Special Lunch', location: 'Main Canteen' },
    { time: '03:30 PM', title: 'Basketball Practice', location: 'Sports Ground' },
    { time: '05:00 PM', title: 'Robotics Club Meetup', location: 'Innovation Hub' }
  ],
  events: [
    {
      id: 'evt-1',
      title: 'AI & Machine Learning Workshop',
      category: 'Workshop',
      date: '2026-10-12',
      time: '11:00 AM',
      venue: 'Seminar Hall',
      organizer: 'AI/ML Club',
      description: 'Hands-on workshop on building practical AI prototypes and moving from theory to deployment.',
      eligibility: 'Open to all students with interest in AI, ML, and automation.',
      registrationDeadline: '2026-10-10',
      seatsAvailable: 48,
      contact: 'ai.club@demo-campus.edu',
      image: 'linear-gradient(135deg, rgba(37,99,235,0.14), rgba(6,182,212,0.2))'
    },
    {
      id: 'evt-2',
      title: 'Inter-Department Football Championship',
      category: 'Sports',
      date: '2026-10-15',
      time: '04:00 PM',
      venue: 'Sports Ground',
      organizer: 'Sports Committee',
      description: 'A competitive in-campus football championship with team spirit and student engagement.',
      eligibility: 'Students from all departments may register as teams.',
      registrationDeadline: '2026-10-13',
      seatsAvailable: 120,
      contact: 'sports@demo-campus.edu',
      image: 'linear-gradient(135deg, rgba(16,185,129,0.14), rgba(20,184,166,0.16))'
    },
    {
      id: 'evt-3',
      title: 'Designing Your First Web App',
      category: 'Technical',
      date: '2026-10-20',
      time: '02:30 PM',
      venue: 'Lab 302',
      organizer: 'Computer Engineering Department',
      description: 'An introductory session on frontend planning, layout principles, and functional interactions.',
      eligibility: 'Beginner-friendly for first and second year students.',
      registrationDeadline: '2026-10-18',
      seatsAvailable: 65,
      contact: 'webops@demo-campus.edu',
      image: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(59,130,246,0.18))'
    },
    {
      id: 'evt-4',
      title: 'Cultural Night 2026',
      category: 'Cultural',
      date: '2026-10-23',
      time: '07:00 PM',
      venue: 'Auditorium',
      organizer: 'Cultural Club',
      description: 'A vibrant evening of music, dance, drama, and student performances.',
      eligibility: 'All students are welcome.',
      registrationDeadline: '2026-10-21',
      seatsAvailable: 200,
      contact: 'culture@demo-campus.edu',
      image: 'linear-gradient(135deg, rgba(236,72,153,0.16), rgba(168,85,247,0.16))'
    },
    {
      id: 'evt-5',
      title: 'Placement Preparation Bootcamp',
      category: 'Placement',
      date: '2026-10-28',
      time: '10:00 AM',
      venue: 'Seminar Hall',
      organizer: 'Career Cell',
      description: 'Resume review, aptitude practice, and mock interview readiness for graduating students.',
      eligibility: 'Final year students and interested pre-final year students.',
      registrationDeadline: '2026-10-25',
      seatsAvailable: 85,
      contact: 'placements@demo-campus.edu',
      image: 'linear-gradient(135deg, rgba(59,130,246,0.18), rgba(16,185,129,0.16))'
    }
  ],
  announcements: [
    { id: 'ann-1', title: 'Library extended hours during internal assessments', category: 'Academic', priority: 'Important', department: 'Library', date: '2026-10-01', description: 'The library remains open until 9:30 PM for the next two weeks to support revision and exam preparation.', attachment: true, read: false },
    { id: 'ann-2', title: 'Mid-semester exam schedule released', category: 'Examination', priority: 'Urgent', department: 'Exam Cell', date: '2026-10-02', description: 'Please check the updated timetable and seating arrangement for the upcoming mid-semester tests.', attachment: true, read: false },
    { id: 'ann-3', title: 'Free Wi-Fi upgrade in academic blocks', category: 'Administration', priority: 'Normal', department: 'IT Services', date: '2026-10-03', description: 'Wireless connectivity has been improved in Blocks A, B and the central lobby during maintenance.', attachment: false, read: true },
    { id: 'ann-4', title: 'Placement drive registration open', category: 'Placement', priority: 'Important', department: 'Career Cell', date: '2026-10-04', description: 'Students interested in the software role drive should submit their CVs by the end of this week.', attachment: true, read: false },
    { id: 'ann-5', title: 'Student activity fair registrations live', category: 'Student Affairs', priority: 'Normal', department: 'Student Council', date: '2026-10-05', description: 'All clubs can register for the semester activity fair and showcase their events for new students.', attachment: false, read: true },
    { id: 'ann-6', title: 'AI/ML lab access update', category: 'Department', priority: 'Normal', department: 'AI & ML', date: '2026-10-06', description: 'Students must carry their ID cards while using the research labs after 4:00 PM.', attachment: false, read: false }
  ],
  news: [
    { id: 'news-1', title: 'Campus innovation fair brings student prototypes to life', category: 'Student Achievements', summary: 'A vibrant showcase of projects from design, engineering and AI-based student teams.', date: '2026-10-01', author: 'Campus Desk', readingTime: '4 min read', image: 'linear-gradient(135deg, rgba(37,99,235,0.14), rgba(20,184,166,0.14))' },
    { id: 'news-2', title: 'New digital library catalog now available to all students', category: 'Infrastructure', summary: 'The library has introduced a searchable digital catalog with quick access to new editions and e-books.', date: '2026-09-28', author: 'Library Team', readingTime: '3 min read', image: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(124,58,237,0.18))' },
    { id: 'news-3', title: 'Faculty team experiments with sustainable campus design', category: 'Faculty Achievement', summary: 'A collaborative effort on greener campus systems and design-driven energy savings.', date: '2026-09-23', author: 'Research Office', readingTime: '5 min read', image: 'linear-gradient(135deg, rgba(16,185,129,0.14), rgba(59,130,246,0.16))' },
    { id: 'news-4', title: 'NSS drives cleanliness and social outreach initiative', category: 'Campus Initiatives', summary: 'Volunteers teamed up to improve public spaces and support community outreach programs.', date: '2026-09-18', author: 'NSS Cell', readingTime: '4 min read', image: 'linear-gradient(135deg, rgba(250,204,21,0.18), rgba(251,146,60,0.16))' }
  ],
  blogs: [
    { id: 'blog-1', title: 'Finding your rhythm in a packed engineering semester', author: 'Aarav S.', role: 'Student', date: '2026-09-15', readingTime: '6 min read', category: 'Student Life', excerpt: 'A practical guide to balancing projects, assignments, and personal time without burning out.', cover: 'linear-gradient(135deg, rgba(59,130,246,0.18), rgba(14,165,233,0.2))' },
    { id: 'blog-2', title: 'What makes a strong first-year portfolio?', author: 'Meera K.', role: 'Mentor', date: '2026-09-18', readingTime: '5 min read', category: 'Career', excerpt: 'Learn how to showcase projects, internships, and skills in a way that attracts attention.', cover: 'linear-gradient(135deg, rgba(124,58,237,0.18), rgba(59,130,246,0.18))' },
    { id: 'blog-3', title: 'From campus club to community project', author: 'Yash R.', role: 'Robotics Club Member', date: '2026-09-22', readingTime: '7 min read', category: 'Clubs', excerpt: 'A story of turning curiosity into a team-driven robotics initiative.', cover: 'linear-gradient(135deg, rgba(16,185,129,0.16), rgba(20,184,166,0.18))' }
  ],
  books: [
    { id: 'book-1', title: 'Data Structures and Algorithms', author: 'S. Chand', category: 'Programming', availability: 'Available', shelf: 'A-12', isbn: '978-1-234-56789-0', publisher: 'Campus Press', description: 'A foundational guide covering core data structures, algorithmic thinking and problem-solving techniques.', edition: '3rd Edition' },
    { id: 'book-2', title: 'Machine Learning Fundamentals', author: 'R. Verma', category: 'AI/ML', availability: 'Issued', shelf: 'B-04', isbn: '978-1-234-56789-1', publisher: 'Academic House', description: 'Covers comparing models, training, validation and practical ML workflows for students.', edition: '2nd Edition' },
    { id: 'book-3', title: 'Engineering Mathematics', author: 'P. Sharma', category: 'Engineering', availability: 'Available', shelf: 'C-11', isbn: '978-1-234-56789-2', publisher: 'Core Concepts', description: 'Useful for solving ordinary differential equations, probability, and matrices in engineering.', edition: '5th Edition' },
    { id: 'book-4', title: 'Operating Systems', author: 'N. Mehta', category: 'Reference', availability: 'Available', shelf: 'D-09', isbn: '978-1-234-56789-3', publisher: 'Tech Library', description: 'Covers process management, memory, scheduling and file systems in detail.', edition: '1st Edition' },
    { id: 'book-5', title: 'Creative Writing Essentials', author: 'J. Patel', category: 'Fiction', availability: 'E-book', shelf: 'E-02', isbn: '978-1-234-56789-4', publisher: 'Ink & Paper', description: 'A student-friendly guide to storytelling, vocabulary-building and narrative voice.', edition: '4th Edition' }
  ],
  canteen: [
    { id: 'food-1', name: 'Veg Poha', category: 'Breakfast', price: 35, veg: true, availability: 'Available', image: 'linear-gradient(135deg, rgba(22,163,74,0.15), rgba(16,185,129,0.16))' },
    { id: 'food-2', name: 'Paneer Sandwich', category: 'Breakfast', price: 60, veg: true, availability: 'Available', image: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))' },
    { id: 'food-3', name: 'Dal Tadka', category: 'Lunch', price: 90, veg: true, availability: 'Available', image: 'linear-gradient(135deg, rgba(234,179,8,0.18), rgba(249,115,22,0.12))' },
    { id: 'food-4', name: 'Butter Naan + Paneer Masala', category: 'Lunch', price: 145, veg: true, availability: 'Limited', image: 'linear-gradient(135deg, rgba(251,146,60,0.18), rgba(239,68,68,0.12))' },
    { id: 'food-5', name: 'Veg Spring Roll', category: 'Snacks', price: 50, veg: true, availability: 'Available', image: 'linear-gradient(135deg, rgba(6,182,212,0.14), rgba(14,165,233,0.16))' },
    { id: 'food-6', name: 'Cold Coffee', category: 'Beverages', price: 55, veg: true, availability: 'Available', image: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(249,115,22,0.12))' },
    { id: 'food-7', name: 'Masala Dosa', category: 'Lunch', price: 70, veg: true, availability: 'Available', image: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(34,197,94,0.18))' },
    { id: 'food-8', name: 'Special Thali', category: 'Specials', price: 160, veg: true, availability: 'Popular', image: 'linear-gradient(135deg, rgba(37,99,235,0.16), rgba(124,58,237,0.16))' }
  ],
  clubs: [
    { id: 'club-1', name: 'Coding Club', category: 'Technical', members: 220, upcoming: 'Hacknight on Friday', description: 'A collaborative community for problem-solving, web development and hackathons.', contact: '@codingclub', logo: '💻' },
    { id: 'club-2', name: 'AI/ML Club', category: 'Technical', members: 180, upcoming: 'Computer Vision Demo', description: 'Explores machine learning workflows, research discussions, and projects.', contact: '@aimlclub', logo: '🤖' },
    { id: 'club-3', name: 'Robotics Club', category: 'Technical', members: 150, upcoming: 'Robot Build Session', description: 'Hands-on building and experimentation with robotics and embedded systems.', contact: '@roboticsclub', logo: '🛠️' },
    { id: 'club-4', name: 'Literary Club', category: 'Arts', members: 110, upcoming: 'Open Mic Evening', description: 'Encourages creative writing, discussions, and expressive storytelling.', contact: '@literaryclub', logo: '📖' },
    { id: 'club-5', name: 'Cultural Club', category: 'Arts', members: 200, upcoming: 'Dance Fusion Workshop', description: 'Celebrates identity, performance, and campus culture through creative arts.', contact: '@culturalclub', logo: '🎭' },
    { id: 'club-6', name: 'Sports Club', category: 'Sports', members: 260, upcoming: 'Inter-college tournament prep', description: 'A hub for sports practice, match planning and sportsmanship.', contact: '@sportsclub', logo: '🏅' }
  ],
  departments: [
    { id: 'dept-1', name: 'Computer Engineering', overview: 'Software systems, coding culture, and practical engineering fundamentals.', labs: 'Programming Lab, Networking Lab', events: 'Hackathons, startup workshops', contact: 'ce@demo-campus.edu' },
    { id: 'dept-2', name: 'Artificial Intelligence & Machine Learning', overview: 'Research and project work in AI, deep learning and intelligent systems.', labs: 'AI Lab, Data Science Lab', events: 'ML challenge, research showcase', contact: 'aiml@demo-campus.edu' },
    { id: 'dept-3', name: 'Information Technology', overview: 'Digital systems, application design, and cloud-based technology workflows.', labs: 'Web Lab, IT Infrastructure Lab', events: 'IT fair, cloud bootcamps', contact: 'it@demo-campus.edu' },
    { id: 'dept-4', name: 'Mechanical Engineering', overview: 'Applied mechanics, manufacturing and design-thinking for physical systems.', labs: 'Workshop, CAD Lab', events: 'Innovation expo, technical seminars', contact: 'mech@demo-campus.edu' },
    { id: 'dept-5', name: 'Civil Engineering', overview: 'Structures, surveying and sustainable infrastructure approaches.', labs: 'Surveying Lab, Material Testing Lab', events: 'Site visits, model competitions', contact: 'civil@demo-campus.edu' }
  ],
  facilities: [
    { id: 'fac-1', name: 'Library', location: 'Central Block', hours: '8:30 AM - 8:30 PM', description: 'Study zones, archives, and book lending services for academic and research support.', features: ['Reading rooms', 'Reference desk', 'E-books'] },
    { id: 'fac-2', name: 'Computer Labs', location: 'Block B, Floor 2', hours: '9:00 AM - 6:00 PM', description: 'Lab infrastructure for coding, simulations, graphics, and practical coursework.', features: ['High-speed PCs', 'Programming tools', 'Project labs'] },
    { id: 'fac-3', name: 'Auditorium', location: 'Main Campus', hours: '9:00 AM - 8:00 PM', description: 'Large event venue for seminars, cultural programs, and larger gatherings.', features: ['Stage lighting', 'Audio system', 'Seating for 250+'] },
    { id: 'fac-4', name: 'Seminar Hall', location: 'Academic Block', hours: '9:00 AM - 5:00 PM', description: 'Discussion and lecture space for workshops, guest sessions and presentations.', features: ['Projectors', 'AV setup', 'Lecture seating'] },
    { id: 'fac-5', name: 'Canteen', location: 'Student Plaza', hours: '8:00 AM - 7:00 PM', description: 'Students can access daily meals, snacks, beverages, and special items.', features: ['Veg menu', 'Combo meals', 'Quick snacks'] },
    { id: 'fac-6', name: 'Sports Ground', location: 'South Campus', hours: '6:00 AM - 7:00 PM', description: 'Sports and physical activities for football, athletics, and practice sessions.', features: ['Ground access', 'Practice kits', 'Open courts'] }
  ],
  lostFound: [
    { id: 'lf-1', itemName: 'Black ID Card', category: 'ID Card', description: 'Found near the library entrance during lunchtime.', location: 'Library', date: '2026-10-01', status: 'Found', contact: 'securitydesk@demo-campus.edu' },
    { id: 'lf-2', itemName: 'Blue Wallet', category: 'Wallet', description: 'A blue leather wallet with student ID and a few notes was found in the canteen.', location: 'Canteen', date: '2026-09-29', status: 'Unclaimed', contact: 'canteenhelp@demo-campus.edu' },
    { id: 'lf-3', itemName: 'Gray USB-C Charger', category: 'Charger', description: 'Lost in the computer lab after 4PM.', location: 'Lab 205', date: '2026-09-27', status: 'Lost', contact: 'labhelp@demo-campus.edu' }
  ],
  notifications: [
    { id: 'not-1', text: 'New announcement: library hours extended during assessments.', time: '2m ago', read: false },
    { id: 'not-2', text: 'Your event registration for AI Workshop is confirmed.', time: '12m ago', read: false },
    { id: 'not-3', text: 'Feedback received successfully. Thank you for sharing your input.', time: '1h ago', read: true },
    { id: 'not-4', text: 'Order #C360-1042 is now being prepared.', time: '2h ago', read: true }
  ],
  calendarEvents: [
    { date: '2026-10-05', title: 'Mid-semester exam', type: 'Exam' },
    { date: '2026-10-08', title: 'Placement drive', type: 'Placement' },
    { date: '2026-10-12', title: 'AI workshop', type: 'Event' },
    { date: '2026-10-15', title: 'Football championship', type: 'Sports' },
    { date: '2026-10-19', title: 'Holiday', type: 'Holiday' },
    { date: '2026-10-20', title: 'Web app workshop', type: 'Workshop' },
    { date: '2026-10-23', title: 'Cultural night', type: 'Event' }
  ],
  timetable: [
    { day: 'Monday', subjects: [
      { time: '09:00 - 10:00', subject: 'Data Structures', room: 'Room 201', faculty: 'Dr. Rao' },
      { time: '10:15 - 11:15', subject: 'Web Design', room: 'Lab 204', faculty: 'Ms. Jain' },
      { time: '01:30 - 02:30', subject: 'Algorithms', room: 'Room 305', faculty: 'Prof. Sen' }
    ] },
    { day: 'Tuesday', subjects: [
      { time: '09:00 - 10:00', subject: 'AI Basics', room: 'Room 112', faculty: 'Dr. Rao' },
      { time: '12:00 - 01:00', subject: 'Operating Systems', room: 'Room 204', faculty: 'Ms. Oza' }
    ] }
  ]
};

window.campusData = campusData;
