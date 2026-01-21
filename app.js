// Thesis Tracker - Main Application
class ThesisTracker {
    constructor() {
        this.currentPage = 'overview';
        this.searchResults = [];
        this.init();
    }

    init() {
        // Initialize LocalStorage
        this.initStorage();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup router
        this.setupRouter();
        
        // Load initial page
        this.loadPage(window.location.hash || '#overview');
    }

    initStorage() {
        // Initialize default data if not exists
        if (!localStorage.getItem('thesis_notes')) {
            localStorage.setItem('thesis_notes', '');
        }
        
        if (!localStorage.getItem('workflow_tasks')) {
            localStorage.setItem('workflow_tasks', JSON.stringify([]));
        }
        
        if (!localStorage.getItem('workflow_archives')) {
            localStorage.setItem('workflow_archives', JSON.stringify([]));
        }
        
        if (!localStorage.getItem('student_notes')) {
            localStorage.setItem('student_notes', JSON.stringify({}));
        }
        
        if (!localStorage.getItem('current_stage')) {
            localStorage.setItem('current_stage', 'pre_thesis_02');
        }
        
        if (!localStorage.getItem('stage_milestones')) {
            localStorage.setItem('stage_milestones', JSON.stringify({}));
        }
    }

    setupEventListeners() {
        // Nav toggle for mobile
        document.getElementById('navToggle').addEventListener('click', () => {
            document.getElementById('navLinks').classList.toggle('active');
        });

        // Global search
        const searchInput = document.getElementById('globalSearch');
        const searchResults = document.getElementById('searchResults');
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                this.performSearch(query);
            } else {
                searchResults.style.display = 'none';
            }
        });

        searchInput.addEventListener('focus', () => {
            if (this.searchResults.length > 0) {
                searchResults.style.display = 'block';
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                searchResults.style.display = 'none';
            }
        });
    }

    setupRouter() {
        window.addEventListener('hashchange', () => {
            this.loadPage(window.location.hash);
        });
    }

    async loadPage(hash) {
        const pageName = hash.replace('#', '') || 'overview';
        
        // Show loading
        document.getElementById('pageLoading').style.display = 'block';
        document.getElementById('pageContent').classList.add('loading');
        
        // Simulate loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            }
        });
        
        // Render page
        this.renderPage(pageName);
        
        // Hide loading
        document.getElementById('pageLoading').style.display = 'none';
        document.getElementById('pageContent').classList.remove('loading');
        
        // Close mobile menu
        document.getElementById('navLinks').classList.remove('active');
    }

    renderPage(pageName) {
        const pageContent = document.getElementById('pageContent');
        
        switch(pageName) {
            case 'overview':
                pageContent.innerHTML = this.renderOverview();
                break;
            case 'thesis':
                pageContent.innerHTML = this.renderThesisInfo();
                this.setupThesisPage();
                break;
            case 'supervisors':
                pageContent.innerHTML = this.renderSupervisors();
                this.setupSupervisorsPage();
                break;
            case 'students':
                pageContent.innerHTML = this.renderStudents();
                this.setupStudentsPage();
                break;
            case 'workflow':
                pageContent.innerHTML = this.renderWorkflow();
                this.setupWorkflowPage();
                break;
            case 'stages':
                pageContent.innerHTML = this.renderStages();
                this.setupStagesPage();
                break;
            case 'settings':
                pageContent.innerHTML = this.renderSettings();
                this.setupSettingsPage();
                break;
            default:
                pageContent.innerHTML = this.renderOverview();
        }
    }

    // ========== PAGE RENDERERS ==========

    renderOverview() {
        const tasks = JSON.parse(localStorage.getItem('workflow_tasks') || '[]');
        const completedTasks = tasks.filter(t => t.completed).length;
        const activeTasks = tasks.filter(t => !t.completed).slice(0, 5);
        const currentStage = localStorage.getItem('current_stage') || 'pre_thesis_02';
        
        return `
            <div class="container">
                <div class="section-header">
                    <h1 class="section-title">Dashboard Overview</h1>
                    <p class="section-subtitle">Track your thesis progress and next actions</p>
                </div>
                
                <div class="hero-card card" style="margin-bottom: 2rem;">
                    <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--accent);">
                        ${THESIS_DATA.thesis.title}
                    </h2>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;">
                        <span class="chip">ID: ${THESIS_DATA.thesis.id}</span>
                        <span class="chip active">${THESIS_DATA.thesis.stage}</span>
                    </div>
                    <p style="color: var(--text-muted);">
                        Focus: ${THESIS_DATA.thesis.focusedTopic}
                    </p>
                </div>
                
                <div class="grid grid-4" style="margin-bottom: 2rem;">
                    <div class="card">
                        <h3 class="card-title"><i class="fas fa-user-graduate"></i> Students</h3>
                        <div style="font-size: 2.5rem; font-weight: 700; color: var(--accent);">
                            ${THESIS_DATA.students.length}
                        </div>
                        <p style="color: var(--text-muted); margin-top: 0.5rem;">Total Participants</p>
                    </div>
                    
                    <div class="card">
                        <h3 class="card-title"><i class="fas fa-users"></i> Officials</h3>
                        <div style="font-size: 2.5rem; font-weight: 700; color: var(--accent);">
                            3
                        </div>
                        <p style="color: var(--text-muted); margin-top: 0.5rem;">Supervisors & Co-supervisors</p>
                    </div>
                    
                    <div class="card">
                        <h3 class="card-title"><i class="fas fa-tasks"></i> Tasks</h3>
                        <div style="font-size: 2.5rem; font-weight: 700; color: var(--accent);">
                            ${completedTasks}/${tasks.length}
                        </div>
                        <p style="color: var(--text-muted); margin-top: 0.5rem;">Completed / Total</p>
                    </div>
                    
                    <div class="card">
                        <h3 class="card-title"><i class="fas fa-chart-line"></i> Progress</h3>
                        <div style="font-size: 2.5rem; font-weight: 700; color: var(--accent);">
                            ${Math.round((completedTasks / Math.max(tasks.length, 1)) * 100)}%
                        </div>
                        <p style="color: var(--text-muted); margin-top: 0.5rem;">Overall Completion</p>
                    </div>
                </div>
                
                <div class="grid grid-2" style="gap: 2rem;">
                    <div class="card">
                        <h3 class="card-title"><i class="fas fa-project-diagram"></i> Stage Progress</h3>
                        <div class="timeline">
                            ${THESIS_DATA.stages.map(stage => `
                                <div class="timeline-item ${stage.id === currentStage ? 'active' : ''} ${stage.completed ? 'completed' : ''}">
                                    <h4 style="margin-bottom: 0.25rem;">${stage.title}</h4>
                                    <p style="color: var(--text-muted); font-size: 0.875rem;">${stage.description}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="card">
                        <h3 class="card-title"><i class="fas fa-list-check"></i> Next Actions</h3>
                        ${activeTasks.length > 0 ? `
                            <div style="margin-top: 1rem;">
                                ${activeTasks.map(task => `
                                    <div class="task-item">
                                        <div class="task-checkbox">
                                            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                                                   onchange="app.toggleTaskCompletion('${task.id}')">
                                        </div>
                                        <div class="task-content">
                                            <div class="task-title">${task.title}</div>
                                            ${task.description ? `<div class="task-desc">${task.description}</div>` : ''}
                                            <div class="task-meta">
                                                ${task.dueDate ? `<span><i class="far fa-calendar"></i> ${task.dueDate}</span>` : ''}
                                                ${task.priority ? `<span class="priority-badge priority-${task.priority}">${task.priority}</span>` : ''}
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        ` : `
                            <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
                                <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                                <p>All tasks completed! Great work!</p>
                            </div>
                        `}
                        <div style="margin-top: 1.5rem;">
                            <a href="#workflow" class="btn btn-primary">
                                <i class="fas fa-plus"></i> Add New Task
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderThesisInfo() {
        const notes = localStorage.getItem('thesis_notes') || '';
        
        return `
            <div class="container">
                <div class="section-header">
                    <h1 class="section-title">Thesis Information</h1>
                    <p class="section-subtitle">Complete thesis details and notes</p>
                </div>
                
                <div class="grid grid-2" style="gap: 2rem;">
                    <div class="card">
                        <h3 class="card-title"><i class="fas fa-info-circle"></i> Basic Information</h3>
                        <div class="info-grid" style="display: grid; gap: 1rem;">
                            <div>
                                <label style="color: var(--text-muted); font-size: 0.875rem;">Thesis Title</label>
                                <p style="font-weight: 500;">${THESIS_DATA.thesis.title}</p>
                            </div>
                            <div>
                                <label style="color: var(--text-muted); font-size: 0.875rem;">Thesis ID</label>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <p style="font-weight: 500;">${THESIS_DATA.thesis.id}</p>
                                    <button class="btn btn-sm btn-icon" onclick="app.copyToClipboard('${THESIS_DATA.thesis.id}')">
                                        <i class="far fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label style="color: var(--text-muted); font-size: 0.875rem;">Brought Topic</label>
                                <p style="font-weight: 500;">${THESIS_DATA.thesis.broughtTopic}</p>
                            </div>
                            <div>
                                <label style="color: var(--text-muted); font-size: 0.875rem;">Focused Topic</label>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <p style="font-weight: 500;">${THESIS_DATA.thesis.focusedTopic}</p>
                                    <button class="btn btn-sm btn-icon" onclick="app.copyToClipboard('${THESIS_DATA.thesis.focusedTopic}')">
                                        <i class="far fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label style="color: var(--text-muted); font-size: 0.875rem;">Current Stage</label>
                                <p style="font-weight: 500; color: var(--accent);">${THESIS_DATA.thesis.stage}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <h3 class="card-title"><i class="fas fa-edit"></i> Thesis Notes</h3>
                        <div class="form-group">
                            <textarea id="thesisNotes" class="form-control" 
                                      placeholder="Add your thesis notes here...">${notes}</textarea>
                        </div>
                        <div style="display: flex; justify-content: flex-end; gap: 1rem;">
                            <button class="btn btn-secondary" onclick="app.clearThesisNotes()">
                                Clear
                            </button>
                            <button class="btn btn-primary" onclick="app.saveThesisNotes()">
                                Save Notes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderSupervisors() {
        const { supervisor, associateSupervisor, coSupervisor } = THESIS_DATA.supervisors;
        
        return `
            <div class="container">
                <div class="section-header">
                    <h1 class="section-title">Supervisors & Faculties</h1>
                    <p class="section-subtitle">Contact information and details</p>
                </div>
                
                <div class="grid grid-3" style="gap: 2rem;">
                    <!-- Supervisor Card -->
                    <div class="card">
                        <div style="margin-bottom: 1rem;">
                            <span class="chip active" style="margin-bottom: 0.5rem;">Supervisor</span>
                            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${supervisor.name}</h3>
                            <p style="color: var(--text-muted);">${supervisor.title}</p>
                        </div>
                        
                        <div class="contact-info" style="margin-bottom: 1.5rem;">
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <div>
                                    <div>${supervisor.email}</div>
                                    <div style="font-size: 0.875rem; color: var(--text-muted);">${supervisor.altEmail}</div>
                                </div>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <div>${supervisor.phone}</div>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-university"></i>
                                <div>${supervisor.department}, ${supervisor.university}</div>
                            </div>
                        </div>
                        
                        <div class="bio-section" style="margin-bottom: 1.5rem;">
                            <div class="accordion">
                                <button class="btn btn-sm btn-secondary" onclick="app.toggleBio('supervisor')">
                                    <i class="fas fa-chevron-down"></i> View Bio
                                </button>
                                <div id="bio-supervisor" style="display: none; margin-top: 1rem; padding: 1rem; background: var(--panel); border-radius: var(--radius);">
                                    <p style="color: var(--text-muted);">${supervisor.bio}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="quick-actions" style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-sm btn-primary" onclick="app.copyToClipboard('${supervisor.email}')">
                                <i class="far fa-copy"></i> Copy Email
                            </button>
                            <button class="btn btn-sm btn-primary" onclick="app.copyToClipboard('${supervisor.phone}')">
                                <i class="far fa-copy"></i> Copy Phone
                            </button>
                            <button class="btn btn-sm btn-secondary" onclick="app.generateVCard('supervisor')">
                                <i class="fas fa-address-card"></i> vCard
                            </button>
                        </div>
                    </div>
                    
                    <!-- Associate Supervisor Card -->
                    <div class="card">
                        <div style="margin-bottom: 1rem;">
                            <span class="chip" style="margin-bottom: 0.5rem;">Associate Supervisor</span>
                            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${associateSupervisor.name}</h3>
                            <p style="color: var(--text-muted);">${associateSupervisor.title}</p>
                        </div>
                        
                        <div class="contact-info" style="margin-bottom: 1.5rem;">
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <div>${associateSupervisor.email}</div>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <div>${associateSupervisor.phone}</div>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-university"></i>
                                <div>${associateSupervisor.department}, ${associateSupervisor.university}</div>
                            </div>
                        </div>
                        
                        <div class="bio-section" style="margin-bottom: 1.5rem;">
                            <div class="accordion">
                                <button class="btn btn-sm btn-secondary" onclick="app.toggleBio('associate')">
                                    <i class="fas fa-chevron-down"></i> View Bio
                                </button>
                                <div id="bio-associate" style="display: none; margin-top: 1rem; padding: 1rem; background: var(--panel); border-radius: var(--radius);">
                                    <p style="color: var(--text-muted);">${associateSupervisor.bio}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Co-Supervisor Card -->
                    <div class="card">
                        <div style="margin-bottom: 1rem;">
                            <span class="chip" style="margin-bottom: 0.5rem;">Co-Supervisor</span>
                            <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${coSupervisor.name}</h3>
                            <p style="color: var(--text-muted);">${coSupervisor.title}</p>
                        </div>
                        
                        <div class="contact-info" style="margin-bottom: 1.5rem;">
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <div>${coSupervisor.email}</div>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-university"></i>
                                <div>${coSupervisor.department}, ${coSupervisor.university}</div>
                            </div>
                        </div>
                        
                        <div class="bio-section" style="margin-bottom: 1.5rem;">
                            <div class="accordion">
                                <button class="btn btn-sm btn-secondary" onclick="app.toggleBio('co')">
                                    <i class="fas fa-chevron-down"></i> View Bio
                                </button>
                                <div id="bio-co" style="display: none; margin-top: 1rem; padding: 1rem; background: var(--panel); border-radius: var(--radius);">
                                    <p style="color: var(--text-muted);">${coSupervisor.bio}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="quick-actions" style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-sm btn-primary" onclick="app.copyToClipboard('${coSupervisor.email}')">
                                <i class="far fa-copy"></i> Copy Email
                            </button>
                            <button class="btn btn-sm btn-secondary" onclick="app.generateVCard('co')">
                                <i class="fas fa-address-card"></i> vCard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderStudents() {
        return `
            <div class="container">
                <div class="section-header">
                    <h1 class="section-title">Students & Participants</h1>
                    <p class="section-subtitle">${THESIS_DATA.students.length} team members</p>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <div class="card">
                        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                                <input type="text" id="studentSearch" class="form-control" placeholder="Search by name, ID, or email..." 
                                       style="width: 300px;">
                                <div style="display: flex; gap: 0.25rem; flex-wrap: wrap;">
                                    ${Array.from(new Set(THESIS_DATA.students.map(s => s.initial[0]))).map(letter => `
                                        <button class="chip" onclick="app.filterStudentsByLetter('${letter}')">${letter}</button>
                                    `).join('')}
                                    <button class="chip" onclick="app.clearStudentFilter()">All</button>
                                </div>
                            </div>
                            <div style="display: flex; gap: 0.5rem;">
                                <button class="btn btn-sm btn-secondary" id="toggleView">
                                    <i class="fas fa-th"></i> Card View
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="studentsContainer">
                    <div class="student-grid">
                        ${THESIS_DATA.students.map(student => `
                            <div class="student-card" data-student-id="${student.id}">
                                <div class="student-header">
                                    <div class="student-avatar">
                                        ${student.initial}
                                    </div>
                                    <div class="student-info">
                                        <div class="student-name">${student.name}</div>
                                        <div class="student-id">ID: ${student.id}</div>
                                        <div style="font-size: 0.875rem; color: var(--accent); margin-top: 0.25rem;">
                                            ${student.role}
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="student-contacts">
                                    <div class="contact-item">
                                        <i class="fas fa-envelope"></i>
                                        <div style="flex: 1;">
                                            <div>${student.gsuite}</div>
                                            <button class="btn btn-sm btn-icon" onclick="app.copyToClipboard('${student.gsuite}')" 
                                                    style="margin-left: auto;">
                                                <i class="far fa-copy"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="contact-item">
                                        <i class="fas fa-phone"></i>
                                        <div style="flex: 1;">
                                            <div>${student.contact}</div>
                                            <button class="btn btn-sm btn-icon" onclick="app.copyToClipboard('${student.contact}')" 
                                                    style="margin-left: auto;">
                                                <i class="far fa-copy"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="student-notes" style="margin-top: 1rem;">
                                    <textarea class="form-control student-notes-input" 
                                              data-student-id="${student.id}"
                                              placeholder="Add notes for ${student.name}..."
                                              style="font-size: 0.875rem; min-height: 60px;">${this.getStudentNotes(student.id)}</textarea>
                                    <div style="display: flex; justify-content: flex-end; margin-top: 0.5rem;">
                                        <button class="btn btn-sm btn-primary" onclick="app.saveStudentNotes('${student.id}')">
                                            Save Notes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderWorkflow() {
        const tasks = JSON.parse(localStorage.getItem('workflow_tasks') || '[]');
        const archives = JSON.parse(localStorage.getItem('workflow_archives') || '[]');
        const completedCount = tasks.filter(t => t.completed).length;
        const totalCount = tasks.length;
        const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
        
        return `
            <div class="container">
                <div class="section-header">
                    <h1 class="section-title">Workflow & Tasks</h1>
                    <p class="section-subtitle">Manage your thesis tasks and milestones</p>
                </div>
                
                <div class="grid grid-2" style="gap: 2rem; margin-bottom: 2rem;">
                    <div class="card">
                        <h3 class="card-title"><i class="fas fa-plus-circle"></i> Add New Task</h3>
                        <form id="taskForm" onsubmit="return app.addTask(event)">
                            <div class="form-group">
                                <label class="form-label">Task Title *</label>
                                <input type="text" id="taskTitle" class="form-control" required 
                                       placeholder="What needs to be done?">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">Description (Optional)</label>
                                <textarea id="taskDescription" class="form-control" 
                                          placeholder="Add details about this task..."></textarea>
                            </div>
                            
                            <div class="grid grid-2" style="gap: 1rem;">
                                <div class="form-group">
                                    <label class="form-label">Priority</label>
                                    <select id="taskPriority" class="form-control">
                                        <option value="low">Low</option>
                                        <option value="medium" selected>Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">Due Date</label>
                                    <input type="date" id="taskDueDate" class="form-control">
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-plus"></i> Add Task
                                </button>
                                <button type="button" class="btn btn-secondary" onclick="app.clearTaskForm()">
                                    Clear Form
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div class="card">
                        <h3 class="card-title"><i class="fas fa-chart-bar"></i> Progress Overview</h3>
                        <div style="text-align: center; margin: 2rem 0;">
                            <div style="font-size: 2.5rem; font-weight: 700; color: var(--accent);">
                                ${completedCount}/${totalCount}
                            </div>
                            <p style="color: var(--text-muted); margin-bottom: 1rem;">Tasks Completed</p>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progressPercent}%"></div>
                            </div>
                        </div>
                        
                        <div style="margin-top: 2rem;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
                                <span>Sort by:</span>
                                <div style="display: flex; gap: 0.5rem;">
                                    <button class="btn btn-sm btn-secondary" onclick="app.sortTasks('created')">
                                        Created
                                    </button>
                                    <button class="btn btn-sm btn-secondary" onclick="app.sortTasks('due')">
                                        Due Date
                                    </button>
                                    <button class="btn btn-sm btn-secondary" onclick="app.sortTasks('priority')">
                                        Priority
                                    </button>
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                                <button class="btn btn-sm ${this.showCompleted ? 'btn-primary' : 'btn-secondary'}" 
                                        onclick="app.toggleShowCompleted()">
                                    ${this.showCompleted ? 'Hide' : 'Show'} Completed
                                </button>
                                <button class="btn btn-sm btn-warning" onclick="app.archiveWorkflow()">
                                    <i class="fas fa-archive"></i> Archive & Start New
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card" style="margin-bottom: 2rem;">
                    <div class="card-title">
                        <i class="fas fa-tasks"></i> Active Tasks
                        <span style="font-size: 0.875rem; color: var(--text-muted); margin-left: auto;">
                            ${totalCount} total, ${completedCount} completed
                        </span>
                    </div>
                    
                    <div id="tasksContainer">
                        ${this.renderTaskList(tasks)}
                    </div>
                </div>
                
                ${archives.length > 0 ? `
                    <div class="card">
                        <div class="card-title">
                            <i class="fas fa-archive"></i> Archived Workflows
                            <span style="font-size: 0.875rem; color: var(--text-muted); margin-left: auto;">
                                ${archives.length} archives
                            </span>
                        </div>
                        
                        <div id="archivesContainer">
                            ${this.renderArchivesList(archives)}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderStages() {
        const stages = THESIS_DATA.stages;
        const currentStage = localStorage.getItem('current_stage') || 'pre_thesis_02';
        const milestones = JSON.parse(localStorage.getItem('stage_milestones') || '{}');
        
        return `
            <div class="container">
                <div class="section-header">
                    <h1 class="section-title">Stages & Timeline</h1>
                    <p class="section-subtitle">Track your thesis progress through stages</p>
                </div>
                
                <div class="grid grid-2" style="gap: 2rem;">
                    <div class="card">
                        <h3 class="card-title"><i class="fas fa-road"></i> Thesis Stages</h3>
                        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
                            Select your current stage and track progress
                        </p>
                        
                        <div class="timeline">
                            ${stages.map(stage => `
                                <div class="timeline-item ${stage.id === currentStage ? 'active' : ''} ${stage.completed ? 'completed' : ''}">
                                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                        <div style="flex: 1;">
                                            <h4 style="margin-bottom: 0.25rem;">${stage.title}</h4>
                                            <p style="color: var(--text-muted); font-size: 0.875rem;">${stage.description}</p>
                                        </div>
                                        <div>
                                            <input type="radio" name="currentStage" value="${stage.id}" 
                                                   ${stage.id === currentStage ? 'checked' : ''}
                                                   onchange="app.setCurrentStage('${stage.id}')">
                                        </div>
                                    </div>
                                    
                                    <div style="margin-top: 1rem;">
                                        <textarea class="form-control stage-milestones" 
                                                  data-stage-id="${stage.id}"
                                                  placeholder="Add milestone notes for ${stage.title}..."
                                                  style="font-size: 0.875rem; min-height: 80px;">${milestones[stage.id] || ''}</textarea>
                                        <div style="display: flex; justify-content: flex-end; margin-top: 0.5rem;">
                                            <button class="btn btn-sm btn-primary" onclick="app.saveStageMilestones('${stage.id}')">
                                                Save Notes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="card">
                        <h3 class="card-title"><i class="fas fa-calendar-check"></i> Timeline Overview</h3>
                        <div style="margin: 2rem 0;">
                            <div style="text-align: center;">
                                <div style="font-size: 3rem; color: var(--accent); margin-bottom: 0.5rem;">
                                    ${stages.findIndex(s => s.id === currentStage) + 1}/${stages.length}
                                </div>
                                <p style="color: var(--text-muted);">Current Stage</p>
                            </div>
                            
                            <div class="progress-bar" style="margin: 2rem 0;">
                                <div class="progress-fill" 
                                     style="width: ${((stages.findIndex(s => s.id === currentStage) + 1) / stages.length) * 100}%"></div>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; text-align: center;">
                                ${stages.map((stage, index) => `
                                    <div style="padding: 0.5rem; background: ${stage.id === currentStage ? 'var(--accent)' : 'var(--panel)'}; 
                                                border-radius: var(--radius);">
                                        <div style="font-size: 0.75rem; font-weight: 600;">Stage ${index + 1}</div>
                                        <div style="font-size: 0.875rem; margin-top: 0.25rem; ${stage.id === currentStage ? 'color: white;' : ''}">
                                            ${stage.title.split(' ')[0]}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div style="margin-top: 2rem;">
                            <h4 style="margin-bottom: 1rem;">Upcoming Deadlines</h4>
                            <div style="background: var(--panel); padding: 1rem; border-radius: var(--radius);">
                                ${this.renderUpcomingDeadlines()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderSettings() {
        return `
            <div class="container">
                <div class="section-header">
                    <h1 class="section-title">Settings & Data Management</h1>
                    <p class="section-subtitle">Manage your data and application settings</p>
                </div>
                
                <div class="grid grid-2" style="gap: 2rem;">
                    <div class="card">
                        <h3 class="card-title"><i class="fas fa-download"></i> Export Data</h3>
                        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
                            Export all your thesis data as a JSON file for backup or transfer.
                        </p>
                        <button class="btn btn-primary" onclick="app.exportAllData()">
                            <i class="fas fa-file-export"></i> Export All Data
                        </button>
                    </div>
                    
                    <div class="card">
                        <h3 class="card-title"><i class="fas fa-upload"></i> Import Data</h3>
                        <p style="color: var(--text-muted); margin-bottom: 1rem;">
                            Import previously exported data from a JSON file.
                        </p>
                        <div class="form-group">
                            <input type="file" id="importFile" class="form-control" accept=".json">
                        </div>
                        <button class="btn btn-primary" onclick="app.importData()">
                            <i class="fas fa-file-import"></i> Import Data
                        </button>
                    </div>
                </div>
                
                <div class="card" style="margin-top: 2rem;">
                    <h3 class="card-title"><i class="fas fa-database"></i> Storage Information</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
                        <div>
                            <h4 style="margin-bottom: 0.5rem; font-size: 1rem;">LocalStorage Usage</h4>
                            <div style="background: var(--panel); padding: 1rem; border-radius: var(--radius);">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <span>Tasks</span>
                                    <span>${JSON.parse(localStorage.getItem('workflow_tasks') || '[]').length}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <span>Archives</span>
                                    <span>${JSON.parse(localStorage.getItem('workflow_archives') || '[]').length}</span>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span>Student Notes</span>
                                    <span>${Object.keys(JSON.parse(localStorage.getItem('student_notes') || '{}')).length}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h4 style="margin-bottom: 0.5rem; font-size: 1rem;">Application Info</h4>
                            <div style="background: var(--panel); padding: 1rem; border-radius: var(--radius);">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <span>Version</span>
                                    <span>1.0.0</span>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <span>Creator</span>
                                    <span>Tahsin Ahmed</span>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span>Last Updated</span>
                                    <span>${new Date().toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card" style="margin-top: 2rem; border-color: var(--danger);">
                    <h3 class="card-title" style="color: var(--danger);">
                        <i class="fas fa-exclamation-triangle"></i> Danger Zone
                    </h3>
                    <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
                        This will permanently delete all your data. This action cannot be undone.
                    </p>
                    <button class="btn btn-danger" onclick="app.confirmResetAllData()">
                        <i class="fas fa-trash-alt"></i> Reset All Application Data
                    </button>
                </div>
            </div>
        `;
    }

    // ========== HELPER METHODS ==========

    renderTaskList(tasks) {
        const filteredTasks = this.showCompleted ? tasks : tasks.filter(t => !t.completed);
        
        if (filteredTasks.length === 0) {
            return `
                <div style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    <i class="fas fa-clipboard-list" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <p>No tasks found. Add your first task above!</p>
                </div>
            `;
        }
        
        return filteredTasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-checkbox">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} 
                           onchange="app.toggleTaskCompletion('${task.id}')">
                </div>
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    ${task.description ? `<div class="task-desc">${task.description}</div>` : ''}
                    <div class="task-meta">
                        ${task.dueDate ? `<span><i class="far fa-calendar"></i> ${task.dueDate}</span>` : ''}
                        ${task.priority ? `<span class="priority-badge priority-${task.priority}">${task.priority}</span>` : ''}
                        <span><i class="far fa-clock"></i> Created: ${new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn btn-sm btn-icon" onclick="app.editTask('${task.id}')">
                        <i class="far fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-icon" onclick="app.deleteTask('${task.id}')">
                        <i class="far fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderArchivesList(archives) {
        return archives.map(archive => `
            <div class="card" style="margin-bottom: 1rem; background: var(--panel);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <div>
                        <strong>${archive.name}</strong>
                        <div style="font-size: 0.875rem; color: var(--text-muted);">
                            ${new Date(archive.date).toLocaleString()}
                        </div>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-sm btn-secondary" onclick="app.toggleArchiveDetails('${archive.id}')">
                            <i class="fas fa-chevron-down"></i> Details
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="app.restoreArchive('${archive.id}')">
                            <i class="fas fa-history"></i> Restore
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="app.deleteArchive('${archive.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
                <div id="archive-${archive.id}" style="display: none; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
                    <div style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 0.5rem;">
                        ${archive.tasks.length} tasks
                    </div>
                    <div style="max-height: 200px; overflow-y: auto;">
                        ${archive.tasks.map(task => `
                            <div style="padding: 0.5rem; background: var(--card); border-radius: var(--radius); margin-bottom: 0.25rem; 
                                        display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-${task.completed ? 'check-circle success' : 'circle'}"></i>
                                <span style="${task.completed ? 'text-decoration: line-through; color: var(--text-muted);' : ''}">
                                    ${task.title}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderUpcomingDeadlines() {
        const tasks = JSON.parse(localStorage.getItem('workflow_tasks') || '[]');
        const upcoming = tasks
            .filter(t => !t.completed && t.dueDate)
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 5);
        
        if (upcoming.length === 0) {
            return '<p style="color: var(--text-muted); text-align: center;">No upcoming deadlines</p>';
        }
        
        return upcoming.map(task => `
            <div style="padding: 0.75rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div>${task.title}</div>
                    <div style="font-size: 0.875rem; color: var(--text-muted);">
                        Due: ${task.dueDate}
                    </div>
                </div>
                <span class="priority-badge priority-${task.priority || 'medium'}">
                    ${task.priority || 'medium'}
                </span>
            </div>
        `).join('');
    }

    // ========== TASK MANAGEMENT ==========

    addTask(e) {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const priority = document.getElementById('taskPriority').value;
        const dueDate = document.getElementById('taskDueDate').value;
        
        const task = {
            id: Date.now().toString(),
            title,
            description,
            priority,
            dueDate,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        const tasks = JSON.parse(localStorage.getItem('workflow_tasks') || '[]');
        tasks.unshift(task);
        localStorage.setItem('workflow_tasks', JSON.stringify(tasks));
        
        this.clearTaskForm();
        this.loadPage('#workflow');
        this.showToast('Task added successfully!', 'success');
    }

    clearTaskForm() {
        document.getElementById('taskTitle').value = '';
        document.getElementById('taskDescription').value = '';
        document.getElementById('taskPriority').value = 'medium';
        document.getElementById('taskDueDate').value = '';
    }

    toggleTaskCompletion(taskId) {
        const tasks = JSON.parse(localStorage.getItem('workflow_tasks') || '[]');
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            localStorage.setItem('workflow_tasks', JSON.stringify(tasks));
            
            if (this.currentPage === 'workflow') {
                this.loadPage('#workflow');
            } else if (this.currentPage === 'overview') {
                this.loadPage('#overview');
            }
            
            this.showToast(`Task marked as ${tasks[taskIndex].completed ? 'completed' : 'active'}`, 'info');
        }
    }

    editTask(taskId) {
        const tasks = JSON.parse(localStorage.getItem('workflow_tasks') || '[]');
        const task = tasks.find(t => t.id === taskId);
        
        if (!task) return;
        
        const modalHtml = `
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">Edit Task</h3>
                </div>
                <div class="modal-body">
                    <form id="editTaskForm" onsubmit="return app.updateTask('${taskId}', event)">
                        <div class="form-group">
                            <label class="form-label">Task Title</label>
                            <input type="text" id="editTaskTitle" class="form-control" value="${task.title}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Description</label>
                            <textarea id="editTaskDescription" class="form-control">${task.description || ''}</textarea>
                        </div>
                        <div class="grid grid-2" style="gap: 1rem;">
                            <div class="form-group">
                                <label class="form-label">Priority</label>
                                <select id="editTaskPriority" class="form-control">
                                    <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                                    <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                                    <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Due Date</label>
                                <input type="date" id="editTaskDueDate" class="form-control" value="${task.dueDate || ''}">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
                    <button class="btn btn-primary" onclick="app.updateTask('${taskId}')">Save Changes</button>
                </div>
            </div>
        `;
        
        this.showModal(modalHtml);
    }

    updateTask(taskId) {
        const title = document.getElementById('editTaskTitle').value;
        const description = document.getElementById('editTaskDescription').value;
        const priority = document.getElementById('editTaskPriority').value;
        const dueDate = document.getElementById('editTaskDueDate').value;
        
        const tasks = JSON.parse(localStorage.getItem('workflow_tasks') || '[]');
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex] = {
                ...tasks[taskIndex],
                title,
                description,
                priority,
                dueDate
            };
            
            localStorage.setItem('workflow_tasks', JSON.stringify(tasks));
            this.closeModal();
            this.loadPage('#workflow');
            this.showToast('Task updated successfully!', 'success');
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            const tasks = JSON.parse(localStorage.getItem('workflow_tasks') || '[]');
            const filteredTasks = tasks.filter(t => t.id !== taskId);
            localStorage.setItem('workflow_tasks', JSON.stringify(filteredTasks));
            
            this.loadPage('#workflow');
            this.showToast('Task deleted successfully!', 'success');
        }
    }

    sortTasks(method) {
        const tasks = JSON.parse(localStorage.getItem('workflow_tasks') || '[]');
        
        switch(method) {
            case 'created':
                tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'due':
                tasks.sort((a, b) => {
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                });
                break;
            case 'priority':
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
                break;
        }
        
        localStorage.setItem('workflow_tasks', JSON.stringify(tasks));
        this.loadPage('#workflow');
    }

    archiveWorkflow() {
        const name = prompt('Enter a name for this workflow archive:');
        if (!name) return;
        
        const tasks = JSON.parse(localStorage.getItem('workflow_tasks') || '[]');
        const archives = JSON.parse(localStorage.getItem('workflow_archives') || '[]');
        
        const archive = {
            id: Date.now().toString(),
            name,
            date: new Date().toISOString(),
            tasks: [...tasks]
        };
        
        archives.unshift(archive);
        localStorage.setItem('workflow_archives', JSON.stringify(archives));
        localStorage.setItem('workflow_tasks', JSON.stringify([]));
        
        this.loadPage('#workflow');
        this.showToast(`Workflow archived as "${name}"`, 'success');
    }

    restoreArchive(archiveId) {
        if (confirm('Restore this workflow? Current tasks will be replaced.')) {
            const archives = JSON.parse(localStorage.getItem('workflow_archives') || '[]');
            const archive = archives.find(a => a.id === archiveId);
            
            if (archive) {
                localStorage.setItem('workflow_tasks', JSON.stringify(archive.tasks));
                this.loadPage('#workflow');
                this.showToast('Workflow restored successfully!', 'success');
            }
        }
    }

    deleteArchive(archiveId) {
        if (confirm('Delete this archive permanently?')) {
            const archives = JSON.parse(localStorage.getItem('workflow_archives') || '[]');
            const filteredArchives = archives.filter(a => a.id !== archiveId);
            localStorage.setItem('workflow_archives', JSON.stringify(filteredArchives));
            
            this.loadPage('#workflow');
            this.showToast('Archive deleted successfully!', 'success');
        }
    }

    // ========== DATA MANAGEMENT ==========

    saveThesisNotes() {
        const notes = document.getElementById('thesisNotes').value;
        localStorage.setItem('thesis_notes', notes);
        this.showToast('Thesis notes saved!', 'success');
    }

    clearThesisNotes() {
        if (confirm('Clear all thesis notes?')) {
            document.getElementById('thesisNotes').value = '';
            localStorage.setItem('thesis_notes', '');
            this.showToast('Thesis notes cleared!', 'info');
        }
    }

    getStudentNotes(studentId) {
        const notes = JSON.parse(localStorage.getItem('student_notes') || '{}');
        return notes[studentId] || '';
    }

    saveStudentNotes(studentId) {
        const notes = JSON.parse(localStorage.getItem('student_notes') || '{}');
        const textarea = document.querySelector(`textarea[data-student-id="${studentId}"]`);
        
        if (textarea) {
            notes[studentId] = textarea.value;
            localStorage.setItem('student_notes', JSON.stringify(notes));
            this.showToast(`Notes saved for ${THESIS_DATA.students.find(s => s.id === studentId)?.name}!`, 'success');
        }
    }

    setCurrentStage(stageId) {
        localStorage.setItem('current_stage', stageId);
        this.showToast(`Current stage updated!`, 'success');
        
        if (this.currentPage === 'overview') {
            this.loadPage('#overview');
        } else if (this.currentPage === 'stages') {
            this.loadPage('#stages');
        }
    }

    saveStageMilestones(stageId) {
        const textarea = document.querySelector(`textarea[data-stage-id="${stageId}"]`);
        if (!textarea) return;
        
        const milestones = JSON.parse(localStorage.getItem('stage_milestones') || '{}');
        milestones[stageId] = textarea.value;
        localStorage.setItem('stage_milestones', JSON.stringify(milestones));
        
        this.showToast('Milestone notes saved!', 'success');
    }

    // ========== UTILITIES ==========

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy:', err);
            this.showToast('Failed to copy to clipboard', 'error');
        });
    }

    generateVCard(type) {
        const { supervisor, coSupervisor } = THESIS_DATA.supervisors;
        let contact;
        
        if (type === 'supervisor') {
            contact = supervisor;
        } else if (type === 'co') {
            contact = coSupervisor;
        } else {
            return;
        }
        
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.name}
ORG:${contact.university}
TITLE:${contact.title}
EMAIL:${contact.email}
TEL:${contact.phone || ''}
END:VCARD`;
        
        const blob = new Blob([vcard], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${contact.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.vcf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('vCard downloaded!', 'success');
    }

    toggleBio(type) {
        const bioDiv = document.getElementById(`bio-${type}`);
        if (bioDiv) {
            bioDiv.style.display = bioDiv.style.display === 'none' ? 'block' : 'none';
        }
    }

    performSearch(query) {
        const searchResultsDiv = document.getElementById('searchResults');
        const normalizedQuery = query.toLowerCase();
        
        this.searchResults = [];
        
        // Search students
        THESIS_DATA.students.forEach(student => {
            if (student.name.toLowerCase().includes(normalizedQuery) ||
                student.id.includes(normalizedQuery) ||
                student.gsuite.toLowerCase().includes(normalizedQuery) ||
                student.initial.toLowerCase().includes(normalizedQuery)) {
                this.searchResults.push({
                    type: 'student',
                    title: student.name,
                    subtitle: `ID: ${student.id}`,
                    action: () => {
                        window.location.hash = '#students';
                        setTimeout(() => {
                            const element = document.querySelector(`[data-student-id="${student.id}"]`);
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                element.style.boxShadow = '0 0 0 2px var(--accent)';
                                setTimeout(() => element.style.boxShadow = '', 2000);
                            }
                        }, 300);
                    }
                });
            }
        });
        
        // Search tasks
        const tasks = JSON.parse(localStorage.getItem('workflow_tasks') || '[]');
        tasks.forEach(task => {
            if (task.title.toLowerCase().includes(normalizedQuery) ||
                task.description?.toLowerCase().includes(normalizedQuery)) {
                this.searchResults.push({
                    type: 'task',
                    title: task.title,
                    subtitle: `Task · ${task.completed ? 'Completed' : 'Active'}`,
                    action: () => {
                        window.location.hash = '#workflow';
                        setTimeout(() => {
                            const element = document.querySelector(`[data-task-id="${task.id}"]`);
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                element.style.boxShadow = '0 0 0 2px var(--accent)';
                                setTimeout(() => element.style.boxShadow = '', 2000);
                            }
                        }, 300);
                    }
                });
            }
        });
        
        // Render results
        if (this.searchResults.length > 0) {
            searchResultsDiv.innerHTML = this.searchResults.map(result => `
                <div class="search-result-item" onclick="${result.action.toString().replace(/"/g, '&quot;')}">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--accent); 
                                    display: flex; align-items: center; justify-content: center; color: white;">
                            <i class="fas fa-${result.type === 'student' ? 'user-graduate' : 'tasks'}"></i>
                        </div>
                        <div>
                            <div style="font-weight: 500;">${result.title}</div>
                            <div style="font-size: 0.875rem; color: var(--text-muted);">${result.subtitle}</div>
                        </div>
                    </div>
                </div>
            `).join('');
            searchResultsDiv.style.display = 'block';
        } else {
            searchResultsDiv.innerHTML = `
                <div style="padding: 1rem; text-align: center; color: var(--text-muted);">
                    No results found
                </div>
            `;
            searchResultsDiv.style.display = 'block';
        }
    }

    filterStudentsByLetter(letter) {
        const students = THESIS_DATA.students;
        const filtered = students.filter(s => s.name[0].toLowerCase() === letter.toLowerCase());
        
        const container = document.getElementById('studentsContainer');
        container.innerHTML = `
            <div class="student-grid">
                ${filtered.map(student => `
                    <div class="student-card">
                        <div class="student-header">
                            <div class="student-avatar">
                                ${student.initial}
                            </div>
                            <div class="student-info">
                                <div class="student-name">${student.name}</div>
                                <div class="student-id">ID: ${student.id}</div>
                            </div>
                        </div>
                        <div class="student-contacts">
                            <div class="contact-item">
                                <i class="fas fa-envelope"></i>
                                <div style="flex: 1;">
                                    <div>${student.gsuite}</div>
                                    <button class="btn btn-sm btn-icon" onclick="app.copyToClipboard('${student.gsuite}')" 
                                            style="margin-left: auto;">
                                        <i class="far fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="contact-item">
                                <i class="fas fa-phone"></i>
                                <div style="flex: 1;">
                                    <div>${student.contact}</div>
                                    <button class="btn btn-sm btn-icon" onclick="app.copyToClipboard('${student.contact}')" 
                                            style="margin-left: auto;">
                                        <i class="far fa-copy"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    clearStudentFilter() {
        this.loadPage('#students');
    }

    exportAllData() {
        const data = {
            thesis_notes: localStorage.getItem('thesis_notes'),
            workflow_tasks: JSON.parse(localStorage.getItem('workflow_tasks') || '[]'),
            workflow_archives: JSON.parse(localStorage.getItem('workflow_archives') || '[]'),
            student_notes: JSON.parse(localStorage.getItem('student_notes') || '{}'),
            current_stage: localStorage.getItem('current_stage'),
            stage_milestones: JSON.parse(localStorage.getItem('stage_milestones') || '{}'),
            export_date: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `thesis_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Data exported successfully!', 'success');
    }

    importData() {
        const fileInput = document.getElementById('importFile');
        const file = fileInput.files[0];
        
        if (!file) {
            this.showToast('Please select a file to import', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (confirm('Import this data? Current data will be replaced.')) {
                    localStorage.setItem('thesis_notes', data.thesis_notes || '');
                    localStorage.setItem('workflow_tasks', JSON.stringify(data.workflow_tasks || []));
                    localStorage.setItem('workflow_archives', JSON.stringify(data.workflow_archives || []));
                    localStorage.setItem('student_notes', JSON.stringify(data.student_notes || {}));
                    localStorage.setItem('current_stage', data.current_stage || 'pre_thesis_02');
                    localStorage.setItem('stage_milestones', JSON.stringify(data.stage_milestones || {}));
                    
                    this.showToast('Data imported successfully!', 'success');
                    this.loadPage(window.location.hash);
                }
            } catch (error) {
                this.showToast('Invalid data file', 'error');
                console.error('Import error:', error);
            }
        };
        
        reader.readAsText(file);
        fileInput.value = '';
    }

    confirmResetAllData() {
        if (confirm('⚠️ WARNING: This will delete ALL your data including tasks, archives, and notes. This action cannot be undone.\n\nAre you absolutely sure?')) {
            localStorage.clear();
            this.initStorage();
            this.showToast('All data has been reset', 'info');
            this.loadPage(window.location.hash);
        }
    }

    // ========== UI UTILITIES ==========

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <div>${message}</div>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => container.removeChild(toast), 300);
        }, 3000);
    }

    showModal(content) {
        const container = document.getElementById('modalContainer');
        container.innerHTML = content;
        container.style.display = 'flex';
        
        // Close modal on background click
        container.onclick = (e) => {
            if (e.target === container) {
                this.closeModal();
            }
        };
        
        // Close on Escape key
        const closeOnEsc = (e) => {
            if (e.key === 'Escape') this.closeModal();
        };
        document.addEventListener('keydown', closeOnEsc);
        
        // Store the event listener for cleanup
        this.currentModalEscListener = closeOnEsc;
    }

    closeModal() {
        const container = document.getElementById('modalContainer');
        container.style.display = 'none';
        container.innerHTML = '';
        
        if (this.currentModalEscListener) {
            document.removeEventListener('keydown', this.currentModalEscListener);
            this.currentModalEscListener = null;
        }
    }

    // ========== PAGE SETUP METHODS ==========

    setupThesisPage() {
        // Add event listeners for thesis page
        const textarea = document.getElementById('thesisNotes');
        if (textarea) {
            textarea.addEventListener('input', () => {
                // Auto-save after 2 seconds of inactivity
                clearTimeout(this.thesisNotesTimeout);
                this.thesisNotesTimeout = setTimeout(() => {
                    this.saveThesisNotes();
                }, 2000);
            });
        }
    }

    setupSupervisorsPage() {
        // Add event listeners for supervisors page
    }

    setupStudentsPage() {
        // Setup student search
        const searchInput = document.getElementById('studentSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const cards = document.querySelectorAll('.student-card');
                
                cards.forEach(card => {
                    const name = card.querySelector('.student-name').textContent.toLowerCase();
                    const id = card.querySelector('.student-id').textContent.toLowerCase();
                    const email = card.querySelector('.contact-item:nth-child(1) div:nth-child(1)').textContent.toLowerCase();
                    
                    if (name.includes(query) || id.includes(query) || email.includes(query)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        }
        
        // Auto-save student notes
        document.querySelectorAll('.student-notes-input').forEach(textarea => {
            textarea.addEventListener('input', (e) => {
                clearTimeout(this.studentNotesTimeout);
                const studentId = e.target.dataset.studentId;
                this.studentNotesTimeout = setTimeout(() => {
                    this.saveStudentNotes(studentId);
                }, 2000);
            });
        });
    }

    setupWorkflowPage() {
        this.showCompleted = false;
        
        // Add keyboard shortcut for adding tasks
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && document.getElementById('taskTitle')) {
                document.querySelector('form').requestSubmit();
            }
        });
    }

    setupStagesPage() {
        // Auto-save stage milestones
        document.querySelectorAll('.stage-milestones').forEach(textarea => {
            textarea.addEventListener('input', (e) => {
                clearTimeout(this.stageMilestonesTimeout);
                const stageId = e.target.dataset.stageId;
                this.stageMilestonesTimeout = setTimeout(() => {
                    this.saveStageMilestones(stageId);
                }, 2000);
            });
        });
    }

    setupSettingsPage() {
        // Nothing specific needed for settings page
    }
}

// Initialize the application
const app = new ThesisTracker();
window.app = app; // Make app available globally for inline event handlers
