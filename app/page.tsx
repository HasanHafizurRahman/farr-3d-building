// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Scene from '@/components/Scene';
import { api, FloorData, BuildingData } from '@/lib/api';
import { useGLTF } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Layers, ArrowRight, Phone, Mail, Star, Shield, Award, Gem, ChevronDown, Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [buildingsData, setBuildingsData] = useState<BuildingData[]>([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBuildings()
      .then(data => {
        setBuildingsData(data);
        if (data.length > 0) {
          setSelectedBuildingId(data[0].id);
          // Preload the model to speed up initial render
          useGLTF.preload(data[0].modelPath);
        }
        setLoading(false);
        setIsVisible(true);
      })
      .catch(err => {
        console.error('Failed to load buildings:', err);
        setLoading(false);
      });
  }, []);

  const selectedBuilding = buildingsData.find(b => b.id === selectedBuildingId) || buildingsData[0];

  const handleFloorClick = (floor: FloorData) => {
    router.push(`/floor/${floor.id}`);
  };

  const featureIcons = [Star, Shield, Award, Gem];

  if (!selectedBuilding) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-white text-black overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-100/40 to-orange-100/20 blur-3xl animate-orb-1" />
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-gray-100/60 to-slate-100/30 blur-3xl animate-orb-2" />
        <div className="absolute -bottom-40 right-1/3 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-amber-50/30 to-yellow-50/20 blur-3xl animate-float-slow" />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Premium Header */}
      <header className="fixed inset-x-0 top-0 z-50 glass border-b border-black/5">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 sm:px-12 py-4">
          <div className={`flex items-center gap-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-br from-amber-400/30 to-amber-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative rounded-xl bg-gradient-to-br from-black via-gray-900 to-gray-800 p-3.5 text-white font-black text-xl shadow-xl">
                FB
              </div>
            </div>
            <div className="leading-tight">
              <div className="text-xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
                  Farr Builders
                </span>
              </div>
              <div className="text-xs text-gray-400 font-medium tracking-widest uppercase">Premium Real Estate</div>
            </div>
          </div>

          <nav className={`hidden md:flex items-center gap-8 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
            <a href="#features" className="relative text-gray-500 hover:text-black transition-colors font-medium group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#about" className="relative text-gray-500 hover:text-black transition-colors font-medium group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 group-hover:w-full transition-all duration-300" />
            </a>
            <a href="#contact" className="relative text-gray-500 hover:text-black transition-colors font-medium group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 group-hover:w-full transition-all duration-300" />
            </a>
          </nav>

          <div className={`hidden md:flex items-center gap-4 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <button
              onClick={() => router.push('/admin')}
              className="relative group overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black text-white px-7 py-3 rounded-xl font-bold transition-all hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] hover-lift"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - 3D Building Viewer */}
      <section className="relative h-screen w-full mt-[90px] pt-20">
        <div className="absolute inset-0">
          <Scene
            buildingModelPath={selectedBuilding.modelPath}
            floors={selectedBuilding.floors}
            onFloorClick={handleFloorClick}
          />
        </div>

        {/* Premium Floating Building Card */}
        <div className={`absolute left-6 lg:left-12 bottom-6 z-30 max-w-md transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="relative group">
            {/* Animated Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse-glow" />

            <div className="relative glass rounded-3xl p-8 shadow-2xl border border-white/50 hover:border-amber-200/50 transition-all duration-500">
              {/* Premium Badge */}
              <div className="absolute -top-3 -right-3">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg animate-float">
                  ✦ Premium
                </div>
              </div>

              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-3xl font-black mb-1">
                    <span className="bg-gradient-to-r from-black via-gray-800 to-gray-600 bg-clip-text text-transparent">
                      {selectedBuilding.name}
                    </span>
                  </h2>
                  <p className="text-amber-600 font-semibold text-sm tracking-wide">Exclusive Residences</p>
                </div>
              </div>

              <p className="text-gray-500 mb-6 leading-relaxed text-sm">{selectedBuilding.description}</p>

              {/* Info Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-black/5 rounded-xl p-3 text-center hover:bg-black/10 transition-colors">
                  <MapPin className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                  <div className="text-xs text-gray-500 mb-0.5">Location</div>
                  <div className="font-bold text-sm text-black truncate">{selectedBuilding.location.split(',')[0]}</div>
                </div>
                <div className="bg-black/5 rounded-xl p-3 text-center hover:bg-black/10 transition-colors">
                  <Calendar className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                  <div className="text-xs text-gray-500 mb-0.5">Possession</div>
                  <div className="font-bold text-sm text-black">{selectedBuilding.possession}</div>
                </div>
                <div className="bg-black/5 rounded-xl p-3 text-center hover:bg-black/10 transition-colors">
                  <Layers className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                  <div className="text-xs text-gray-500 mb-0.5">Floors</div>
                  <div className="font-bold text-sm text-black">{selectedBuilding.totalFloors} Levels</div>
                </div>
              </div>

              {/* CTA Hint */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200/50">
                <p className="text-sm text-amber-800 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                  Hover over floors in the 3D model to explore
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden lg:flex flex-col items-center gap-3">
          <span className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">Scroll</span>
          <div className="w-8 h-14 border-2 border-black/20 rounded-full flex items-start justify-center p-2 hover:border-amber-500/50 transition-colors">
            <ChevronDown className="w-4 h-4 text-gray-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Section - Premium Grid */}
      <section id="features" className="relative py-32 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-50/30 to-transparent" />

        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 relative">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Star className="w-4 h-4" />
              World-Class Amenities
            </div>
            <h2 className="text-5xl sm:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
                Exceptional
              </span>
              <br />
              <span className="text-amber-600">Features</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Every detail meticulously crafted for those who appreciate the finest things in life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {selectedBuilding.features.map((feature: string, index: number) => {
              const IconComponent = featureIcons[index % featureIcons.length];
              return (
                <div
                  key={index}
                  className="group relative hover-lift"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-3xl opacity-0 group-hover:opacity-100 blur transition-all duration-500" />

                  <div className="relative h-full glass rounded-3xl p-8 border border-black/5 group-hover:border-amber-200/50 transition-all duration-500">
                    {/* Number badge */}
                    <div className="absolute top-4 right-4 text-6xl font-black text-black/[0.03] group-hover:text-amber-500/10 transition-colors">
                      0{index + 1}
                    </div>

                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-black mb-3">{feature}</h3>
                      <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-transparent rounded-full group-hover:w-20 transition-all duration-500" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-black via-gray-900 to-black relative overflow-hidden">
        {/* Animated pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '50+', label: 'Premium Properties', icon: Gem },
              { value: '1000+', label: 'Happy Families', icon: Star },
              { value: '15+', label: 'Years Excellence', icon: Award },
              { value: '100%', label: 'Client Satisfaction', icon: Shield },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-4 group-hover:bg-amber-500/20 transition-colors">
                  <stat.icon className="w-6 h-6 text-amber-400" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-white mb-2 stat-number">{stat.value}</div>
                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="relative py-32 overflow-hidden">
        {/* Premium background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-br from-amber-100/30 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-12 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full text-sm font-semibold mb-8">
              <Phone className="w-4 h-4" />
              Get In Touch
            </div>

            <h2 className="text-5xl sm:text-7xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-black via-gray-700 to-gray-500 bg-clip-text text-transparent">
                Ready to Find Your
              </span>
              <br />
              <span className="text-gradient-gold">Dream Home?</span>
            </h2>

            <p className="text-xl text-gray-500 mb-12 leading-relaxed max-w-2xl mx-auto">
              Schedule a personalized tour and experience luxury living at {selectedBuilding.name}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => router.push('/contact')}
                className="group relative overflow-hidden bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:shadow-amber-500/25 transition-all duration-500 hover-lift"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  Schedule Private Tour
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </button>

              <button className="group bg-white hover:bg-gray-50 text-black font-bold px-10 py-5 rounded-2xl transition-all border-2 border-black/10 hover:border-black/20 flex items-center gap-3 shadow-lg hover-lift">
                <Mail className="w-5 h-5" />
                <span>Download Brochure</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="relative bg-black text-white py-20 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-3.5 text-white font-black text-xl shadow-lg">
                  FB
                </div>
                <div>
                  <div className="text-2xl font-black">Farr Builders</div>
                  <div className="text-sm text-gray-400">Premium Real Estate Solutions</div>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md mb-6">
                Redefining luxury living with exceptional properties that blend sophistication,
                innovation, and timeless design.
              </p>
              <div className="flex gap-3">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 bg-white/10 hover:bg-amber-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-3">
                {['Properties', 'Features', 'About Us', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors flex items-center gap-2 group">
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">Contact Us</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-500" />
                  +880 1234-567890
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-amber-500" />
                  info@farrbuilders.com
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-amber-500" />
                  Dhaka, Bangladesh
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Farr Builders and Landmarks LTD. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}