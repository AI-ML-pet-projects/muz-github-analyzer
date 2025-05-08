"use client";

interface PlanCardProps {
  plan: string;
  usage: number;
  limit: number;
}

export function PlanCard({ plan, usage, limit }: PlanCardProps) {
  const usagePercentage = (usage / limit) * 100;
  const isWarning = usagePercentage >= 75;
  const isDanger = usagePercentage >= 90;

  return (
    <div className='bg-gradient-to-r from-[#e0c3fc] to-[#8ec5fc] rounded-xl p-6 sm:p-8 shadow-md relative overflow-hidden'>
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4'>
        <div>
          <div className='uppercase text-xs font-semibold text-white/80 mb-1'>
            Current Plan
          </div>
          <div className='text-2xl sm:text-3xl font-bold text-white'>
            {plan}
          </div>
        </div>
        <button className='bg-white/30 text-white px-4 py-2 rounded-lg font-medium border border-white/40 hover:bg-white/40 transition-colors duration-200 w-full sm:w-auto text-center'>
          Manage Plan
        </button>
      </div>

      <div className='space-y-2'>
        <div className='text-white/90'>API Usage</div>
        <div className='w-full h-2 bg-white/30 rounded-full'>
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isDanger ? "bg-red-400" : isWarning ? "bg-yellow-400" : "bg-white"
            }`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
        <div className='flex justify-between items-center text-sm'>
          <div className='text-white/80'>
            {usage.toLocaleString()} / {limit.toLocaleString()} Credits
          </div>
          {isDanger && (
            <div className='text-red-200 text-xs'>
              Warning: Approaching limit
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
