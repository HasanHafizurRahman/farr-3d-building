// components/BuildingLoader.tsx
'use client';

export default function BuildingLoader() {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 z-50">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-100/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gray-200/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>

            <div className="relative flex flex-col items-center">
                {/* Building Skeleton Animation */}
                <div className="relative mb-8">
                    {/* Ground/Base */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-3 bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-sm animate-pulse" />

                    {/* Building structure */}
                    <div className="relative flex flex-col items-center">
                        {/* Building floors - animating from bottom to top */}
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="relative"
                                style={{
                                    animation: `buildFloor 2.5s ease-in-out infinite`,
                                    animationDelay: `${(7 - i) * 0.15}s`,
                                }}
                            >
                                <div
                                    className={`
                                        ${i === 0 ? 'w-28 h-6 rounded-t-lg' : i === 7 ? 'w-36 h-8' : 'w-32 h-5'}
                                        bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300
                                        relative overflow-hidden
                                        ${i === 0 ? 'mb-0' : '-mt-px'}
                                    `}
                                >
                                    {/* Shimmer effect */}
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                        style={{
                                            animation: 'shimmer 2s infinite',
                                            animationDelay: `${i * 0.1}s`
                                        }}
                                    />

                                    {/* Windows */}
                                    {i !== 0 && i !== 7 && (
                                        <div className="absolute inset-x-2 inset-y-1 flex gap-1 justify-center">
                                            {[...Array(4)].map((_, j) => (
                                                <div
                                                    key={j}
                                                    className="w-3 h-3 bg-gray-400/30 rounded-sm"
                                                    style={{
                                                        animation: 'windowGlow 1.5s ease-in-out infinite',
                                                        animationDelay: `${(i + j) * 0.2}s`
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Side details for ground floor */}
                                {i === 7 && (
                                    <>
                                        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-6 h-7 bg-amber-400/50 rounded-t-lg" />
                                    </>
                                )}
                            </div>
                        ))}

                        {/* Roof antenna */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-gray-400 rounded-full animate-pulse" />
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-3 h-1 bg-red-400/60 rounded-full animate-pulse" />
                    </div>
                </div>

                {/* Loading text */}
                <div className="text-center">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                    <p className="text-lg font-bold text-gray-700 tracking-wide">Building Your View</p>
                    <p className="text-sm text-gray-400 mt-1">Loading 3D model...</p>
                </div>

                {/* Progress bar */}
                <div className="mt-6 w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 rounded-full"
                        style={{
                            animation: 'progressBar 2s ease-in-out infinite'
                        }}
                    />
                </div>
            </div>

            {/* Inline keyframe styles */}
            <style jsx>{`
                @keyframes buildFloor {
                    0%, 100% {
                        opacity: 0.6;
                        transform: scaleY(0.95);
                    }
                    50% {
                        opacity: 1;
                        transform: scaleY(1);
                    }
                }
                
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                
                @keyframes windowGlow {
                    0%, 100% {
                        opacity: 0.3;
                    }
                    50% {
                        opacity: 0.8;
                    }
                }
                
                @keyframes progressBar {
                    0% {
                        width: 0%;
                    }
                    50% {
                        width: 70%;
                    }
                    100% {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}
