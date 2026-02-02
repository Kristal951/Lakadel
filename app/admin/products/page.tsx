// app/admin/products/page.tsx
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Image as ImageIcon,
  ArrowUpDown,
  Archive,
  Edit2,
} from "lucide-react";

export default function ProductsAdminPage() {
  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Inventory Management
          </nav>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Products
          </h1>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-3 bg-foreground text-background rounded-2xl hover:opacity-90 transition text-sm font-bold"
        >
          <Plus className="w-5 h-5" />
          Create New Product
        </Link>
      </header>

      {/* Search + Filters */}
      <section className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:max-w-md group">
          <Search className="w-5 h-5 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-foreground transition-colors" />
          <input
            placeholder="Search by name, SKU, or category..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-foreground/10 transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-muted/40 transition text-sm font-bold text-foreground shadow-sm">
            <Filter className="w-4 h-4" />
            Category
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-muted/40 transition text-sm font-bold text-foreground shadow-sm">
            Status
          </button>

          <div className="h-8 w-[1px] bg-border mx-2 hidden md:block" />

          <button className="px-4 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground transition">
            Reset Filters
          </button>
        </div>
      </section>

      {/* Products Table Wrapper */}
      <section className="bg-background rounded-[2rem] border border-border shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-background">
          <h2 className="text-lg font-bold text-foreground">
            Catalogue{" "}
            <span className="text-muted-foreground ml-2 font-medium text-sm">
              24 Total
            </span>
          </h2>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted/40 rounded-lg transition text-muted-foreground hover:text-foreground">
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-border bg-muted/20">
                <th className="px-8 py-4 text-[11px] text-muted-foreground font-semibold uppercase tracking-[0.1em]">
                  Product Info
                </th>
                <th className="px-8 py-4 text-[11px] text-muted-foreground font-semibold uppercase tracking-[0.1em]">
                  Category
                </th>
                <th className="px-8 py-4 text-[11px] text-muted-foreground font-semibold uppercase tracking-[0.1em]">
                  Price
                </th>
                <th className="px-8 py-4 text-[11px] text-muted-foreground font-semibold uppercase tracking-[0.1em]">
                  Stock Level
                </th>
                <th className="px-8 py-4 text-[11px] text-muted-foreground font-semibold uppercase tracking-[0.1em]">
                  Status
                </th>
                <th className="px-8 py-4 text-[11px] text-muted-foreground font-semibold uppercase tracking-[0.1em] text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {/* Sample Product Row */}
              <tr className="group hover:bg-muted/30 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center border border-border overflow-hidden group-hover:border-foreground/20 transition-colors">
                      <ImageIcon className="w-6 h-6 text-muted-foreground/60" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        Premium Wireless Headphones
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                        SKU: HEAD-2024-XP
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-8 py-5">
                  <span className="text-xs font-bold text-foreground bg-muted/30 px-3 py-1 rounded-full border border-border">
                    Electronics
                  </span>
                </td>

                <td className="px-8 py-5">
                  <span className="text-sm font-black text-foreground">
                    ₦45,000
                  </span>
                </td>

                <td className="px-8 py-5">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between w-24">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">
                        12 left
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground/60">
                        / 50
                      </span>
                    </div>
                    <div className="w-24 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-[24%]" />
                    </div>
                  </div>
                </td>

                <td className="px-8 py-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                    Active
                  </span>
                </td>

                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-background hover:bg-muted/40 rounded-xl border border-border transition shadow-sm text-muted-foreground hover:text-primary">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-background hover:bg-muted/40 rounded-xl border border-border transition shadow-sm text-muted-foreground hover:text-rose-600">
                      <Archive className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>

              {/* Empty State Placeholder (keep hidden until you need it) */}
              <tr className="hidden">
                <td colSpan={6} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mb-2 border border-border">
                      <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      No products found
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                      Your catalogue is currently empty. Start by adding your
                      first product to the store.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
