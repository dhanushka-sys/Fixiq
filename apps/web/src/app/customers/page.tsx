'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Laptop,
  ArrowRight,
} from 'lucide-react';

const CUSTOMERS_DATA = [
  {
    id: 'CUST-001',
    name: 'Vertex Corp (Enterprise IT)',
    contactPerson: 'David Miller',
    email: 'dmiller@vertexcorp.com',
    phone: '+1 (555) 392-1049',
    devicesCount: 38,
    activeRepairs: 3,
    status: 'ENTERPRISE',
  },
  {
    id: 'CUST-002',
    name: 'Apex Logistics LLC',
    contactPerson: 'Elena Rostova',
    email: 'elena@apexlogistics.io',
    phone: '+1 (555) 782-9921',
    devicesCount: 16,
    activeRepairs: 1,
    status: 'BUSINESS',
  },
  {
    id: 'CUST-003',
    name: 'Dr. Silva Medical Clinic',
    contactPerson: 'Dr. Marcus Silva',
    email: 'marcus@silvaclinic.org',
    phone: '+1 (555) 881-2041',
    devicesCount: 5,
    activeRepairs: 1,
    status: 'INDIVIDUAL',
  },
  {
    id: 'CUST-004',
    name: 'TechCare Warranty Services',
    contactPerson: 'Sarah Jenkins',
    email: 'claims@techcare.net',
    phone: '+1 (555) 431-8902',
    devicesCount: 84,
    activeRepairs: 4,
    status: 'PARTNER',
  },
];

export default function CustomersPage() {
  const [search, setSearch] = useState('');

  const filtered = CUSTOMERS_DATA.filter(
    (c) =>
      search === '' ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
              <Users className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Customers &amp; Accounts
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {CUSTOMERS_DATA.length} Active Accounts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Client directory, warranty service contracts, and fleet repair histories.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((customer) => (
          <div
            key={customer.id}
            className="glass-card p-5 sm:p-6 rounded-2xl space-y-4 hover:border-emerald-400/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {customer.id}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {customer.name}
                  </h3>
                  <span className="text-xs text-slate-500">Contact: {customer.contactPerson}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                  {customer.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{customer.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <span className="text-slate-500 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-white">{customer.devicesCount}</strong> Devices
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {customer.activeRepairs} On Bench
                </span>
              </div>
              <Link
                href="/repairs"
                className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center space-x-1"
              >
                <span>View Jobs</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
