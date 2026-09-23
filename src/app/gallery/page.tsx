"use client";

import { useEffect, useMemo, useState } from "react";
import SiteLayout, { PageHeader, useQuote } from "@/components/site/SiteLayout";
import Icon from "@/components/ui/Icon";
import Modal from "@/components/ui/Modal";
import { CTABanner, SectionTitle } from "@/components/site/Sections";

interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  image: string;
  category: string;
  altText?: string;
  sortOrder?: number;
  status: string;
}

export default function GalleryPage() {
  const { openQuote } = useQuote();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function loadGallery() {
      try {
        setLoading(true);
        const res = await fetch("/api/gallery");
        const data = await res.json();
        if (Array.isArray(data)) {
          setItems(data);
        }
      } catch (err) {
        console.error("Failed to load gallery:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, []);

  // Extract unique categories from items
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ["All", ...Array.from(set)];
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Visual Portfolio"
        title="Field Operations & Service Delivery Gallery"
        subtitle="Explore high-resolution visual documentation of our on-site security deployments, mechanized cleaning, water tank sanitization, civil painting, and integrated facility operations across Pune & PCMC."
      />

      <section className="section-y bg-background">
        <div className="container-x">
          {/* Category Dropdown Filter */}
          <div className="mt-8 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gold">Facility Highlights</p>
              <h2 className="mt-0.5 text-2xl sm:text-3xl font-extrabold text-navy">
                On-Ground Operations Showcase
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Showing {filteredItems.length} of {items.length} verified operations visuals
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label htmlFor="gallery-category-filter" className="text-xs sm:text-sm font-bold text-navy whitespace-nowrap">
                Filter by Category
              </label>
              <div className="relative flex-1 sm:w-64">
                <select
                  id="gallery-category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-border bg-white px-4 py-2.5 pr-10 text-xs sm:text-sm font-semibold text-navy shadow-xs focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold cursor-pointer transition-all hover:border-gold/60"
                >
                  <option value="All">All Categories ({items.length})</option>
                  {categories.filter((c) => c !== "All").map((cat) => {
                    const count = items.filter((i) => i.category === cat).length;
                    return (
                      <option key={cat} value={cat}>
                        {cat} ({count})
                      </option>
                    );
                  })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-navy">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          {loading ? (
            <div className="py-24 text-center">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent inline-block" />
              <p className="mt-3 text-xs font-semibold text-navy">Loading gallery visuals from MongoDB…</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-20 text-center rounded-2xl border border-dashed border-border p-8 mt-6">
              <Icon name="photo" className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <h3 className="mt-3 text-base font-bold text-navy">No gallery visuals found</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Try selecting another category or check back as new project photos are uploaded.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-lift flex flex-col"
                >
                  {/* Image Frame */}
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                    <img
                      src={item.image}
                      alt={item.altText || item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category Tag */}
                    <span className="absolute top-3 left-3 rounded-md bg-navy/90 px-2.5 py-1 text-[11px] font-bold text-gold backdrop-blur-sm border border-gold/20">
                      {item.category}
                    </span>

                    {/* Quick Preview Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewItem(item)}
                      aria-label={`Preview ${item.title}`}
                      className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-lg bg-gold text-white opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-gold-hover shadow-card"
                    >
                      <Icon name="eye" className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="text-base font-bold text-navy group-hover:text-gold transition-colors">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => setPreviewItem(item)}
                        className="font-bold text-gold hover:underline flex items-center gap-1"
                      >
                        View Details <Icon name="arrow" className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openQuote({ services: [item.category] })}
                        className="text-[11px] font-semibold text-navy hover:text-gold"
                      >
                        Book Service
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox / Preview Modal */}
      {previewItem && (
        <Modal
          open={!!previewItem}
          onClose={() => setPreviewItem(null)}
          title={previewItem.title}
          maxWidth="max-w-4xl"
        >
          <div className="space-y-4">
            <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-navy border border-border">
              <img
                src={previewItem.image}
                alt={previewItem.altText || previewItem.title}
                className="h-full w-full object-contain"
              />
            </div>
            {previewItem.description && (
              <p className="text-xs leading-relaxed text-muted-foreground">
                {previewItem.description}
              </p>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
              <span className="text-[11px] text-muted-foreground font-mono">
                Category: <strong className="text-navy">{previewItem.category}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn-base btn-secondary text-xs py-2 px-3.5"
                  onClick={() => setPreviewItem(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn-base btn-accent text-xs py-2 px-4 font-bold"
                  onClick={() => {
                    const cat = previewItem.category;
                    setPreviewItem(null);
                    openQuote({ services: [cat] });
                  }}
                >
                  Request Quote for this Service
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      <CTABanner />
    </SiteLayout>
  );
}
