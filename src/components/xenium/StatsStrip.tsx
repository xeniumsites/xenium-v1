import { useEffect, useState } from "react";
import { Heart, Star, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const MIN_TO_SHOW_COUNT = 5;

export default function StatsStrip() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase.functions.invoke<{ ordersDelivered: number }>(
          "get-public-stats",
          { method: "GET" },
        );
        if (!cancelled && data && typeof data.ordersDelivered === "number") {
          setCount(data.ordersDelivered);
        }
      } catch {
        // silent fallback — strip still renders rating + reach
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const showCount = count !== null && count >= MIN_TO_SHOW_COUNT;

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] sm:text-xs text-muted-foreground/80 mt-6 sm:mt-8">
      {showCount && (
        <span className="inline-flex items-center gap-1.5">
          <Heart size={11} className="text-xenium-rose/80 fill-xenium-rose/40" />
          <span className="text-foreground/90 font-medium">
            {count!.toLocaleString("en-IN")}+
          </span>{" "}
          families gifted &amp; counting
        </span>
      )}
      <span className="inline-flex items-center gap-1.5">
        <Star size={11} className="text-xenium-amber fill-xenium-amber" />
        <span className="text-foreground/90 font-medium">4.9</span> avg rating from early customers
      </span>
      <span className="inline-flex items-center gap-1.5">
        <MapPin size={11} className="text-xenium-violet-mid/80" />
        Delivered across India &amp; abroad
      </span>
    </div>
  );
}
