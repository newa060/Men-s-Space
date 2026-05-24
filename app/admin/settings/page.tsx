"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopNavBar from "@/components/layout/TopNavBar";
import { AdminImageField } from "@/components/admin/AdminImageField";

type Tab = "account" | "users" | "store";

interface AdminProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl: string;
  role: string;
}

interface UserRow {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl: string;
  role: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("account");

  // ── Account state ──────────────────────────────────────────
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountMsg, setAccountMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ── Users state ────────────────────────────────────────────
  const [users, setUsers] = useState<UserRow[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "customer" | "admin">("all");

  // ── Store state ────────────────────────────────────────────
  const [storeName, setStoreName] = useState("");
  const [storeTagline, setStoreTagline] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeInstagram, setStoreInstagram] = useState("");
  const [storeTwitter, setStoreTwitter] = useState("");
  const [storeFacebook, setStoreFacebook] = useState("");
  const [storeLocationUrl, setStoreLocationUrl] = useState("");
  const [storeSaving, setStoreSaving] = useState(false);
  const [storeMsg, setStoreMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Load admin profile
  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((json) => {
        if (json.data?.user) {
          const u = json.data.user;
          setProfile(u);
          setFullName(u.fullName || "");
          setPhone(u.phone || "");
          setAvatarUrl(u.avatarUrl || "");
        }
      });
  }, []);

  // Load users when tab is active
  useEffect(() => {
    if (activeTab !== "users") return;
    setUsersLoading(true);
    fetch("/api/admin/settings/users")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setUsers(json.data);
      })
      .finally(() => setUsersLoading(false));
  }, [activeTab]);

  // Load store settings from CMS
  useEffect(() => {
    if (activeTab !== "store") return;
    fetch("/api/admin/cms")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          const d = json.data;
          setStoreName(d.storeName || "Aesthete Studio");
          setStoreTagline(d.storeTagline || "");
          setStoreEmail(d.storeEmail || "");
          setStorePhone(d.storePhone || "");
          setStoreInstagram(d.storeInstagram || "");
          setStoreTwitter(d.storeTwitter || "");
          setStoreFacebook(d.storeFacebook || "");
          setStoreLocationUrl(d.storeLocationUrl || "");
        }
      });
  }, [activeTab]);

  // Save account
  const handleSaveAccount = async () => {
    setAccountSaving(true);
    setAccountMsg(null);
    try {
      const res = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone, avatarUrl }),
      });
      const json = await res.json();
      if (json.success) {
        setAccountMsg({ type: "success", text: "Profile updated successfully." });
        setProfile((prev) => prev ? { ...prev, fullName, phone, avatarUrl } : prev);
      } else {
        setAccountMsg({ type: "error", text: json.error || "Failed to update profile." });
      }
    } catch {
      setAccountMsg({ type: "error", text: "An unexpected error occurred." });
    } finally {
      setAccountSaving(false);
      setTimeout(() => setAccountMsg(null), 3000);
    }
  };

  // Save store settings
  const handleSaveStore = async () => {
    setStoreSaving(true);
    setStoreMsg(null);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeName, storeTagline, storeEmail, storePhone, storeInstagram, storeTwitter, storeFacebook, storeLocationUrl }),
      });
      const json = await res.json();
      if (json.success) {
        setStoreMsg({ type: "success", text: "Store settings saved." });
      } else {
        setStoreMsg({ type: "error", text: json.error || "Failed to save." });
      }
    } catch {
      setStoreMsg({ type: "error", text: "An unexpected error occurred." });
    } finally {
      setStoreSaving(false);
      setTimeout(() => setStoreMsg(null), 3000);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const initials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopNavBar
        breadcrumbs={[
          { label: "Console", href: "/admin/dashboard" },
          { label: "Settings" },
        ]}
      />

      <main className="flex-1 flex flex-col">
        {/* Header & Tabs */}
        <div className="px-10 pt-8 border-b border-outline-variant bg-surface sticky top-0 z-30 space-y-6">
          <div>
            <h2 className="text-[28px] font-light text-on-surface italic font-serif mb-1">Settings</h2>
            <p className="text-[13px] text-on-surface-variant">
              Manage your account, users, and store configuration.
            </p>
          </div>
          <div className="flex gap-8 border-b border-outline-variant/30">
            {([
              { key: "account", label: "My Account", icon: "manage_accounts" },
              { key: "users", label: "User Management", icon: "group" },
              { key: "store", label: "Store Settings", icon: "storefront" },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase pb-4 transition-colors relative ${
                  activeTab === tab.key
                    ? "text-primary border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-10 flex-1 max-w-4xl">
          <AnimatePresence mode="wait">

            {/* ── ACCOUNT TAB ─────────────────────────────────── */}
            {activeTab === "account" && (
              <motion.section
                key="account"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-[20px] font-light text-on-surface italic font-serif mb-1">My Account</h3>
                  <p className="text-[13px] text-on-surface-variant">Update your admin profile information.</p>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full border-2 border-outline-variant overflow-hidden bg-surface-container-high flex items-center justify-center flex-shrink-0">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[22px] font-bold text-on-surface-variant">
                        {initials(fullName || profile?.email || "A")}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant mb-2">
                      Profile Avatar
                    </p>
                    <AdminImageField
                      value={avatarUrl}
                      onChange={setAvatarUrl}
                      aspectClass="aspect-square"
                      folder="avatars"
                      emptyLabel="Upload avatar"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-surface-container border border-outline-variant text-on-surface p-3 text-[13px] focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-surface-container border border-outline-variant text-on-surface p-3 text-[13px] focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile?.email || ""}
                      disabled
                      className="bg-surface-container border border-outline-variant text-on-surface-variant p-3 text-[13px] opacity-50 cursor-not-allowed"
                    />
                    <p className="text-[10px] text-on-surface-variant opacity-50">Email cannot be changed here.</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Role
                    </label>
                    <input
                      type="text"
                      value={profile?.role || "admin"}
                      disabled
                      className="bg-surface-container border border-outline-variant text-on-surface-variant p-3 text-[13px] opacity-50 cursor-not-allowed capitalize"
                    />
                  </div>
                </div>

                {accountMsg && (
                  <div className={`px-4 py-3 text-[12px] font-semibold tracking-wide border ${
                    accountMsg.type === "success"
                      ? "bg-tertiary/10 border-tertiary/30 text-tertiary"
                      : "bg-error/10 border-error/30 text-error"
                  }`}>
                    {accountMsg.text}
                  </div>
                )}

                <button
                  onClick={handleSaveAccount}
                  disabled={accountSaving}
                  className="px-8 py-3 bg-primary text-on-primary text-[11px] font-bold tracking-widest uppercase hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  {accountSaving ? "Saving..." : "Save Changes"}
                </button>
              </motion.section>
            )}

            {/* ── USERS TAB ───────────────────────────────────── */}
            {activeTab === "users" && (
              <motion.section
                key="users"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-[20px] font-light text-on-surface italic font-serif mb-1">User Management</h3>
                  <p className="text-[13px] text-on-surface-variant">View all registered users and their activity.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-50 text-[18px]">
                      search
                    </span>
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search by name or email..."
                      className="w-full bg-surface-container border border-outline-variant text-on-surface pl-10 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex gap-2">
                    {(["all", "customer", "admin"] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setRoleFilter(r)}
                        className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase border transition-all ${
                          roleFilter === r
                            ? "border-primary text-primary bg-primary/5"
                            : "border-outline-variant text-on-surface-variant hover:border-outline"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Total Users", value: users.length },
                    { label: "Customers", value: users.filter((u) => u.role === "customer").length },
                    { label: "Admins", value: users.filter((u) => u.role === "admin").length },
                  ].map((s) => (
                    <div key={s.label} className="bg-surface-container-low border border-outline-variant p-4">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">{s.label}</p>
                      <p className="text-[24px] font-light text-on-surface font-serif">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Table */}
                <div className="bg-surface border border-outline-variant overflow-hidden">
                  {usersLoading ? (
                    <div className="py-16 text-center text-[13px] text-on-surface-variant">
                      <span className="material-symbols-outlined text-[32px] block mb-2 opacity-30 animate-spin">progress_activity</span>
                      Loading users...
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-surface-container-low border-b border-outline-variant">
                          <tr>
                            {["User", "Email", "Phone", "Role", "Orders", "Total Spent", "Joined"].map((h, i) => (
                              <th
                                key={h}
                                className={`px-5 py-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ${
                                  i >= 4 ? "text-right" : ""
                                }`}
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant/30">
                          {filteredUsers.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-5 py-12 text-center text-[13px] text-on-surface-variant">
                                No users found.
                              </td>
                            </tr>
                          ) : (
                            filteredUsers.map((u) => (
                              <tr key={u.id} className="hover:bg-primary/5 transition-colors">
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant overflow-hidden flex items-center justify-center flex-shrink-0">
                                      {u.avatarUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={u.avatarUrl} alt={u.fullName} className="w-full h-full object-cover" />
                                      ) : (
                                        <span className="text-[10px] font-bold text-on-surface-variant">
                                          {initials(u.fullName)}
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[13px] text-on-surface font-medium">{u.fullName}</span>
                                  </div>
                                </td>
                                <td className="px-5 py-4 text-[12px] text-on-surface-variant">{u.email}</td>
                                <td className="px-5 py-4 text-[12px] text-on-surface-variant">{u.phone || "—"}</td>
                                <td className="px-5 py-4">
                                  <span className={`px-2.5 py-1 text-[9px] font-bold tracking-widest uppercase rounded-full border ${
                                    u.role === "admin"
                                      ? "bg-primary/10 text-primary border-primary/20"
                                      : "bg-outline/10 text-on-surface-variant border-outline/20"
                                  }`}>
                                    {u.role}
                                  </span>
                                </td>
                                <td className="px-5 py-4 text-[13px] text-on-surface text-right font-medium">{u.orderCount}</td>
                                <td className="px-5 py-4 text-[13px] text-primary text-right font-semibold">
                                  ${u.totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                </td>
                                <td className="px-5 py-4 text-[12px] text-on-surface-variant text-right">
                                  {new Date(u.createdAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "2-digit",
                                    year: "numeric",
                                  })}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </motion.section>
            )}

            {/* ── STORE TAB ───────────────────────────────────── */}
            {activeTab === "store" && (
              <motion.section
                key="store"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-[20px] font-light text-on-surface italic font-serif mb-1">Store Settings</h3>
                  <p className="text-[13px] text-on-surface-variant">Configure your store identity and contact details.</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Store Name
                      </label>
                      <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="bg-surface-container border border-outline-variant text-on-surface p-3 text-[13px] focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={storeTagline}
                        onChange={(e) => setStoreTagline(e.target.value)}
                        className="bg-surface-container border border-outline-variant text-on-surface p-3 text-[13px] focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="border-t border-outline-variant pt-6">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant mb-4">Contact Information</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          value={storeEmail}
                          onChange={(e) => setStoreEmail(e.target.value)}
                          placeholder="hello@aesthete.com"
                          className="bg-surface-container border border-outline-variant text-on-surface p-3 text-[13px] focus:outline-none focus:border-primary placeholder:text-on-surface-variant/30"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                          Contact Phone
                        </label>
                        <input
                          type="text"
                          value={storePhone}
                          onChange={(e) => setStorePhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="bg-surface-container border border-outline-variant text-on-surface p-3 text-[13px] focus:outline-none focus:border-primary placeholder:text-on-surface-variant/30"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-outline-variant pt-6">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant mb-4">Location</p>
                    <div className="grid grid-cols-1 gap-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                          <span className="material-symbols-outlined text-[14px]">map</span>
                          Google Maps URL
                        </label>
                        <input
                          type="text"
                          value={storeLocationUrl}
                          onChange={(e) => setStoreLocationUrl(e.target.value)}
                          placeholder="https://maps.google.com/?q=..."
                          className="bg-surface-container border border-outline-variant text-on-surface p-3 text-[13px] focus:outline-none focus:border-primary placeholder:text-on-surface-variant/30"
                        />
                        <p className="text-[10px] text-on-surface-variant/50">Paste the full Google Maps link for your store. Customers will be redirected here when they click the map.</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-outline-variant pt-6">
                    <p className="text-[11px] font-bold tracking-widest uppercase text-on-surface-variant mb-4">Social Links</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                          <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                          Instagram
                        </label>
                        <input
                          type="text"
                          value={storeInstagram}
                          onChange={(e) => setStoreInstagram(e.target.value)}
                          placeholder="@aesthete.studio"
                          className="bg-surface-container border border-outline-variant text-on-surface p-3 text-[13px] focus:outline-none focus:border-primary placeholder:text-on-surface-variant/30"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                          <span className="material-symbols-outlined text-[14px]">tag</span>
                          Twitter / X
                        </label>
                        <input
                          type="text"
                          value={storeTwitter}
                          onChange={(e) => setStoreTwitter(e.target.value)}
                          placeholder="@aesthete"
                          className="bg-surface-container border border-outline-variant text-on-surface p-3 text-[13px] focus:outline-none focus:border-primary placeholder:text-on-surface-variant/30"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                          <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                          Facebook
                        </label>
                        <input
                          type="text"
                          value={storeFacebook}
                          onChange={(e) => setStoreFacebook(e.target.value)}
                          placeholder="facebook.com/aesthete"
                          className="bg-surface-container border border-outline-variant text-on-surface p-3 text-[13px] focus:outline-none focus:border-primary placeholder:text-on-surface-variant/30"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {storeMsg && (
                  <div className={`px-4 py-3 text-[12px] font-semibold tracking-wide border ${
                    storeMsg.type === "success"
                      ? "bg-tertiary/10 border-tertiary/30 text-tertiary"
                      : "bg-error/10 border-error/30 text-error"
                  }`}>
                    {storeMsg.text}
                  </div>
                )}

                <button
                  onClick={handleSaveStore}
                  disabled={storeSaving}
                  className="px-8 py-3 bg-primary text-on-primary text-[11px] font-bold tracking-widest uppercase hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  {storeSaving ? "Saving..." : "Save Store Settings"}
                </button>
              </motion.section>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
