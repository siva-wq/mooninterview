import React, { useState } from "react";
import Demo from './Demo';
import Pricing from "./Pricing";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  GraduationCap,
  Menu,
  X,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


function Home() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const openPricing = (plan) => {
    setSelectedPlan(plan);
    setShowPricing(true);
  };

  const motionVariants = {
    fadeUp: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    },
    fadeLeft: {
      hidden: { opacity: 0, x: -30 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
    },
    fadeRight: {
      hidden: { opacity: 0, x: 30 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
    },
    staggerContainer: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2
        }
      }
    }
  };

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
    <>
      <Helmet>
        <title>
          MoonInterview - Virtual Interview Platform for Organizations
        </title>

        <meta
          name="description"
          content="MoonInterview is a virtual interview platform for organizations. Schedule interviews, review resumes, conduct live interviews, enable coding assessments when needed, and streamline your hiring process."
        />

        <meta
          name="keywords"
          content="MoonInterview,
Virtual Interview Platform,
Online Interview Platform,
Interview Management Software,
Recruitment Platform,
Hiring Platform,
Coding Interview Platform,
Resume Review,
Live Interview Platform"
        />

        <meta property="og:title" content="MoonInterview" />

        <meta
          property="og:description"
          content="Virtual interview platform for organizations."
        />

        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://mooninterview-yukx.vercel.app/main_logo.png"
        />
        <meta
          property="og:url"
          content="https://mooninterview-yukx.vercel.app/"
        />
        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="MoonInterview - Virtual Interview Platform"
        />

        <meta
          name="twitter:description"
          content="Virtual interview platform for organizations."
        />

        <link rel="canonical" href="https://mooninterview-yukx.vercel.app/" />
      </Helmet>
      <div className="min-h-screen bg-background text-navy">
        {/* NAVBAR */}
        <nav className="sticky top-0 z-50 bg-navy/90 backdrop-blur-md border-b border-custom">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/main_icon.png"
                alt="MoonInterview"
                className="h-12 sm:h-16 w-auto"
              />

              <h1 className="text-xl sm:text-2xl font-bold">
                <span className="text-gold">
                  Moon
                </span>
                <span className="text-primary">
                  Interview
                </span>
              </h1>
            </div>

            <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-secondary">
              <a href="#features" className="hover:text-primary transition-colors duration-200 relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </a>
              <a href="#workflow" className="hover:text-primary transition-colors duration-200 relative group">
                Workflow
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </a>
              <a href="#pricing" className="hover:text-primary transition-colors duration-200 relative group">
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </a>
              <a href="#faq" className="hover:text-primary transition-colors duration-200 relative group">
                FAQ
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </a>
              <button
                onClick={() => navigate("/release")}
                className="hover:text-primary transition-colors duration-200 relative group cursor-pointer select-none"
              >
                Release Notes

                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-3">

              <Link
                to="/login"
                className="px-5 py-2.5 rounded-xl border border-custom btn-primary hover:border-gold hover:scale-102 transition-all duration-200 hover:scale-102"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="btn-primary hover:scale-102"
              >
                Get Started
              </Link>
            </div>

            <button
              className="lg:hidden p-2 text-secondary hover:text-primary transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial={false}
            animate={{
              height: isMobileMenuOpen ? "auto" : 0,
              opacity: isMobileMenuOpen ? 1 : 0,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="lg:hidden overflow-hidden bg-navy/95 backdrop-blur-md border-b border-custom"
          >
            <div className="px-6 py-4 space-y-4">
              <a
                href="#features"
                className="block text-secondary hover:text-primary transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#workflow"
                className="block text-secondary hover:text-primary transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Workflow
              </a>
              <a
                href="#pricing"
                className="block text-secondary hover:text-primary transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#faq"
                className="block text-secondary hover:text-primary transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </a>
              <button
                onClick={() => navigate("/release")}
                className="hover:text-primary transition-colors duration-200 relative group cursor-pointer select-none"
              >
                Release Notes

                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
              </button>
              <div className="pt-4 space-y-3">
                <Link
                  to="/login"
                  className="block w-full px-5 py-2.5 rounded-xl border border-custom hover:border-primary hover:bg-[#1E293B] hover:text-white transition-all duration-200 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary block w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        </nav>

        {/* HERO */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center bg-background">
            <div className="text-center lg:text-left">
              <motion.span
                initial="hidden"
                animate="visible"
                variants={motionVariants.fadeUp}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gold/10 border border-navy text-gold text-xs sm:text-sm font-medium"
              >
                Smart Interviews. Better Hiring
              </motion.span>

              <motion.h1
                initial="hidden"
                animate="visible"
                variants={motionVariants.fadeUp}
                transition={{ delay: 0.1 }}
                className="mt-6 sm:mt-8 text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight"
              >
                Conduct Interviews
                <span className="text-gold">
                  {" "}Smarter
                </span>
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                variants={motionVariants.fadeUp}
                transition={{ delay: 0.2 }}
                className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-secondary max-w-xl mx-auto lg:mx-0"
              >
                Schedule interviews, review resumes, monitor screen sharing, conduct live coding assessments when needed, and evaluate candidates, all from one centralized platform.
              </motion.p>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={motionVariants.staggerContainer}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 justify-center lg:justify-start"
              >
                <motion.div variants={motionVariants.fadeUp}>
                  <button
                    className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-custom btn-primary hover:border-gold hover:scale-102 transition-all duration-200 text-sm sm:text-base"
                    onClick={() => setShowDemo(true)}
                  >
                    Book a Demo
                  </button>

                  {showDemo && (
                    <Demo onClose={() => setShowDemo(false)} />
                  )}
                </motion.div>

                <motion.div variants={motionVariants.fadeUp}>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl border border-custom hover:border-primary hover:bg-[#1E293B] hover:text-white transition-all duration-200 text-sm sm:text-base"
                  >
                    Login
                  </Link>
                </motion.div>
              </motion.div>
            </div>


            <motion.div
              initial="hidden"
              animate="visible"
              variants={motionVariants.fadeRight}
              transition={{ delay: 0.4 }}
              className="hidden md:block bg-background border border-custom rounded-2xl sm:rounded-3xl p-1 shadow-xl"
            >
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                loop
                className="rounded-2xl h-[180px] sm:h-[250px] md:h-[350px] lg:h-[450px]"
                breakpoints={{
                  320: {
                    slidesPerView: 1,
                    spaceBetween: 5,
                  },
                  640: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                  },
                  768: {
                    slidesPerView: 1,
                    spaceBetween: 15,
                  },
                  1024: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                  },
                }}
              >
                <SwiperSlide>
                  <img
                    src="/platform/full_admin.png"
                    alt="Dashboard"
                    className="block w-full h-full object-cover rounded-2xl"
                  />
                </SwiperSlide>

                <SwiperSlide>
                  <img
                    src="/platform/schedule_interview.png"
                    alt="Schedule Interview"
                    className="block w-full h-full object-cover rounded-2xl"
                  />
                </SwiperSlide>

                <SwiperSlide>
                  <img
                    src="/platform/candidate_waiting.PNG"
                    alt="Waiting Room"
                    className="block w-full h-full object-cover rounded-2xl"
                  />
                </SwiperSlide>

                <SwiperSlide>
                  <img
                    src="/platform/interviews.png"
                    alt="interviews"
                    className="block w-full h-full object-contain rounded-2xl"
                  />
                </SwiperSlide>

                <SwiperSlide>
                  <img
                    src="/platform/reports.png"
                    alt="Reports"
                    className="block w-full h-full object-contain rounded-2xl"
                  />
                </SwiperSlide>
              </Swiper>
            </motion.div>
          </div>
        </section>

        {/* ORGANIZATIONS */}
        <section className="border-y border-custom bg-background text-navy">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={motionVariants.fadeUp}
              className="text-center text-xl sm:text-2xl font-bold mb-8 sm:mb-10"
            >
              Built For
            </motion.h2>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={motionVariants.staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
            >
              <motion.div
                variants={motionVariants.fadeUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="bg-background rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-card text-center hover:border-primary hover:shadow-lg transition-all duration-200 group"
              >
                <Building2 className="mx-auto mb-2 sm:mb-3 text-gold" size={20} />
                <p className="text-navy font-medium text-sm sm:text-base">
                  Colleges
                </p>
              </motion.div>

              <motion.div
                variants={motionVariants.fadeUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="bg-background rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-card text-center hover:border-primary hover:shadow-lg transition-all duration-200 group"
              >
                <Users className="mx-auto mb-2 sm:mb-3 text-gold" size={20} />
                <p className="text-navy font-medium text-sm sm:text-base">
                  Recruiters
                </p>
              </motion.div>

              <motion.div
                variants={motionVariants.fadeUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="bg-background rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-card text-center hover:border-primary hover:shadow-lg transition-all duration-200 group"
              >
                <ShieldCheck className="mx-auto mb-2 sm:mb-3 text-gold" size={20} />
                <p className="text-navy font-medium text-sm sm:text-base">
                  Organizations
                </p>
              </motion.div>

              <motion.div
                variants={motionVariants.fadeUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="bg-background rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-card text-center hover:border-primary hover:shadow-lg transition-all duration-200 group"
              >
                <GraduationCap className="mx-auto mb-2 sm:mb-3 text-gold" size={20} />
                <p className="text-navy font-medium text-sm sm:text-base">
                  Training Institutes
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* WORKFLOW */}
        <section
          id="workflow"
          className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24"
        >
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={motionVariants.fadeUp}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-12 sm:mb-16 text-navy drop-shadow-[0_0_10px_rgba(212,160,23,0.3)]"
          >
            Interview Workflow
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={motionVariants.staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 md:gap-4"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={motionVariants.fadeUp}
                className="bg-[#1E293B] border border-custom rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-5 text-center shadow-sm hover:border-primary hover:bg-[#334155] transition-all duration-200"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 rounded-full bg-gold text-white flex items-center justify-center font-bold text-sm sm:text-base">
                  {index + 1}
                </div>

                <p className="font-medium text-white text-xs sm:text-sm">
                  {step}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* FEATURES */}
        <section id="features" className="border-y border-custom bg-background py-16 sm:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={motionVariants.fadeUp}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-12 sm:mb-16 text-navy drop-shadow-[0_0_10px_rgba(212,160,23,0.3)]"
            >
              Everything Needed for Smarter Interviews
            </motion.h2>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={motionVariants.staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
            >
              {features.map(
                (
                  feature,
                  index
                ) => {
                  const Icon =
                    feature.icon;

                  return (
                    <motion.div
                      key={index}
                      variants={motionVariants.fadeUp}
                      whileHover={{ y: -6, transition: { duration: 0.18, ease: "easeOut" } }}
                      className="bg-background border border-card rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-lg hover:border-primary hover:bg-secondary transition-all duration-200 group"
                    >
                      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.18, ease: "easeOut" }}>
                        <Icon
                          size={28}
                          className="text-gold mb-3 sm:mb-4 drop-shadow-[0_0_10px_rgba(212,160,23,0.3)]"
                        />
                      </motion.div>

                      <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-navy">
                        {
                          feature.title
                        }
                      </h3>

                      <p className="text-secondary text-sm sm:text-base leading-relaxed">
                        {
                          feature.description
                        }
                      </p>
                    </motion.div>
                  );
                }
              )}
            </motion.div>
          </div>
        </section>

        {/* PRICING */}
        <section
          id="pricing"
          className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24"
        >
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={motionVariants.fadeUp}
            className="text-4xl font-bold text-center mb-16 text-navy drop-shadow-[0_0_10px_rgba(212,160,23,0.3)]"
          >
            Choose Your Plan
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/*free plan */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={motionVariants.fadeUp}
              className="bg-[#1E293B] border border-custom rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 text-center shadow-xl hover:border-primary hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] transition-all duration-200"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
                One-Time Trial
              </h2>

              <p className="text-5xl sm:text-6xl font-bold">
                <span className="text-gold">
                  ₹0
                </span>
                <span className="text-xl text-white">
                  /10 days
                </span>
              </p>

              <p className="mt-2 text-secondary">
                Available once per organization.
              </p>

              <div className="grid grid-cols-1 gap-3 mt-6 sm:mt-8 text-left text-white">
                {[
                  "Full Platform Access",
                  "Unlimited Interviews",
                  "Unlimited Candidates",
                  "Valid for 10 Days",
                  "No Credit Card Required",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="text-gold" size={18} />
                    {item}
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="btn-primary mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 font-semibold"
                onClick={() => openPricing("One-Time Trial")}
              >
                Start Free Trial
              </motion.button>
            </motion.div>
            {/* Daily Plan */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={motionVariants.fadeUp}
              className="bg-[#1E293B] border border-custom rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 text-center shadow-xl hover:border-primary hover:shadow-[0_0_30px_rgba(124,58,237,0.2)] transition-all duration-200"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
                Daily Plan
              </h2>

              <p className="text-5xl sm:text-6xl font-bold">
                <span className="text-gold">
                  ₹99
                </span>
                <span className="text-xl text-white">
                  /1 Day
                </span>
              </p>

              <p className="mt-2 text-secondary">
                Per Organization
              </p>

              <div className="grid grid-cols-1 gap-3 mt-6 sm:mt-8 text-left text-white">
                {[
                  "Full Platform Access",
                  "Unlimited Interviews",
                  "Unlimited Candidates",
                  "Valid for 24 Hours",
                  "Instant Activation"
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="text-gold" size={18} />
                    {item}
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="btn-primary mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 font-semibold"
                onClick={() => openPricing("Daily Plan")}
              >
                Get Daily Access
              </motion.button>
            </motion.div>

            {/* Monthly Plan */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={motionVariants.fadeUp}
              transition={{ delay: 0.1 }}
              className="bg-[#1E293B] border-2 border-gold rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 text-center shadow-xl hover:shadow-[0_0_30px_rgba(212,160,23,0.3)] transition-all duration-200 relative"
            >
              <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2 bg-gold text-white px-3 sm:px-4 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                Popular
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
                Professional Plan
              </h2>

              <p className="text-5xl sm:text-6xl font-bold">
                <span className="text-gold">
                  ₹599
                </span>
                <span className="text-xl text-white">
                  /30 Days
                </span>
              </p>

              <p className="mt-2 text-secondary">
                Per Organization
              </p>

              <div className="grid grid-cols-1 gap-3 mt-6 sm:mt-8 text-left text-white">
                {[
                  "Full Platform Access",
                  "Unlimited Interviews",
                  "Unlimited Candidates",
                  "Priority Support",
                  "Valid for 30 Days"
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="text-gold" size={18} />
                    {item}
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="btn-primary mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 font-semibold"
                onClick={() => openPricing("Professional Plan")}
              >
                Choose Professional
              </motion.button>
            </motion.div>
          </div>

          <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm md:text-base text-secondary">For payment mail us to get the payment link at <a href="mailto:moonintelligence2005@gmail.com" className="hover:text-primary transition-colors duration-200">moonintelligence2005@gmail.com</a></p>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="bg-background py-16 sm:py-20 lg:py-24"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={motionVariants.fadeUp}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 text-navy drop-shadow-[0_0_10px_rgba(212,160,23,0.3)]"
            >
              Frequently Asked Questions
            </motion.h2>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={motionVariants.staggerContainer}
              className="space-y-3 sm:space-y-4 md:space-y-5"
            >
              {faqs.map(
                (
                  faq,
                  index
                ) => (
                  <motion.div
                    key={index}
                    variants={motionVariants.fadeUp}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="bg-background border border-card rounded-2xl p-4 sm:p-5 md:p-6 hover:border-primary hover:bg-background transition-all duration-200"
                  >
                    <h3 className="font-semibold text-base sm:text-lg text-navy">
                      {faq.q}
                    </h3>

                    <p className="mt-1.5 sm:mt-2 text-secondary text-sm sm:text-base">
                      {faq.a}
                    </p>
                  </motion.div>
                )
              )}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 lg:py-24 border-navy">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={motionVariants.fadeUp}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-navy">
                Ready To Transform Your Interview Process?
              </h2>

              <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-secondary">
                Start conducting professional interviews with MoonInterview.
              </p>

              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <Link
                  to="/register"
                  className="btn-primary inline-flex items-center gap-2 mt-4 sm:mt-6 md:mt-8 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base"
                >
                  Get Started
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-custom bg-background">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={motionVariants.fadeUp}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10">

              {/* BRAND */}
              <div className="text-center md:text-left">
                <img
                  src="/main_logo.png"
                  alt="MoonInterview"
                  className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 mx-auto md:mx-0"
                />


                <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-secondary">
                  interview platform for organizations,
                  recruiters, colleges, and training institutes.
                </p>
              </div>

              {/* QUICK LINKS */}
              <div className="text-center">
                <h4 className="text-lg font-semibold text-navy mb-4">
                  Quick Links
                </h4>

                <div className="flex flex-col gap-2 sm:gap-3 text-secondary text-sm sm:text-base">
                  <a href="#features" className="hover:text-primary transition">
                    Features
                  </a>

                  <a href="#workflow" className="hover:text-primary transition">
                    Workflow
                  </a>

                  <a href="#pricing" className="hover:text-primary transition">
                    Pricing
                  </a>

                  <a href="#faq" className="hover:text-primary transition">
                    FAQ
                  </a>
                </div>
              </div>

              {/* CONTACT */}
              <div className="text-center md:text-right">
                <h4 className="text-lg font-semibold text-navy mb-4">
                  Contact
                </h4>

                <a
                  href="mailto:moonintelligence2005@gmail.com"
                  className="block text-secondary hover:text-primary transition"
                >
                  moonintelligence2005@gmail.com
                </a>

                <button
                  onClick={() => setShowDemo(true)}
                  className="btn-primary mt-6"
                >
                  Book a Demo
                </button>
              </div>

            </div>

            {/* BOTTOM */}
            <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-custom flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 text-xs sm:text-sm text-secondary">

              <p>
                © 2026 MoonInterview. All rights reserved.
              </p>

              <div className="flex gap-4 sm:gap-6">
                <Link
                  to="/login"
                  className="hover:text-primary transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="hover:text-primary transition"
                >
                  Get Started
                </Link>
              </div>

            </div>
          </motion.div>
        </footer>
      </div>
      {showPricing && (
        <Pricing
          price={selectedPlan}
          onClose={() => setShowPricing(false)}
        />
      )}

    </>
  );
}

export default Home;
