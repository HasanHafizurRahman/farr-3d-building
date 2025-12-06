// app/page.tsx
'use client';

import React, { useState } from 'react';
import Scene from '@/components/Scene';
import { buildingsData, BuildingData, FloorData } from '@/lib/data';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Gallery1 from '../public/assets/gallery-1.jpg';
import Gallery2 from '../public/assets/gallery-2.jpg';
import Gallery3 from '../public/assets/gallery-3.jpg';
import { Building2, MapPin, Calendar, Layers, Sparkles, ArrowRight, Phone, Mail } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [selectedBuildingId, setSelectedBuildingId] = useState(buildingsData[0].id);
  const selectedBuilding = buildingsData.find(b => b.id === selectedBuildingId) || buildingsData[0];

  const handleFloorClick = (floor: FloorData) => {
    router.push(`/building/${selectedBuildingId}/floor/${floor.id}`);
  };

  return (
    <main className="min-h-screen w-full bg-white text-black">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, black 2px, black 4px),
                           repeating-linear-gradient(90deg, transparent, transparent 2px, black 2px, black 4px)`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Premium Header */}
      <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-black/10">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 sm:px-12 py-5">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-600 rounded-xl blur-sm group-hover:blur-md transition-all" />
              <div className="relative rounded-xl bg-gradient-to-br from-black via-gray-800 to-gray-600 p-3 text-white font-black text-lg">
                EP
              </div>
            </div>
            <div className="leading-tight">
              <div className="text-lg font-black tracking-tight bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                Farr Builders and Landmarks LTD
              </div>
              <div className="text-xs text-gray-500 font-medium tracking-wide">Premium Real Estate Solutions</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button className="text-gray-600 hover:text-black transition-colors font-medium">
              Properties
            </button>
            <button className="text-gray-600 hover:text-black transition-colors font-medium">
              About
            </button>
            <button
              onClick={() => router.push('/contact')}
              className="relative group overflow-hidden bg-black text-white px-6 py-2.5 rounded-lg font-bold transition-all hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]"
            >
              <span className="relative z-10">Schedule Viewing</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </header>

      {/* 3D Building Viewer with Enhanced Overlay */}
      <section className="relative h-screen w-full">
        <div className="absolute inset-0">
          <Scene
            buildingModelPath={selectedBuilding.modelPath}
            floors={selectedBuilding.floors}
            onFloorClick={handleFloorClick}
          />
        </div>

        {/* Premium Building Information Card */}
        <div className="absolute left-6 bottom-6 z-30 max-w-md">
          <div className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-black/20 to-gray-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-white/90 backdrop-blur-2xl border border-black/20 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-3xl font-black bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
                  {selectedBuilding.name}
                </h2>
                <div className="bg-black/10 backdrop-blur-xl px-3 py-1 rounded-full">
                  <span className="text-xs font-bold text-black">{selectedBuilding.totalFloors} Floors</span>
                </div>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{selectedBuilding.description}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Location</div>
                    <div className="font-semibold text-black">{selectedBuilding.location}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Status</div>
                    <div className="font-semibold text-black">{selectedBuilding.possession}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
                    <Layers className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Total Floors</div>
                    <div className="font-semibold text-black">{selectedBuilding.totalFloors} Levels</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push(`/building/${selectedBuildingId}`)}
                className="w-full bg-black text-white font-bold py-4 rounded-xl hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>Explore Building</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden lg:block">
          <div className="flex flex-col items-center gap-2 text-black/60 animate-bounce">
            <span className="text-xs font-medium tracking-wider">SCROLL TO EXPLORE</span>
            <div className="w-6 h-10 border-2 border-black/30 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-black/60 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Building Features - Premium Grid */}
      <section id="features" className="max-w-[1440px] mx-auto px-6 sm:px-12 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black mb-4 bg-gradient-to-r from-black to-gray-500 bg-clip-text text-transparent">
            Exceptional Features
          </h2>
          <p className="text-gray-500 text-lg">Designed for the discerning few</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {selectedBuilding.features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-black/5 backdrop-blur-xl p-8 rounded-3xl border border-black/10 hover:border-black/30 transition-all duration-500 hover:shadow-[0_0_50px_rgba(0,0,0,0.1)]"
            >
              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <span className="text-white font-black text-2xl">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-black mb-2">{feature}</h3>
                <div className="w-12 h-1 bg-gradient-to-r from-black to-transparent rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="relative py-32 overflow-hidden bg-gray-50">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-black/5 rounded-full blur-3xl" />

        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl sm:text-6xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-black via-gray-800 to-gray-500 bg-clip-text text-transparent">
                Ready to Experience
              </span>
              <br />
              <span className="text-black">{selectedBuilding.name}?</span>
            </h2>

            <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
              Schedule a personalized tour to experience these premium properties in person.
              Our team is ready to assist you with all your real estate needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => router.push('/contact')}
                className="group relative overflow-hidden bg-black text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:shadow-[0_0_50px_rgba(0,0,0,0.4)] flex items-center gap-3"
              >
                <Phone className="w-5 h-5" />
                <span>Schedule Viewing</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="group bg-black/5 backdrop-blur-xl hover:bg-black/10 text-black font-bold px-10 py-5 rounded-2xl transition-all border-2 border-black/20 hover:border-black/40 flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <span>Download Brochure</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-black text-black mb-2">50+</div>
                <div className="text-gray-500 text-sm font-medium">Premium Properties</div>
              </div>
              <div className="text-center border-x border-black/10">
                <div className="text-4xl font-black text-black mb-2">1000+</div>
                <div className="text-gray-500 text-sm font-medium">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-black mb-2">15+</div>
                <div className="text-gray-500 text-sm font-medium">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="border-t border-black/10 py-16 bg-white/50 backdrop-blur-2xl">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-xl bg-gradient-to-br from-black via-gray-800 to-gray-600 p-3 text-white font-black text-lg">
                  EP
                </div>
                <div>
                  <div className="text-xl font-black text-black">Farr Builders and Landmarks LTD</div>
                  <div className="text-sm text-gray-500">Premium Real Estate Solutions</div>
                </div>
              </div>
              <p className="text-gray-500 leading-relaxed max-w-md">
                Redefining luxury living with exceptional properties that blend sophistication,
                innovation, and timeless design.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-black font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-black transition-colors">Properties</a></li>
                <li><a href="#features" className="text-gray-500 hover:text-black transition-colors">Features</a></li>
                <li><a href="#gallery" className="text-gray-500 hover:text-black transition-colors">Gallery</a></li>
                <li><a href="#" className="text-gray-500 hover:text-black transition-colors">About Us</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-black font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-500">
                <li>+880 1234-567890</li>
                <li>info@eliteproperties.com</li>
                <li>Dhaka, Bangladesh</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-black/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Farr Builders and Landmarks LTD. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-black transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}