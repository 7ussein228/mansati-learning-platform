from fpdf import FPDF
import os

class CVPDF(FPDF):
    def header(self):
        pass
    
    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def create_cv_pdf():
    pdf = CVPDF()
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_page()
    
    # --- NAME & CONTACT ---
    pdf.set_font('Helvetica', 'B', 28)
    pdf.set_text_color(26, 54, 93)
    pdf.cell(0, 12, 'HUSSEIN ALI', ln=True)
    
    pdf.set_font('Helvetica', '', 12)
    pdf.set_text_color(37, 99, 235)
    pdf.cell(0, 7, 'Full-Stack Developer', ln=True)
    
    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 6, 'Suez, Egypt | Remote Available | linkedin.com/in/hussein-ali-dev', ln=True)
    
    # Divider
    pdf.set_draw_color(37, 99, 235)
    pdf.set_line_width(0.8)
    pdf.line(10, pdf.get_y() + 3, 200, pdf.get_y() + 3)
    pdf.ln(8)
    
    # --- PROFESSIONAL SUMMARY ---
    pdf.set_font('Helvetica', 'B', 13)
    pdf.set_text_color(30, 64, 175)
    pdf.cell(0, 8, 'PROFESSIONAL SUMMARY', ln=True)
    pdf.set_draw_color(219, 234, 254)
    pdf.set_line_width(0.3)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(3)
    
    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(50, 50, 50)
    summary = (
        "Full-Stack Developer and Dental Medicine student at Galala University. "
        "Specialized in building high-performance booking systems, learning platforms, "
        "and web applications. Expertise in React, Node.js, Next.js, and Supabase with "
        "a proven track record of delivering 7+ production-ready projects. "
        "Available for remote work - Starting from $1,500."
    )
    pdf.multi_cell(0, 5, summary)
    pdf.ln(5)
    
    # --- TECHNICAL SKILLS ---
    pdf.set_font('Helvetica', 'B', 13)
    pdf.set_text_color(30, 64, 175)
    pdf.cell(0, 8, 'TECHNICAL SKILLS', ln=True)
    pdf.set_draw_color(219, 234, 254)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(3)
    
    skills = [
        ('Frontend', 'React 18/19, Next.js 16, Vite, Tailwind CSS, TypeScript, Framer Motion'),
        ('Backend', 'Node.js, Express.js, RESTful APIs'),
        ('Database', 'Supabase (PostgreSQL), Drizzle ORM, JSON DB'),
        ('Authentication', 'JWT, bcrypt'),
        ('Other', 'QR Code Integration, PWA, Real-time Systems, IndexedDB'),
        ('Languages', 'Arabic (Native), English (Professional)'),
    ]
    
    for label, value in skills:
        pdf.set_font('Helvetica', 'B', 10)
        pdf.set_text_color(50, 50, 50)
        pdf.cell(35, 5, label + ':', 0, 0)
        pdf.set_font('Helvetica', '', 10)
        pdf.cell(0, 5, value, ln=True)
    
    pdf.ln(5)
    
    # --- PROJECTS ---
    pdf.set_font('Helvetica', 'B', 13)
    pdf.set_text_color(30, 64, 175)
    pdf.cell(0, 8, 'PROJECTS', ln=True)
    pdf.set_draw_color(219, 234, 254)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(3)
    
    projects = [
        {
            'title': 'CineVox - Seaway Suez Cinema Booking System',
            'role': 'Full-Stack Developer | 2026',
            'details': [
                'Built a complete cinema booking platform inspired by VOX Cinemas for Seaway Suez',
                'Developed real-time interactive seat map with anti-double-booking logic',
                'Implemented full bilingual support (AR/EN) with seamless language switching',
                'Integrated secure authentication (JWT + bcrypt) and admin dashboard',
            ],
            'tech': 'React 18, Vite, Tailwind CSS, Express.js, JSON Database',
        },
        {
            'title': 'FUTURE CINEMA - Premium Cinema Booking Platform',
            'role': 'Full-Stack Developer | 2026',
            'details': [
                'Built a premium bilingual booking platform for Future Mall, New Cairo (8 Halls, IMAX, 4DX)',
                'Developed real-time seat selection with conflict detection',
                'Created admin dashboard with real-time revenue analytics',
            ],
            'tech': 'React, Vite, Tailwind CSS, Node.js, Supabase',
        },
        {
            'title': 'Monasati - Learning Management System',
            'role': 'Full-Stack Developer | 2026',
            'details': [
                'Built a comprehensive learning platform for secondary school students',
                'Developed course management, interactive quizzes, and student progress tracking',
                'Integrated payment system (XPayEG) and certificate generation',
            ],
            'tech': 'Next.js 16, React 19, TypeScript, Tailwind CSS, PostgreSQL, Drizzle ORM',
        },
        {
            'title': 'Dr. Hussein Ali - Biology & Science Platform',
            'role': 'Full-Stack Developer | 2026',
            'details': [
                'Built a specialized learning platform for Biology & Integrated Science courses',
                'Implemented course filtering by grade, language, and curriculum',
                'Developed video protection system and payment integration (Paymob/XPay)',
            ],
            'tech': 'Next.js 16, React 19, TypeScript, Tailwind CSS',
        },
        {
            'title': 'StudyDesk - Student Learning Platform',
            'role': 'Full-Stack Developer | 2025',
            'details': [
                'Built a lightweight student platform with local storage capabilities',
                'Implemented admin panel for course management and content upload',
                'Developed IndexedDB-based storage for offline access (~1GB+ capacity)',
            ],
            'tech': 'HTML, Vanilla JavaScript, IndexedDB, PowerShell Server',
        },
        {
            'title': 'Teacher Platform',
            'role': 'Frontend Developer | 2025',
            'details': [
                'Built a modern teacher dashboard with smooth animations',
                'Implemented course management and student interaction features',
            ],
            'tech': 'Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion',
        },
        {
            'title': 'Nexora Agency Website',
            'role': 'Frontend Developer | 2025',
            'details': [
                'Built a premium agency portfolio website with optimized performance',
                'Implemented single-file build for fast deployment',
            ],
            'tech': 'React 19, Vite, TypeScript, Tailwind CSS',
        },
    ]
    
    for proj in projects:
        # Project title
        pdf.set_font('Helvetica', 'B', 11)
        pdf.set_text_color(30, 58, 138)
        pdf.cell(0, 6, proj['title'], ln=True)
        
        # Role
        pdf.set_font('Helvetica', 'I', 9)
        pdf.set_text_color(107, 114, 128)
        pdf.cell(0, 5, proj['role'], ln=True)
        
        # Details
        pdf.set_font('Helvetica', '', 9)
        pdf.set_text_color(50, 50, 50)
        for detail in proj['details']:
            pdf.cell(5, 4.5, '', 0, 0)
            pdf.cell(3, 4.5, '-', 0, 0)
            pdf.cell(0, 4.5, ' ' + detail, ln=True)
        
        # Tech stack
        pdf.set_font('Helvetica', 'B', 9)
        pdf.set_text_color(37, 99, 235)
        pdf.cell(0, 5, 'Tech Stack: ' + proj['tech'], ln=True)
        pdf.ln(3)
    
    # --- SERVICES ---
    pdf.set_font('Helvetica', 'B', 13)
    pdf.set_text_color(30, 64, 175)
    pdf.cell(0, 8, 'SERVICES', ln=True)
    pdf.set_draw_color(219, 234, 254)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(3)
    
    pdf.set_font('Helvetica', '', 10)
    pdf.set_text_color(50, 50, 50)
    services = [
        'Cinema & Entertainment Booking Systems',
        'Learning Management Systems (LMS)',
        'Healthcare & Clinic Platforms',
        'Agency & Portfolio Websites',
        'Any web-based business',
    ]
    for s in services:
        pdf.cell(5, 5, '', 0, 0)
        pdf.cell(3, 5, '-', 0, 0)
        pdf.cell(0, 5, ' ' + s, ln=True)
    
    pdf.set_font('Helvetica', 'B', 10)
    pdf.set_text_color(37, 99, 235)
    pdf.ln(2)
    pdf.cell(0, 5, 'Starting from $1,500 | 15-min demo available on request', ln=True)
    pdf.ln(5)
    
    # --- EDUCATION ---
    pdf.set_font('Helvetica', 'B', 13)
    pdf.set_text_color(30, 64, 175)
    pdf.cell(0, 8, 'EDUCATION', ln=True)
    pdf.set_draw_color(219, 234, 254)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(3)
    
    pdf.set_font('Helvetica', 'B', 11)
    pdf.set_text_color(50, 50, 50)
    pdf.cell(0, 6, 'Galala University', ln=True)
    pdf.set_font('Helvetica', '', 10)
    pdf.cell(0, 5, 'Bachelor of Dental Medicine (BDS) - Currently Pursuing', ln=True)
    pdf.cell(0, 5, 'Suez, Egypt', ln=True)
    
    # Save
    pdf_path = r"D:\develop-monasati-learning-platform (1)\Hussein_Ali_CV.pdf"
    pdf.output(pdf_path)
    print(f"PDF created successfully: {pdf_path}")

if __name__ == '__main__':
    create_cv_pdf()
