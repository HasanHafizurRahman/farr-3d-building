'use client';

import { FloorData, BuildingData } from '@/lib/api';
import Image from 'next/image';
import { X, Check, Home, Maximize2, Phone, Mail, MapPin, Calendar, Building2, Star, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface FloorDetailSidebarProps {
    floor: FloorData | null;
    building: BuildingData | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function FloorDetailSidebar({ floor, building, isOpen, onClose }: FloorDetailSidebarProps) {
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            // Delay adding listener to prevent immediate close on click
            const timer = setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 100);
            return () => {
                clearTimeout(timer);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen, onClose]);

    // Handle escape key to close
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, onClose]);

    if (!floor || !building) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            />

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-700" />
                </button>

                {/* Hero Section - Floor Plan Image */}
                <div className="relative h-72 overflow-hidden">
                    <Image
                        src={floor.mapUrl}
                        alt={`${floor.name} floor plan`}
                        fill
                        className="object-cover"
                        priority={true}
                    />

                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Floating Status Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            Premium Unit
                        </div>
                    </div>

                    <div className="absolute top-4 right-14 flex flex-col gap-2">
                        <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg">
                            <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Level</div>
                            <div className="text-2xl font-black text-black">{floor.level}</div>
                        </div>
                    </div>

                    {/* Bottom Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-sm font-bold mb-3 border border-white/20">
                            <Maximize2 className="w-3.5 h-3.5" />
                            {floor.size}
                        </div>
                        <h1 className="text-3xl font-black text-white mb-2 tracking-tight leading-tight drop-shadow-lg">
                            {floor.name}
                        </h1>
                        <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-3xl font-black text-gradient-gold">{floor.price}</span>
                            <span className="text-sm text-white/70 font-medium">Total Price</span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 space-y-6">
                    {/* Status Badge */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-3 rounded-xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-white/80 font-bold uppercase tracking-wider mb-1">Status</div>
                                <div className="text-lg font-bold text-white flex items-center gap-2">
                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                    Available
                                </div>
                            </div>
                            <Shield className="w-8 h-8 text-white/30" />
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                            <div className="text-xl font-black text-black">{floor.size}</div>
                            <div className="text-xs text-gray-500 font-medium">Total Area</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                            <div className="text-xl font-black text-black">{floor.benefits.length}</div>
                            <div className="text-xs text-gray-500 font-medium">Key Features</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                            <div className="text-xl font-black text-amber-600">Level {floor.level}</div>
                            <div className="text-xs text-gray-500 font-medium">Floor Number</div>
                        </div>
                    </div>

                    {/* Property Description */}
                    <div className="bg-gray-50 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
                                <Home className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-bold text-black">About This Property</h2>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {floor.description}
                        </p>
                    </div>

                    {/* Benefits Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
                                <Star className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-lg font-bold text-black">Key Features</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {floor.benefits.map((benefit, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 bg-gray-50 hover:bg-amber-50 p-3 rounded-xl transition-colors duration-200"
                                >
                                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-sm">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-gray-700 font-medium text-sm">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Building Info */}
                    <div className="bg-gray-50 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-700 rounded-xl flex items-center justify-center shadow-md">
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-black">{building.name}</h2>
                                <p className="text-xs text-gray-500">Part of this exclusive development</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white rounded-xl p-3 text-center">
                                <MapPin className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                                <div className="text-xs text-gray-500">Location</div>
                                <div className="font-bold text-xs text-black truncate">{building.location}</div>
                            </div>
                            <div className="bg-white rounded-xl p-3 text-center">
                                <Calendar className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                                <div className="text-xs text-gray-500">Possession</div>
                                <div className="font-bold text-xs text-black">{building.possession}</div>
                            </div>
                            <div className="bg-white rounded-xl p-3 text-center">
                                <Building2 className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                                <div className="text-xs text-gray-500">Total Floors</div>
                                <div className="font-bold text-xs text-black">{building.totalFloors} Levels</div>
                            </div>
                            <div className="bg-white rounded-xl p-3 text-center">
                                <Shield className="w-4 h-4 mx-auto mb-1 text-amber-600" />
                                <div className="text-xs text-gray-500">Status</div>
                                <div className="font-bold text-xs text-green-600">Available</div>
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="bg-gray-50 rounded-2xl p-5">
                        <h3 className="text-sm font-bold text-black mb-3 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-amber-600" />
                            Why Choose Us
                        </h3>
                        <div className="space-y-2">
                            {['Verified Property', '100% Transparent Pricing', '24/7 Support Available', 'Legal Documentation Ready'].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-gray-600">
                                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3 h-3 text-green-600" />
                                    </div>
                                    <span className="text-xs font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3 pt-2 pb-6">
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
            </div>
        </>
    );
}
