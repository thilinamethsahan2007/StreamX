import { FranchiseContent } from '@/hooks/useFranchise';
import { getImageUrl } from '@/lib/utils';
import { useModalStore } from '@/store/modalStore';
import { motion } from 'framer-motion';

interface TimelineProps {
    content: FranchiseContent[];
}

export default function Timeline({ content }: TimelineProps) {
    const openModal = useModalStore((state) => state.openModal);

    return (
        <div className="relative container mx-auto px-4 py-24">
            {/* Vertical Line with Gradient */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent -translate-x-1/2 md:translate-x-0" />

            <div className="space-y-24">
                {content.map((item, index) => {
                    const isEven = index % 2 === 0;
                    return (
                        <motion.div
                            key={`${item.id}-${index}`}
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }} // Apple-like spring/ease
                            className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* Date Marker */}
                            <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] ring-4 ring-[#141414]" />
                            </div>

                            {/* Content Spacer */}
                            <div className="flex-1 w-full md:w-1/2" />

                            {/* Content Card */}
                            <div className={`flex-1 w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pr-20' : 'md:pl-20'}`}>
                                <div
                                    className="group relative bg-[#1c1c1e]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl cursor-pointer"
                                    onClick={() => openModal(item as any)}
                                >
                                    <div className="flex h-48 sm:h-56">
                                        <div className="w-32 sm:w-40 shrink-0 relative overflow-hidden">
                                            <img
                                                src={getImageUrl(item.poster_path, 'w500')}
                                                alt={item.title}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                                        </div>
                                        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center relative">

                                            <div className="relative z-10 space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-white/90 text-lg font-semibold tracking-tight">
                                                        {item.release_date ? new Date(item.release_date).getFullYear() : 'TBA'}
                                                    </span>
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide bg-white/10 text-white/70 backdrop-blur-md">
                                                        {item.media_type === 'movie' ? 'MOVIE' : 'TV SERIES'}
                                                    </span>
                                                </div>

                                                <h3 className="text-white font-bold text-2xl sm:text-3xl leading-tight tracking-tight group-hover:text-white/90 transition-colors line-clamp-2">
                                                    {item.title}
                                                </h3>

                                                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 font-medium">
                                                    {item.overview}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
