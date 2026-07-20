import React from "react";
import { useNavigate } from "react-router-dom";
import {
    CalendarDays,
    Users,
    ShieldCheck,
    Video,
    MonitorUp,
    Code2,
    FileText,
    BarChart3,
    Mail,
    Sparkles,
    BrainCircuit,
    ArrowRight,
    Rocket,
} from "lucide-react";

function Release() {
    const navigate = useNavigate();

    const features = [
        {
            icon: CalendarDays,
            title: "Interview Management",
            description:
                "Schedule and manage technical interviews from one streamlined workspace.",
        },
        {
            icon: Users,
            title: "Candidate Management",
            description:
                "Manage candidates and their interview journey in one place.",
        },
        {
            icon: ShieldCheck,
            title: "Secure Interview Access",
            description:
                "Candidates join interviews through secure, dedicated interview links.",
        },
        {
            icon: Video,
            title: "Live Interviews",
            description:
                "Conduct browser-based interviews with camera and microphone support.",
        },
        {
            icon: MonitorUp,
            title: "Screen Sharing",
            description:
                "Share screens during interviews for technical discussions and evaluation.",
        },
        {
            icon: Code2,
            title: "Multi-Language Code Execution",
            description:
                "Candidates can write and execute code in multiple programming languages and view the output directly during interviews.",
        },
        {
            icon: FileText,
            title: "Resume Management",
            description:
                "Upload and access candidate resumes as part of the interview workflow.",
        },
        {
            icon: BarChart3,
            title: "Interview Results & Decisions",
            description:
                "Record interview decisions as Selected, Rejected, or Hold, with automated candidate notifications and the ability to update pending decisions later.",
        },
        {
            icon: Mail,
            title: "Automated Emails",
            description:
                "Keep candidates informed with automated interview communications.",
        },
    ];

    return (
        <div className="min-h-screen bg-background text-navy">

            {/* ================= BRAND NAV ================= */}
            <nav className="border-b border-primary/20 bg-white">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

                    <div
                        onClick={() => navigate("/")}
                        className="flex items-center gap-3 cursor-pointer select-none"
                    >
                        <img
                            src="/main_icon.png"
                            alt="MoonInterview Logo"
                            className="h-11 w-auto object-contain"
                        />

                        <span className="text-gold text-xl font-bold">
                            Moon<span className="text-primary">Interview</span>
                        </span>
                    </div>

                    <button
                        onClick={() => navigate("/")}
                        className="
              text-sm font-medium text-secondary
              hover:text-primary
              transition-colors
              cursor-pointer
            "
                    >
                        Back to MoonInterview
                    </button>

                </div>
            </nav>

            <main>

                {/* ================= HERO ================= */}
                <section className="relative overflow-hidden">

                    {/* Background decoration */}
                    <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute -left-20 bottom-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />

                    <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-white mb-7 shadow-sm">
                            <Rocket size={16} className="text-primary" />

                            <span className="text-sm font-semibold text-primary">
                                Our journey begins
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                            <span className="text-gold text-xl font-bold">
                                Moon<span className="text-primary">Interview</span>
                            </span>
                            <span className="block text-navy mt-2">
                                V0.1
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl font-medium text-primary mb-5">
                            Initial Public Release · August 1, 2026
                        </p>

                        <p className="max-w-3xl mx-auto text-secondary text-lg leading-8">
                            The first official chapter of MoonInterview, built to make
                            technical interviews more organized, collaborative, and
                            efficient for organizations and candidates.
                        </p>

                    </div>
                </section>

                {/* ================= RELEASE INFO ================= */}
                <section className="max-w-6xl mx-auto px-6 pb-24">

                    <div className="flex items-center gap-4 mb-10">

                        <div className="px-4 py-2 bg-primary text-white rounded-full font-semibold text-sm">
                            V0.1
                        </div>

                        <div className="h-px flex-1 bg-primary/20" />

                        <span className="text-sm text-secondary">
                            Current Release
                        </span>

                    </div>

                    <div className="mb-12">
                        <p className="text-gold font-semibold mb-2">
                            WHAT'S INSIDE
                        </p>

                        <h2 className="text-3xl md:text-4xl font-bold">
                            The foundation of <span className="text-gold">
                                Moon<span className="text-primary">Interview</span>
                            </span>
                        </h2>

                        <p className="text-secondary mt-4 max-w-2xl leading-7">
                            V0.1 brings together the essential tools needed to manage and
                            conduct technical interviews through a unified platform.
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

                        {features.map((feature, index) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={index}
                                    className="
                    group
                    bg-white
                    border border-primary/15
                    rounded-2xl
                    p-6
                    shadow-sm
                    hover:-translate-y-1
                    hover:shadow-lg
                    hover:border-primary/40
                    transition-all duration-300
                  "
                                >
                                    <div className="
                    w-11 h-11
                    rounded-xl
                    bg-primary/10
                    flex items-center justify-center
                    mb-5
                    group-hover:bg-primary
                    transition-colors
                  ">
                                        <Icon
                                            size={21}
                                            className="text-gold group-hover:text-white transition-colors"
                                        />
                                    </div>

                                    <h3 className="font-bold text-lg mb-2">
                                        {feature.title}
                                    </h3>

                                    <p className="text-secondary text-sm leading-6">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}

                    </div>
                </section>

                {/* ================= V1 ROADMAP ================= */}
                <section className="bg-navy text-white relative overflow-hidden">

                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />

                    <div className="relative max-w-6xl mx-auto px-6 py-24">

                        <div className="grid lg:grid-cols-2 gap-14 items-center">

                            {/* Left */}
                            <div>

                                <div className="inline-flex items-center gap-2 text-gold font-semibold mb-5">
                                    <Sparkles size={18} />
                                    THE ROAD AHEAD
                                </div>

                                <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                                    V0.1 is only
                                    <span className="text-primary block">
                                        the beginning.
                                    </span>
                                </h2>

                                <p className="text-gray-300 leading-8 text-lg max-w-xl">
                                    We're building toward a more intelligent interview
                                    experience. Future releases will expand MoonInterview with
                                    AI-powered capabilities, smarter workflows, and new
                                    experiences designed to transform how technical interviews
                                    are conducted.
                                </p>

                            </div>

                            {/* V1 Card */}
                            <div className="
                relative
                bg-white/5
                backdrop-blur
                border border-white/10
                rounded-3xl
                p-8
              ">

                                <div className="flex justify-between items-start mb-10">

                                    <div>
                                        <p className="text-gray-400 text-sm mb-2">
                                            FUTURE MILESTONE
                                        </p>

                                        <h3 className="text-4xl font-bold">
                                            V1.0
                                        </h3>
                                    </div>

                                    <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
                                        <BrainCircuit
                                            size={28}
                                            className="text-purple-400"
                                        />
                                    </div>

                                </div>

                                <div className="space-y-5">

                                    <div className="flex gap-4">
                                        <Sparkles
                                            className="text-gold shrink-0 mt-1"
                                            size={20}
                                        />

                                        <div>
                                            <h4 className="font-semibold mb-1">
                                                AI-Powered Capabilities
                                            </h4>

                                            <p className="text-gray-400 text-sm leading-6">
                                                Intelligent features designed to make technical
                                                interviewing smarter and more efficient.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/10" />

                                    <div className="flex gap-4">
                                        <Rocket
                                            className="text-purple-400 shrink-0 mt-1"
                                            size={20}
                                        />

                                        <div>
                                            <h4 className="font-semibold mb-1">
                                                And there's more...
                                            </h4>

                                            <p className="text-gray-400 text-sm leading-6">
                                                We're keeping a few things under wraps. New experiences
                                                and surprising features are being explored for the road
                                                to V1.0.
                                            </p>
                                        </div>
                                    </div>

                                </div>

                                <div className="mt-8 pt-6 border-t border-white/10">
                                    <span className="inline-flex items-center gap-2 text-gold text-sm font-medium">
                                        In development
                                        <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                                    </span>
                                </div>

                            </div>

                        </div>
                    </div>
                </section>

                {/* ================= FINAL SECTION ================= */}
                <section className="max-w-7xl mx-auto px-6 py-24 text-center">

                    <img
                        src="/main_logo.png"
                        alt="MoonInterview"
                        className="h-40 w-auto mx-auto mb-6 object-contain"
                    />

                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        We're just getting started.
                    </h2>

                    <p className="text-secondary max-w-2xl mx-auto leading-7 mb-8">
                        MoonInterview will continue evolving with every release.
                        Follow our journey as we build a better way to conduct
                        technical interviews.
                    </p>

                    <button
                        onClick={() => navigate("/login")}
                        className="
              inline-flex items-center gap-2
              bg-primary
              text-white
              px-6 py-3
              rounded-lg
              font-semibold
              hover:opacity-90
              transition-all
              cursor-pointer
            "
                    >
                        Explore MoonInterview
                        <ArrowRight size={18} />
                    </button>

                </section>

            </main>

        </div>
    );
}

export default Release;