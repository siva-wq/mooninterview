import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Video,
  Monitor,
  Code2,
  FileText,
  Mail,
  ShieldCheck,
  CheckCircle,
  Building2,
  Users,
  Brain,
} from "lucide-react";

function Home() {
  const navigate=useNavigate();
  const features = [
    {
      icon: Video,
      title: "Live Video Interviews",
      description:
        "Conduct professional face-to-face interviews directly from the platform.",
    },
    {
      icon: Monitor,
      title: "Screen Monitoring",
      description:
        "View candidate screen sharing in real time during assessments.",
    },
    {
      icon: Code2,
      title: "Coding Assessment",
      description:
        "Built-in code editor supporting multiple programming languages.",
    },
    {
      icon: FileText,
      title: "Resume Review",
      description:
        "Access candidate resumes while conducting interviews.",
    },
    {
      icon: Mail,
      title: "Email Automation",
      description:
        "Automatically send interview invitations and results.",
    },
    {
      icon: Brain,
      title: "AI Question Generator",
      description:
        "Generate technical interview questions instantly using AI.",
    },
  ];

  const steps = [
    "Schedule Interview",
    "Candidate Receives Email",
    "Resume Upload",
    "Waiting Room Verification",
    "Live Interview",
    "Coding Assessment",
    "Result Submission",
  ];

  const faqs = [
    {
      q: "Do candidates need to install software?",
      a: "No. MoonInterview runs entirely in the browser.",
    },
    {
      q: "Can I monitor candidate screens?",
      a: "Yes. Screen sharing is supported during interviews.",
    },
    {
      q: "Can I conduct coding interviews?",
      a: "Yes. A real-time coding editor is included.",
    },
    {
      q: "Can I review resumes during interviews?",
      a: "Absolutely. Candidate resumes are available inside the interview room.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#0F172A]/90 backdrop-blur-md border-b border-[#334155]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/icon2.png"
              alt="MoonInterview"
              className="h-16 w-auto"
            />

            <h1 className="text-2xl font-bold">
              <span className="bg-gradient-to-br from-[#B8860B] via-[#D4A017] to-[#FFD76A] bg-clip-text text-transparent">
                Moon
              </span>
              <span className="text-[#7C3AED]">
                Interview
              </span>
            </h1>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#94A3B8]">
            <a href="#features" className="hover:text-[#7C3AED] transition-colors">Features</a>
            <a href="#workflow" className="hover:text-[#7C3AED] transition-colors">Workflow</a>
            <a href="#pricing" className="hover:text-[#7C3AED] transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-[#7C3AED] transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl border border-[#334155] hover:border-[#7C3AED] hover:bg-[#1E293B] transition-all"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-[0_0_25px_rgba(124,58,237,0.35)] transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FBBF24]/10 border border-[#FBBF24]/20 text-[#FBBF24] text-sm font-medium">
              AI-Powered Technical Interview Platform
            </span>

            <h1 className="mt-8 text-5xl lg:text-7xl font-bold leading-tight">
              Conduct Technical Interviews
              <span className="bg-gradient-to-br from-[#B8860B] via-[#D4A017] to-[#FFD76A] bg-clip-text text-transparent">
                {" "}Smarter
              </span>
            </h1>

            <p className="mt-6 text-lg text-[#94A3B8] max-w-xl">
              Schedule interviews, review resumes,
              monitor screen sharing, conduct live
              coding assessments and evaluate
              candidates from one centralized platform.
            </p>

            <div className="flex gap-4 mt-8">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-[0_0_25px_rgba(124,58,237,0.35)] transition-all"
              >
                Start Free Trial
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/login"
                className="px-6 py-3 rounded-xl border border-[#334155] hover:border-[#7C3AED] hover:bg-[#1E293B] transition-all"
              >
                Login
              </Link>
            </div>
          </div>

          <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-6 shadow-xl">
            <img
              src="/logo2.png"
              alt="Dashboard"
              className="rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* ORGANIZATIONS */}
      <section className="border-y border-[#334155] bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-center text-2xl font-bold mb-10 text-[#F8FAFC]">
            Built For
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] text-center hover:border-[#7C3AED] hover:bg-[#334155] transition-all group">
              <Building2 className="mx-auto mb-3 text-[#FBBF24]" />
              <p className="text-[#F8FAFC] font-medium">Colleges</p>
            </div>

            <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] text-center hover:border-[#7C3AED] hover:bg-[#334155] transition-all group">
              <Users className="mx-auto mb-3 text-[#FBBF24]" />
              <p className="text-[#F8FAFC] font-medium">Recruiters</p>
            </div>

            <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] text-center hover:border-[#7C3AED] hover:bg-[#334155] transition-all group">
              <ShieldCheck className="mx-auto mb-3 text-[#FBBF24]" />
              <p className="text-[#F8FAFC] font-medium">Organizations</p>
            </div>

            <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] text-center hover:border-[#7C3AED] hover:bg-[#334155] transition-all group">
              <Brain className="mx-auto mb-3 text-[#FBBF24]" />
              <p className="text-[#F8FAFC] font-medium">Training Institutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section
        id="workflow"
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <h2 className="text-4xl font-bold text-center mb-16 text-[#FBBF24] drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
          Interview Workflow
        </h2>

        <div className="grid md:grid-cols-7 gap-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5 text-center shadow-sm hover:border-[#7C3AED] hover:bg-[#334155] transition-all"
            >
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#B8860B] via-[#D4A017] to-[#FFD76A] text-white flex items-center justify-center font-bold">
                {index + 1}
              </div>

              <p className="font-medium text-[#F8FAFC]">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-y border-[#334155] bg-[#0F172A] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#FBBF24] drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
            Everything Needed For Technical Interviews
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map(
              (
                feature,
                index
              ) => {
                const Icon =
                  feature.icon;

                return (
                  <div
                    key={index}
                    className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-[#7C3AED] hover:bg-[#334155] transition-all group"
                  >
                    <Icon
                      size={32}
                      className="text-[#FBBF24] mb-4 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                    />

                    <h3 className="text-xl font-semibold mb-3 text-[#F8FAFC]">
                      {
                        feature.title
                      }
                    </h3>

                    <p className="text-[#94A3B8]">
                      {
                        feature.description
                      }
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        className="max-w-5xl mx-auto px-6 py-24"
      >
        <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-10 text-center shadow-xl hover:border-[#7C3AED] hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] transition-all duration-300">
          <h2 className="text-4xl font-bold mb-4 text-[#F8FAFC]">
            Professional Plan
          </h2>

          <p className="text-6xl font-bold">
            <span className="bg-gradient-to-br from-[#B8860B] via-[#D4A017] to-[#FFD76A] bg-clip-text text-transparent">
              ₹599
            </span>
            <span className="text-xl">
              /month
            </span>
          </p>

          <p className="mt-2 text-[#94A3B8]">
            Per Organization
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-10 text-left text-[#FBBF24] max-w-3xl mx-auto">
            {[
              "Unlimited Interviews",
              "Unlimited Candidates",
              "Live Video Interviews",
              "Screen Sharing",
              "Coding Assessment",
              "Resume Management",
              "Email Automation",
              "AI Question Generation",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2"
              >
                <CheckCircle size={18} />
                {item}
              </div>
            ))}
          </div>

          <button className="mt-10 px-8 py-4 rounded-xl bg-[#7C3AED] text-white font-semibold hover:bg-[#6D28D9] transition-all" onClick={() => navigate("/register")}>
            Start Free Trial for 10 days
          </button>
          <p className="mt-2 text-[#94A3B8]">For payment mail us to get the payment link at <a href="mailto:contact@mooninterview.com" className="hover:text-[#7C3AED] transition-colors">contact@mooninterview.com</a></p>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="bg-[#0F172A] py-24"
      >
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#FBBF24] drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
            Frequently Asked Questions
          </h2>

          <div className="space-y-5">
            {faqs.map(
              (
                faq,
                index
              ) => (
                <div
                  key={index}
                  className="bg-[#1E293B] border border-[#334155] rounded-2xl p-6 hover:border-[#7C3AED] hover:bg-[#334155] transition-all"
                >
                  <h3 className="font-semibold text-lg text-[#F8FAFC]">
                    {faq.q}
                  </h3>

                  <p className="mt-2 text-[#94A3B8]">
                    {faq.a}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl font-bold text-[#F8FAFC]">
            Ready To Transform Your Interview Process?
          </h2>

          <p className="mt-4 text-lg text-[#94A3B8]">
            Start conducting professional
            technical interviews with MoonInterview.
          </p>

          <Link
            to="/register"
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-xl bg-[#7C3AED] text-white hover:bg-[#6D28D9] shadow-[0_0_25px_rgba(124,58,237,0.35)] transition-all"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#334155] bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">
          <img
            src="/icon2.png"
            alt="MoonInterview"
            className="h-16 mx-auto"
          />

          <p className="text-[#94A3B8] mt-2">
            Smart Intervers. Better Hiring.
          </p>

          <p className="text-[#64748B] mt-4">
            © 2026 MoonInterview. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
