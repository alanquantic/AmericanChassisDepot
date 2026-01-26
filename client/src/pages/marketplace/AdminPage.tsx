import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ChevronRight,
  Shield,
  Activity,
  Search,
  UserCog,
  Ban,
  UserCheck,
  Trash2,
  Edit,
  MoreVertical,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  ImageIcon,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  getStoredUser, 
  isAuthenticated,
  getMarketplaceStats,
  getPendingListings,
  approveListing,
  rejectListing,
  getAllUsers,
  getUserDetails,
  updateUser,
  changeUserRole,
  suspendUser,
  activateUser,
  deleteUser,
  getAllListingsAdmin,
  updateListingStatus,
  deleteListingAdmin,
  updateListing,
  getAllOffersAdmin,
  type AdminUser,
  type UserFilters,
  type MarketplaceListing,
  type AdminOffer,
} from '@/lib/marketplace-api';
import { Switch } from '@/components/ui/switch';
import { t, formatPrice, formatDate } from '@/lib/marketplace-i18n';
import { getCurrentLanguage } from '@/lib/i18n-simple';

export default function AdminPage() {
  const [, navigate] = useLocation();
  const lang = getCurrentLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = getStoredUser();

  // Dialog states
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');

  // User management states
  const [userFilters, setUserFilters] = useState<UserFilters>({ page: 1, limit: 20 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [editUserDialogOpen, setEditUserDialogOpen] = useState(false);
  const [editUserData, setEditUserData] = useState<Partial<AdminUser>>({});
  const [roleChangeDialogOpen, setRoleChangeDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Listings management states
  const [listingFilters, setListingFilters] = useState<{ status?: string; search?: string; page: number }>({ page: 1 });
  const [listingSearchTerm, setListingSearchTerm] = useState('');
  const [selectedListingForAction, setSelectedListingForAction] = useState<MarketplaceListing | null>(null);
  const [deleteListingDialogOpen, setDeleteListingDialogOpen] = useState(false);
  
  // Listing edit states
  const [editListingDialogOpen, setEditListingDialogOpen] = useState(false);
  const [editListingData, setEditListingData] = useState<Partial<MarketplaceListing>>({});
  const [quickPriceDialogOpen, setQuickPriceDialogOpen] = useState(false);
  const [quickPrice, setQuickPrice] = useState('');
  
  // Offers management states
  const [offerFilters, setOfferFilters] = useState<{ status?: string; search?: string; page: number }>({ page: 1 });
  const [offerSearchTerm, setOfferSearchTerm] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(`/${lang}/marketplace/login`);
      return;
    }
    if (!['admin', 'super_admin'].includes(user?.role || '')) {
      navigate(`/${lang}/marketplace/dashboard`);
    }
  }, [user]);

  const isSuperAdmin = user?.role === 'super_admin';

  // Fetch stats
  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useQuery({
    queryKey: ['marketplace-stats'],
    queryFn: getMarketplaceStats,
    staleTime: 30000,
    refetchOnMount: 'always', // Always refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    retry: 2, // Retry twice on failure
    retryDelay: 1000,
  });

  // Fetch pending listings
  const { data: pendingListings, isLoading: pendingLoading, refetch: refetchPending } = useQuery({
    queryKey: ['pending-listings'],
    queryFn: getPendingListings,
    staleTime: 30000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    retry: 2,
    retryDelay: 1000,
  });

  // Fetch users
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useQuery({
    queryKey: ['admin-users', userFilters],
    queryFn: () => getAllUsers(userFilters),
    staleTime: 30000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    retry: 2,
    retryDelay: 1000,
  });

  // Fetch all listings (admin)
  const { data: listingsData, isLoading: listingsLoading, refetch: refetchListings } = useQuery({
    queryKey: ['admin-listings', listingFilters],
    queryFn: () => getAllListingsAdmin(listingFilters),
    staleTime: 30000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    retry: 2,
    retryDelay: 1000,
  });

  // Fetch all offers (admin)
  const { data: offersData, isLoading: offersLoading, refetch: refetchOffers } = useQuery({
    queryKey: ['admin-offers', offerFilters],
    queryFn: () => getAllOffersAdmin(offerFilters),
    staleTime: 30000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    retry: 2,
    retryDelay: 1000,
  });

  // Manual refresh all data
  const handleRefreshAll = () => {
    refetchStats();
    refetchPending();
    refetchUsers();
    refetchListings();
    refetchOffers();
    toast({ title: lang === 'es' ? 'Datos actualizados' : 'Data refreshed' });
  };

  // Show error if stats failed
  useEffect(() => {
    if (statsError) {
      console.error('Stats error:', statsError);
      toast({
        title: 'Error',
        description: lang === 'es' ? 'Error al cargar estadísticas. Reintentando...' : 'Failed to load stats. Retrying...',
        variant: 'destructive',
      });
    }
  }, [statsError]);

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (id: number) => approveListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-listings'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-stats'] });
      toast({
        title: 'Listing Approved',
        description: 'The listing is now live on the marketplace.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => rejectListing(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-listings'] });
      setRejectDialogOpen(false);
      setRejectReason('');
      setSelectedListing(null);
      toast({
        title: 'Listing Rejected',
        description: 'The seller has been notified.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // User mutations
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: any }) => updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setEditUserDialogOpen(false);
      setSelectedUser(null);
      toast({ title: 'User Updated', description: 'User information has been updated.' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: string }) => changeUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-stats'] });
      setRoleChangeDialogOpen(false);
      setSelectedUser(null);
      setNewRole('');
      toast({ title: 'Role Changed', description: 'User role has been updated.' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const suspendUserMutation = useMutation({
    mutationFn: ({ userId, reason }: { userId: number; reason: string }) => suspendUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setSuspendDialogOpen(false);
      setSelectedUser(null);
      setSuspendReason('');
      toast({ title: 'User Suspended', description: 'The user account has been suspended.' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const activateUserMutation = useMutation({
    mutationFn: (userId: number) => activateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: 'User Activated', description: 'The user account has been reactivated.' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: number) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-stats'] });
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      toast({ title: 'User Deleted', description: 'The user has been permanently deleted.' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Listing mutations
  const updateListingStatusMutation = useMutation({
    mutationFn: ({ listingId, status }: { listingId: number; status: 'active' | 'inactive' | 'sold' }) => 
      updateListingStatus(listingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pending-listings'] });
      toast({ 
        title: lang === 'es' ? 'Estado Actualizado' : 'Status Updated', 
        description: lang === 'es' ? 'El listing ha sido actualizado.' : 'The listing has been updated.' 
      });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteListingMutation = useMutation({
    mutationFn: (listingId: number) => deleteListingAdmin(listingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-stats'] });
      setDeleteListingDialogOpen(false);
      setSelectedListingForAction(null);
      toast({ 
        title: lang === 'es' ? 'Listing Eliminado' : 'Listing Deleted', 
        description: lang === 'es' ? 'El listing ha sido eliminado permanentemente.' : 'The listing has been permanently deleted.' 
      });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Edit listing mutation (admin)
  const editListingMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MarketplaceListing> }) => updateListing(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-listings'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace-stats'] });
      setEditListingDialogOpen(false);
      setQuickPriceDialogOpen(false);
      setSelectedListingForAction(null);
      toast({ 
        title: lang === 'es' ? 'Listing Actualizado' : 'Listing Updated', 
        description: lang === 'es' ? 'Los cambios han sido guardados.' : 'Changes have been saved.' 
      });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const handleReject = () => {
    if (!selectedListing || !rejectReason.trim()) return;
    rejectMutation.mutate({ id: selectedListing.id, reason: rejectReason });
  };

  const handleSearch = () => {
    setUserFilters({ ...userFilters, search: searchTerm, page: 1 });
  };

  const openEditUser = (u: AdminUser) => {
    setSelectedUser(u);
    setEditUserData({
      firstName: u.firstName || '',
      lastName: u.lastName || '',
      companyName: u.companyName || '',
      phone: u.phone || '',
      city: u.city || '',
      state: u.state || '',
    });
    setEditUserDialogOpen(true);
  };

  const openRoleChange = (u: AdminUser) => {
    setSelectedUser(u);
    setNewRole(u.role);
    setRoleChangeDialogOpen(true);
  };

  const openSuspend = (u: AdminUser) => {
    setSelectedUser(u);
    setSuspendReason('');
    setSuspendDialogOpen(true);
  };

  const openDelete = (u: AdminUser) => {
    setSelectedUser(u);
    setDeleteDialogOpen(true);
  };

  // Listing helper functions
  const handleListingSearch = () => {
    setListingFilters({ ...listingFilters, search: listingSearchTerm, page: 1 });
  };

  const handleListingStatusChange = (listing: MarketplaceListing, newStatus: 'active' | 'inactive' | 'sold') => {
    updateListingStatusMutation.mutate({ listingId: listing.id, status: newStatus });
  };

  const openDeleteListing = (listing: MarketplaceListing) => {
    setSelectedListingForAction(listing);
    setDeleteListingDialogOpen(true);
  };

  const openEditListing = (listing: MarketplaceListing) => {
    setSelectedListingForAction(listing);
    setEditListingData({
      title: listing.title,
      titleEs: listing.titleEs,
      description: listing.description,
      descriptionEs: listing.descriptionEs,
      pricePerUnit: listing.pricePerUnit,
      priceNegotiable: listing.priceNegotiable,
      quantity: listing.quantity,
      quantityAvailable: listing.quantityAvailable,
      city: listing.city,
      state: listing.state,
      // Admin-only fields
      chassisType: listing.chassisType,
      chassisSize: listing.chassisSize,
      condition: listing.condition,
      featured: listing.featured,
      verified: listing.verified,
    });
    setEditListingDialogOpen(true);
  };

  const openQuickPrice = (listing: MarketplaceListing) => {
    setSelectedListingForAction(listing);
    setQuickPrice(listing.pricePerUnit);
    setQuickPriceDialogOpen(true);
  };

  const handleSaveListingEdit = () => {
    if (!selectedListingForAction) return;
    editListingMutation.mutate({ id: selectedListingForAction.id, data: editListingData });
  };

  const handleSaveQuickPrice = () => {
    if (!selectedListingForAction || !quickPrice) return;
    editListingMutation.mutate({ 
      id: selectedListingForAction.id, 
      data: { pricePerUnit: quickPrice } 
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'pending': return 'secondary';
      case 'sold': return 'outline';
      case 'inactive': return 'destructive';
      default: return 'outline';
    }
  };

  // Offer helpers
  const handleOfferSearch = () => {
    setOfferFilters({ ...offerFilters, search: offerSearchTerm, page: 1 });
  };

  const getOfferStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return { variant: 'secondary' as const, label: lang === 'es' ? 'Pendiente' : 'Pending', color: 'text-amber-600' };
      case 'accepted': return { variant: 'default' as const, label: lang === 'es' ? 'Aceptada' : 'Accepted', color: 'text-green-600' };
      case 'rejected': return { variant: 'destructive' as const, label: lang === 'es' ? 'Rechazada' : 'Rejected', color: 'text-red-600' };
      case 'countered': return { variant: 'outline' as const, label: lang === 'es' ? 'Contraoferta' : 'Countered', color: 'text-blue-600' };
      case 'expired': return { variant: 'outline' as const, label: lang === 'es' ? 'Expirada' : 'Expired', color: 'text-gray-500' };
      case 'cancelled': return { variant: 'outline' as const, label: lang === 'es' ? 'Cancelada' : 'Cancelled', color: 'text-gray-500' };
      default: return { variant: 'outline' as const, label: status, color: 'text-gray-600' };
    }
  };

  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    return null;
  }

  const statCards = [
    {
      label: 'Total Listings',
      value: stats?.listings?.totalListings || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Active Listings',
      value: stats?.listings?.activeListings || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Pending Approval',
      value: stats?.listings?.pendingListings || 0,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      label: 'Total Users',
      value: stats?.users?.totalUsers || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Total Offers',
      value: stats?.offers?.totalOffers || 0,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      label: 'Inventory Value',
      value: formatPrice(stats?.listings?.totalValue || 0),
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      isPrice: true,
    },
  ];

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin': return 'destructive';
      case 'admin': return 'default';
      case 'seller': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-[#0A3161]" />
              <h1 className="text-3xl font-bold text-gray-900">{t('adminPanel')}</h1>
              {isSuperAdmin && (
                <Badge variant="destructive" className="ml-2">Super Admin</Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshAll}
              disabled={statsLoading || pendingLoading || usersLoading || listingsLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${(statsLoading || listingsLoading) ? 'animate-spin' : ''}`} />
              {lang === 'es' ? 'Actualizar' : 'Refresh'}
            </Button>
          </div>
          <p className="text-gray-600">
            {lang === 'es' ? 'Gestiona listings, usuarios y configuración del marketplace' : 'Manage listings, users, and marketplace settings'}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className={`text-2xl font-bold ${stat.isPrice ? 'text-lg' : ''}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Content */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending" className="relative">
              {t('pendingApproval')}
              {pendingListings && pendingListings.length > 0 && (
                <Badge className="ml-2 bg-amber-500">{pendingListings.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="listings">All Listings</TabsTrigger>
            <TabsTrigger value="users">
              {lang === 'es' ? 'Usuarios' : 'Users'}
            </TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
          </TabsList>

          {/* Pending Listings */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Listings Pending Approval
                </CardTitle>
                <CardDescription>
                  Review and approve or reject new listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : pendingListings && pendingListings.length > 0 ? (
                  <div className="space-y-4">
                    {pendingListings.map((listing: any) => (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                          {listing.primaryImageUrl ? (
                            <img src={listing.primaryImageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{listing.title}</h3>
                            <Badge variant="outline">{listing.listingNumber}</Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            {listing.chassisType} {listing.chassisSize} • {listing.condition} • {listing.city}, {listing.state}
                          </p>
                          <p className="text-sm text-gray-500">
                            Seller: {listing.sellerName || listing.sellerEmail} • Submitted: {formatDate(listing.createdAt)}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-bold text-[#0A3161]">
                            {formatPrice(listing.pricePerUnit)}
                          </p>
                          <p className="text-sm text-gray-500">{listing.quantity} units</p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => approveMutation.mutate(listing.id)}
                            disabled={approveMutation.isPending}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {t('approve')}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedListing(listing);
                              setRejectDialogOpen(true);
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            {t('reject')}
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">All caught up!</h3>
                    <p className="text-gray-500">No listings pending approval</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Listings */}
          <TabsContent value="listings">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      {lang === 'es' ? 'Todos los Listings' : 'All Listings'}
                    </CardTitle>
                    <CardDescription>
                      {lang === 'es' ? 'Gestiona todos los listings del marketplace' : 'Manage all marketplace listings'}
                    </CardDescription>
                  </div>
                  
                  {/* Filters */}
                  <div className="flex flex-wrap gap-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder={lang === 'es' ? 'Buscar...' : 'Search...'}
                        value={listingSearchTerm}
                        onChange={(e) => setListingSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleListingSearch()}
                        className="w-48"
                      />
                      <Button variant="outline" size="icon" onClick={handleListingSearch}>
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                    <Select
                      value={listingFilters.status || 'all'}
                      onValueChange={(value) => setListingFilters({ ...listingFilters, status: value === 'all' ? undefined : value, page: 1 })}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{lang === 'es' ? 'Todos' : 'All Status'}</SelectItem>
                        <SelectItem value="active">{lang === 'es' ? 'Activos' : 'Active'}</SelectItem>
                        <SelectItem value="pending">{lang === 'es' ? 'Pendientes' : 'Pending'}</SelectItem>
                        <SelectItem value="sold">{lang === 'es' ? 'Vendidos' : 'Sold'}</SelectItem>
                        <SelectItem value="inactive">{lang === 'es' ? 'Inactivos' : 'Inactive'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Listing Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-green-600">{stats?.listings?.activeListings || 0}</p>
                      <p className="text-sm text-gray-500">{lang === 'es' ? 'Activos' : 'Active'}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-amber-600">{stats?.listings?.pendingListings || 0}</p>
                      <p className="text-sm text-gray-500">{lang === 'es' ? 'Pendientes' : 'Pending'}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-purple-600">{stats?.listings?.soldListings || 0}</p>
                      <p className="text-sm text-gray-500">{lang === 'es' ? 'Vendidos' : 'Sold'}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-gray-600">{stats?.listings?.totalListings || 0}</p>
                      <p className="text-sm text-gray-500">Total</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Listings List */}
                {listingsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : listingsData?.listings && listingsData.listings.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {listingsData.listings.map((listing: MarketplaceListing) => (
                        <motion.div
                          key={listing.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {listing.primaryImageUrl ? (
                              <img src={listing.primaryImageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Package className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold truncate">{listing.title}</span>
                              <Badge variant="outline" className="text-xs">{listing.listingNumber}</Badge>
                              <Badge variant={getStatusBadgeVariant(listing.status)} className="capitalize">
                                {listing.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                              <span>{listing.chassisType} • {listing.chassisSize}</span>
                              <span>{listing.condition}</span>
                              {listing.city && listing.state && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {listing.city}, {listing.state}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right hidden md:block">
                            <p className="text-lg font-bold text-[#0A3161]">{formatPrice(listing.pricePerUnit)}</p>
                            <p className="text-sm text-gray-500">{listing.quantityAvailable} {lang === 'es' ? 'unidades' : 'units'}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/${lang}/chassis-marketplace/${listing.slug}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigate(`/${lang}/chassis-marketplace/${listing.slug}`)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  {lang === 'es' ? 'Ver Detalles' : 'View Details'}
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem onClick={() => openEditListing(listing)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  {lang === 'es' ? 'Editar Listing' : 'Edit Listing'}
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem onClick={() => navigate(`/${lang}/marketplace/seller/listings/${listing.id}/images?from=admin`)}>
                                  <ImageIcon className="w-4 h-4 mr-2" />
                                  {lang === 'es' ? 'Gestionar Fotos' : 'Manage Photos'}
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem onClick={() => openQuickPrice(listing)}>
                                  <DollarSign className="w-4 h-4 mr-2" />
                                  {lang === 'es' ? 'Cambiar Precio' : 'Change Price'}
                                </DropdownMenuItem>
                                
                                <DropdownMenuSeparator />
                                
                                {listing.status !== 'active' && (
                                  <DropdownMenuItem 
                                    onClick={() => handleListingStatusChange(listing, 'active')}
                                    className="text-green-600"
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    {lang === 'es' ? 'Activar' : 'Activate'}
                                  </DropdownMenuItem>
                                )}
                                
                                {listing.status === 'active' && (
                                  <DropdownMenuItem 
                                    onClick={() => handleListingStatusChange(listing, 'inactive')}
                                    className="text-amber-600"
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    {lang === 'es' ? 'Desactivar' : 'Deactivate'}
                                  </DropdownMenuItem>
                                )}
                                
                                {listing.status !== 'sold' && (
                                  <DropdownMenuItem 
                                    onClick={() => handleListingStatusChange(listing, 'sold')}
                                    className="text-purple-600"
                                  >
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    {lang === 'es' ? 'Marcar Vendido' : 'Mark as Sold'}
                                  </DropdownMenuItem>
                                )}
                                
                                <DropdownMenuSeparator />
                                
                                <DropdownMenuItem 
                                  onClick={() => openDeleteListing(listing)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  {lang === 'es' ? 'Eliminar' : 'Delete'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {listingsData.totalPages > 1 && (
                      <div className="flex justify-center gap-2 mt-6">
                        <Button
                          variant="outline"
                          disabled={listingFilters.page === 1}
                          onClick={() => setListingFilters({ ...listingFilters, page: listingFilters.page - 1 })}
                        >
                          {lang === 'es' ? 'Anterior' : 'Previous'}
                        </Button>
                        <span className="flex items-center px-4 text-sm text-gray-500">
                          {lang === 'es' ? 'Página' : 'Page'} {listingFilters.page} {lang === 'es' ? 'de' : 'of'} {listingsData.totalPages}
                        </span>
                        <Button
                          variant="outline"
                          disabled={listingFilters.page >= listingsData.totalPages}
                          onClick={() => setListingFilters({ ...listingFilters, page: listingFilters.page + 1 })}
                        >
                          {lang === 'es' ? 'Siguiente' : 'Next'}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {lang === 'es' ? 'No se encontraron listings' : 'No listings found'}
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setListingFilters({ page: 1 })}
                    >
                      {lang === 'es' ? 'Limpiar Filtros' : 'Clear Filters'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <UserCog className="w-5 h-5" />
                      {lang === 'es' ? 'Gestión de Usuarios' : 'User Management'}
                    </CardTitle>
                    <CardDescription>
                      {lang === 'es' ? 'Administra compradores, vendedores y administradores' : 'Manage buyers, sellers, and admins'}
                    </CardDescription>
                  </div>
                  
                  {/* Filters */}
                  <div className="flex flex-wrap gap-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder={lang === 'es' ? 'Buscar...' : 'Search...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-48"
                      />
                      <Button variant="outline" size="icon" onClick={handleSearch}>
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                    <Select
                      value={userFilters.role || 'all'}
                      onValueChange={(value) => setUserFilters({ ...userFilters, role: value === 'all' ? undefined : value, page: 1 })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{lang === 'es' ? 'Todos' : 'All Roles'}</SelectItem>
                        <SelectItem value="buyer">Buyer</SelectItem>
                        <SelectItem value="seller">Seller</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={userFilters.status || 'all'}
                      onValueChange={(value) => setUserFilters({ ...userFilters, status: value as any, page: 1 })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{lang === 'es' ? 'Todos' : 'All Status'}</SelectItem>
                        <SelectItem value="active">{lang === 'es' ? 'Activos' : 'Active'}</SelectItem>
                        <SelectItem value="suspended">{lang === 'es' ? 'Suspendidos' : 'Suspended'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* User Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-blue-600">{stats?.users?.buyers || 0}</p>
                      <p className="text-sm text-gray-500">Buyers</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-green-600">{stats?.users?.sellers || 0}</p>
                      <p className="text-sm text-gray-500">Sellers</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-purple-600">{stats?.users?.admins || 0}</p>
                      <p className="text-sm text-gray-500">Admins</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-gray-600">{stats?.users?.totalUsers || 0}</p>
                      <p className="text-sm text-gray-500">Total</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Users List */}
                {usersLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : usersData?.users && usersData.users.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {usersData.users.map((u: AdminUser) => (
                        <motion.div
                          key={u.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 ${u.isSuspended ? 'bg-red-50 border-red-200' : ''}`}
                        >
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className={`${u.isSuspended ? 'bg-red-200 text-red-700' : 'bg-[#0A3161] text-white'}`}>
                              {(u.firstName?.[0] || u.email[0]).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold truncate">
                                {u.firstName ? `${u.firstName} ${u.lastName || ''}` : u.email}
                              </span>
                              <Badge variant={getRoleBadgeVariant(u.role)} className="capitalize">
                                {u.role.replace('_', ' ')}
                              </Badge>
                              {u.isSuspended && (
                                <Badge variant="destructive">
                                  <Ban className="w-3 h-3 mr-1" />
                                  {lang === 'es' ? 'Suspendido' : 'Suspended'}
                                </Badge>
                              )}
                              {u.sellerVerified && u.role === 'seller' && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {u.email}
                              </span>
                              {u.companyName && (
                                <span className="flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  {u.companyName}
                                </span>
                              )}
                              {u.city && u.state && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {u.city}, {u.state}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right text-sm text-gray-500 hidden md:block">
                            <p className="flex items-center gap-1 justify-end">
                              <Calendar className="w-3 h-3" />
                              {lang === 'es' ? 'Registro' : 'Joined'}: {formatDate(u.createdAt)}
                            </p>
                            {u.lastLoginAt && (
                              <p>{lang === 'es' ? 'Último acceso' : 'Last login'}: {formatDate(u.lastLoginAt)}</p>
                            )}
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditUser(u)}>
                                <Edit className="w-4 h-4 mr-2" />
                                {lang === 'es' ? 'Editar Información' : 'Edit Info'}
                              </DropdownMenuItem>
                              
                              {isSuperAdmin && u.id !== user.id && (
                                <DropdownMenuItem onClick={() => openRoleChange(u)}>
                                  <UserCog className="w-4 h-4 mr-2" />
                                  {lang === 'es' ? 'Cambiar Rol' : 'Change Role'}
                                </DropdownMenuItem>
                              )}
                              
                              <DropdownMenuSeparator />
                              
                              {u.isSuspended ? (
                                <DropdownMenuItem 
                                  onClick={() => activateUserMutation.mutate(u.id)}
                                  className="text-green-600"
                                >
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  {lang === 'es' ? 'Reactivar Usuario' : 'Activate User'}
                                </DropdownMenuItem>
                              ) : u.id !== user.id && (
                                <DropdownMenuItem 
                                  onClick={() => openSuspend(u)}
                                  className="text-amber-600"
                                >
                                  <Ban className="w-4 h-4 mr-2" />
                                  {lang === 'es' ? 'Suspender Usuario' : 'Suspend User'}
                                </DropdownMenuItem>
                              )}
                              
                              {isSuperAdmin && u.id !== user.id && u.role !== 'super_admin' && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => openDelete(u)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    {lang === 'es' ? 'Eliminar Usuario' : 'Delete User'}
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </motion.div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {usersData.pagination.totalPages > 1 && (
                      <div className="flex justify-center gap-2 mt-6">
                        <Button
                          variant="outline"
                          disabled={userFilters.page === 1}
                          onClick={() => setUserFilters({ ...userFilters, page: (userFilters.page || 1) - 1 })}
                        >
                          {lang === 'es' ? 'Anterior' : 'Previous'}
                        </Button>
                        <span className="flex items-center px-4 text-sm text-gray-500">
                          {lang === 'es' ? 'Página' : 'Page'} {userFilters.page} {lang === 'es' ? 'de' : 'of'} {usersData.pagination.totalPages}
                        </span>
                        <Button
                          variant="outline"
                          disabled={!usersData.pagination.hasMore}
                          onClick={() => setUserFilters({ ...userFilters, page: (userFilters.page || 1) + 1 })}
                        >
                          {lang === 'es' ? 'Siguiente' : 'Next'}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {lang === 'es' ? 'No se encontraron usuarios' : 'No users found'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Offers */}
          <TabsContent value="offers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  {lang === 'es' ? 'Gestión de Ofertas' : 'Offer Management'}
                </CardTitle>
                <CardDescription>
                  {lang === 'es' ? 'Monitorea todas las ofertas del marketplace' : 'Monitor all marketplace offers'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-amber-600">{stats?.offers?.pendingOffers || 0}</p>
                      <p className="text-sm text-amber-700">{lang === 'es' ? 'Pendientes' : 'Pending'}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-green-600">{stats?.offers?.acceptedOffers || 0}</p>
                      <p className="text-sm text-green-700">{lang === 'es' ? 'Aceptadas' : 'Accepted'}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-red-600">{stats?.offers?.rejectedOffers || 0}</p>
                      <p className="text-sm text-red-700">{lang === 'es' ? 'Rechazadas' : 'Rejected'}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-gray-600">{stats?.offers?.totalOffers || 0}</p>
                      <p className="text-sm text-gray-500">Total</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder={lang === 'es' ? 'Buscar por # de oferta o listing...' : 'Search by offer # or listing...'}
                      value={offerSearchTerm}
                      onChange={(e) => setOfferSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleOfferSearch()}
                      className="max-w-sm"
                    />
                    <Button variant="outline" size="icon" onClick={handleOfferSearch}>
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                  <Select
                    value={offerFilters.status || 'all'}
                    onValueChange={(value) => setOfferFilters({ ...offerFilters, status: value === 'all' ? undefined : value, page: 1 })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={lang === 'es' ? 'Todos los estados' : 'All Status'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{lang === 'es' ? 'Todos' : 'All Status'}</SelectItem>
                      <SelectItem value="pending">{lang === 'es' ? 'Pendientes' : 'Pending'}</SelectItem>
                      <SelectItem value="accepted">{lang === 'es' ? 'Aceptadas' : 'Accepted'}</SelectItem>
                      <SelectItem value="rejected">{lang === 'es' ? 'Rechazadas' : 'Rejected'}</SelectItem>
                      <SelectItem value="countered">{lang === 'es' ? 'Contraoferta' : 'Countered'}</SelectItem>
                      <SelectItem value="expired">{lang === 'es' ? 'Expiradas' : 'Expired'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Offers List */}
                {offersLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : offersData?.offers && offersData.offers.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      {offersData.offers.map((offer: AdminOffer) => {
                        const statusBadge = getOfferStatusBadge(offer.status);
                        return (
                          <motion.div
                            key={offer.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              {/* Offer Info */}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                    {offer.offerNumber}
                                  </span>
                                  <Badge variant={statusBadge.variant} className={statusBadge.color}>
                                    {statusBadge.label}
                                  </Badge>
                                </div>
                                
                                <p className="font-medium text-gray-900 mb-1">
                                  {offer.listingTitle}
                                </p>
                                <p className="text-sm text-gray-500 mb-2">
                                  {offer.listingNumber}
                                </p>
                                
                                {/* Buyer & Seller */}
                                <div className="flex flex-wrap gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4 text-blue-500" />
                                    <span className="text-gray-600">{lang === 'es' ? 'Comprador:' : 'Buyer:'}</span>
                                    <span className="font-medium">
                                      {offer.buyer?.companyName || `${offer.buyer?.firstName} ${offer.buyer?.lastName}`}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Building2 className="w-4 h-4 text-green-500" />
                                    <span className="text-gray-600">{lang === 'es' ? 'Vendedor:' : 'Seller:'}</span>
                                    <span className="font-medium">
                                      {offer.seller?.companyName || `${offer.seller?.firstName} ${offer.seller?.lastName}`}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Price & Quantity */}
                              <div className="text-right space-y-1">
                                <p className="text-2xl font-bold text-[#0A3161]">
                                  {formatPrice(offer.totalAmount)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {offer.quantity} × {formatPrice(offer.pricePerUnit)} {lang === 'es' ? 'c/u' : 'each'}
                                </p>
                                {offer.counterPrice && (
                                  <p className="text-sm text-blue-600">
                                    {lang === 'es' ? 'Contraoferta:' : 'Counter:'} {formatPrice(offer.counterPrice)}
                                    {offer.counterQuantity && ` × ${offer.counterQuantity}`}
                                  </p>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/${lang}/chassis-marketplace/${offer.listingSlug}`)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  {lang === 'es' ? 'Ver Listing' : 'View Listing'}
                                </Button>
                                {offer.buyer?.email && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => window.location.href = `mailto:${offer.buyer?.email}?subject=Re: Offer ${offer.offerNumber}`}
                                  >
                                    <Mail className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* Notes */}
                            {(offer.buyerNotes || offer.sellerNotes) && (
                              <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                                {offer.buyerNotes && (
                                  <div className="bg-blue-50 p-3 rounded-lg">
                                    <p className="text-xs font-medium text-blue-700 mb-1">
                                      {lang === 'es' ? 'Notas del comprador:' : 'Buyer notes:'}
                                    </p>
                                    <p className="text-sm text-blue-900">{offer.buyerNotes}</p>
                                  </div>
                                )}
                                {offer.sellerNotes && (
                                  <div className="bg-green-50 p-3 rounded-lg">
                                    <p className="text-xs font-medium text-green-700 mb-1">
                                      {lang === 'es' ? 'Respuesta del vendedor:' : 'Seller response:'}
                                    </p>
                                    <p className="text-sm text-green-900">{offer.sellerNotes}</p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Footer Info */}
                            <div className="mt-3 pt-3 border-t flex flex-wrap gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {lang === 'es' ? 'Creada:' : 'Created:'} {formatDate(offer.createdAt, lang as 'en' | 'es')}
                              </span>
                              {offer.expiresAt && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {lang === 'es' ? 'Expira:' : 'Expires:'} {formatDate(offer.expiresAt, lang as 'en' | 'es')}
                                </span>
                              )}
                              {offer.respondedAt && (
                                <span className="flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  {lang === 'es' ? 'Respondida:' : 'Responded:'} {formatDate(offer.respondedAt, lang as 'en' | 'es')}
                                </span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {offersData.totalPages > 1 && (
                      <div className="flex justify-center gap-2 mt-6">
                        <Button
                          variant="outline"
                          disabled={offerFilters.page === 1}
                          onClick={() => setOfferFilters({ ...offerFilters, page: offerFilters.page - 1 })}
                        >
                          {lang === 'es' ? 'Anterior' : 'Previous'}
                        </Button>
                        <span className="flex items-center px-4 text-sm text-gray-500">
                          {lang === 'es' ? 'Página' : 'Page'} {offerFilters.page} {lang === 'es' ? 'de' : 'of'} {offersData.totalPages}
                        </span>
                        <Button
                          variant="outline"
                          disabled={offerFilters.page >= offersData.totalPages}
                          onClick={() => setOfferFilters({ ...offerFilters, page: offerFilters.page + 1 })}
                        >
                          {lang === 'es' ? 'Siguiente' : 'Next'}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      {offerFilters.search || offerFilters.status
                        ? (lang === 'es' ? 'No se encontraron ofertas con estos filtros' : 'No offers found with these filters')
                        : (lang === 'es' ? 'No hay ofertas aún' : 'No offers yet')}
                    </p>
                    {(offerFilters.search || offerFilters.status) && (
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setOfferFilters({ page: 1 });
                          setOfferSearchTerm('');
                        }}
                      >
                        {lang === 'es' ? 'Limpiar filtros' : 'Clear filters'}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Reject Listing Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Listing</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting "{selectedListing?.title}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim() || rejectMutation.isPending}
            >
              {rejectMutation.isPending ? 'Rejecting...' : 'Reject Listing'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editUserDialogOpen} onOpenChange={setEditUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang === 'es' ? 'Editar Usuario' : 'Edit User'}</DialogTitle>
            <DialogDescription>
              {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{lang === 'es' ? 'Nombre' : 'First Name'}</Label>
                <Input
                  value={editUserData.firstName || ''}
                  onChange={(e) => setEditUserData({ ...editUserData, firstName: e.target.value })}
                />
              </div>
              <div>
                <Label>{lang === 'es' ? 'Apellido' : 'Last Name'}</Label>
                <Input
                  value={editUserData.lastName || ''}
                  onChange={(e) => setEditUserData({ ...editUserData, lastName: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>{lang === 'es' ? 'Empresa' : 'Company'}</Label>
              <Input
                value={editUserData.companyName || ''}
                onChange={(e) => setEditUserData({ ...editUserData, companyName: e.target.value })}
              />
            </div>
            <div>
              <Label>{lang === 'es' ? 'Teléfono' : 'Phone'}</Label>
              <Input
                value={editUserData.phone || ''}
                onChange={(e) => setEditUserData({ ...editUserData, phone: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{lang === 'es' ? 'Ciudad' : 'City'}</Label>
                <Input
                  value={editUserData.city || ''}
                  onChange={(e) => setEditUserData({ ...editUserData, city: e.target.value })}
                />
              </div>
              <div>
                <Label>{lang === 'es' ? 'Estado' : 'State'}</Label>
                <Input
                  value={editUserData.state || ''}
                  onChange={(e) => setEditUserData({ ...editUserData, state: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserDialogOpen(false)}>
              {lang === 'es' ? 'Cancelar' : 'Cancel'}
            </Button>
            <Button 
              onClick={() => selectedUser && updateUserMutation.mutate({ userId: selectedUser.id, data: editUserData })}
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? (lang === 'es' ? 'Guardando...' : 'Saving...') : (lang === 'es' ? 'Guardar' : 'Save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Role Dialog */}
      <Dialog open={roleChangeDialogOpen} onOpenChange={setRoleChangeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang === 'es' ? 'Cambiar Rol de Usuario' : 'Change User Role'}</DialogTitle>
            <DialogDescription>
              {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label>{lang === 'es' ? 'Nuevo Rol' : 'New Role'}</Label>
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">Buyer</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-amber-600 mt-2">
              {lang === 'es' 
                ? 'Advertencia: Cambiar el rol puede afectar los permisos del usuario inmediatamente.'
                : 'Warning: Changing the role will affect user permissions immediately.'}
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleChangeDialogOpen(false)}>
              {lang === 'es' ? 'Cancelar' : 'Cancel'}
            </Button>
            <Button 
              onClick={() => selectedUser && changeRoleMutation.mutate({ userId: selectedUser.id, role: newRole })}
              disabled={changeRoleMutation.isPending || newRole === selectedUser?.role}
            >
              {changeRoleMutation.isPending ? (lang === 'es' ? 'Cambiando...' : 'Changing...') : (lang === 'es' ? 'Cambiar Rol' : 'Change Role')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend User Dialog */}
      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang === 'es' ? 'Suspender Usuario' : 'Suspend User'}</DialogTitle>
            <DialogDescription>
              {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label>{lang === 'es' ? 'Razón de la suspensión' : 'Suspension Reason'}</Label>
            <Textarea
              className="mt-2"
              placeholder={lang === 'es' ? 'Ingresa la razón...' : 'Enter reason...'}
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendDialogOpen(false)}>
              {lang === 'es' ? 'Cancelar' : 'Cancel'}
            </Button>
            <Button 
              variant="destructive"
              onClick={() => selectedUser && suspendUserMutation.mutate({ userId: selectedUser.id, reason: suspendReason })}
              disabled={suspendUserMutation.isPending || !suspendReason.trim()}
            >
              {suspendUserMutation.isPending ? (lang === 'es' ? 'Suspendiendo...' : 'Suspending...') : (lang === 'es' ? 'Suspender' : 'Suspend')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {lang === 'es' ? '¿Eliminar usuario permanentemente?' : 'Permanently delete user?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {lang === 'es' 
                ? `Esta acción no se puede deshacer. Se eliminará permanentemente la cuenta de ${selectedUser?.email} y todos sus datos asociados.`
                : `This action cannot be undone. This will permanently delete ${selectedUser?.email}'s account and all associated data.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{lang === 'es' ? 'Cancelar' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => selectedUser && deleteUserMutation.mutate(selectedUser.id)}
            >
              {deleteUserMutation.isPending ? (lang === 'es' ? 'Eliminando...' : 'Deleting...') : (lang === 'es' ? 'Eliminar' : 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Listing Confirmation */}
      <AlertDialog open={deleteListingDialogOpen} onOpenChange={setDeleteListingDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {lang === 'es' ? '¿Eliminar listing permanentemente?' : 'Permanently delete listing?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {lang === 'es' 
                ? `Esta acción no se puede deshacer. Se eliminará permanentemente "${selectedListingForAction?.title}" y todos sus datos asociados.`
                : `This action cannot be undone. This will permanently delete "${selectedListingForAction?.title}" and all associated data.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{lang === 'es' ? 'Cancelar' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => selectedListingForAction && deleteListingMutation.mutate(selectedListingForAction.id)}
            >
              {deleteListingMutation.isPending ? (lang === 'es' ? 'Eliminando...' : 'Deleting...') : (lang === 'es' ? 'Eliminar' : 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Listing Dialog */}
      <Dialog open={editListingDialogOpen} onOpenChange={setEditListingDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              {lang === 'es' ? 'Editar Listing' : 'Edit Listing'}
            </DialogTitle>
            <DialogDescription>
              {selectedListingForAction?.listingNumber} - {selectedListingForAction?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Basic Info Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">
                {lang === 'es' ? 'Información Básica' : 'Basic Information'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{lang === 'es' ? 'Título (Inglés)' : 'Title (English)'}</Label>
                  <Input
                    value={editListingData.title || ''}
                    onChange={(e) => setEditListingData({ ...editListingData, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{lang === 'es' ? 'Título (Español)' : 'Title (Spanish)'}</Label>
                  <Input
                    value={editListingData.titleEs || ''}
                    onChange={(e) => setEditListingData({ ...editListingData, titleEs: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label>{lang === 'es' ? 'Descripción (Inglés)' : 'Description (English)'}</Label>
                <Textarea
                  value={editListingData.description || ''}
                  onChange={(e) => setEditListingData({ ...editListingData, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div>
                <Label>{lang === 'es' ? 'Descripción (Español)' : 'Description (Spanish)'}</Label>
                <Textarea
                  value={editListingData.descriptionEs || ''}
                  onChange={(e) => setEditListingData({ ...editListingData, descriptionEs: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            {/* Pricing & Inventory Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">
                {lang === 'es' ? 'Precio e Inventario' : 'Pricing & Inventory'}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>{lang === 'es' ? 'Precio ($)' : 'Price ($)'}</Label>
                  <Input
                    type="number"
                    value={editListingData.pricePerUnit || ''}
                    onChange={(e) => setEditListingData({ ...editListingData, pricePerUnit: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    checked={editListingData.priceNegotiable || false}
                    onCheckedChange={(checked) => setEditListingData({ ...editListingData, priceNegotiable: checked })}
                  />
                  <Label className="text-sm">{lang === 'es' ? 'Negociable' : 'Negotiable'}</Label>
                </div>
                <div>
                  <Label>{lang === 'es' ? 'Cantidad Total' : 'Total Qty'}</Label>
                  <Input
                    type="number"
                    value={editListingData.quantity || ''}
                    onChange={(e) => setEditListingData({ ...editListingData, quantity: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label>{lang === 'es' ? 'Disponible' : 'Available'}</Label>
                  <Input
                    type="number"
                    value={editListingData.quantityAvailable || ''}
                    onChange={(e) => setEditListingData({ ...editListingData, quantityAvailable: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 border-b pb-2">
                {lang === 'es' ? 'Ubicación' : 'Location'}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{lang === 'es' ? 'Ciudad' : 'City'}</Label>
                  <Input
                    value={editListingData.city || ''}
                    onChange={(e) => setEditListingData({ ...editListingData, city: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{lang === 'es' ? 'Estado' : 'State'}</Label>
                  <Input
                    value={editListingData.state || ''}
                    onChange={(e) => setEditListingData({ ...editListingData, state: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Admin-Only Section */}
            <div className="space-y-4 bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h3 className="font-semibold text-amber-800 border-b border-amber-300 pb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                {lang === 'es' ? 'Campos de Admin' : 'Admin Fields'}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label>{lang === 'es' ? 'Tipo de Chassis' : 'Chassis Type'}</Label>
                  <Select
                    value={editListingData.chassisType || ''}
                    onValueChange={(value) => setEditListingData({ ...editListingData, chassisType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Gooseneck">Gooseneck</SelectItem>
                      <SelectItem value="Slider">Slider</SelectItem>
                      <SelectItem value="Extendable">Extendable</SelectItem>
                      <SelectItem value="Spread">Spread</SelectItem>
                      <SelectItem value="Tank">Tank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{lang === 'es' ? 'Tamaño' : 'Size'}</Label>
                  <Select
                    value={editListingData.chassisSize || ''}
                    onValueChange={(value) => setEditListingData({ ...editListingData, chassisSize: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20'">20'</SelectItem>
                      <SelectItem value="40'">40'</SelectItem>
                      <SelectItem value="45'">45'</SelectItem>
                      <SelectItem value="53'">53'</SelectItem>
                      <SelectItem value="20-40'">20-40' (Extendable)</SelectItem>
                      <SelectItem value="40-45'">40-45' (Extendable)</SelectItem>
                      <SelectItem value="40-45-48'">40-45-48' (Extendable)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{lang === 'es' ? 'Condición' : 'Condition'}</Label>
                  <Select
                    value={editListingData.condition || ''}
                    onValueChange={(value) => setEditListingData({ ...editListingData, condition: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Road-worthy">Road-worthy</SelectItem>
                      <SelectItem value="ASIS">As-Is</SelectItem>
                      <SelectItem value="Certified">Certified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editListingData.featured || false}
                    onCheckedChange={(checked) => setEditListingData({ ...editListingData, featured: checked })}
                  />
                  <Label className="text-sm">{lang === 'es' ? 'Destacado' : 'Featured'}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editListingData.verified || false}
                    onCheckedChange={(checked) => setEditListingData({ ...editListingData, verified: checked })}
                  />
                  <Label className="text-sm">{lang === 'es' ? 'Verificado' : 'Verified'}</Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditListingDialogOpen(false)}>
              {lang === 'es' ? 'Cancelar' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleSaveListingEdit}
              disabled={editListingMutation.isPending}
              className="bg-[#0A3161] hover:bg-[#0A3161]/90"
            >
              {editListingMutation.isPending 
                ? (lang === 'es' ? 'Guardando...' : 'Saving...') 
                : (lang === 'es' ? 'Guardar Cambios' : 'Save Changes')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Price Edit Dialog */}
      <Dialog open={quickPriceDialogOpen} onOpenChange={setQuickPriceDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              {lang === 'es' ? 'Cambiar Precio' : 'Change Price'}
            </DialogTitle>
            <DialogDescription>
              {selectedListingForAction?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div>
              <Label>{lang === 'es' ? 'Precio Actual' : 'Current Price'}</Label>
              <p className="text-2xl font-bold text-gray-400 line-through">
                {formatPrice(selectedListingForAction?.pricePerUnit || '0')}
              </p>
            </div>
            
            <div>
              <Label>{lang === 'es' ? 'Nuevo Precio ($)' : 'New Price ($)'}</Label>
              <Input
                type="number"
                value={quickPrice}
                onChange={(e) => setQuickPrice(e.target.value)}
                className="text-2xl font-bold"
                autoFocus
              />
            </div>
            
            {quickPrice && selectedListingForAction?.pricePerUnit && (
              <div className="text-sm text-gray-500">
                {parseFloat(quickPrice) < parseFloat(selectedListingForAction.pricePerUnit) ? (
                  <span className="text-red-600">
                    ↓ {((1 - parseFloat(quickPrice) / parseFloat(selectedListingForAction.pricePerUnit)) * 100).toFixed(1)}% {lang === 'es' ? 'menos' : 'decrease'}
                  </span>
                ) : parseFloat(quickPrice) > parseFloat(selectedListingForAction.pricePerUnit) ? (
                  <span className="text-green-600">
                    ↑ {((parseFloat(quickPrice) / parseFloat(selectedListingForAction.pricePerUnit) - 1) * 100).toFixed(1)}% {lang === 'es' ? 'más' : 'increase'}
                  </span>
                ) : (
                  <span>{lang === 'es' ? 'Sin cambio' : 'No change'}</span>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setQuickPriceDialogOpen(false)}>
              {lang === 'es' ? 'Cancelar' : 'Cancel'}
            </Button>
            <Button 
              onClick={handleSaveQuickPrice}
              disabled={editListingMutation.isPending || !quickPrice}
              className="bg-[#0A3161] hover:bg-[#0A3161]/90"
            >
              {editListingMutation.isPending 
                ? (lang === 'es' ? 'Guardando...' : 'Saving...') 
                : (lang === 'es' ? 'Actualizar Precio' : 'Update Price')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
