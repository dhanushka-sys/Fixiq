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
  X,
  Building,
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
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const statuses = ['ALL', 'ENTERPRISE', 'BUSINESS', 'PARTNER', 'INDIVIDUAL'];

  const filtered = CUSTOMERS_DATA.filter((c) => {
    const matchesSearch =
      search === '' ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <span>Repair Operations</span>
            <span>•</span>
            <span>Accounts &amp; Fleets</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Customers &amp; Accounts
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Client directory, warranty service contracts, and fleet repair histories.
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/repairs"
          className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm hover:shadow-emerald-500/20 transition-all flex items-center justify-center space-x-2 self-start sm:self-auto active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New Customer Intake</span>
        </Link>
      </div>

      {/* Status Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedStatus === st
                  ? 'bg-emerald-600 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {st === 'ALL' ? 'All Accounts' : st}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer, email, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/30 space-y-3">
          <Users className="h-8 w-8 mx-auto text-slate-400 opacity-50" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No accounts found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            No customers match &ldquo;{search}&rdquo;. Try another name or clear your filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedStatus('ALL');
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {filtered.map((customer) => (
          <div
            key={customer.id}
            className="glass-card p-5 sm:p-6 rounded-2xl space-y-4 hover:border-emerald-400/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
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

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <a
                  href={`mailto:${customer.email}`}
                  className="flex items-center space-x-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </a>
                <a
                  href={`tel:${customer.phone}`}
                  className="flex items-center space-x-2 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{customer.phone}</span>
                </a>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <span className="text-slate-500">
                  <strong className="text-slate-900 dark:text-white">{customer.devicesCount}</strong> Devices
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {customer.activeRepairs} Active
                </span>
              </div>

              <Link
                href="/repairs"
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-bold flex items-center space-x-1"
              >
                <span>View Repairs</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
