import { Card } from "@/components/ui/Card";
import { JoinForm } from "@/components/ui/JoinForm";
import ctfData from "@/data/ctf-data.json";
import { Trophy, MapPin, Users, Linkedin, ExternalLink, Target, Shield, Zap, Award, Star, TrendingUp, Calendar, Flag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Interactive Components
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { Typewriter } from "@/components/ui/Typewriter";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { HackerTerminal } from "@/components/ui/HackerTerminal";
import { SkillBadges } from "@/components/ui/SkillBadges";
import { KonamiEasterEgg } from "@/components/ui/KonamiEasterEgg";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { CursorGlow } from "@/components/ui/CursorGlow";

export default function Home() {
  // Calculate stats
  const totalPoints = ctfData.reduce((sum, ctf) => sum + ctf.points, 0);
  const bestRank = Math.min(...ctfData.map(ctf => ctf.place));
  const topFinishes = ctfData.filter(ctf => ctf.place <= 100).length;

  return (
    <div className="container mx-auto px-4 space-y-32 pb-24">
      {/* Cursor Glow Effect */}
      <CursorGlow />

      {/* Interactive Background */}
      <ParticleBackground />

      {/* Easter Egg */}
      <KonamiEasterEgg />

      {/* Hacker Terminal Widget */}
      <HackerTerminal />

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-size-[50px_50px]" />

        {/* Team Logo */}
        <div className="animate-float mb-10 relative group">
          <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-purple-500 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity scale-110" />
          <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white/20 shadow-[0_0_60px_rgba(6,182,212,0.4)]">
            <Image
              src="/team_logo.jpg"
              alt="Utopians Team Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        <h1 className="text-7xl md:text-9xl font-black bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 mb-4 tracking-tighter animate-tilt">
          UTOPIANS
        </h1>
        <div className="text-xl md:text-2xl text-muted-foreground font-light tracking-widest mb-2 uppercase h-8">
          <Typewriter
            texts={["Capture The Flag Team", "Security Researchers", "Bug Hunters", "Ethical Hackers", "Problem Solvers"]}
            speed={80}
            deleteSpeed={40}
            pauseTime={2500}
          />
        </div>
        <p className="text-lg text-cyan-500/80 mb-8 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          University of Calcutta, India
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link href="#join" className="group px-8 py-4 rounded-full bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] transition-all duration-300 flex items-center gap-2">
            <Zap className="w-5 h-5 group-hover:animate-pulse" />
            Join The Team
          </Link>
          <Link href="#ctfs" className="px-8 py-4 rounded-full border-2 border-cyan-500/40 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all duration-300 font-semibold flex items-center gap-2">
            <Flag className="w-5 h-5" />
            View CTFs
          </Link>
          <Link href="https://ctftime.org/team/408313" target="_blank" className="px-8 py-4 rounded-full border-2 border-purple-500/40 hover:border-purple-500 hover:bg-purple-500/10 transition-all duration-300 font-semibold flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            CTFtime Profile
          </Link>
        </div>

        {/* Quick Stats Banner */}
        <div className="glass-card rounded-2xl p-6 flex flex-wrap justify-center gap-8 md:gap-12">
          <div className="text-center">
            <AnimatedCounter end={ctfData.length} className="text-3xl md:text-4xl font-black text-cyan-400" />
            <p className="text-sm text-muted-foreground uppercase tracking-wider">CTFs Played</p>
          </div>
          <div className="text-center">
            <span className="text-3xl md:text-4xl font-black text-yellow-400">#</span>
            <AnimatedCounter end={bestRank} className="text-3xl md:text-4xl font-black text-yellow-400" />
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Best Rank</p>
          </div>
          <div className="text-center">
            <AnimatedCounter end={totalPoints} decimals={2} className="text-3xl md:text-4xl font-black text-purple-400" />
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Total Points</p>
          </div>
          <div className="text-center">
            <AnimatedCounter end={topFinishes} className="text-3xl md:text-4xl font-black text-green-400" />
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Top 100 Finishes</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold">
          Who We <span className="text-cyan-500">Are</span>
        </h2>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Utopians is a group of <span className="text-cyan-400 font-semibold">cybersecurity enthusiasts</span> and tech-savvy individuals who love solving complex problems and learning from each other. We&apos;re passionate about <span className="text-purple-400 font-semibold">Capture The Flag (CTF)</span> challenges and exploring the world of cybersecurity.
        </p>

        {/* Interactive Skill Badges */}
        <div className="pt-4">
          <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">Our Expertise (Click to explore)</p>
          <SkillBadges />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform">
            <Shield className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Security Research</h3>
            <p className="text-sm text-muted-foreground">Exploring vulnerabilities and defense mechanisms</p>
          </div>
          <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform">
            <Target className="w-12 h-12 text-purple-500 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">CTF Competitions</h3>
            <p className="text-sm text-muted-foreground">Competing in global hacking challenges</p>
          </div>
          <div className="glass-card p-6 rounded-2xl hover:scale-105 transition-transform">
            <Users className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Knowledge Sharing</h3>
            <p className="text-sm text-muted-foreground">Learning and growing together as a team</p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="space-y-12">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Meet The <span className="text-cyan-500">Team</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The brilliant minds behind the flags. Passionate hackers, dedicated learners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Pratham */}
          <Card className="group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-cyan-500/20 to-transparent rounded-bl-full" />
            <div className="flex items-center gap-6 relative">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-cyan-400 to-blue-600 rounded-full blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
                <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-3xl font-bold text-white shrink-0 shadow-lg">
                  P
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold">Pratham</h3>
                <p className="text-cyan-500 mb-1">@uniquepratham</p>
                <p className="text-sm text-muted-foreground mb-3">Full Stack Developer & CTF Player</p>
                <div className="flex flex-wrap gap-2">
                  <Link href="https://www.linkedin.com/in/uniquepratham/" target="_blank" className="inline-flex items-center gap-2 text-sm bg-cyan-500/10 hover:bg-cyan-500/20 px-4 py-2 rounded-full transition-colors">
                    <Linkedin className="w-4 h-4 text-cyan-500" /> Connect
                  </Link>
                  <Link href="https://uniquepratham-portfolio.web.app/" target="_blank" className="inline-flex items-center gap-2 text-sm bg-cyan-500/10 hover:bg-cyan-500/20 px-4 py-2 rounded-full transition-colors">
                    <ExternalLink className="w-4 h-4 text-cyan-500" /> Portfolio
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          {/* Shaswata */}
          <Card className="group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-purple-500/20 to-transparent rounded-bl-full" />
            <div className="flex items-center gap-6 relative">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-purple-400 to-pink-600 rounded-full blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
                <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-purple-400 to-pink-600 flex items-center justify-center text-3xl font-bold text-white shrink-0 shadow-lg">
                  S
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold">Shaswata Saha</h3>
                <p className="text-purple-500 mb-1">@subhro1530</p>
                <p className="text-sm text-muted-foreground mb-3">Advanced App Engineering Analyst</p>
                <div className="flex flex-wrap gap-2">
                  <Link href="https://www.linkedin.com/in/shaswata-saha-74b209251/" target="_blank" className="inline-flex items-center gap-2 text-sm bg-purple-500/10 hover:bg-purple-500/20 px-4 py-2 rounded-full transition-colors">
                    <Linkedin className="w-4 h-4 text-purple-500" /> Connect
                  </Link>
                  <Link href="https://ssaha.vercel.app/" target="_blank" className="inline-flex items-center gap-2 text-sm bg-purple-500/10 hover:bg-purple-500/20 px-4 py-2 rounded-full transition-colors">
                    <ExternalLink className="w-4 h-4 text-purple-500" /> Portfolio
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTFs Section */}
      <section id="ctfs" className="space-y-12">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-cyan-500">Achievements</span>
          </h2>
          <p className="text-muted-foreground text-lg">Conquering CTF challenges across the globe in 2025.</p>
        </div>

        {/* Highlighted achievements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 rounded-2xl border-l-4 border-yellow-500 hover:scale-[1.02] transition-transform">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-8 h-8 text-yellow-500" />
              <span className="text-sm uppercase tracking-wider text-muted-foreground">Best Placement</span>
            </div>
            <p className="text-4xl font-black text-yellow-400">#{bestRank}</p>
            <p className="text-sm text-muted-foreground mt-1">Pointer Overflow CTF</p>
          </div>
          <div className="glass-card p-6 rounded-2xl border-l-4 border-cyan-500 hover:scale-[1.02] transition-transform">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-8 h-8 text-cyan-500" />
              <span className="text-sm uppercase tracking-wider text-muted-foreground">Highest Score</span>
            </div>
            <p className="text-4xl font-black text-cyan-400">{Math.max(...ctfData.map(c => c.points)).toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">saarCTF 2025</p>
          </div>
          <div className="glass-card p-6 rounded-2xl border-l-4 border-purple-500 hover:scale-[1.02] transition-transform">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-8 h-8 text-purple-500" />
              <span className="text-sm uppercase tracking-wider text-muted-foreground">Active Since</span>
            </div>
            <p className="text-4xl font-black text-purple-400">2025</p>
            <p className="text-sm text-muted-foreground mt-1">And going strong!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {ctfData
            .sort((a, b) => a.place - b.place)
            .map((ctf, index) => {
              // Generate unique gradient colors based on CTF name
              const gradients = [
                'from-cyan-500 to-blue-600',
                'from-purple-500 to-pink-600',
                'from-green-500 to-emerald-600',
                'from-orange-500 to-red-600',
                'from-yellow-500 to-amber-600',
                'from-indigo-500 to-violet-600',
                'from-rose-500 to-pink-600',
                'from-teal-500 to-cyan-600',
              ];
              const gradient = gradients[index % gradients.length];
              const initials = ctf.event.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

              return (
                <Card key={index} className="group relative overflow-hidden hover:scale-[1.03] transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                  {/* Decorative corner gradient */}
                  <div className={`absolute -top-12 -right-12 w-32 h-32 bg-linear-to-br ${gradient} rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity`} />

                  {/* Rank badge */}
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${ctf.place <= 50 ? 'bg-linear-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 ring-1 ring-yellow-500/30' :
                    ctf.place <= 100 ? 'bg-linear-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 ring-1 ring-cyan-500/30' :
                      ctf.place <= 200 ? 'bg-linear-to-r from-purple-500/20 to-pink-500/20 text-purple-400 ring-1 ring-purple-500/30' :
                        'bg-gray-500/10 text-gray-400 ring-1 ring-gray-500/20'
                    }`}>
                    {ctf.place <= 50 && <Star className="w-3 h-3" />}
                    #{ctf.place}
                  </div>

                  <div className="flex items-start gap-4">
                    {/* CTF Logo */}
                    <div className="relative shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-white/5 shadow-lg group-hover:scale-110 transition-transform ring-1 ring-white/10">
                      {ctf.logo ? (
                        <Image
                          src={`/ctf-logos/${ctf.logo}`}
                          alt={`${ctf.event} logo`}
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className={`w-full h-full bg-linear-to-br ${gradient} flex items-center justify-center`}>
                          <span className="text-white font-bold text-sm">{initials}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 pr-8">
                      <h3 className="font-bold text-sm mb-1 line-clamp-2 group-hover:text-cyan-400 transition-colors leading-tight">{ctf.event}</h3>
                      <p className="text-xs text-muted-foreground">2025 Season</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
                    <div className="flex items-center gap-2">
                      <Trophy className={`w-4 h-4 ${ctf.place <= 50 ? 'text-yellow-500' :
                        ctf.place <= 100 ? 'text-cyan-500' :
                          'text-muted-foreground'
                        }`} />
                      <span className="text-lg font-bold">{ctf.points.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">pts</span>
                    </div>
                    {ctf.place <= 100 && (
                      <div className={`text-xs px-2 py-1 rounded-full ${ctf.place <= 50 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-cyan-500/10 text-cyan-400'
                        }`}>
                        Top {ctf.place <= 50 ? '50' : '100'}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
        </div>
      </section>

      {/* Join Section */}
      <section id="join" className="relative">
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-cyan-500/5 via-purple-500/5 to-transparent rounded-3xl" />
        <div className="max-w-2xl mx-auto text-center space-y-8 py-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-500 text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            We&apos;re recruiting!
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to <span className="text-cyan-500">Hack</span> With Us?
          </h2>
          <p className="text-muted-foreground text-lg">
            Join the Utopians and become part of an amazing cybersecurity community. Whether you&apos;re a beginner or an experienced player, there&apos;s a place for you here.
          </p>
          <JoinForm />
        </div>
      </section>

    </div>
  );
}
