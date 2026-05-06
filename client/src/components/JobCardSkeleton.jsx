import React from 'react'

const JobCardSkeleton = () => {
  return (
    <div className="bg-[#0d1526] border border-violet-900/30 hover:border-violet-500/50 
            rounded-xl p-5 flex flex-col gap-3 hover:shadow-lg 
            hover:shadow-violet-900/20 transition-all relative overflow-hidden">
      
      {/* Animated shimmer sweep */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.06) 50%, transparent 100%)',
          animation: 'skeletonShimmer 2s infinite'
        }} 
      />

      {/* Top: Logo + Info + Badge */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div 
            className="w-11 h-11 rounded-xl flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', animation: 'skeletonPulse 2s ease-in-out infinite' }}
          />
          <div className="space-y-2">
            {/* Company name */}
            <div 
              className="h-4 w-28 rounded-md"
              style={{ background: 'rgba(255,255,255,0.07)', animation: 'skeletonPulse 2s ease-in-out infinite 0.1s' }}
            />
            {/* Job title */}
            <div 
              className="h-3 w-40 rounded-md"
              style={{ background: 'rgba(255,255,255,0.05)', animation: 'skeletonPulse 2s ease-in-out infinite 0.2s' }}
            />
          </div>
        </div>
        {/* Days badge */}
        <div 
          className="h-3 w-14 rounded-md flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.05)', animation: 'skeletonPulse 2s ease-in-out infinite' }}
        />
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 mb-4">
        <div 
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ background: 'rgba(139,92,246,0.3)', animation: 'skeletonPulse 2s ease-in-out infinite' }}
        />
        <div 
          className="h-3 w-48 rounded-md"
          style={{ background: 'rgba(255,255,255,0.06)', animation: 'skeletonPulse 2s ease-in-out infinite 0.15s' }}
        />
      </div>

      {/* Description */}
      <div className="space-y-2 mb-5">
        <div className="h-3 w-full rounded-md" style={{ background: 'rgba(255,255,255,0.05)', animation: 'skeletonPulse 2s ease-in-out infinite 0.1s' }} />
        <div className="h-3 w-5/6 rounded-md" style={{ background: 'rgba(255,255,255,0.04)', animation: 'skeletonPulse 2s ease-in-out infinite 0.2s' }} />
        <div className="h-3 w-3/4 rounded-md" style={{ background: 'rgba(255,255,255,0.03)', animation: 'skeletonPulse 2s ease-in-out infinite 0.3s' }} />
      </div>

      {/* Apply button skeleton — purple tint to match real button */}
      <div 
        className="h-10 w-full rounded-lg"
        style={{ background: 'rgba(139,92,246,0.15)', animation: 'skeletonPulse 2s ease-in-out infinite 0.2s' }}
      />
    </div>
  )
}

export default JobCardSkeleton
