// components/FloorDetailsPanel.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, ArrowRight, Map } from 'lucide-react';
import { FloorData, BuildingData } from '@/lib/data';

interface Props {
    floor: FloorData | null;
    building: BuildingData;
    onClose: () => void;
}

export default function FloorDetailsPanel({ floor, building, onClose }: Props) {
    return (
        <AnimatePresence>
            {floor && (
                <motion.aside
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    className="fixed right-0 top-0 h-full w-full md:w-[420px] bg-white/95 backdrop-blur-2xl shadow-2xl z-50 p-6 overflow-y-auto border-l border-white/20"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5">
                        <X className="w-6 h-6 text-gray-600" />
                    </button>

                    <div className="mt-8 space-y-6">
                        <div>
                            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wide uppercase mb-3">
                                Level {floor.level}
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">{floor.name}</h2>
                            <p className="text-blue-600 font-bold text-2xl mt-2">{floor.price}</p>
                        </div>

                        <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                <Map className="w-12 h-12" />
                                <div className="text-sm font-medium">INTERACTIVE MAP</div>
                            </div>
                        </div>

                        <p className="text-gray-600">{floor.description}</p>

                        <div className="pt-4">
                            <Link href={`/building/${building.id}/floor/${floor.id}`} className="w-full bg-gray-900 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2">
                                View Full Details <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
}
