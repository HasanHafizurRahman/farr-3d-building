'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, FloorData, BuildingData } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, Check, Home, Maximize2, Phone, Mail, MapPin, Calendar, Building2, Star, Shield, Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function FloorPage() {
    const params = useParams();
    const id = params?.id as string;
    const [floor, setFloor] = useState<FloorData | null>(null);
    const [building, setBuilding] = useState<BuildingData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            api.getBuildings()
                .then(buildings => {
                    // Find the floor and its building
                    let foundFloor: FloorData | undefined;
                    let foundBuilding: BuildingData | undefined;

                    for (const b of buildings) {
                        const f = b.floors?.find(floor => floor.id === id);
                        if (f) {
                            foundFloor = f;
                            foundBuilding = b;
                            break;
                        }
                    }

                    if (foundFloor && foundBuilding) {
                        setFloor(foundFloor);
                        setBuilding(foundBuilding);
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to load floor data:', err);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (!floor || !building) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Floor Not Found</h1>
                    <Link href="/" className="text-amber-600 hover:text-amber-700">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-amber-100/30 to-orange-100/20 blur-3xl animate-orb-1" />
                <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-gray-100/50 to-slate-100/30 blur-3xl animate-orb-2" />
            </div>

            {/* Floating Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
                <div className="max-w-[1440px] mx-auto flex items-center justify-between">
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-3 glass px-5 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 border border-white/50 hover:border-amber-200/50"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-black to-gray-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ArrowLeft className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-gray-700 group-hover:text-black transition-colors">Back to Home</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/" className="glass px-4 py-2.5 rounded-xl border border-white/50 hover:border-amber-200/50 transition-all">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-amber-600" />
                                <span className="font-semibold text-sm">{building.name}</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                {/* Hero Section - Floor Plan Image */}
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl mb-12 group">
                    {/* Gradient border effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400/30 via-amber-500/20 to-orange-400/30 rounded-[2rem] opacity-0 group-hover:opacity-100 blur transition-all duration-700" />

                    <div className="relative h-[500px] md:h-[600px] rounded-[2rem] overflow-hidden">
                        <Image
                            src={floor.mapUrl}
                            alt={`${floor.name} floor plan`}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            priority={true}
                        />

                        {/* Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

                        {/* Floating Status Badges */}
                        <div className="absolute top-6 right-6 flex flex-col gap-3">
                            <div className="glass px-5 py-3 rounded-2xl shadow-xl transform transition-all hover:scale-105 hover:-translate-y-1">
                                <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Level</div>
                                <div className="text-3xl font-black text-black">{floor.level}</div>
                            </div>
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-3 rounded-2xl shadow-xl transform transition-all hover:scale-105">
                                <div className="text-xs text-white/80 font-bold uppercase tracking-wider mb-1">Status</div>
                                <div className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                    Available
                                </div>
                            </div>
                        </div>

                        {/* Premium Badge */}
                        <div className="absolute top-6 left-6">
                            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-float">
                                <Sparkles className="w-4 h-4" />
                                Premium Unit
                            </div>
                        </div>

                        {/* Bottom Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                            <div className="max-w-4xl">
                                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold mb-4 border border-white/20">
                                    <Maximize2 className="w-4 h-4" />
                                    {floor.size}
                                </div>
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tight leading-tight drop-shadow-lg">
                                    {floor.name}
                                </h1>
                                <div className="flex items-baseline gap-3 flex-wrap">
                                    <span className="text-4xl md:text-5xl lg:text-6xl font-black text-gradient-gold">{floor.price}</span>
                                    <span className="text-lg text-white/70 font-medium">Total Price</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content - 2 columns */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Property Description */}
                        <div className="glass rounded-3xl p-8 md:p-10 shadow-xl border border-white/50 hover:border-amber-200/30 transition-all duration-500 hover:shadow-2xl group">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Home className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-black">About This Property</h2>
                            </div>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {floor.description}
                            </p>

                            {/* Quick highlights */}
                            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-black/5">
                                <div className="text-center">
                                    <div className="text-2xl font-black text-black">{floor.size}</div>
                                    <div className="text-sm text-gray-500 font-medium">Total Area</div>
                                </div>
                                <div className="text-center border-x border-black/5">
                                    <div className="text-2xl font-black text-black">{floor.benefits.length}</div>
                                    <div className="text-sm text-gray-500 font-medium">Key Features</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-black text-amber-600">Level {floor.level}</div>
                                    <div className="text-sm text-gray-500 font-medium">Floor Number</div>
                                </div>
                            </div>
                        </div>

                        {/* Benefits Section */}
                        <div className="glass rounded-3xl p-8 md:p-10 shadow-xl border border-white/50 hover:border-amber-200/30 transition-all duration-500">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Star className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-black">Key Features</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {floor.benefits.map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="group relative bg-gradient-to-br from-black/[0.02] to-black/[0.05] hover:from-amber-50 hover:to-orange-50 p-5 rounded-2xl border border-black/5 hover:border-amber-200/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                                                <Check className="w-5 h-5 text-white" />
                                            </div>
                                            <span className="text-gray-700 font-semibold group-hover:text-black transition-colors">{benefit}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Building Info */}
                        <div className="glass rounded-3xl p-8 md:p-10 shadow-xl border border-white/50">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-700 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Building2 className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-black">{building.name}</h2>
                                    <p className="text-sm text-gray-500">Part of this exclusive development</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-black/5 rounded-xl p-4 text-center hover:bg-amber-50 transition-colors">
                                    <MapPin className="w-5 h-5 mx-auto mb-2 text-amber-600" />
                                    <div className="text-xs text-gray-500 mb-1">Location</div>
                                    <div className="font-bold text-sm text-black truncate">{building.location}</div>
                                </div>
                                <div className="bg-black/5 rounded-xl p-4 text-center hover:bg-amber-50 transition-colors">
                                    <Calendar className="w-5 h-5 mx-auto mb-2 text-amber-600" />
                                    <div className="text-xs text-gray-500 mb-1">Possession</div>
                                    <div className="font-bold text-sm text-black">{building.possession}</div>
                                </div>
                                <div className="bg-black/5 rounded-xl p-4 text-center hover:bg-amber-50 transition-colors">
                                    <Building2 className="w-5 h-5 mx-auto mb-2 text-amber-600" />
                                    <div className="text-xs text-gray-500 mb-1">Total Floors</div>
                                    <div className="font-bold text-sm text-black">{building.totalFloors} Levels</div>
                                </div>
                                <div className="bg-black/5 rounded-xl p-4 text-center hover:bg-amber-50 transition-colors">
                                    <Shield className="w-5 h-5 mx-auto mb-2 text-amber-600" />
                                    <div className="text-xs text-gray-500 mb-1">Status</div>
                                    <div className="font-bold text-sm text-green-600">Available</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - 1 column */}
                    <div className="space-y-6">
                        {/* Price Card */}
                        <div className="glass rounded-3xl p-6 shadow-xl border border-white/50 sticky top-24">
                            <div className="text-center mb-6 pb-6 border-b border-black/5">
                                <div className="text-sm text-gray-500 font-medium mb-2">Total Price</div>
                                <div className="text-4xl font-black text-gradient-gold">{floor.price}</div>
                            </div>

                            {/* Quick Stats */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-4 p-3 bg-black/5 rounded-xl hover:bg-amber-50 transition-colors">
                                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md">
                                        <Maximize2 className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 font-semibold uppercase">Area</div>
                                        <div className="text-lg font-bold text-black">{floor.size}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 bg-black/5 rounded-xl hover:bg-amber-50 transition-colors">
                                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md">
                                        <Home className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 font-semibold uppercase">Level</div>
                                        <div className="text-lg font-bold text-black">Floor {floor.level}</div>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Buttons */}
                            <div className="space-y-3">
                                <button className="w-full group bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                                    <Phone className="w-5 h-5" />
                                    Schedule Viewing
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="w-full bg-black hover:bg-gray-900 text-white font-bold py-4 px-6 rounded-xl transition-all hover:shadow-lg flex items-center justify-center gap-2">
                                    <Mail className="w-5 h-5" />
                                    Contact Agent
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="glass rounded-3xl p-6 shadow-xl border border-white/50">
                            <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-amber-600" />
                                Why Choose Us
                            </h3>
                            <div className="space-y-3">
                                {['Verified Property', '100% Transparent Pricing', '24/7 Support Available', 'Legal Documentation Ready'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-gray-600">
                                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Check className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span className="text-sm font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom CTA Bar */}
            <div className="fixed bottom-0 left-0 right-0 glass border-t border-white/50 py-4 px-6 md:hidden z-40">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <div className="text-xs text-gray-500">Price</div>
                        <div className="text-xl font-black text-gradient-gold">{floor.price}</div>
                    </div>
                    <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact
                    </button>
                </div>
            </div>
        </main>
    );
}
