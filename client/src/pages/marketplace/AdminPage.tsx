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
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
} from '@/lib/marketplace-api';
import { t, formatPrice, formatDate } from '@/lib/marketplace-i18n';
import { getCurrentLanguage } from '@/lib/i18n-simple';

export default function AdminPage() {
  const [, navigate] = useLocation();
  const lang = getCurrentLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = getStoredUser();

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');

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

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['marketplace-stats'],
    queryFn: getMarketplaceStats,
  });

  // Fetch pending listings
  const { data: pendingListings, isLoading: pendingLoading } = useQuery({
    queryKey: ['pending-listings'],
    queryFn: getPendingListings,
  });

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

  const handleReject = () => {
    if (!selectedListing || !rejectReason.trim()) return;
    rejectMutation.mutate({ id: selectedListing.id, reason: rejectReason });
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
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-[#0A3161]" />
            <h1 className="text-3xl font-bold text-gray-900">{t('adminPanel')}</h1>
          </div>
          <p className="text-gray-600">
            Manage listings, users, and marketplace settings
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
            <TabsTrigger value="users">Users</TabsTrigger>
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
                <CardTitle>All Listings</CardTitle>
                <CardDescription>View and manage all marketplace listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Full listing management coming soon</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate(`/${lang}/chassis-marketplace`)}
                  >
                    View Marketplace
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage buyers, sellers, and admins</CardDescription>
              </CardHeader>
              <CardContent>
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
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Full user management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Offers */}
          <TabsContent value="offers">
            <Card>
              <CardHeader>
                <CardTitle>Offer Overview</CardTitle>
                <CardDescription>Monitor marketplace offers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-amber-600">{stats?.offers?.pendingOffers || 0}</p>
                      <p className="text-sm text-gray-500">Pending</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-green-600">{stats?.offers?.acceptedOffers || 0}</p>
                      <p className="text-sm text-gray-500">Accepted</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-3xl font-bold text-gray-600">{stats?.offers?.totalOffers || 0}</p>
                      <p className="text-sm text-gray-500">Total</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Full offer management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Reject Dialog */}
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

      <Footer />
    </div>
  );
}
