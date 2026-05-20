import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
  Plus,
  Trash2,
  Edit3,
  Check,
  Layers,
  Tv,
  Sparkles,
  Loader2,
  FileText,
  AlertTriangle,
  X,
  Search,
  ChevronDown,
  QrCode,
  Upload,
  CreditCard,
  Eye,
  ShieldCheck,
  ShieldX,
  Clock
} from 'lucide-react';
import {
  useBrands,
  useCreateBrand,
  useUpdateBrand,
  useDeleteBrand,
  usePacks,
  useCreatePack,
  useUpdatePack,
  useDeletePack
} from '../hooks/useOTT';
import type { OTTBrandData, PackData } from '../hooks/useOTT';
import { useGetPayments, useVerifyPayment } from '../hooks/usePayment';
import type { PaymentRecord } from '../hooks/usePayment';
import { useToast } from '../context/ToastContext';
import type { ToastType } from '../context/ToastContext';
import { CATEGORY_COLORS, GLOBAL_STRINGS } from '../constants/theme';
import { useSettings, useUpdatePaymentQr } from '../hooks/useSettings';

type Tab = 'overview' | 'brands' | 'packs' | 'payment-config';

export const AnalyticsSpace: React.FC = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // ==================== BRANDS STATE & MUTATIONS ====================
  const { data: allBrands, isLoading: loadingBrands } = useBrands();
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredBrands = allBrands?.filter(brand => {
    const matchesCategory = !selectedCategoryFilter || brand.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
    const matchesSearch = !searchTerm ||
      brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (brand.description && brand.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
  const createBrandMutation = useCreateBrand();
  const updateBrandMutation = useUpdateBrand();
  const deleteBrandMutation = useDeleteBrand();

  const [brandForm, setBrandForm] = useState({
    name: '',
    category: 'entertainment',
    logo: '',
    description: ''
  });
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [deletingBrand, setDeletingBrand] = useState<OTTBrandData | null>(null);

  // ==================== PACKS STATE & MUTATIONS ====================
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('');
  const { data: allPacks, isLoading: loadingPacks } = usePacks(selectedBrandFilter || undefined);

  // Also fetch all packs regardless of brand for general management when filter is empty
  const { data: generalPacks } = usePacks();

  const createPackMutation = useCreatePack();
  const updatePackMutation = useUpdatePack();
  const deletePackMutation = useDeletePack();

  const [packForm, setPackForm] = useState({
    brand: '',
    title: '',
    price: 0,
    originalPrice: 0,
    validity: '30 Days',
    features: '',
    description: ''
  });
  const [editingPackId, setEditingPackId] = useState<string | null>(null);
  const [deletingPack, setDeletingPack] = useState<PackData | null>(null);

  // ==================== SETTINGS STATE & MUTATIONS ====================
  const { data: settings, isLoading: loadingSettings } = useSettings();
  const updateSettingsMutation = useUpdatePaymentQr();
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string>('');

  // ==================== PAYMENTS STATE & MUTATIONS ====================
  const { data: allPayments, isLoading: loadingPayments } = useGetPayments();
  const verifyPaymentMutation = useVerifyPayment();

  // Approve modal state
  const [approvingPayment, setApprovingPayment] = useState<PaymentRecord | null>(null);
  const [approveForm, setApproveForm] = useState({ ottUsername: '', ottPassword: '' });
  const [rejectingPayment, setRejectingPayment] = useState<PaymentRecord | null>(null);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('Pending');

  const approvedPayments = allPayments?.filter(p => p.status === 'Approved') || [];
  const totalRevenue = approvedPayments.reduce((sum, p) => sum + p.amount, 0);
  const uniqueSubscribers = new Set(
    approvedPayments
      .map(p => p.userId && typeof p.userId === 'object' ? p.userId._id : p.userId)
      .filter(Boolean)
  );
  const activeSubscribersCount = uniqueSubscribers.size;

  const totalUsersCount = new Set(
    allPayments
      ?.map(p => p.userId && typeof p.userId === 'object' ? p.userId._id : p.userId)
      .filter(Boolean)
  ).size;

  const categories = [
    { value: 'entertainment', label: GLOBAL_STRINGS.entertainment },
    { value: 'education', label: GLOBAL_STRINGS.education },
    { value: 'music', label: GLOBAL_STRINGS.music },
    { value: 'creator', label: GLOBAL_STRINGS.creator },
    { value: 'productivity', label: GLOBAL_STRINGS.productivity }
  ];

  const analyticsTabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Activity,
      activeClass: 'bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-[0_0_18px_rgba(6,182,212,0.35)]',
      hoverClass: 'hover:text-cyan-200 hover:bg-cyan-500/10'
    },
    {
      id: 'brands',
      label: 'Channels / Brands',
      icon: Tv,
      activeClass: 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-[0_0_18px_rgba(244,63,94,0.35)]',
      hoverClass: 'hover:text-rose-200 hover:bg-rose-500/10'
    },
    {
      id: 'packs',
      label: 'Service Packs',
      icon: Layers,
      activeClass: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_18px_rgba(16,185,129,0.35)]',
      hoverClass: 'hover:text-emerald-200 hover:bg-emerald-500/10'
    },
    {
      id: 'payment-config',
      label: 'Payment Config',
      icon: QrCode,
      activeClass: 'bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white shadow-[0_0_18px_rgba(217,70,239,0.35)]',
      hoverClass: 'hover:text-fuchsia-200 hover:bg-fuchsia-500/10'
    }
  ];

  const actionButtonStyles = {
    channel: 'bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 shadow-[0_0_15px_rgba(251,113,133,0.25)] hover:shadow-[0_0_25px_rgba(251,113,133,0.42)]',
    brand: 'bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]',
    pack: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    approve: 'bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 shadow-[0_0_15px_rgba(132,204,22,0.22)]',
    qr: 'bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-400 hover:to-violet-400 shadow-[0_0_15px_rgba(217,70,239,0.22)]',
    danger: 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
  };

  // ==================== HANDLERS ====================

  const handleBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandForm.name || !brandForm.category) return;

    try {
      if (editingBrandId) {
        await updateBrandMutation.mutateAsync({
          id: editingBrandId,
          ...brandForm
        });
        showToast(
          "Channel Updated",
          brandForm.category as ToastType,
          `Successfully modified channel node for '${brandForm.name}'.`
        );
        setEditingBrandId(null);
      } else {
        await createBrandMutation.mutateAsync(brandForm);
        showToast(
          "Channel Registered",
          brandForm.category as ToastType,
          `Successfully initialized new channel node '${brandForm.name}'.`
        );
      }
      setBrandForm({ name: '', category: 'entertainment', logo: '', description: '' });
      setIsBrandModalOpen(false);
    } catch (error: any) {
      showToast(
        "Action Failed",
        "error",
        error.response?.data?.message || error.message || "An unexpected error occurred."
      );
    }
  };

  const handleEditBrand = (brand: OTTBrandData) => {
    setEditingBrandId(brand._id);
    setBrandForm({
      name: brand.name,
      category: brand.category,
      logo: brand.logo || '',
      description: brand.description || ''
    });
    setIsBrandModalOpen(true);
  };

  const handleDeleteBrand = (brand: OTTBrandData) => {
    setDeletingBrand(brand);
  };

  const confirmDeleteBrand = async () => {
    if (!deletingBrand) return;
    const brandName = deletingBrand.name;
    const brandCategory = deletingBrand.category;
    try {
      await deleteBrandMutation.mutateAsync(deletingBrand._id);
      showToast(
        GLOBAL_STRINGS.channelDissolved,
        brandCategory as ToastType,
        `The channel '${brandName}' has been removed from the platform.`
      );
    } catch (error: any) {
      showToast(
        GLOBAL_STRINGS.dissolutionFailed,
        "error",
        error.response?.data?.message || error.message || "An unexpected error occurred."
      );
    } finally {
      setDeletingBrand(null);
    }
  };

  const handlePackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packForm.brand || !packForm.title || !packForm.validity) return;

    const featuresArray = packForm.features
      .split(',')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const submissionData = {
      brand: packForm.brand,
      title: packForm.title,
      price: Number(packForm.price),
      originalPrice: Number(packForm.originalPrice),
      validity: packForm.validity,
      features: featuresArray,
      description: packForm.description
    };

    const parentBrand = allBrands?.find(b => b._id === packForm.brand);
    const brandCategory = parentBrand ? parentBrand.category : 'success';
    const brandName = parentBrand ? parentBrand.name : '';

    try {
      if (editingPackId) {
        await updatePackMutation.mutateAsync({
          id: editingPackId,
          ...submissionData
        });
        showToast(
          "Service Plan Updated",
          brandCategory as ToastType,
          `Dynamic tier '${packForm.title}' under '${brandName}' has been modified.`
        );
        setEditingPackId(null);
      } else {
        await createPackMutation.mutateAsync(submissionData);
        showToast(
          "Service Plan Published",
          brandCategory as ToastType,
          `Successfully added new tier '${packForm.title}' under '${brandName}'.`
        );
      }
      setPackForm({
        brand: '',
        title: '',
        price: 0,
        originalPrice: 0,
        validity: '30 Days',
        features: '',
        description: ''
      });
    } catch (error: any) {
      showToast(
        "Action Failed",
        "error",
        error.response?.data?.message || error.message || "An unexpected error occurred."
      );
    }
  };

  const handleEditPack = (pack: PackData) => {
    setEditingPackId(pack._id);
    const parentBrandId = typeof pack.brand === 'object' ? pack.brand?._id : pack.brand;
    setPackForm({
      brand: parentBrandId || '',
      title: pack.title,
      price: pack.price,
      originalPrice: pack.originalPrice,
      validity: pack.validity,
      features: pack.features ? pack.features.join(', ') : '',
      description: pack.description || ''
    });
  };

  const handleDeletePack = (pack: PackData) => {
    setDeletingPack(pack);
  };

  const confirmDeletePack = async () => {
    if (!deletingPack) return;
    const packTitle = deletingPack.title;
    const parentBrandId = typeof deletingPack.brand === 'object' ? deletingPack.brand?._id : deletingPack.brand;
    const parentBrand = allBrands?.find(b => b._id === parentBrandId);
    const brandCategory = parentBrand ? parentBrand.category : 'success';
    const brandName = parentBrand ? parentBrand.name : '';

    try {
      await deletePackMutation.mutateAsync(deletingPack._id);
      showToast(
        "Service Plan Purged",
        brandCategory as ToastType,
        `Dynamic tier '${packTitle}' of '${brandName}' has been removed.`
      );
    } catch (error: any) {
      showToast(
        "Purge Failed",
        "error",
        error.response?.data?.message || error.message || "An unexpected error occurred."
      );
    } finally {
      setDeletingPack(null);
    }
  };

  const handleQrFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setQrFile(file);
      setQrPreview(URL.createObjectURL(file));
    }
  };



  const handleQrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrFile) {
      showToast("Missing File", "error", "Please select a QR code image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('qrCode', qrFile);

    try {
      await updateSettingsMutation.mutateAsync(formData);
      showToast("Settings Updated", "success", "Payment QR code has been successfully updated.");
      setQrFile(null);
      setQrPreview('');
    } catch (error: any) {
      showToast("Upload Failed", "error", error.response?.data?.message || "Failed to update payment settings.");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-12 overflow-x-hidden">
      <div className="mb-6 sm:mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
            Control Center
          </h2>
          <p className="text-white/50 text-sm">Real-time system statistics and dynamic service management.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex max-w-full overflow-x-auto bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md custom-scrollbar">
          {analyticsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${activeTab === tab.id
                  ? tab.activeClass
                  : `text-white/60 ${tab.hoverClass}`
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {[
              { label: 'Total Platform Revenue', value: loadingPayments ? '...' : `₹${totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-green-400' },
              { label: 'Active Subscribers', value: loadingPayments ? '...' : activeSubscribersCount.toLocaleString('en-IN'), icon: UserCheck, color: 'text-blue-400' },
              { label: 'Total Platform Users', value: loadingPayments ? '...' : totalUsersCount.toLocaleString('en-IN'), icon: Users, color: 'text-indigo-400' },
              { label: 'Dynamic Brands', value: allBrands?.length || '0', icon: Tv, color: 'text-purple-400' },
              { label: 'Configured Packs', value: generalPacks?.length || '0', icon: Layers, color: 'text-orange-400' },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-white/50 text-xs font-semibold mb-1 uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">{stat.value}</h3>
                </div>
                <div className={`p-3 sm:p-4 bg-white/5 rounded-2xl border border-white/10 ${stat.color} shrink-0`}>
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            ))}
          </div>

          {/* Payment Verification List */}
          <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Payment Verification Queue</h3>
                  <p className="text-white/40 text-xs">Review and approve subscriber payment requests</p>
                </div>
              </div>
              {/* Filter Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setPaymentStatusFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      paymentStatusFilter === f
                        ? f === 'Pending' ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                          : f === 'Approved' ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                          : f === 'Rejected' ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                          : 'bg-white/10 border border-white/20 text-white'
                        : 'bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {f === 'All' ? `All (${allPayments?.length ?? 0})` :
                     f === 'Pending' ? `Pending (${allPayments?.filter(p => p.status === 'Pending').length ?? 0})` :
                     f === 'Approved' ? `Approved (${allPayments?.filter(p => p.status === 'Approved').length ?? 0})` :
                     `Rejected (${allPayments?.filter(p => p.status === 'Rejected').length ?? 0})`}
                  </button>
                ))}
              </div>
            </div>

            {/* List Body */}
            <div className="p-4 sm:p-5">
              {loadingPayments ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
              ) : (() => {
                const filteredPayments = (allPayments || []).filter(p =>
                  paymentStatusFilter === 'All' ? true : p.status === paymentStatusFilter
                );
                if (filteredPayments.length === 0) {
                  return (
                    <div className="flex flex-col items-center justify-center py-14 text-center gap-3">
                      <FileText className="w-10 h-10 text-white/20" />
                      <p className="text-white/40 text-sm font-semibold">No {paymentStatusFilter === 'All' ? '' : paymentStatusFilter.toLowerCase()} payment requests found.</p>
                    </div>
                  );
                }
                return (
                  <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar custom-scrollbar-analytics">
                    {filteredPayments.map(payment => {
                      const user = payment.userId && typeof payment.userId === 'object' ? payment.userId : null;
                      const pack = payment.bundleId && typeof payment.bundleId === 'object' ? payment.bundleId as any : null;
                      const bundleDisplayName = pack
                        ? (pack.brand?.name ? `${pack.brand.name} - ${pack.title}` : pack.title)
                        : (payment as any).bundleTitle || 'Unknown Bundle';
                      const isPending = payment.status === 'Pending';
                      const isApproved = payment.status === 'Approved';
                      return (
                        <div
                          key={payment._id}
                          className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all ${
                            isPending
                              ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40'
                              : isApproved
                              ? 'bg-emerald-500/5 border-emerald-500/20'
                              : 'bg-rose-500/5 border-rose-500/20'
                          }`}
                        >
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                isPending ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : isApproved ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              }`}>
                                {payment.status.toUpperCase()}
                              </span>
                              <span className="text-white font-bold text-sm truncate">
                                {user ? user.name : 'Unknown User'}
                              </span>
                              <span className="text-white/30 text-xs">&bull;</span>
                              <span className="text-white/50 text-xs truncate">{user ? user.email : ''}</span>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap text-xs text-white/50">
                              <span className="flex items-center gap-1">
                                <Layers className="w-3 h-3" />
                                {bundleDisplayName}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3 text-green-400" />
                                <span className="text-green-300 font-bold">₹{payment.amount.toLocaleString('en-IN')}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(payment.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                            <p className="text-white/30 text-[11px] mt-1 font-mono">TxID: {payment.transactionId}</p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            {payment.screenshot && (
                              <a
                                href={`${import.meta.env.VITE_API_URL || ''}${payment.screenshot}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                                title="View Screenshot"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                            )}
                            {isPending && (
                              <>
                                <button
                                  onClick={() => { setApprovingPayment(payment); setApproveForm({ ottUsername: '', ottPassword: '' }); }}
                                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 hover:border-emerald-500/50 text-xs font-bold transition-all cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => setRejectingPayment(payment)}
                                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 hover:border-rose-500/50 text-xs font-bold transition-all cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  Reject
                                </button>
                              </>
                            )}
                            {!isPending && (
                              <span className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold ${
                                isApproved
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}>
                                {isApproved ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldX className="w-3.5 h-3.5" />}
                                {isApproved ? 'Verified' : 'Rejected'}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* APPROVE PAYMENT MODAL */}
      {approvingPayment && createPortal(
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setApprovingPayment(null)} />
            <motion.div
              className="relative w-full max-w-md bg-[#0e1a2e] border border-emerald-500/30 rounded-3xl p-6 shadow-[0_0_60px_rgba(16,185,129,0.15)] z-10"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-emerald-500/15 rounded-2xl border border-emerald-500/30">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">Approve Payment</h3>
                  <p className="text-white/40 text-xs">
                    {(approvingPayment.userId as any)?.name || 'User'} &bull; ₹{approvingPayment.amount.toLocaleString('en-IN')}
                  </p>
                </div>
                <button onClick={() => setApprovingPayment(null)} className="ml-auto p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-white/50 text-xs mb-5 leading-relaxed">
                Optionally provide OTT login credentials to send to the user via email upon approval.
              </p>

              <div className="space-y-4 mb-6">
                <div className="space-y-1.5">
                  <label className="text-white/50 text-xs font-bold uppercase tracking-wider">OTT Username (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. user@ottservice.com"
                    value={approveForm.ottUsername}
                    onChange={e => setApproveForm(f => ({ ...f, ottUsername: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-white/50 text-xs font-bold uppercase tracking-wider">OTT Password (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Pass@1234"
                    value={approveForm.ottPassword}
                    onChange={e => setApproveForm(f => ({ ...f, ottPassword: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500/50 focus:shadow-[0_0_15px_rgba(16,185,129,0.1)] transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setApprovingPayment(null)}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 text-sm font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={verifyPaymentMutation.isPending}
                  onClick={async () => {
                    try {
                      await verifyPaymentMutation.mutateAsync({
                        paymentId: approvingPayment._id,
                        status: 'Approved',
                        ottUsername: approveForm.ottUsername || undefined,
                        ottPassword: approveForm.ottPassword || undefined,
                      });
                      showToast('Payment Approved', 'success', `Payment by ${(approvingPayment.userId as any)?.name || 'user'} has been approved.`);
                      setApprovingPayment(null);
                    } catch (err: any) {
                      showToast('Approval Failed', 'error', err?.response?.data?.message || 'Something went wrong.');
                    }
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {verifyPaymentMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  Approve
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}

      {/* REJECT PAYMENT MODAL */}
      {rejectingPayment && createPortal(
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setRejectingPayment(null)} />
            <motion.div
              className="relative w-full max-w-sm bg-[#1a0e12] border border-rose-500/30 rounded-3xl p-6 shadow-[0_0_60px_rgba(244,63,94,0.15)] z-10"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-rose-500/15 rounded-2xl border border-rose-500/30">
                  <ShieldX className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">Reject Payment?</h3>
                  <p className="text-white/40 text-xs">This action cannot be undone.</p>
                </div>
                <button onClick={() => setRejectingPayment(null)} className="ml-auto p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-white/50 text-sm mb-6">
                You are about to reject the payment by <span className="text-white font-bold">{(rejectingPayment.userId as any)?.name || 'this user'}</span> of <span className="text-rose-300 font-bold">₹{rejectingPayment.amount.toLocaleString('en-IN')}</span>. The user will not receive credentials.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setRejectingPayment(null)}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 text-sm font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  disabled={verifyPaymentMutation.isPending}
                  onClick={async () => {
                    try {
                      await verifyPaymentMutation.mutateAsync({
                        paymentId: rejectingPayment._id,
                        status: 'Rejected',
                      });
                      showToast('Payment Rejected', 'error', `Payment by ${(rejectingPayment.userId as any)?.name || 'user'} has been rejected.`);
                      setRejectingPayment(null);
                    } catch (err: any) {
                      showToast('Rejection Failed', 'error', err?.response?.data?.message || 'Something went wrong.');
                    }
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {verifyPaymentMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldX className="w-4 h-4" />}
                  Reject
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}

      {/* CHANNELS / BRANDS TAB */}
      {activeTab === 'brands' && (
        <div className="p-4 sm:p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl w-full animate-fadeIn">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div className="flex flex-col md:flex-row md:items-start lg:items-center gap-4 w-full lg:w-auto">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">Registered Sector Channels</h3>
                <p className="text-white/50 text-xs mt-1">Configure active brand nodes and content provider spaces.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {/* Premium Cosmic Search Bar */}
                <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl px-3 py-2 focus-within:border-purple-500/50 focus-within:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all w-full sm:w-48 md:w-56 shrink-0">
                  <Search className="w-3.5 h-3.5 text-white/40 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search channels..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none text-white text-xs font-medium focus:outline-none w-full placeholder:text-white/30"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="p-0.5 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-colors absolute right-2 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Custom Custom Cosmic Category Select */}
                <div className="relative shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                    className="flex items-center justify-between gap-2 bg-white/5 border border-white/10 hover:bg-white/10 active:scale-98 rounded-2xl py-2 px-4 backdrop-blur-md text-white text-xs font-bold transition-all cursor-pointer select-none w-full sm:w-auto"
                  >
                    <span className="text-white/40 text-[9px] font-black uppercase tracking-wider">Filter Space:</span>
                    <span className="capitalize">
                      {categories.find(c => c.value === selectedCategoryFilter)?.label || 'All Spheres'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isFilterDropdownOpen && (
                      <>
                        {/* Click Outside Invisible Backdrop */}
                        <div
                          className="fixed inset-0 z-30"
                          onClick={() => setIsFilterDropdownOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-48 bg-[#151224]/95 border border-white/10 rounded-2xl shadow-2xl p-1.5 z-40 backdrop-blur-xl"
                          style={{ boxShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 15px rgba(124,58,237,0.1)' }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCategoryFilter('');
                              setIsFilterDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${!selectedCategoryFilter
                                ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border border-purple-500/20'
                                : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent'
                              }`}
                          >
                            All Spheres
                          </button>
                          {categories.map(cat => {
                            const isSelected = selectedCategoryFilter === cat.value;
                            const getHoverTheme = (c: string) => {
                              const config = CATEGORY_COLORS[c];
                              if (!config) return 'hover:text-purple-300 hover:bg-purple-500/10';
                              return `hover:text-${config.colorName}-300 hover:bg-${config.colorName}-500/10 border-${config.colorName}-500/20`;
                            };
                            const getSelectedTheme = (c: string) => {
                              const config = CATEGORY_COLORS[c];
                              if (!config) return 'bg-purple-500/15 text-purple-300 border border-purple-500/35';
                              return `bg-${config.colorName}-500/15 text-${config.colorName}-300 border border-${config.colorName}-500/35`;
                            };

                            return (
                              <button
                                key={cat.value}
                                type="button"
                                onClick={() => {
                                  setSelectedCategoryFilter(cat.value);
                                  setIsFilterDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer mt-0.5 border ${isSelected
                                    ? getSelectedTheme(cat.value)
                                    : `text-white/70 hover:scale-[1.02] border-transparent ${getHoverTheme(cat.value)}`
                                  }`}
                              >
                                {cat.label}
                              </button>
                            );
                          })}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingBrandId(null);
                setBrandForm({ name: '', category: 'entertainment', logo: '', description: '' });
                setIsBrandModalOpen(true);
              }}
              className={`px-5 py-3 ${actionButtonStyles.channel} text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0 w-full sm:w-auto`}
            >
              <Plus className="w-4 h-4" />
              Register New Channel
            </button>
          </div>

          {loadingBrands ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
              <p className="text-white/40 text-xs">Retrieving channels layout...</p>
            </div>
          ) : !allBrands || allBrands.length === 0 ? (
            <div className="py-20 text-center rounded-2xl bg-white/5 border border-white/5 border-dashed">
              <p className="text-white/40 text-sm italic mb-2">No active services are registered.</p>
              <p className="text-xs text-white/35">Click the registration button above to initialize the first node.</p>
            </div>
          ) : !filteredBrands || filteredBrands.length === 0 ? (
            <div className="py-20 text-center rounded-2xl bg-white/5 border border-white/5 border-dashed animate-fadeIn">
              <p className="text-white/40 text-sm italic mb-2">No channels match your query.</p>
              <p className="text-xs text-white/35">Try adjusting your search terms or category sphere filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[min(600px,62dvh)] overflow-y-auto pr-1.5 custom-scrollbar custom-scrollbar-analytics">
              {filteredBrands.map(brand => {
                const config = CATEGORY_COLORS[brand.category.toLowerCase()] || CATEGORY_COLORS.discover;
                const cName = config.colorName;
                const badgeColor = cName === 'white'
                  ? 'bg-white/5 text-white/70 border-white/10'
                  : `bg-${cName}-500/10 text-${cName}-300 border-${cName}-500/20`;

                return (
                  <motion.div
                    key={brand._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between hover:bg-white/10 transition-colors group relative overflow-hidden"
                  >
                    {/* Subtle category-themed glow effect in top corner */}
                    <div className={`absolute -top-12 -right-12 w-24 h-24 rounded-full blur-2xl opacity-15 pointer-events-none transition-all duration-500 group-hover:scale-125 bg-${cName}-500`} />

                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        {brand.logo ? (
                          <img
                            src={brand.logo}
                            alt={brand.name}
                            className="w-10 h-10 rounded-xl object-cover border border-white/15 shadow-md shrink-0 bg-secondary/50"
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-xl font-black text-base flex items-center justify-center border shrink-0 shadow-md ${cName === 'white' ? 'bg-white/10 text-white/70 border-white/20' : `bg-${cName}-500/20 text-${cName}-300 border-${cName}-500/30 shadow-${cName}-500/10`
                            }`}>
                            {brand.name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wider shrink-0 shadow-sm ${badgeColor}`}>
                          {brand.category}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-white group-hover:text-purple-300 transition-colors mb-0.5 truncate">{brand.name}</h4>
                      <p className="text-[11px] text-white/45 line-clamp-1 min-h-[16px]">{brand.description || 'No description provided.'}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 mt-3 pt-2.5">
                      <span className="text-[9px] text-white/35 font-bold uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live Node
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleEditBrand(brand)}
                          className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold border border-white/5 hover:border-white/15"
                          title="Edit Brand"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBrand(brand)}
                          className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold border border-rose-500/10 hover:border-rose-500/20"
                          title="Delete Brand"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* CREATE / EDIT BRAND MODAL */}
          {createPortal(
            <AnimatePresence>
              {isBrandModalOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsBrandModalOpen(false)}
                    className="fixed inset-0 bg-primary/80 backdrop-blur-md z-[999] flex items-center justify-center pointer-events-auto"
                  />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                    className="fixed inset-x-3 sm:inset-x-0 top-4 bottom-4 sm:inset-y-0 sm:m-auto w-auto sm:w-full sm:max-w-2xl h-fit max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] bg-secondary border border-white/15 rounded-[24px] sm:rounded-[32px] shadow-2xl p-4 sm:p-6 md:p-8 z-[1000] flex flex-col overflow-y-auto custom-scrollbar pointer-events-auto"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                          <Tv className="w-5.5 h-5.5 text-purple-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {editingBrandId ? 'Modify OTT Channel' : 'Register New Channel'}
                          </h3>
                          <p className="text-xs text-white/50">Define new portal nodes and streaming dimensions.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsBrandModalOpen(false)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer border border-white/5"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Form Layout with Logo Preview */}
                    <form onSubmit={handleBrandSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">

                        {/* Left Column: Form Fields */}
                        <div className="md:col-span-2 space-y-4">

                          {/* Channel Name */}
                          <div className="space-y-1.5">
                            <label className="text-white/60 text-xs font-bold uppercase tracking-wider">Channel Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Netflix, Prime Video"
                              value={brandForm.name}
                              onChange={e => setBrandForm({ ...brandForm, name: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500/50 transition-all text-sm"
                            />
                          </div>

                          {/* Planetary Space Category */}
                          <div className="space-y-1.5">
                            <label className="text-white/60 text-xs font-bold uppercase tracking-wider">Planetary Space Category</label>
                            <select
                              value={brandForm.category}
                              onChange={e => setBrandForm({ ...brandForm, category: e.target.value })}
                              className="w-full bg-primary border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500/50 transition-all text-sm cursor-pointer"
                            >
                              {categories.map(cat => (
                                <option key={cat.value} value={cat.value} className="bg-secondary text-white">{cat.label}</option>
                              ))}
                            </select>
                          </div>

                          {/* Logo URL */}
                          <div className="space-y-1.5">
                            <label className="text-white/60 text-xs font-bold uppercase tracking-wider">Logo URL (Optional)</label>
                            <input
                              type="url"
                              placeholder="e.g. https://domain.com/logo.png"
                              value={brandForm.logo}
                              onChange={e => setBrandForm({ ...brandForm, logo: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500/50 transition-all text-sm"
                            />
                          </div>

                        </div>

                        {/* Right Column: Visual Preview Card */}
                        <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm self-start min-h-[220px] w-full text-center">
                          <span className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-4">Logo Preview</span>

                          {brandForm.logo ? (
                            <div className="relative group">
                              <img
                                src={brandForm.logo}
                                alt="Logo Preview"
                                className="w-24 h-24 rounded-2xl object-cover border border-white/15 shadow-xl bg-secondary/50"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            </div>
                          ) : (
                            <div className={`w-24 h-24 rounded-2xl border flex items-center justify-center text-3xl font-black shadow-xl transition-all duration-300 ${(() => {
                                const conf = CATEGORY_COLORS[brandForm.category] || CATEGORY_COLORS.discover;
                                const n = conf.colorName;
                                return n === 'white'
                                  ? 'bg-white/10 text-white/70 border-white/20'
                                  : `bg-${n}-500/20 text-${n}-300 border-${n}-500/30 shadow-${n}-500/10`;
                              })()
                              }`}>
                              {brandForm.name ? brandForm.name.charAt(0).toUpperCase() : '?'}
                            </div>
                          )}

                          <span className="text-xs text-white/70 mt-3 capitalize font-bold truncate max-w-full">
                            {brandForm.name || 'Untitled Channel'}
                          </span>
                          <span className="text-[9px] text-white/30 tracking-widest uppercase mt-1">
                            {brandForm.category} space
                          </span>
                        </div>

                      </div>

                      {/* Description field spanning full width */}
                      <div className="space-y-1.5">
                        <label className="text-white/60 text-xs font-bold uppercase tracking-wider">Short Tagline / Description</label>
                        <textarea
                          placeholder="Summarize this service provider for users..."
                          value={brandForm.description}
                          onChange={e => setBrandForm({ ...brandForm, description: e.target.value })}
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-500/50 transition-all text-sm resize-none"
                        />
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => setIsBrandModalOpen(false)}
                          className="px-5 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl text-xs hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          Cancel / Return
                        </button>
                        <button
                          type="submit"
                          disabled={createBrandMutation.isPending || updateBrandMutation.isPending}
                          className={`px-6 py-3 ${actionButtonStyles.brand} text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer`}
                        >
                          {(createBrandMutation.isPending || updateBrandMutation.isPending) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              {editingBrandId ? 'Apply Changes' : 'Initialize Channel'}
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </>
              )}
            </AnimatePresence>,
            document.body
          )}

          {/* DELETE BRAND CONFIRMATION MODAL */}
          {createPortal(
            <AnimatePresence>
              {deletingBrand && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setDeletingBrand(null)}
                    className="fixed inset-0 bg-primary/80 backdrop-blur-md z-[999] flex items-center justify-center pointer-events-auto"
                  />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="fixed inset-x-3 sm:inset-x-0 top-1/2 -translate-y-1/2 sm:inset-y-0 sm:m-auto w-auto sm:w-full sm:max-w-md h-fit max-h-[calc(100dvh-2rem)] overflow-y-auto bg-[#171424] border border-rose-500/30 rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 md:p-8 z-[1000] flex flex-col text-center shadow-2xl pointer-events-auto"
                    style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 35px rgba(244,63,94,0.15)' }}
                  >
                    <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/25 mx-auto mb-5">
                      <AlertTriangle className="w-8 h-8 text-rose-500 animate-pulse" />
                    </div>

                    <h3 className="text-xl font-black text-white tracking-tight mb-2">Confirm Dissolution</h3>
                    <p className="text-sm text-white/60 mb-5 leading-relaxed">
                      Are you sure you want to permanently dissolve the channel <span className="text-rose-400 font-extrabold">{deletingBrand.name}</span> and purge all of its associated service packs from the Subscription Universe?
                    </p>

                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-left space-y-2 mb-6 text-xs text-white/50">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <span>All active subscription packs will be deleted</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <span>Users will lose access to dynamic activations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <span>This action is completely irreversible</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setDeletingBrand(null)}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-xs transition-colors border border-white/5 cursor-pointer"
                      >
                        Keep Active
                      </button>
                      <button
                        type="button"
                        onClick={confirmDeleteBrand}
                        disabled={deleteBrandMutation.isPending}
                        className={`flex-1 py-3 ${actionButtonStyles.danger} text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer`}
                      >
                        {deleteBrandMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="w-3.5 h-3.5" />
                            Confirm Purge
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>,
            document.body
          )}

          {/* DELETE PACK CONFIRMATION MODAL */}
          {createPortal(
            <AnimatePresence>
              {deletingPack && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setDeletingPack(null)}
                    className="fixed inset-0 bg-primary/80 backdrop-blur-md z-[999] flex items-center justify-center pointer-events-auto"
                  />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="fixed inset-x-3 sm:inset-x-0 top-1/2 -translate-y-1/2 sm:inset-y-0 sm:m-auto w-auto sm:w-full sm:max-w-md h-fit max-h-[calc(100dvh-2rem)] overflow-y-auto bg-[#171424] border border-rose-500/30 rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 md:p-8 z-[1000] flex flex-col text-center shadow-2xl pointer-events-auto"
                    style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 35px rgba(244,63,94,0.15)' }}
                  >
                    <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/25 mx-auto mb-5">
                      <AlertTriangle className="w-8 h-8 text-rose-500 animate-pulse" />
                    </div>

                    <h3 className="text-xl font-black text-white tracking-tight mb-2">Confirm Plan Deletion</h3>
                    <p className="text-sm text-white/60 mb-5 leading-relaxed">
                      Are you sure you want to permanently dissolve the tier <span className="text-rose-400 font-extrabold">{deletingPack.title}</span> from the <span className="text-purple-400 font-extrabold">{allBrands?.find(b => b._id === (typeof deletingPack.brand === 'object' ? deletingPack.brand?._id : deletingPack.brand))?.name || 'dynamic'}</span> stack?
                    </p>

                    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-left space-y-2 mb-6 text-xs text-white/50">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <span>Plan Rate: ₹{deletingPack.price} ({deletingPack.validity})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <span>This tier will be instantly withdrawn from sale</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <span>Active subscriber tokens remain valid until expiration</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setDeletingPack(null)}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-xs transition-colors border border-white/5 cursor-pointer"
                      >
                        Keep Plan
                      </button>
                      <button
                        type="button"
                        onClick={confirmDeletePack}
                        disabled={deletePackMutation.isPending}
                        className={`flex-1 py-3 ${actionButtonStyles.danger} text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer`}
                      >
                        {deletePackMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="w-3.5 h-3.5" />
                            Confirm Purge
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>,
            document.body
          )}
        </div>
      )}

      {/* SERVICE PACKS TAB */}
      {activeTab === 'packs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start animate-fadeIn">
          {/* Pack Configuration Form */}
          <div className="lg:col-span-5 p-4 sm:p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-400" />
              {editingPackId ? 'Modify Service Pack' : 'Configure Service Pack'}
            </h3>

            <form onSubmit={handlePackSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Parent Brand</label>
                <select
                  required
                  value={packForm.brand}
                  onChange={e => setPackForm({ ...packForm, brand: e.target.value })}
                  className="w-full bg-secondary border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-purple-500/50 transition-all text-sm"
                >
                  <option value="" className="bg-secondary text-white/40">Select OTT Brand...</option>
                  {allBrands?.map(brand => (
                    <option key={brand._id} value={brand._id} className="bg-secondary text-white">
                      {brand.name} ({brand.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Pack Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Standard Mobile, Ultra Premium"
                  value={packForm.title}
                  onChange={e => setPackForm({ ...packForm, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-purple-500/50 transition-all text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Discounted Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="e.g. 199"
                    value={packForm.price || ''}
                    onChange={e => setPackForm({ ...packForm, price: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-purple-500/50 transition-all text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Original Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    placeholder="e.g. 349"
                    value={packForm.originalPrice || ''}
                    onChange={e => setPackForm({ ...packForm, originalPrice: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-purple-500/50 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Validity Period</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 30 Days, 3 Months, 1 Year"
                  value={packForm.validity}
                  onChange={e => setPackForm({ ...packForm, validity: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-purple-500/50 transition-all text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Features (Comma-separated)</label>
                <textarea
                  placeholder="e.g. 1080p, Ads-free, 2 Screens, Mobile+PC"
                  value={packForm.features}
                  onChange={e => setPackForm({ ...packForm, features: e.target.value })}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-purple-500/50 transition-all text-sm resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Brief Pack Description</label>
                <textarea
                  placeholder="e.g. Best for standard single user streaming."
                  value={packForm.description}
                  onChange={e => setPackForm({ ...packForm, description: e.target.value })}
                  rows={1}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white focus:outline-none focus:border-purple-500/50 transition-all text-sm resize-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={createPackMutation.isPending || updatePackMutation.isPending}
                  className={`flex-1 py-2.5 ${actionButtonStyles.pack} text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer`}
                >
                  {(createPackMutation.isPending || updatePackMutation.isPending) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      {editingPackId ? 'Update Plan' : 'Publish Plan'}
                    </>
                  )}
                </button>
                {editingPackId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPackId(null);
                      setPackForm({
                        brand: '',
                        title: '',
                        price: 0,
                        originalPrice: 0,
                        validity: '30 Days',
                        features: '',
                        description: ''
                      });
                    }}
                    className="px-4 py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl text-sm hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Service Packs List */}
          <div className="lg:col-span-7 p-4 sm:p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h3 className="text-xl font-bold text-white">Active Service Plans</h3>

              {/* Brand Filter */}
              <div className="shrink-0 flex items-center gap-2">
                <label className="text-white/40 text-xs whitespace-nowrap">Filter by Brand:</label>
                <select
                  value={selectedBrandFilter}
                  onChange={e => setSelectedBrandFilter(e.target.value)}
                  className="bg-secondary border border-white/10 rounded-xl py-1.5 px-3 text-xs text-white focus:outline-none focus:border-purple-500/50 transition-all cursor-pointer"
                >
                  <option value="" className="bg-secondary text-white">All Brands</option>
                  {allBrands?.map(b => (
                    <option key={b._id} value={b._id} className="bg-secondary text-white">{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {loadingPacks ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
            ) : !allPacks || allPacks.length === 0 ? (
              <div className="py-12 text-center text-white/40 italic text-sm">
                No subscription packs found for the selected filter. Create one using the form on the left.
              </div>
            ) : (
              <div className="space-y-3 max-h-[min(500px,60dvh)] overflow-y-auto pr-1 custom-scrollbar custom-scrollbar-analytics">
                {allPacks.map(pack => {
                  const brandName = typeof pack.brand === 'object' ? pack.brand?.name : 'Unknown Service';
                  return (
                    <div
                      key={pack._id}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-4"
                    >
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-base font-bold text-white">{pack.title}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-[9px] text-purple-300 font-bold">
                            {brandName}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] text-white/50">
                            {pack.validity}
                          </span>
                        </div>
                        <p className="text-xs text-white/40 mt-1 line-clamp-1">{pack.description || 'No description.'}</p>

                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-sm font-black text-white">₹{pack.price}</span>
                          {pack.originalPrice > pack.price && (
                            <span className="text-[10px] line-through text-white/30">₹{pack.originalPrice}</span>
                          )}
                        </div>

                        {pack.features && pack.features.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                            {pack.features.map((f, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-white/60">
                                {f}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                        <button
                          onClick={() => handleEditPack(pack)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                          title="Edit Pack"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePack(pack)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          title="Delete Pack"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PAYMENT CONFIG TAB */}
      {activeTab === 'payment-config' && (

        <div className="p-4 sm:p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl animate-fadeIn max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-400" />
            Global Payment Configuration
          </h3>
          <p className="text-white/50 text-sm mb-8">Upload the master UPI or payment QR code that users will scan during checkout.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 items-start">
            <form onSubmit={handleQrSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-white/60 text-xs font-bold uppercase tracking-wider block">Upload New QR Code Image</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQrFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`w-full border-2 border-dashed rounded-xl py-10 px-4 text-center transition-all flex flex-col items-center justify-center gap-3 ${qrFile ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10 bg-white/5 hover:border-emerald-500/30 hover:bg-white/10'}`}>
                    <Upload className={`w-8 h-8 ${qrFile ? 'text-emerald-400' : 'text-white/30'}`} />
                    <div>
                      <p className="text-white text-sm font-bold">{qrFile ? qrFile.name : 'Click or drag image here'}</p>
                      <p className="text-white/40 text-[10px] mt-1">Supports PNG, JPG (Max 5MB)</p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={!qrFile || updateSettingsMutation.isPending}
                className={`w-full py-3.5 ${actionButtonStyles.qr} disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer`}
              >
                {updateSettingsMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Save Active QR Code
                  </>
                )}
              </button>
            </form>

            <div className="flex flex-col items-center justify-center p-5 sm:p-8 rounded-3xl bg-white/5 border border-white/10 text-center min-h-[260px] sm:min-h-[300px]">
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-6">Live Checkout Preview</span>
              {qrPreview || (settings?.paymentQrUrl) ? (
                <div className="relative p-3 bg-white rounded-2xl shadow-xl">
                  <img
                    src={qrPreview || `http://localhost:5000${settings?.paymentQrUrl}`}
                    alt="Payment QR"
                    className="w-48 h-48 object-contain rounded-xl"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 rounded-2xl border border-white/10 flex items-center justify-center flex-col gap-3">
                  <QrCode className="w-12 h-12 text-white/20" />
                  <span className="text-xs text-white/30">No QR Code active</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
