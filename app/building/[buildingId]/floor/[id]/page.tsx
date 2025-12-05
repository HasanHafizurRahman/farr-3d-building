import { getBuildingById, getFloorById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Home, Maximize2 } from 'lucide-react';
import Image from 'next/image';

export async function generateStaticParams() {
    return [];
}

export default async function FloorPage({
    params
}: {
    params: Promise<{ buildingId: string; id: string }>
}) {
    const { buildingId, id } = await params;
    const building = getBuildingById(buildingId);
    const floor = getFloorById(buildingId, id);

    if (!building || !floor) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white">
            {/* Floating Back Button */}
            <div className="fixed top-6 left-6 z-50">
                <Link
                    href={`/building/${buildingId}`}
                    className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-xl text-gray-700 hover:text-black px-6 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 border border-black/10"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-semibold">Back to {building.name}</span>
                </Link>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Hero Section - Map with Overlays */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-12 group">
                    <div className="relative h-[600px]">
                        <Image
                            src={floor.mapUrl}
                            alt={`${floor.name} floor plan`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority={false}
                            loading="lazy"
                        />
                        {/* Gradient Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/5 mix-blend-multiply" />

                        {/* Floating Info Cards */}
                        <div className="absolute top-6 right-6 flex flex-col gap-3">
                            <div className="bg-white/90 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-xl border border-black/10 transform transition-all hover:scale-105">
                                <div className="text-xs text-gray-800 font-bold uppercase tracking-wider mb-1">Level</div>
                                <div className="text-2xl font-bold text-black">{floor.level}</div>
                            </div>
                            <div className="bg-black backdrop-blur-xl px-5 py-3 rounded-2xl shadow-xl border border-black/20 transform transition-all hover:scale-105">
                                <div className="text-xs text-gray-300 font-bold uppercase tracking-wider mb-1">Status</div>
                                <div className="text-lg font-bold text-white">Available</div>
                            </div>
                        </div>

                        {/* Bottom Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                            <div className="max-w-4xl">
                                <div className="inline-block bg-black/90 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold mb-4">
                                    {floor.size}
                                </div>
                                <h1 className="text-5xl md:text-7xl font-bold text-black mb-4 tracking-tight leading-tight">
                                    {floor.name}
                                </h1>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl md:text-6xl font-bold text-black">{floor.price}</span>
                                    <span className="text-xl text-gray-700">/ Total</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    {/* Main Content - 2 columns */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Property Description */}
                        <div className="bg-black/5 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-xl border border-black/10 transition-all hover:shadow-2xl">
                            <h2 className="text-3xl font-bold text-black mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-gradient-to-b from-black to-gray-600 rounded-full"></span>
                                About This Property
                            </h2>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                {floor.description}
                            </p>
                        </div>

                        {/* Benefits Section */}
                        <div className="bg-gradient-to-br from-black/5 to-black/10 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-xl border border-black/10">
                            <h2 className="text-3xl font-bold text-black mb-8 flex items-center gap-3">
                                <span className="w-2 h-8 bg-gradient-to-b from-black to-gray-600 rounded-full"></span>
                                Key Features
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {floor.benefits.map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="group relative bg-white/80 backdrop-blur-md hover:bg-white p-6 rounded-2xl border border-black/10 hover:border-black/30 transition-all hover:shadow-2xl hover:-translate-y-1"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-black to-gray-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                                <Check className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="text-gray-800 font-semibold text-lg">{benefit}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - 1 column */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="bg-black/5 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-black/10 transition-all hover:shadow-2xl">
                            <h3 className="text-lg font-bold text-black mb-6">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-black/5 to-transparent rounded-xl transition-all hover:bg-black/10">
                                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-md">
                                        <Maximize2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-600 font-semibold uppercase">Area</div>
                                        <div className="text-xl font-bold text-black">{floor.size}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-black/5 to-transparent rounded-xl transition-all hover:bg-black/10">
                                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-md">
                                        <Home className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-600 font-semibold uppercase">Level</div>
                                        <div className="text-xl font-bold text-black">{floor.level}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Card */}
                        <div className="bg-gradient-to-br from-black to-gray-800 rounded-3xl p-8 shadow-2xl text-white sticky top-6 transition-all hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                            <h3 className="text-2xl font-bold mb-3">Ready to View?</h3>
                            <p className="text-gray-200 mb-6 leading-relaxed">
                                Schedule a personalized tour of this exclusive property today.
                            </p>
                            <div className="space-y-3">
                                <button className="w-full bg-white text-black hover:bg-gray-50 font-bold py-4 px-6 rounded-xl transition-all hover:shadow-xl hover:scale-105 active:scale-95">
                                    Schedule Viewing
                                </button>
                                <button className="w-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold py-4 px-6 rounded-xl transition-all border-2 border-white/20 hover:border-white/40">
                                    Contact Agent
                                </button>
                            </div>
                            <div className="mt-6 pt-6 border-t border-white/20">
                                <div className="text-sm text-gray-200">Price</div>
                                <div className="text-3xl font-bold mt-1">{floor.price}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}