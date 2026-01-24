import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  MessageSquare, 
  Heart,
  DollarSign,
  TrendingUp,
  Eye,
  Bell,
  Plus,
  ChevronRight,
  User,
  Building2,
  Settings,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  getStoredUser, 
  isAuthenticated,
  logout,
  getSellerListings,
  getSentOffers,
  getReceivedOffers,
  getFavorites,
  getConversations,
  getNotifications,
  type MarketplaceUser,
} from '@/lib/marketplace-api';
import { t, formatPrice, formatDate } from '@/lib/marketplace-i18n';
import { getCurrentLanguage } from '@/lib/i18n-simple';

export default function DashboardPage() {
  const [, navigate] = useLocation();
  const lang = getCurrentLanguage();
  const user = getStoredUser();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(`/${lang}/marketplace/login`);
    }
  }, []);

  // Fetch data
  const { data: listings } = useQuery({
    queryKey: ['seller-listings'],
    queryFn: () => getSellerListings({ limit: 5 }),
    enabled: user?.role === 'seller' || user?.role === 'admin' || user?.role === 'super_admin',
  });

  const { data: sentOffers } = useQuery({
    queryKey: ['sent-offers'],
    queryFn: getSentOffers,
  });

  const { data: receivedOffers } = useQuery({
    queryKey: ['received-offers'],
    queryFn: getReceivedOffers,
    enabled: user?.role === 'seller' || user?.role === 'admin' || user?.role === 'super_admin',
  });

  const { data: favorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavorites,
  });

  const { data: conversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => getConversations('all'),
  });

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(true),
  });

  const handleLogout = () => {
    logout();
    navigate(`/${lang}/chassis-marketplace`);
  };

  if (!user) {
    return null;
  }

  const isSeller = ['seller', 'admin', 'super_admin'].includes(user.role);
  const isAdmin = ['admin', 'super_admin'].includes(user.role);

  const stats = [
    {
      label: 'Active Listings',
      value: listings?.pagination?.total || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      show: isSeller,
    },
    {
      label: 'Offers Received',
      value: receivedOffers?.filter(o => o.status === 'pending').length || 0,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      show: isSeller,
    },
    {
      label: 'Offers Sent',
      value: sentOffers?.filter(o => o.status === 'pending').length || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      show: true,
    },
    {
      label: 'Favorites',
      value: favorites?.length || 0,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      show: true,
    },
    {
      label: 'Unread Messages',
      value: conversations?.reduce((acc, c) => acc + (c.buyerUnreadCount || 0) + (c.sellerUnreadCount || 0), 0) || 0,
      icon: MessageSquare,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      show: true,
    },
    {
      label: 'Notifications',
      value: notifications?.length || 0,
      icon: Bell,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      show: true,
    },
  ].filter(s => s.show);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-6">
                {/* User Info */}
                <div className="text-center mb-6">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarFallback className="bg-[#0A3161] text-white text-2xl">
                      {(user.firstName?.[0] || user.email[0]).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="font-semibold text-lg">
                    {user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email}
                  </h2>
                  {user.companyName && (
                    <p className="text-sm text-gray-500">{user.companyName}</p>
                  )}
                  <Badge variant="secondary" className="mt-2 capitalize">
                    {user.role}
                  </Badge>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                  <button
                    onClick={() => navigate(`/${lang}/marketplace/dashboard`)}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-[#0A3161]/10 text-[#0A3161] font-medium"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    {t('dashboard')}
                  </button>
                  
                  {isSeller && (
                    <button
                      onClick={() => navigate(`/${lang}/marketplace/seller/listings`)}
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                    >
                      <Package className="w-5 h-5" />
                      {t('myListings')}
                    </button>
                  )}
                  
                  <button
                    onClick={() => navigate(`/${lang}/marketplace/offers`)}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                  >
                    <DollarSign className="w-5 h-5" />
                    {t('myOffers')}
                  </button>
                  
                  <button
                    onClick={() => navigate(`/${lang}/marketplace/messages`)}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                  >
                    <MessageSquare className="w-5 h-5" />
                    {t('messages')}
                  </button>
                  
                  <button
                    onClick={() => navigate(`/${lang}/marketplace/favorites`)}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                  >
                    <Heart className="w-5 h-5" />
                    {t('favorites')}
                  </button>
                  
                  {isAdmin && (
                    <button
                      onClick={() => navigate(`/${lang}/marketplace/admin`)}
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                    >
                      <Building2 className="w-5 h-5" />
                      {t('adminPanel')}
                    </button>
                  )}
                  
                  <div className="border-t my-4"></div>
                  
                  <button
                    onClick={() => navigate(`/${lang}/marketplace/settings`)}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                  >
                    <Settings className="w-5 h-5" />
                    {t('settings')}
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-50 text-red-600"
                  >
                    <LogOut className="w-5 h-5" />
                    {t('logout')}
                  </button>
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Welcome */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-gradient-to-r from-[#0A3161] to-[#1a4a8a] text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">
                        {lang === 'es' ? 'Bienvenido' : 'Welcome'}, {user.firstName || 'User'}!
                      </h1>
                      <p className="text-blue-100">
                        {lang === 'es' 
                          ? 'Administra tu cuenta del marketplace desde aquí.' 
                          : 'Manage your marketplace account from here.'}
                      </p>
                    </div>
                    {isSeller && (
                      <Button 
                        onClick={() => navigate(`/${lang}/marketplace/seller/create`)}
                        className="bg-white text-[#0A3161] hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        New Listing
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.map((stat, index) => (
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
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="activity" className="space-y-4">
              <TabsList>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                {isSeller && <TabsTrigger value="listings">My Listings</TabsTrigger>}
                <TabsTrigger value="offers">Offers</TabsTrigger>
              </TabsList>

              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest marketplace activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {notifications && notifications.length > 0 ? (
                      <div className="space-y-4">
                        {notifications.slice(0, 5).map((notification: any) => (
                          <div 
                            key={notification.id}
                            className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="w-10 h-10 rounded-full bg-[#0A3161]/10 flex items-center justify-center">
                              <Bell className="w-5 h-5 text-[#0A3161]" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{notification.title}</p>
                              <p className="text-sm text-gray-500">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatDate(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">No recent activity</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {isSeller && (
                <TabsContent value="listings">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>{t('myListings')}</CardTitle>
                        <CardDescription>Manage your chassis listings</CardDescription>
                      </div>
                      <Button onClick={() => navigate(`/${lang}/marketplace/seller/listings`)}>
                        View All
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {listings?.listings && listings.listings.length > 0 ? (
                        <div className="space-y-4">
                          {listings.listings.slice(0, 5).map((listing) => (
                            <div 
                              key={listing.id}
                              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                              onClick={() => navigate(`/${lang}/chassis-marketplace/${listing.slug}`)}
                            >
                              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                                {listing.primaryImageUrl ? (
                                  <img src={listing.primaryImageUrl} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-6 h-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{listing.title}</p>
                                <p className="text-sm text-gray-500">
                                  {listing.city}, {listing.state} • {listing.quantityAvailable} units
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-[#0A3161]">{formatPrice(listing.pricePerUnit)}</p>
                                <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                                  {listing.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 mb-4">No listings yet</p>
                          <Button onClick={() => navigate(`/${lang}/marketplace/seller/create`)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Listing
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              <TabsContent value="offers">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('myOffers')}</CardTitle>
                    <CardDescription>
                      {isSeller ? 'Offers you sent and received' : 'Offers you sent'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="sent">
                      <TabsList className="mb-4">
                        <TabsTrigger value="sent">Sent ({sentOffers?.length || 0})</TabsTrigger>
                        {isSeller && (
                          <TabsTrigger value="received">
                            Received ({receivedOffers?.filter(o => o.status === 'pending').length || 0})
                          </TabsTrigger>
                        )}
                      </TabsList>

                      <TabsContent value="sent">
                        {sentOffers && sentOffers.length > 0 ? (
                          <div className="space-y-4">
                            {sentOffers.slice(0, 5).map((offer: any) => (
                              <div key={offer.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                  <p className="font-medium">{offer.listingTitle}</p>
                                  <p className="text-sm text-gray-500">
                                    {offer.quantity} units @ {formatPrice(offer.pricePerUnit)}/unit
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold">{formatPrice(offer.totalAmount)}</p>
                                  <Badge 
                                    variant={
                                      offer.status === 'accepted' ? 'default' :
                                      offer.status === 'rejected' ? 'destructive' :
                                      'secondary'
                                    }
                                  >
                                    {offer.status}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-gray-500 py-8">No offers sent</p>
                        )}
                      </TabsContent>

                      {isSeller && (
                        <TabsContent value="received">
                          {receivedOffers && receivedOffers.length > 0 ? (
                            <div className="space-y-4">
                              {receivedOffers.slice(0, 5).map((offer: any) => (
                                <div key={offer.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                  <div className="flex-1">
                                    <p className="font-medium">{offer.listingTitle}</p>
                                    <p className="text-sm text-gray-500">
                                      {offer.quantity} units @ {formatPrice(offer.pricePerUnit)}/unit
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold">{formatPrice(offer.totalAmount)}</p>
                                    <Badge 
                                      variant={offer.status === 'pending' ? 'default' : 'secondary'}
                                    >
                                      {offer.status}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-center text-gray-500 py-8">No offers received</p>
                          )}
                        </TabsContent>
                      )}
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
