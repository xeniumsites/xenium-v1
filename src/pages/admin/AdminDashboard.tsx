import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Search, Filter, RefreshCw, ChevronLeft, ChevronRight, Plus, ExternalLink, Trash2 } from "lucide-react";
import { AdminOrder, adminListOrders, adminDeleteOrder } from "@/lib/adminClient";
import { formatINR, paymentStatusLabel, productionStatusLabel } from "@/lib/paymentClient";

const PAGE_SIZE = 25;

export default function AdminDashboard() {
  const [items, setItems] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [productionStatus, setProductionStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Admin · Orders | Xenium";
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminListOrders({
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
        search: search.trim() || undefined,
        paymentStatus: paymentStatus || undefined,
        productionStatus: productionStatus || undefined,
      });
      setItems(res.items);
      setTotal(res.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, paymentStatus, productionStatus]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    void load();
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-light">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {total.toLocaleString("en-IN")} total · showing {Math.min(items.length, total)} on this page
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 px-3 min-h-[40px] rounded-full border border-border"
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />} Refresh
          </button>
          <Link
            to="/admin/orders/new"
            className="gradient-full text-foreground font-semibold inline-flex items-center gap-1.5 px-4 min-h-[40px] rounded-full text-xs"
          >
            <Plus size={13} /> New manual order
          </Link>
        </div>
      </div>

      <form onSubmit={onSearch} className="grid sm:grid-cols-[1fr_auto_auto_auto] gap-3 mb-6">
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, email, name, occasion…"
            className="w-full pl-10 pr-4 py-2.5 rounded-full bg-muted/20 border border-border/60 text-sm focus:outline-none focus:border-xenium-violet-mid/40 focus:ring-2 focus:ring-xenium-violet-mid/20"
          />
        </div>
        <select
          value={paymentStatus}
          onChange={(e) => {
            setPaymentStatus(e.target.value);
            setPage(0);
          }}
          className="px-4 py-2.5 rounded-full bg-muted/20 border border-border/60 text-sm"
          aria-label="Filter by payment status"
        >
          <option value="">All payments</option>
          <option value="pending">Pending</option>
          <option value="created">Awaiting payment</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
          <option value="expired">Expired</option>
          <option value="waived">Waived</option>
        </select>
        <select
          value={productionStatus}
          onChange={(e) => {
            setProductionStatus(e.target.value);
            setPage(0);
          }}
          className="px-4 py-2.5 rounded-full bg-muted/20 border border-border/60 text-sm"
          aria-label="Filter by production status"
        >
          <option value="">All production</option>
          <option value="awaiting_payment">Awaiting payment</option>
          <option value="queued">Queued</option>
          <option value="in_progress">In progress</option>
          <option value="review">Review</option>
          <option value="revisions">Revisions</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button type="submit" className="px-4 py-2.5 rounded-full bg-muted/30 text-sm hover:bg-muted/50 inline-flex items-center gap-1.5">
          <Filter size={13} /> Apply
        </button>
      </form>

      {error && (
        <div className="mb-4 p-4 rounded-xl border border-xenium-rose/30 bg-xenium-rose/5 text-xenium-rose text-sm">{error}</div>
      )}

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead className="text-left text-[11px] uppercase tracking-widest text-muted-foreground border-b border-border">
              <tr>
                <th className="p-4">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Occasion</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Production</th>
                <th className="p-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading && items.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground"><Loader2 className="animate-spin inline" size={14} /> Loading…</td></tr>
              )}
              {!loading && items.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No orders match these filters.</td></tr>
              )}
              {items.map((o) => {
                const pay = paymentStatusLabel(o.payment_status);
                const prod = productionStatusLabel(o.production_status);
                return (
                  <tr key={o.id} className="border-b border-border/40 hover:bg-muted/10">
                    <td className="p-4">
                      <Link to={`/admin/orders/${o.short_code}`} className="font-mono text-foreground hover:text-xenium-amber">
                        {o.short_code}
                      </Link>
                      {o.is_manual && <span className="ml-2 text-[10px] uppercase tracking-widest text-xenium-amber/70">manual</span>}
                    </td>
                    <td className="p-4">
                      <div className="text-foreground/90">{o.sender_name}</div>
                      <div className="text-muted-foreground text-xs">{o.sender_email}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-foreground/90">{o.occasion}</div>
                      <div className="text-muted-foreground text-xs">for {o.recipient_name}</div>
                    </td>
                    <td className="p-4 font-medium">{formatINR(o.amount_paise)}</td>
                    <td className="p-4">
                      <Pill tone={pay.tone}>{pay.label}</Pill>
                      {o.payment_link_url && o.payment_status !== "paid" && (
                        <a
                          href={o.payment_link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 inline-flex items-center text-[11px] text-muted-foreground hover:text-foreground"
                          title="Open payment link"
                        >
                          <ExternalLink size={11} />
                        </a>
                      )}
                    </td>
                    <td className="p-4"><Pill tone={prod.tone}>{prod.label}</Pill></td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {new Date(o.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 text-sm text-muted-foreground">
        <span>Page {page + 1} of {totalPages}</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0 || loading}
            className="px-3 py-1.5 rounded-full border border-border hover:bg-muted/20 disabled:opacity-40 inline-flex items-center gap-1"
          >
            <ChevronLeft size={14} /> Prev
          </button>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1 || loading}
            className="px-3 py-1.5 rounded-full border border-border hover:bg-muted/20 disabled:opacity-40 inline-flex items-center gap-1"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Pill({ tone, children }: { tone: "amber" | "violet" | "green" | "muted" | "red" | "rose"; children: React.ReactNode }) {
  const palette: Record<typeof tone, string> = {
    amber: "border-xenium-amber/40 bg-xenium-amber/10 text-xenium-amber",
    violet: "border-xenium-violet-mid/40 bg-xenium-violet-deep/10 text-xenium-violet-mid",
    green: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
    muted: "border-border bg-muted/20 text-muted-foreground",
    red: "border-xenium-rose/40 bg-xenium-rose/10 text-xenium-rose",
    rose: "border-xenium-rose/40 bg-xenium-rose/10 text-xenium-rose",
  } as const;
  return <span className={`inline-block text-[11px] px-2.5 py-1 rounded-full border ${palette[tone]}`}>{children}</span>;
}
