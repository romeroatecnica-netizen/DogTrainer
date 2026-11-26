interface AdSlotProps {
  slotId: string;
  placement: 'mid' | 'bottom';
  sponsoredLabel: string;
  hintText: string;
}

export function AdSlot({ slotId, placement, sponsoredLabel, hintText }: AdSlotProps) {
  const heightClass = placement === 'mid' ? 'min-h-[112px] md:min-h-[120px]' : 'min-h-[120px] md:min-h-[250px]';

  return (
    <aside
      aria-label={sponsoredLabel}
      data-ad-network="media-net"
      data-ad-slot={slotId}
      className={`no-print w-full bg-white border border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center px-4 py-3 text-center ${heightClass}`}
    >
      {/* Media.net Contextual Ad Slot:
          Replace this placeholder container body with your Media.net <div id="..."></div>
          and asynchronous mnet script tag. Keep min-height above to prevent Cumulative Layout Shift (CLS). */}
      <span className="text-[11px] font-medium tracking-wide text-slate-400">
        {sponsoredLabel} · {slotId}
      </span>
      <p className="mt-1 text-xs text-slate-500 max-w-xl">{hintText}</p>
    </aside>
  );
}
