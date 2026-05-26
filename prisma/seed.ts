import { PrismaClient } from "@prisma/client";

// Inline mock data to make seed script self-contained and run without compilation path headaches
const SEED_COLLEGES = [
  {
    id: "col-1",
    name: "Indian Institute of Technology Bombay (IIT Bombay)",
    location: "Mumbai, Maharashtra",
    fees: 220000,
    rating: 4.9,
    placements: "Average package: 23.5 LPA | Highest package: 1.68 CPA",
    overview: "Established in 1958, IIT Bombay is a premier institute of national importance. It is globally recognized for its world-class research, highly qualified faculty, and top-tier student community.",
    courses: "Computer Science, Electrical Engineering, Mechanical Engineering, Aerospace Engineering, Chemical Engineering"
  },
  {
    id: "col-2",
    name: "Indian Institute of Technology Delhi (IIT Delhi)",
    location: "New Delhi, Delhi",
    fees: 225000,
    rating: 4.8,
    placements: "Average package: 22.0 LPA | Highest package: 1.40 CPA",
    overview: "IIT Delhi is a leading public technical university located in Hauz Khas, New Delhi. It is designated as an Institute of Eminence and consistently ranks among the top engineering colleges in India.",
    courses: "Computer Science, Civil Engineering, Biotechnology, Production and Industrial Engineering, Mathematics and Computing"
  },
  {
    id: "col-3",
    name: "Indian Institute of Technology Madras (IIT Madras)",
    location: "Chennai, Tamil Nadu",
    fees: 215000,
    rating: 4.9,
    placements: "Average package: 21.4 LPA | Highest package: 1.98 CPA",
    overview: "Consistently ranked #1 in NIRF engineering rankings, IIT Madras is situated in a lush, forested campus in Chennai. It is famous for its outstanding entrepreneurial ecosystem and research park.",
    courses: "Computer Science, Ocean Engineering, Aerospace Engineering, Electrical Engineering, Metallurgical Engineering"
  },
  {
    id: "col-4",
    name: "Indian Institute of Technology Kharagpur (IIT Kharagpur)",
    location: "Kharagpur, West Bengal",
    fees: 210000,
    rating: 4.7,
    placements: "Average package: 19.5 LPA | Highest package: 1.20 CPA",
    overview: "The first IIT to be established (in 1951), IIT Kharagpur has the largest campus area among all IITs and offers a massive range of diverse engineering and technology specializations.",
    courses: "Computer Science, Electronics and EC Engineering, Agriculture and Food Engineering, Mining Engineering, Exploration Geophysics"
  },
  {
    id: "col-5",
    name: "Indian Institute of Technology Kanpur (IIT Kanpur)",
    location: "Kanpur, Uttar Pradesh",
    fees: 218000,
    rating: 4.8,
    placements: "Average package: 20.8 LPA | Highest package: 1.50 CPA",
    overview: "IIT Kanpur is renowned for its academic rigor, excellent computer center, and unique student-led administration. It features a private airstrip for aeronautical engineering students.",
    courses: "Computer Science, Materials Science, Aerospace Engineering, Electrical Engineering, Earth Sciences"
  },
  {
    id: "col-6",
    name: "Birla Institute of Technology and Science (BITS Pilani)",
    location: "Pilani, Rajasthan",
    fees: 480000,
    rating: 4.7,
    placements: "Average package: 18.2 LPA | Highest package: 60.0 LPA",
    overview: "BITS Pilani is India's premium private university with no reservations policy. It is famous for its flexible curriculum, dual degree options, and 'Practice School' industry internships.",
    courses: "Computer Science, Electronics & Instrumentation, Chemical Engineering, Economics (Dual), Mechanical Engineering"
  },
  {
    id: "col-7",
    name: "National Institute of Technology Trichy (NIT Trichy)",
    location: "Tiruchirappalli, Tamil Nadu",
    fees: 145000,
    rating: 4.6,
    placements: "Average package: 15.8 LPA | Highest package: 52.0 LPA",
    overview: "NIT Trichy is ranked as the #1 National Institute of Technology in India. It is highly sought after for its strong academic curriculum and vibrant college cultural festivals like Festember.",
    courses: "Computer Science, Production Engineering, Electrical & Electronics, Instrumentation & Control, Civil Engineering"
  },
  {
    id: "col-8",
    name: "National Institute of Technology Surathkal (NIT Surathkal)",
    location: "Mangaluru, Karnataka",
    fees: 150000,
    rating: 4.6,
    placements: "Average package: 16.2 LPA | Highest package: 54.0 LPA",
    overview: "NIT Surathkal is uniquely situated right next to the Arabian Sea beach in Mangaluru. It boasts stellar research labs, high placement statistics, and strong global alumni connections.",
    courses: "Information Technology, Computer Engineering, Mining Engineering, Chemical Engineering, Metallurgy"
  },
  {
    id: "col-9",
    name: "Vellore Institute of Technology (VIT)",
    location: "Vellore, Tamil Nadu",
    fees: 198000,
    rating: 4.3,
    placements: "Average package: 9.0 LPA | Highest package: 75.0 LPA",
    overview: "VIT Vellore is one of India's largest and most famous private engineering universities, featuring excellent infrastructure, diverse student clubs, and highly structured placement drives.",
    courses: "Computer Science & Engineering, Information Technology, Electronics & Communication, Biotechnology"
  },
  {
    id: "col-10",
    name: "SRM Institute of Science and Technology (SRM)",
    location: "Chennai, Tamil Nadu",
    fees: 250000,
    rating: 4.1,
    placements: "Average package: 7.5 LPA | Highest package: 45.0 LPA",
    overview: "SRM Chennai offers a highly international environment, expansive campus layouts, and flexible credit-based systems allowing students to pursue cross-disciplinary technical research.",
    courses: "Computer Science, Nanotechnology, Mechatronics Engineering, Civil Engineering, Aerospace Engineering"
  },
  {
    id: "col-11",
    name: "Delhi Technological University (DTU)",
    location: "New Delhi, Delhi",
    fees: 219000,
    rating: 4.5,
    placements: "Average package: 15.6 LPA | Highest package: 1.09 CPA",
    overview: "Formerly known as Delhi College of Engineering (DCE), DTU is a premier state university with a rich legacy dating back to 1941, producing some of the finest technical leaders in the industry.",
    courses: "Software Engineering, Computer Engineering, Mathematics & Computing, Environmental Engineering, Mechanical Engineering"
  },
  {
    id: "col-12",
    name: "Netaji Subhas University of Technology (NSUT)",
    location: "New Delhi, Delhi",
    fees: 206000,
    rating: 4.4,
    placements: "Average package: 14.8 LPA | Highest package: 1.02 CPA",
    overview: "NSUT Delhi is highly acclaimed for its technical educational excellence and top-tier placements, particularly in the tech sector, with a stellar green campus located in Dwarka.",
    courses: "Computer Science & Engineering, Instrumentation & Control, Electronics & Communication, Manufacturing Processes"
  },
  {
    id: "col-13",
    name: "College of Engineering, Guindy (CEG)",
    location: "Chennai, Tamil Nadu",
    fees: 55000,
    rating: 4.5,
    placements: "Average package: 11.2 LPA | Highest package: 38.0 LPA",
    overview: "Established in 1794, CEG is one of the oldest technical institutions in Asia. As a constituent college of Anna University, it offers high-quality engineering education at extremely affordable rates.",
    courses: "Information Technology, Geoinformatics, Printing Technology, Industrial Engineering, Mining Engineering"
  },
  {
    id: "col-14",
    name: "PSG College of Technology",
    location: "Coimbatore, Tamil Nadu",
    fees: 125000,
    rating: 4.4,
    placements: "Average package: 10.5 LPA | Highest package: 36.0 LPA",
    overview: "PSG Tech is an industry-supported, private-aided technical institution known for its strong focus on industrial practice, research, and excellent industry-academia collaborations.",
    courses: "Computer Science, Textile Technology, Automobile Engineering, Production Engineering, Metallurgical Engineering"
  },
  {
    id: "col-15",
    name: "Manipal Institute of Technology (MIT)",
    location: "Manipal, Karnataka",
    fees: 460000,
    rating: 4.3,
    placements: "Average package: 12.5 LPA | Highest package: 54.0 LPA",
    overview: "MIT Manipal is a leading private institute that offers high quality student amenities, a global student exchange program, and a massive innovation center for startup ideation.",
    courses: "Computer Science, Aeronautical Engineering, Mechatronics, Biomedical Engineering, Data Science"
  },
  {
    id: "col-16",
    name: "Thapar Institute of Engineering and Technology",
    location: "Patiala, Punjab",
    fees: 410000,
    rating: 4.2,
    placements: "Average package: 10.9 LPA | Highest package: 40.0 LPA",
    overview: "Thapar University is a premier private educational institution situated in Punjab, globally ranked for its engineering publications and deep academic tie-ups with Trinity College Dublin.",
    courses: "Computer Engineering, Electronics and EC, Chemical Engineering, Civil Engineering, Biotechnology"
  },
  {
    id: "col-17",
    name: "Amity School of Engineering and Technology",
    location: "Noida, Uttar Pradesh",
    fees: 310000,
    rating: 3.9,
    placements: "Average package: 6.0 LPA | Highest package: 30.0 LPA",
    overview: "Amity Noida provides modern high-tech campus layouts, military training camps, and a strong corporate placement network, making it a very popular engineering destination in North India.",
    courses: "Computer Science, Aerospace Engineering, Electronics & Telecommunications, Civil Engineering"
  },
  {
    id: "col-18",
    name: "RV College of Engineering (RVCE)",
    location: "Bengaluru, Karnataka",
    fees: 260000,
    rating: 4.4,
    placements: "Average package: 14.5 LPA | Highest package: 53.0 LPA",
    overview: "RVCE is a top-ranked private engineering institution located in Bengaluru, India's tech hub. It is famous for its research projects and excellent software engineering placements.",
    courses: "Computer Science, Information Science, Electronics & Instrumentation, Industrial Engineering"
  },
  {
    id: "col-19",
    name: "PES University",
    location: "Bengaluru, Karnataka",
    fees: 380000,
    rating: 4.3,
    placements: "Average package: 13.0 LPA | Highest package: 50.0 LPA",
    overview: "PES University is key to Bengaluru's technological talent pipeline, offering a highly structured and modern syllabus, rigorous testing schedules, and exceptional company hiring rates.",
    courses: "Computer Science & Engineering, Electronics & Communication, Biotechnology, Mechanical Engineering"
  },
  {
    id: "col-20",
    name: "Kalinga Institute of Industrial Technology (KIIT)",
    location: "Bhubaneswar, Odisha",
    fees: 350000,
    rating: 4.1,
    placements: "Average package: 8.5 LPA | Highest package: 52.0 LPA",
    overview: "KIIT Bhubaneswar is an institution of eminence with a state-of-the-art campus, offering great sports facilities, diverse international festivals, and a strong track record of high placement volumes.",
    courses: "Computer Science & Engineering, Communication Engineering, Electrical Engineering, Aerospace Engineering"
  }
];

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding colleges...");
  for (const c of SEED_COLLEGES) {
    await prisma.college.upsert({
      where: { id: c.id },
      update: {
        name: c.name,
        location: c.location,
        fees: c.fees,
        rating: c.rating,
        placements: c.placements,
        overview: c.overview,
        courses: c.courses,
      },
      create: {
        id: c.id,
        name: c.name,
        location: c.location,
        fees: c.fees,
        rating: c.rating,
        placements: c.placements,
        overview: c.overview,
        courses: c.courses,
      },
    });
  }
  console.log("Seeding complete successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
