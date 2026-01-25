import { useEffect, useState } from 'react';
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
  const [activeSection, setActiveSection] = useState<'dashboard' | 'offers' | 'messages' | 'favorites' | 'settings'>('dashboard');

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
      label: t('activeListings'),
      value: listings?.pagination?.total || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      show: isSeller,
    },
    {
      label: t('offersReceived'),
      value: receivedOffers?.filter(o => o.status === 'pending').length || 0,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      show: isSeller,
    },
    {
      label: t('offersSent'),
      value: sentOffers?.filter(o => o.status === 'pending').length || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      show: true,
    },
    {
      label: t('favorites'),
      value: favorites?.length || 0,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      show: true,
    },
    {
      label: t('unreadMessages'),
      value: conversations?.reduce((acc, c) => acc + (c.buyerUnreadCount || 0) + (c.sellerUnreadCount || 0), 0) || 0,
      icon: MessageSquare,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
      show: true,
    },
    {
      label: t('notifications'),
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
                    onClick={() => setActiveSection('dashboard')}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${activeSection === 'dashboard' ? 'bg-[#0A3161]/10 text-[#0A3161] font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
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
                    onClick={() => setActiveSection('offers')}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${activeSection === 'offers' ? 'bg-[#0A3161]/10 text-[#0A3161] font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
                  >
                    <DollarSign className="w-5 h-5" />
                    {t('myOffers')}
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('messages')}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${activeSection === 'messages' ? 'bg-[#0A3161]/10 text-[#0A3161] font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
                  >
                    <MessageSquare className="w-5 h-5" />
                    {t('messages')}
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('favorites')}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${activeSection === 'favorites' ? 'bg-[#0A3161]/10 text-[#0A3161] font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
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
                    onClick={() => setActiveSection('settings')}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${activeSection === 'settings' ? 'bg-[#0A3161]/10 text-[#0A3161] font-medium' : 'hover:bg-gray-100 text-gray-700'}`}
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
                        {t('welcome')}, {user.firstName || 'User'}!
                      </h1>
                      <p className="text-blue-100">
                        {t('manageYourAccount')}
                      </p>
                    </div>
                    {isSeller && (
                      <Button 
                        onClick={() => navigate(`/${lang}/marketplace/seller/create`)}
                        className="bg-white text-[#0A3161] hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {t('newListing')}
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

            {/* Content based on activeSection */}
            {activeSection === 'dashboard' && (
              <div className="space-y-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('recentActivity')}</CardTitle>
                    <CardDescription>{t('yourLatestActivity')}</CardDescription>
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
                      <p className="text-center text-gray-500 py-8">{t('noRecentActivity')}</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'offers' && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('myOffers')}</CardTitle>
                  <CardDescription>
                    {isSeller ? t('offersDescription') : t('offersSent')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="sent">
                    <TabsList className="mb-4">
                      <TabsTrigger value="sent">{t('sent')} ({sentOffers?.length || 0})</TabsTrigger>
                      {isSeller && (
                        <TabsTrigger value="received">
                          {t('received')} ({receivedOffers?.filter(o => o.status === 'pending').length || 0})
                        </TabsTrigger>
                      )}
                    </TabsList>

                    <TabsContent value="sent">
                      {sentOffers && sentOffers.length > 0 ? (
                        <div className="space-y-4">
                          {sentOffers.map((offer: any) => (
                            <div key={offer.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium">{offer.listingTitle}</p>
                                <p className="text-sm text-gray-500">
                                  {offer.quantity} {t('units')} @ {formatPrice(offer.pricePerUnit)}/{t('unit')}
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
                        <p className="text-center text-gray-500 py-8">{t('noOffersSent')}</p>
                      )}
                    </TabsContent>

                    {isSeller && (
                      <TabsContent value="received">
                        {receivedOffers && receivedOffers.length > 0 ? (
                          <div className="space-y-4">
                            {receivedOffers.map((offer: any) => (
                              <div key={offer.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                  <p className="font-medium">{offer.listingTitle}</p>
                                  <p className="text-sm text-gray-500">
                                    {offer.quantity} {t('units')} @ {formatPrice(offer.pricePerUnit)}/{t('unit')}
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
                          <p className="text-center text-gray-500 py-8">{t('noOffersReceived')}</p>
                        )}
                      </TabsContent>
                    )}
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {activeSection === 'messages' && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('messages')}</CardTitle>
                  <CardDescription>{t('messagesDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  {conversations && conversations.length > 0 ? (
                    <div className="space-y-4">
                      {conversations.map((conversation: any) => (
                        <div key={conversation.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 rounded-full bg-[#0A3161]/10 flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-[#0A3161]" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{conversation.listingTitle || t('conversation')}</p>
                            <p className="text-sm text-gray-500 truncate">{conversation.lastMessagePreview || t('noMessagesYet')}</p>
                          </div>
                          {(conversation.buyerUnreadCount > 0 || conversation.sellerUnreadCount > 0) && (
                            <Badge variant="default">
                              {conversation.buyerUnreadCount + conversation.sellerUnreadCount} new
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">{t('noMessagesYet')}</p>
                      <p className="text-sm text-gray-400 mt-2">{t('startConversation')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeSection === 'favorites' && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('favorites')}</CardTitle>
                  <CardDescription>{t('favoritesDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  {favorites && favorites.length > 0 ? (
                    <div className="space-y-4">
                      {favorites.map((favorite: any) => (
                        <div 
                          key={favorite.id} 
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                          onClick={() => navigate(`/${lang}/chassis-marketplace/${favorite.listing?.slug}`)}
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                            {favorite.listing?.primaryImageUrl ? (
                              <img src={favorite.listing.primaryImageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Heart className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{favorite.listing?.title || 'Listing'}</p>
                            <p className="text-sm text-gray-500">
                              {favorite.listing?.city}, {favorite.listing?.state}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#0A3161]">{formatPrice(favorite.listing?.pricePerUnit)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">{t('noFavoritesYet')}</p>
                      <p className="text-sm text-gray-400 mt-2">{t('saveFavorites')}</p>
                      <Button 
                        onClick={() => navigate(`/${lang}/chassis-marketplace`)} 
                        className="mt-4"
                        variant="outline"
                      >
                        {t('browseMarketplace')}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeSection === 'settings' && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('settings')}</CardTitle>
                  <CardDescription>{t('settingsDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium mb-2">{t('accountInformation')}</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>{t('email')}:</strong> {user.email}</p>
                        <p><strong>{lang === 'es' ? 'Nombre' : 'Name'}:</strong> {user.firstName || (lang === 'es' ? 'No establecido' : 'Not set')} {user.lastName || ''}</p>
                        <p><strong>{lang === 'es' ? 'Empresa' : 'Company'}:</strong> {user.companyName || (lang === 'es' ? 'No establecido' : 'Not set')}</p>
                        <p><strong>{lang === 'es' ? 'Rol' : 'Role'}:</strong> <Badge variant="secondary" className="capitalize">{user.role}</Badge></p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium mb-2 text-blue-900">{t('needHelp')}</h3>
                      <p className="text-sm text-blue-700">
                        {t('contactSupport')} <a href="mailto:sales@americanchassisdepot.com" className="underline">sales@americanchassisdepot.com</a> {lang === 'es' ? 'o llama al' : 'or call'} <a href="tel:+14422579946" className="underline">+1 (442) 257-9946</a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
