// Thesis Data Structure
const THESIS_DATA = {
    thesis: {
        title: "A Professional thesis on AI and Cybersecurity",
        id: "T2330174",
        broughtTopic: "AI and Cybersecurity",
        focusedTopic: "Graph Neural Network for detecting Financial Fraud Network",
        stage: "Pre-thesis 02 | Poster Presentation"
    },
    
    supervisors: {
        supervisor: {
            name: "Mr. Annajiat Alim Rasel [AAR]",
            title: "Senior Lecturer",
            email: "annajiat@bracu.ac.bd",
            altEmail: "annajiat@gmail.com",
            phone: "+8809638464646 Ext 1922",
            bio: "Senior Lecturer with expertise in AI and Cybersecurity. Extensive research experience in machine learning applications for network security.",
            department: "Computer Science and Engineering",
            university: "BRAC University"
        },
        
        associateSupervisor: {
            name: "Abdullah Al Thaki",
            title: "Lecturer",
            email: "abdullah.thaki@sust.edu",
            phone: "+880-XXX-XXXXXXX",
            bio: "Lecturer at SUST with research interests in network security and distributed systems.",
            department: "Computer Science and Engineering",
            university: "Shahjalal University of Science and Technology"
        },
        
        coSupervisor: {
            name: "Asif Shahriar [SHAH]",
            title: "Lecturer",
            email: "asif.shahriar@bracu.ac.bd",
            bio: "Lecturer specializing in data mining and machine learning applications in cybersecurity.",
            department: "Computer Science and Engineering",
            university: "BRAC University"
        }
    },
    
    students: [
        {
            id: "18301222",
            name: "Ishmam Bin Abdullah",
            initial: "IBA",
            gsuite: "ishmam.bin.abdullah@g.bracu.ac.bd",
            contact: "+8801966785889",
            role: "Contuctor"
        },
        {
            id: "20101198",
            name: "Mohammed Irteza Karim",
            initial: "MIK",
            gsuite: "mohammed.irteza.karim@g.bracu.ac.bd",
            contact: "+8801612461037",
            role: "Resourse Manager"
        },
        {
            id: "22299100",
            name: "Rownak Jahan Nowshin",
            initial: "RJN",
            gsuite: "rownak.jahan.nowshin@g.bracu.ac.bd",
            contact: "+8801569132972",
            role: "Researcher"
        },
        {
            id: "22299107",
            name: "Tahsin Ahmed",
            initial: "TAH",
            gsuite: "tahsin.ahmed2@g.bracu.ac.bd",
            contact: "+8801569132972",
            role: "Assosiate Lead"
        },
        {
            id: "23141072",
            name: "Sourav Das",
            initial: "SRV",
            gsuite: "sourav.das@g.bracu.ac.bd",
            contact: "+8801521437404",
            role: "Team Lead"
        }
    ],
    
    stages: [
        {
            id: "topic_finalization",
            title: "Topic Finalization",
            description: "Finalize thesis topic and research questions",
            completed: true,
            order: 1
        },
        {
            id: "pre_thesis_01",
            title: "Pre-Thesis 01",
            description: "Literature review and initial research proposal",
            completed: true,
            order: 2
        },
        {
            id: "pre_thesis_02",
            title: "Pre-Thesis 02 | Poster Presentation",
            description: "Poster presentation and methodology finalization",
            completed: false,
            order: 3
        },
        {
            id: "thesis_final",
            title: "Thesis Final (CSE400)",
            description: "Final thesis submission and defense",
            completed: false,
            order: 4
        }
    ]
};

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = THESIS_DATA;
}