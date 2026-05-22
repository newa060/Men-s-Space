"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: "Active" | "Draft" | "Archived";
  image: string;
  description: string;
  sizes: string[];
  images?: string[];
  colors?: { name: string; hex: string }[];
  materials?: string;
  waterproof?: string;
  breathability?: string;
  hardware?: string;
  seams?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerImage: string;
  date: string;
  itemsCount: number;
  totalPrice: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  items: string;
}

export interface CmsData {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroCtaText: string;
  featuredCategory: string;
}

export interface FeedbackItem {
  id: string;
  text: string;
  author: string;
  location: string;
  approved: boolean;
}

export interface Installation {
  id: string;
  title: string;
  location: string;
  status: "In Progress" | "Completed" | "Concept";
  structure: string;
  image: string;
}

interface AdminContextProps {
  products: Product[];
  orders: Order[];
  cmsData: CmsData;
  feedbackItems: FeedbackItem[];
  installations: Installation[];
  addProduct: (product: Omit<Product, "id" | "sku">) => void;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateCmsData: (data: Partial<CmsData>) => void;
  toggleFeedbackApproval: (id: string) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  addInstallation: (inst: Omit<Installation, "id">) => void;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cmsData, setCmsData] = useState<CmsData>({
    heroTitle: "Architectural Forms",
    heroSubtitle: "A dialogue between human structure and sartorial precision. Collection 04 is now available.",
    heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBga5lcdNTZo5qWObfMmw_RL3ZwUJtQp_vG9UficR9a_WYSqzsoM3FkgcXjOx82IytbLGbcK72QerzF5Ince2lrPNcUUzGEMXs9SSriYR26pfPLsI9dzJjz3DOrvGmj28_gJ23g7xOcCrMqTbfU8SlatF2I1fmA134UU9on7OKs_SdNhYINdOOO3g5JMlqk5Pxpik_5FRN77rU_4Hr_KhJnyX3F96SSsLQtEwSh5zGTrTqAY7N9w3TwaBn0ZsZ-nNmGmd2Adj_J5THD",
    heroCtaText: "Shop Collection",
    featuredCategory: "Architecture",
  });
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [installations, setInstallations] = useState<Installation[]>([]);

  // Seed mock data
  useEffect(() => {
    // Seed Products
    setProducts([
      {
        id: "prod-1",
        name: "Carrara Monolith",
        slug: "carrara-monolith",
        sku: "ART-CH-001",
        price: 12400,
        stock: 12,
        category: "Architecture",
        status: "Active",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNVuRwR-HDXuwncIMmkOYzlw6uHIkLQm__rl7GOA-bB-qIwAYdcQE58MjtPDWnua2Ih5PViCli_e4wHbJnlYniFt4rZ62ChCfy2PglhBgS4ag0D_TM4_BgfIAOy1rHDQ3WtetxXlVSEek59BrueM3Oq-J4USYYC96igJoak67jxcLUWpsZqIz0Ylqg4C889Q7NtWUWJUWPbWQRVCRNproHnGIOhLD41VtBXwAvtC0_zoPA1hI3ApgirEmE1MWQ2PKTWmP6NBpgtFCo",
        description: "A minimalist high-fashion studio photograph of a sculptural marble chair set against a stark, architectural concrete backdrop.",
        sizes: ["OS"],
      },
      {
        id: "prod-2",
        name: "Obsidian Velvet Panel",
        slug: "obsidian-velvet-panel",
        sku: "TEX-VL-402",
        price: 850,
        stock: 0,
        category: "Textiles",
        status: "Archived",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQmsDgUnSWZWiQ2ymITJU2T1J3VC1WO1ze-6craHb4b_QOHroEKDVNfq4whtxDd3rp_q6ilrmHV7Osv8C1DlxW1VRNktyFvtuSQiJqOzGXt-hEy6jSx0fbu-8AbyI0txWcoStYYaAvq5mluYbNfOSjKeVZk6h1LGoWJbvgCNqo9chsK9499kkdwM9h2unupzjHhkE-Od3GCR4b8Mhbc6t5AgYGsql-O8BKzl6cqgWzdtD-lhqPm2VpN-dbE8sulLKL72jlwkFyZC4-",
        description: "A macro photograph of premium velvet upholstery fabric featuring a complex, geometric weave pattern in deep obsidian and midnight blue.",
        sizes: ["S", "M", "L"],
      },
      {
        id: "prod-3",
        name: "Brutalist Oak Plinth",
        slug: "brutalist-oak-plinth",
        sku: "FUR-WD-089",
        price: 3200,
        stock: 4,
        category: "Furniture",
        status: "Active",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCp6QZIiVQRbMggm-lmpw7svtnVkfPggJxGRSiFo65K3y4_f84eKpYLP-6AQrmDjib3fIwNIj-PYi2tT03gVbMtcCnRs2y4Gf1l8mthPGQR-dHY5aqwDknnkJD27z5AzbtIVA39YgIlfdp1JwI_u3aX_dEFkYegK2W0t0B3blu0O7krkp4cZtmx3cs0i7UknRwJCw4A61kvlI7y7Gk4U5cJ8-A8yN-N17jMySDHwd2hI-SxnQeeG7Bh45rj2hEraLjj7tNagS-i6NKM",
        description: "An interior shot of a Brutalist-inspired living space with a focus on a raw oak side table.",
        sizes: ["OS"],
      },
      {
        id: "prod-4",
        name: "Lucent Glass Divider",
        slug: "lucent-glass-divider",
        sku: "ART-GL-112",
        price: 5100,
        stock: 24,
        category: "Architecture",
        status: "Active",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEExuJ64esSmbamVGgCA4t4CmOzka0zAab_r6fxE7Wl7WvTd_wCd0FYP0QZum5jc83gQZ6jUqnadPoJI1DmkScp9rHWewOKfNHt_GaO9hhhJviBslXcM5eM9PITnjr0MS-V46q8CzV4wzZHv2q6eDYbuo0ineE_T_fkNzn8vbRCPu5r1voj2--402mbaK5C7YOeHkwbTvpa_SzC5kXlp62E0EffQ_92fqaq9HeSMwdKTeNyTgQUtExnURRr36gkMJvcHAOr-HMjCkF",
        description: "A minimalist architectural installation featuring suspended translucent glass panels in a darkened gallery.",
        sizes: ["OS"],
      },
      {
        id: "structural-wool-coat",
        name: "Structural Wool Coat",
        slug: "structural-wool-coat",
        sku: "APP-WC-002",
        price: 1090,
        stock: 15,
        category: "Outerwear",
        status: "Active",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNTiPV-94sOcCV_ZNissk31ncdN23HhehqmCWT8-FQ9ITtuZ3kdB0pD9N0PXXGVaEX_EIzmeyjUC5exi5h2aw3rE-HfiHFKIzp71GbIWjsnAVXBixywaMgWLfxZiQim5ROHDjmCy-Qs5DOHUrz8AmFXqE-x4kqrP6Nr62IWNxEx8tf1luJjCKnvwft0BTid4PD2r7PGqjkHcbpbq03O7lMrnTthhPpi0VVHRpY6EF1yd_jZ-pZg5fnu6SKMgNKHUt47F6n_D0x3fqZ",
        description: "Featuring a custom structured wool weave, this coat defines class and performance. Its sharp collar line and architectural cut are designed to hang perfectly in any pose.",
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBNTiPV-94sOcCV_ZNissk31ncdN23HhehqmCWT8-FQ9ITtuZ3kdB0pD9N0PXXGVaEX_EIzmeyjUC5exi5h2aw3rE-HfiHFKIzp71GbIWjsnAVXBixywaMgWLfxZiQim5ROHDjmCy-Qs5DOHUrz8AmFXqE-x4kqrP6Nr62IWNxEx8tf1luJjCKnvwft0BTid4PD2r7PGqjkHcbpbq03O7lMrnTthhPpi0VVHRpY6EF1yd_jZ-pZg5fnu6SKMgNKHUt47F6n_D0x3fqZ"
        ],
        colors: [
          { name: "Black", hex: "#000000" },
          { name: "Ash", hex: "#8e8e8e" }
        ],
        materials: "100% Virgin Melton Wool",
        waterproof: "Water-resistant",
        breathability: "Natural Breathability",
        hardware: "Horn Buttons",
        seams: "Felled Tailoring Seams"
      },
      {
        id: "monolith-parka",
        name: "Monolith Parka",
        slug: "monolith-parka",
        sku: "APP-PR-001",
        price: 1250,
        stock: 8,
        category: "Outerwear",
        status: "Active",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_Ct1FuIuegBipTc_zn4OdzDzFfm3pU_wd41IEOmbpdJSF-QO_0GDIEF1gJq4d0j8hZseSVpVd5ACa_0eRHDaoYdVHJu7N6mXRz8QIri6hl01rqi7VJPf25KTcmIrlcTdP3jHYRqKnhX1AY_XIRUFNkFPCi_fNxJe-KWF9MgqkLpp0Y0079rsGJgXFerVzCkfDAWAv7CUxwXQv1Z_RcFcwlDWce4jRalgFOou3yjfrXosXfCx2ySplccUTomuVni7URqgkaFrytdXs",
        description: "The Monolith Parka is a study in brutalist silhouette and environmental resilience. Constructed with laser-cut precision, its structural panels create a sharp, protective volume that maintains its geometric integrity regardless of movement.",
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuB_Ct1FuIuegBipTc_zn4OdzDzFfm3pU_wd41IEOmbpdJSF-QO_0GDIEF1gJq4d0j8hZseSVpVd5ACa_0eRHDaoYdVHJu7N6mXRz8QIri6hl01rqi7VJPf25KTcmIrlcTdP3jHYRqKnhX1AY_XIRUFNkFPCi_fNxJe-KWF9MgqkLpp0Y0079rsGJgXFerVzCkfDAWAv7CUxwXQv1Z_RcFcwlDWce4jRalgFOou3yjfrXosXfCx2ySplccUTomuVni7URqgkaFrytdXs",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDsRayMEAab_Rvn-ZKJoYxJ4KuZfFdaKvCP0BRRWI3YSGJp5QpzF6BwaQbojgaINUicOizRH8HwsuQ5xdYMxF1n7Kk4WccnG4u7QoI7azo1lPdEV6FOhi6n3qbOCF9n6N26EFSRbl4C_6oazhBr6gxnNRvKod6JULuI4yHLtqMmncDhJ5yb957vZix3owp5wDEx1xW6Y3rmdh7Qq9YTgcIJlAUicfJBSUuD_Ng5l9vSMzHkDAU77I_CuU_XBUGn6txSNeherfVfMdIG",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCkL8zb_7llZX0kn_yyCNctXTsACdI1urlFOj_paqU4W7vzTHyFiIe8Lf4E3eEFJp1ZzgX2jE-sBY_yjx1alf9324oxXZK7HTnWVNB2tNBd1wgqOzKrl14jVqdtebhvjiUeeZHNRnFdhi-xC9hlvMnQrLR6BEnQ3VymANAbYBeX2Uu8bXF_qq3e0twttRcTGy-m2pKxXis3Y4bsvmYfgkWSUxWo6O9DlcDpWJ1Jyf93qkNt2WCX49pLLxJS34YKgCHi2-RXu9X247MN"
        ],
        colors: [
          { name: "Charcoal", hex: "#1b1b1b" },
          { name: "Slate", hex: "#4c4c4c" }
        ],
        materials: "3L Graphene Shell",
        waterproof: "20,000mm",
        breathability: "15,000g/m²",
        hardware: "Matte Cobalt YKK",
        seams: "Ultrasonic Welded"
      },
      {
        id: "architectural-blazer",
        name: "Architectural Blazer",
        slug: "architectural-blazer",
        sku: "APP-BZ-003",
        price: 950,
        stock: 12,
        category: "Outerwear",
        status: "Active",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCg8ZtOU_uiqG2KZwNs6txbcik_jozZZ-B16Kh8qXgdDLRUcp5-VBhIrJ9DWGQ_ma7w3qFycT8vp-_HpHLaLskpQw4bUfGzAh6YP0vTMFE1xyl17Xdp2gIyOMy0z3RX22KFKnUiQ1MEUtb-45vR0FUFV0OJ0yMe9KeXHlb5rzY1vrHr4I36tfbG5sSp1Zok1Pk0gpinLIsLtSMJrp4BgMYGhnpCpIqmG7ZXeqfDACbzPmmp7JtfP-Gcfz04WL4aUZX8Mjmbr5fjFGLQ",
        description: "An unstructured double-breasted jacket made from organic heavy linen blend. Form fits to follow straight geometric outlines.",
        sizes: ["S", "M", "L"],
        images: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCg8ZtOU_uiqG2KZwNs6txbcik_jozZZ-B16Kh8qXgdDLRUcp5-VBhIrJ9DWGQ_ma7w3qFycT8vp-_HpHLaLskpQw4bUfGzAh6YP0vTMFE1xyl17Xdp2gIyOMy0z3RX22KFKnUiQ1MEUtb-45vR0FUFV0OJ0yMe9KeXHlb5rzY1vrHr4I36tfbG5sSp1Zok1Pk0gpinLIsLtSMJrp4BgMYGhnpCpIqmG7ZXeqfDACbzPmmp7JtfP-Gcfz04WL4aUZX8Mjmbr5fjFGLQ"
        ],
        colors: [
          { name: "White", hex: "#ffffff" }
        ],
        materials: "Heavy Linen Blend",
        waterproof: "None",
        breathability: "High",
        hardware: "Tonal Buttons",
        seams: "Clean finished seams"
      },
      {
        id: "void-biker-jacket",
        name: "Void Biker Jacket",
        slug: "void-biker-jacket",
        sku: "APP-BJ-004",
        price: 2100,
        stock: 5,
        category: "Outerwear",
        status: "Active",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDczKpOmR2DnBjmU33JPt2zX9CzXzMeaHymVMFYqHCuVBBmzuM1IX_PzCLIVG1oeADnjhgJpAJxK9sebeUvg2aOrRVjhS2ve0p25P_7Cpk2awhObH3KP7dwvEEhZNiY3Zs_WJtiNAhEtUvPsoQV_Udk2YBRJEzyC9CaHqTp45WeGc04z9Oa58OVzbTz0NRc3d8Rqq1OtveLUOKseNtpzwWBbH7DD5Q_DQSORMe6gGf4MeIjLitQSrfNAYlYiGIfjwblRA-DQOcNnP6B",
        description: "Modern motorcycle style jacket in robust cowhide, designed with clean matte finishes and zero unnecessary lines.",
        sizes: ["S", "M", "L"],
        images: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDczKpOmR2DnBjmU33JPt2zX9CzXzMeaHymVMFYqHCuVBBmzuM1IX_PzCLIVG1oeADnjhgJpAJxK9sebeUvg2aOrRVjhS2ve0p25P_7Cpk2awhObH3KP7dwvEEhZNiY3Zs_WJtiNAhEtUvPsoQV_Udk2YBRJEzyC9CaHqTp45WeGc04z9Oa58OVzbTz0NRc3d8Rqq1OtveLUOKseNtpzwWBbH7DD5Q_DQSORMe6gGf4MeIjLitQSrfNAYlYiGIfjwblRA-DQOcNnP6B"
        ],
        colors: [
          { name: "Black", hex: "#000000" }
        ],
        materials: "100% Full-grain Cowhide Leather",
        waterproof: "Water-resistant coating",
        breathability: "Moderate",
        hardware: "Matte Black Steel Zippers",
        seams: "Reinforced double stitched seams"
      },
      {
        id: "translucent-shell",
        name: "Translucent Shell",
        slug: "translucent-shell",
        sku: "APP-TS-005",
        price: 780,
        stock: 20,
        category: "Outerwear",
        status: "Active",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCePAGW5LfgIWxsQhog7lJXCYoR3ltubazkI1JIyDKEOqfDBH3BC-tizBiz0yq845DKDGVOLu3Oc76rZ8TwXxrI1s8kXVI2530ssZxAkvnSere06c6VJnELpVwwMvb0zpEJbWRWgVmzTf24abqg7CzyX9mpKftf4sVC1pYfN_lrjT0xZFPGHhL1RKscoWXuu0WfYi_RteT8er8e2G3KW8hSibS2IBPYGd4noghfhE5fkUw8GNaOB-dHdV__g-E0X_FY-Qoyc8KnycTU",
        description: "Semi-transparent water-resistant layer, ultra-lightweight and packable, displaying underlying garment layouts.",
        sizes: ["S", "M", "L"],
        images: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCePAGW5LfgIWxsQhog7lJXCYoR3ltubazkI1JIyDKEOqfDBH3BC-tizBiz0yq845DKDGVOLu3Oc76rZ8TwXxrI1s8kXVI2530ssZxAkvnSere06c6VJnELpVwwMvb0zpEJbWRWgVmzTf24abqg7CzyX9mpKftf4sVC1pYfN_lrjT0xZFPGHhL1RKscoWXuu0WfYi_RteT8er8e2G3KW8hSibS2IBPYGd4noghfhE5fkUw8GNaOB-dHdV__g-E0X_FY-Qoyc8KnycTU"
        ],
        colors: [
          { name: "Frost", hex: "#e2e8f0" }
        ],
        materials: "100% Dyneema Composite Fabric",
        waterproof: "10,000mm",
        breathability: "25,000g/m²",
        hardware: "Waterproof Coil Zipper",
        seams: "Fully bonded seams"
      },
      {
        id: "volume-overcoat",
        name: "Volume Overcoat",
        slug: "volume-overcoat",
        sku: "APP-VO-006",
        price: 1450,
        stock: 6,
        category: "Outerwear",
        status: "Active",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiNVIRX7blr872PFvnvfOVUEuQlE5uHKbo6AJza7qIBfWZMMdoE4qrBuxsri4WjzujH-3zjhlvMW2_OsS_Q_zVQgDjx6JZDFzP0Ciu-yP82kE7Q5JSrAfW2s7FtmxoA3nbG6ZRSSyIYF-SQ2NqbLVBhqJS4xyzJKK_0wUQIH56tymIgwbUoW5TCIyg8d0M19LaBrQosDY1wEuATb7eYW-VSUwEmWsclWyUPx3EGKMlSTw3LIidxbR68TdsQK7jIfNUEOA6nwfKlo5b",
        description: "Brutalist oversized coat silhouette, tailored shoulder lines, structured back panel drape.",
        sizes: ["S", "M", "L", "XL"],
        images: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDiNVIRX7blr872PFvnvfOVUEuQlE5uHKbo6AJza7qIBfWZMMdoE4qrBuxsri4WjzujH-3zjhlvMW2_OsS_Q_zVQgDjx6JZDFzP0Ciu-yP82kE7Q5JSrAfW2s7FtmxoA3nbG6ZRSSyIYF-SQ2NqbLVBhqJS4xyzJKK_0wUQIH56tymIgwbUoW5TCIyg8d0M19LaBrQosDY1wEuATb7eYW-VSUwEmWsclWyUPx3EGKMlSTw3LIidxbR68TdsQK7jIfNUEOA6nwfKlo5b"
        ],
        colors: [
          { name: "Ash", hex: "#8e8e8e" }
        ],
        materials: "Felted Wool Blend",
        waterproof: "Semi-waterproof treatment",
        breathability: "Highly Breathable",
        hardware: "Custom Snaps",
        seams: "Taped interior seams"
      }
    ]);

    // Seed Orders
    setOrders([
      {
        id: "AS-94210",
        customerName: "Theodore Sterling",
        customerImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtiaf3qaq4VXrXI5zfTURBHi4nlnUKFBWfp0_u9NePEa5VKLkdcbUeqh3v7XST4wZd86-pc3b4p62z7sw3FuOQ5ClPy4xHW9Q_Rv0NNIHl5UrmL0VD7wngDkxDEfbGz_1JhBLDYIh_dzJ6XqkFxY8xb41YV6ptKQ3nvwVEuSMr0vw_pLc_bnvhXLxU6QMV_rv1-p6Fy5pxMbRm2-R0bW9eVpGogGF7rjaaHOLBKDDwNS9S1f7CcalOeDfNaUc9BCJWjZm3gui0uiUF",
        date: "Aug 24, 2024",
        itemsCount: 4,
        totalPrice: 12450,
        status: "PROCESSING",
        items: "Carrara Monolith x1, Brutalist Oak Plinth x1",
      },
      {
        id: "AS-94209",
        customerName: "Elena Marcovich",
        customerImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVaNSmll6LCwVsQfuLcTD4WBfKK-Qy2RuS3dH0nys0F6BMriHbHNPFJeyUzYI65xE_R2WHKkZuDEHH2fXfwtqLbmJQI91pL60iGRkKyh4aVjOpQq9vnhWlUQysWlItsgDexwjKf0t8V5zdQ0hwNYneaOid2Z8BypHBTJNNsV0nL1pe5ioJD3PfY_Zf_BGMdE9xIC8JXWQAK5wJ97Gp_Pi7yGGyxnnFTzCbn1B4S8rxc-9ZKYfkJhouAOifInQvxavwUGhI3hHdOCbc",
        date: "Aug 23, 2024",
        itemsCount: 1,
        totalPrice: 8200,
        status: "PENDING",
        items: "Obsidian Velvet Panel x1",
      },
      {
        id: "AS-94208",
        customerName: "Julian Rossi",
        customerImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-3GQVoZdSHuazzGCjFfYoHY3bonAD08MAghW6zXMEsWEynq32P26Q5fr55BZUO4KWCYf52979SHkE3ju_V-SjrAPbErb9CScTKh0WwdL_kjJwnHWpqkFXBycyXAk4CEm5stZ03B8dz3DKT5Boss7PDs4tfthJlDHQcsOk2u8uEd7MfvBAF9828yNotz3-_gb83mPMqfn7X8dwdGdEJuawuiYDX1ScmqiyrMXr0-q-AgcPymJH-eqEW1-3-T4RmjkOl9QKQwcFM9OD",
        date: "Aug 22, 2024",
        itemsCount: 2,
        totalPrice: 25000,
        status: "SHIPPED",
        items: "Carrara Monolith x2",
      },
      {
        id: "AS-94207",
        customerName: "Sophia Chen",
        customerImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3e0igEwbj_tNa8vazMMWnfYUR0sdgHuWDauvR3now53TbzNDokN_387Mud5S8FqAEribKuPk88WY-ZxriqThi6knMO4h4-0TnfnBCd0AtvrZRmjKhNQUgckLilxFRsk0X7CWHznpo6swuLkRMYUT5ueno5yBGQuE_zRVDIzbu3RD1YsdwpVEGpJJfw0uvRmjGr9YPebL3D1bdhhE5erD2Eau53ugDCXQDTug8491IXfnMTkC093O1LW9YMK_aCstV3muk89Rvi7Li",
        date: "Aug 21, 2024",
        itemsCount: 3,
        totalPrice: 5100,
        status: "COMPLETED",
        items: "Lucent Glass Divider x1",
      },
    ]);

    // Seed Community Feedback
    setFeedbackItems([
      {
        id: "fb-1",
        text: "Aesthete represents more than apparel. It’s a deliberate study of form, function, and the silence of exceptional design.",
        author: "Elena Vorski",
        location: "Architectural Critic",
        approved: true,
      },
      {
        id: "fb-2",
        text: "The silhouette of the trench coat is unmatched. Pure architectural bliss.",
        author: "Anonymous",
        location: "London",
        approved: true,
      },
      {
        id: "fb-3",
        text: "Obsessed with the monochromatic palette. It makes getting ready every morning an exercise in effortless luxury.",
        author: "Verified Buyer",
        location: "Tokyo",
        approved: true,
      },
      {
        id: "fb-4",
        text: "Beautiful layout, stunning materials. Their Carrara Monolith feels like a sculptural centerpiece.",
        author: "Marcus Vance",
        location: "Berlin",
        approved: false,
      },
    ]);

    // Seed Spatial Installations / Architecture
    setInstallations([
      {
        id: "inst-1",
        title: "Concrete Pavilion",
        location: "Zurich, Switzerland",
        status: "Completed",
        structure: "Pre-cast Ribbed Concrete Frame",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCp6QZIiVQRbMggm-lmpw7svtnVkfPggJxGRSiFo65K3y4_f84eKpYLP-6AQrmDjib3fIwNIj-PYi2tT03gVbMtcCnRs2y4Gf1l8mthPGQR-dHY5aqwDknnkJD27z5AzbtIVA39YgIlfdp1JwI_u3aX_dEFkYegK2W0t0B3blu0O7krkp4cZtmx3cs0i7UknRwJCw4A61kvlI7y7Gk4U5cJ8-A8yN-N17jMySDHwd2hI-SxnQeeG7Bh45rj2hEraLjj7tNagS-i6NKM",
      },
      {
        id: "inst-2",
        title: "Monolithic Void",
        location: "Kyoto, Japan",
        status: "In Progress",
        structure: "Poured Concrete & Basalt Inlays",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNVuRwR-HDXuwncIMmkOYzlw6uHIkLQm__rl7GOA-bB-qIwAYdcQE58MjtPDWnua2Ih5PViCli_e4wHbJnlYniFt4rZ62ChCfy2PglhBgS4ag0D_TM4_BgfIAOy1rHDQ3WtetxXlVSEek59BrueM3Oq-J4USYYC96igJoak67jxcLUWpsZqIz0Ylqg4C889Q7NtWUWJUWPbWQRVCRNproHnGIOhLD41VtBXwAvtC0_zoPA1hI3ApgirEmE1MWQ2PKTWmP6NBpgtFCo",
      },
      {
        id: "inst-3",
        title: "Lucent Divide",
        location: "Milano, Italy",
        status: "Concept",
        structure: "Tempered Glass & Tension Steel Cables",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEExuJ64esSmbamVGgCA4t4CmOzka0zAab_r6fxE7Wl7WvTd_wCd0FYP0QZum5jc83gQZ6jUqnadPoJI1DmkScp9rHWewOKfNHt_GaO9hhhJviBslXcM5eM9PITnjr0MS-V46q8CzV4wzZHv2q6eDYbuo0ineE_T_fkNzn8vbRCPu5r1voj2--402mbaK5C7YOeHkwbTvpa_SzC5kXlp62E0EffQ_92fqaq9HeSMwdKTeNyTgQUtExnURRr36gkMJvcHAOr-HMjCkF",
      },
    ]);
  }, []);

  const addProduct = (newProd: Omit<Product, "id" | "sku">) => {
    const nextId = `prod-${Date.now()}`;
    const nextSku = `SKU-${newProd.category.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const product: Product = {
      ...newProd,
      id: nextId,
      sku: nextSku,
    };
    setProducts((prev) => [product, ...prev]);
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateCmsData = (updatedFields: Partial<CmsData>) => {
    setCmsData((prev) => ({ ...prev, ...updatedFields }));
  };

  const toggleFeedbackApproval = (id: string) => {
    setFeedbackItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, approved: !item.approved } : item))
    );
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  const addInstallation = (inst: Omit<Installation, "id">) => {
    const id = `inst-${Date.now()}`;
    setInstallations((prev) => [...prev, { ...inst, id }]);
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        orders,
        cmsData,
        feedbackItems,
        installations,
        addProduct,
        updateProduct,
        deleteProduct,
        updateCmsData,
        toggleFeedbackApproval,
        updateOrderStatus,
        addInstallation,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
