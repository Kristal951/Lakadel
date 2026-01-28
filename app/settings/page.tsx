"use client";

import React from "react";
import {
  FiUser,
  FiLock,
  FiBell,
  FiTrash2,
} from "react-icons/fi";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 mt-18">
      <h1 className="text-3xl font-bold mb-10">Settings</h1>

      <div className="space-y-14">
        <section>
          <div className="flex items-center gap-2 mb-4 text-foreground/70">
            <FiUser />
            <h2 className="text-xl font-semibold">Public Profile</h2>
          </div>

          <div className="grid gap-4 p-6 border border-foreground/10 rounded-2xl bg-foreground/2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Display Name</label>
              <input
                type="text"
                placeholder="Your Name"
                className="px-4 py-2 rounded-lg border border-foreground/20 bg-background"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Email Address</label>
              <input
                type="email"
                placeholder="user@example.com"
                className="px-4 py-2 rounded-lg border border-foreground/20 bg-background"
              />
            </div>
          </div>
        </section>

        {/* ================= SECURITY ================= */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-foreground/70">
            <FiLock />
            <h2 className="text-xl font-semibold">Security</h2>
          </div>

          <div className="p-6 border border-foreground/10 rounded-2xl space-y-3">
            <button className="px-4 py-2 bg-foreground text-background rounded-lg font-medium">
              Change Password
            </button>
            <p className="text-sm text-foreground/50">
              Last changed 3 months ago
            </p>
          </div>
        </section>

        {/* ================= NOTIFICATIONS ================= */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-foreground/70">
            <FiBell />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          <div className="grid gap-4 p-6 border border-foreground/10 rounded-2xl bg-foreground/2">
            {[
              ["Order updates", "Get notified about order status"],
              ["Promotions & discounts", "Receive offers and sales alerts"],
              ["Account activity", "Security & login alerts"],
            ].map(([title, desc]) => (
              <label
                key={title}
                className="flex items-center justify-between gap-4"
              >
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-foreground/50">{desc}</p>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-foreground"
                />
              </label>
            ))}
          </div>
        </section>

        {/* ================= APPEARANCE ================= */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground/70">
            Appearance
          </h2>

          <div className="p-6 border border-foreground/10 rounded-2xl">
            <label className="text-sm font-medium mb-2 block">Theme</label>
            <select className="w-full px-4 py-2 rounded-lg border border-foreground/20 bg-background">
              <option>System</option>
              <option>Light</option>
              <option>Dark</option>
            </select>
          </div>
        </section>

        {/* ================= BILLING INFORMATION ================= */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground/70">
            Billing Information
          </h2>

          <div className="grid gap-6 p-6 border border-foreground/10 rounded-2xl bg-foreground/2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="px-4 py-2 rounded-lg border border-foreground/20 bg-background"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Street Address</label>
              <input
                type="text"
                placeholder="123 Main Street"
                className="px-4 py-2 rounded-lg border border-foreground/20 bg-background"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">City</label>
                <input
                  type="text"
                  placeholder="Lagos"
                  className="px-4 py-2 rounded-lg border border-foreground/20 bg-background"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">State</label>
                <input
                  type="text"
                  placeholder="Lagos State"
                  className="px-4 py-2 rounded-lg border border-foreground/20 bg-background"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">ZIP / Postal Code</label>
                <input
                  type="text"
                  placeholder="100001"
                  className="px-4 py-2 rounded-lg border border-foreground/20 bg-background"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Country</label>
              <select className="px-4 py-2 rounded-lg border border-foreground/20 bg-background">
                <option>Nigeria</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Phone Number</label>
              <input
                type="tel"
                placeholder="+234 801 234 5678"
                className="px-4 py-2 rounded-lg border border-foreground/20 bg-background"
              />
            </div>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-5 h-5 accent-foreground"
              />
              <span className="text-sm">
                Use this as my default billing address
              </span>
            </label>
          </div>
        </section>

        {/* ================= ACTIVE SESSIONS ================= */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-foreground/70">
            <FiLock />
            <h2 className="text-xl font-semibold">Active Sessions</h2>
          </div>

          <div className="p-6 border border-foreground/10 rounded-2xl">
            <p className="text-sm text-foreground/50 mb-4">
              You’re logged in on 2 devices
            </p>
            <button className="px-4 py-2 border rounded-lg hover:bg-foreground hover:text-background transition">
              Log out of all devices
            </button>
          </div>
        </section>

        {/* ================= DANGER ZONE ================= */}
        <section className="pt-6 border-t border-red-100">
          <div className="flex items-center gap-2 mb-4 text-red-600">
            <FiTrash2 />
            <h2 className="text-xl font-semibold">Danger Zone</h2>
          </div>

          <div className="p-6 border border-red-100 rounded-2xl bg-red-50/30">
            <p className="text-sm text-red-600/80 mb-4">
              Once you delete your account, there is no going back.
            </p>
            <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg font-medium hover:bg-red-600 hover:text-white transition">
              Delete Account
            </button>
          </div>
        </section>
      </div>

      {/* ================= SAVE ================= */}
      <div className="mt-16 flex justify-end">
        <button className="px-10 py-3 bg-foreground text-background rounded-full font-bold hover:scale-105 active:scale-95 transition-transform">
          Save Changes
        </button>
      </div>
    </div>
  );
}
