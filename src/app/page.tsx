import { supabasePublic } from '@/lib/supabase';
import { 
    DEFAULT_PROJECTS, 
    DEFAULT_EXPERIENCE, 
    DEFAULT_SKILLS, 
    DEFAULT_CERTIFICATIONS 
} from '@/lib/constants';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Certifications from '@/components/Certifications';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import ConfettiCanvas from '@/components/ConfettiCanvas';
import TerminalShell from '@/components/TerminalShell';

// Enable ISR: Revalidate cached pages every 60 seconds in the background
export const revalidate = 60;

export default async function Home() {
    let projects = DEFAULT_PROJECTS;
    let experience = DEFAULT_EXPERIENCE;
    let skills = DEFAULT_SKILLS;
    let certifications = DEFAULT_CERTIFICATIONS;
    let resumeUrl = '#';
    let email = 'aryan.tech.work@gmail.com';
    let tagline = 'Designing robust, maximum-impact interfaces with solid backend system logic. Obsessed with extreme borders, drop-offset shadows, and pixel-perfect software engineering.';
    let availableForWork = true;
    let avatarUrl = '';

    // Fetch live entries from Supabase in parallel if configured
    if (supabasePublic) {
        try {
            const [projectsRes, experienceRes, skillsRes, certsRes, resumeRes, configRes] = await Promise.all([
                supabasePublic.from('projects').select('*').order('created_at', { ascending: false }),
                supabasePublic.from('experience').select('*').order('created_at', { ascending: false }),
                supabasePublic.from('skills').select('*').order('name', { ascending: true }),
                supabasePublic.from('certifications').select('*').order('created_at', { ascending: false }),
                supabasePublic.from('resume').select('*').order('uploaded_at', { ascending: false }).limit(1),
                supabasePublic.from('site_config').select('*')
            ]);

            // Map and load dynamic tables
            if (projectsRes.data && projectsRes.data.length > 0) {
                projects = projectsRes.data.map((p: any) => ({
                    ...p,
                    tech_stack: p.stack ? p.stack.join(', ') : (p.tech_stack || '')
                }));
            }
            if (experienceRes.data && experienceRes.data.length > 0) {
                experience = experienceRes.data;
            }
            if (skillsRes.data && skillsRes.data.length > 0) {
                skills = skillsRes.data;
            }
            if (certsRes.data && certsRes.data.length > 0) {
                certifications = certsRes.data.map((c: any) => ({
                    ...c,
                    url: c.credential_url || c.url || '',
                    badge_image_url: c.badge_image_url || c.badge_image || ''
                }));
            }
            if (resumeRes.data && resumeRes.data.length > 0) {
                resumeUrl = resumeRes.data[0].file_url;
            }
            if (configRes.data) {
                const configMap = new Map(configRes.data.map((item: any) => [item.key, item.value]));
                if (configMap.has('email')) {
                    email = configMap.get('email')!;
                }
                if (configMap.has('tagline')) {
                    tagline = configMap.get('tagline')!;
                }
                if (configMap.has('available_for_work')) {
                    availableForWork = configMap.get('available_for_work') === 'true';
                }
                if (configMap.has('avatar_url')) {
                    avatarUrl = configMap.get('avatar_url')!;
                }
            }
        } catch (err) {
            console.error("Warning: Failed to fetch Supabase data. Rendered default fallbacks instead.", err);
        }
    }

    return (
        <>
            <Navbar availableForWork={availableForWork} />
            <main>
                <Hero tagline={tagline} resumeUrl={resumeUrl} avatarUrl={avatarUrl} />
                <Marquee />
                <Projects projects={projects} />
                <Skills skills={skills} />
                <Experience experience={experience} />
                <Certifications certifications={certifications} />
                <Contact email={email} />
            </main>
            <Footer availableForWork={availableForWork} />
            
            {/* Custom overlays & helpers */}
            <CustomCursor />
            <ConfettiCanvas />
            <TerminalShell />
        </>
    );
}
