"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Globe, Copy, ExternalLink, Code, Check } from "lucide-react";

type Props = {
    eventType: any;
    username: string | null;
    baseUrl: string;
};

export function EventTypeCard({ eventType, username, baseUrl }: Props) {
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedEmbed, setCopiedEmbed] = useState(false);

    const publicUrl = username ? `${baseUrl}/${username}/${eventType.slug}` : "";
    const embedUrl = username ? `${baseUrl}/embed/${username}/${eventType.slug}` : "";

    const views = eventType.pageViews || 0;
    const bookings = eventType._count?.bookings || 0;
    const conversion = views > 0 ? Math.round((bookings / views) * 100) : 0;

    const embedCode = `<iframe src="${embedUrl}" width="100%" height="800" frameborder="0"></iframe>`;

    const copyLink = () => {
        if (!publicUrl) return;
        navigator.clipboard.writeText(publicUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    const copyEmbed = () => {
        if (!embedUrl) return;
        navigator.clipboard.writeText(embedCode);
        setCopiedEmbed(true);
        setTimeout(() => setCopiedEmbed(false), 2000);
    };

    return (
        <div className="glass-panel p-6 flex flex-col h-full group hover:border-[#6366f150] transition-colors relative overflow-hidden">
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-color to-accent-color opacity-50 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex-1 mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">{eventType.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {eventType.duration} min</span>
                    <span className="flex items-center gap-1.5"><Globe size={14} /> Public</span>
                </div>
            </div>

            <div className="pt-4 border-t border-[#ffffff10] flex flex-wrap items-center justify-between gap-y-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={copyLink}
                        disabled={!username}
                        className="text-sm font-medium text-primary-color hover:text-white flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                        {copiedLink ? "Copied" : "Copy Link"}
                    </button>

                    <button
                        onClick={copyEmbed}
                        disabled={!username}
                        className="text-sm font-medium text-accent-color hover:text-white flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {copiedEmbed ? <Check size={14} /> : <Code size={14} />}
                        {copiedEmbed ? "Copied" : "Embed"}
                    </button>
                </div>

                {username ? (
                    <Link href={`/${username}/${eventType.slug}`} target="_blank" className="text-sm border border-[#ffffff10] px-3 py-1.5 rounded-md hover:bg-[#ffffff0a] transition-colors flex items-center gap-1.5">
                        View <ExternalLink size={12} />
                    </Link>
                ) : (
                    <span className="text-xs text-gray-500">Username required</span>
                )}
            </div>

            <div className="pt-4 mt-2 border-t border-[#ffffff10] flex items-center justify-between text-xs text-gray-500 z-10">
                <div className="flex gap-4">
                    <span title="Page Views" className="font-mono">{views} Views</span>
                    <span title="Bookings" className="font-mono">{bookings} Bookings</span>
                </div>
                <div className="font-mono font-medium text-gray-400">{conversion}% Conv.</div>
            </div>
        </div>
    );
}
