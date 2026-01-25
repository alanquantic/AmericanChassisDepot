import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Package, 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Heart,
  Image as ImageIcon,
  Copy,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  getStoredUser, 
  isAuthenticated,
  getSellerListingsWithStats,
  getListingForEdit,
  updateListing,
  deleteListing,
  type MarketplaceListing,
  type SellerListingsResponse,
} from '@/lib/marketplace-api';
import { t, formatPrice, formatDate } from '@/lib/marketplace-i18n';
import { getCurrentLanguage } from '@/lib/i18n-simple';

export default function SellerListingsPage() {
  const [, navigate] = useLocation();
  const lang = getCurrentLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = getStoredUser();

  // State
  const [filters, setFilters] = useState({ status: 'all', search: '', page: 1, limit: 20 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<MarketplaceListing>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quickEditPriceOpen, setQuickEditPriceOpen] = useState(false);
  const [newPrice, setNewPrice] = useState('');

  // Redirect if not authenticated or not seller
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(`/${lang}/marketplace/login`);
      return;
    }
    if (!['seller', 'admin', 'super_admin'].includes(user?.role || '')) {
      navigate(`/${lang}/marketplace/dashboard`);
    }
  }, [user]);

  // Fetch listings
  const { data: listingsData, isLoading } = useQuery({
    queryKey: ['seller-listings-stats', filters],
    queryFn: () => getSellerListingsWithStats(filters),
    enabled: !!user && ['seller', 'admin', 'super_admin'].includes(user.role),
  });

  // Update listing mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MarketplaceListing> }) => updateListing(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-listings-stats'] });
      setEditDialogOpen(false);
      setQuickEditPriceOpen(false);
      setSelectedListing(null);
      toast({
        title: lang === 'es' ? 'Listing actualizado' : 'Listing Updated',
        description: lang === 'es' ? 'Los cambios han sido guardados.' : 'Changes have been saved.',
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

  // Delete listing mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-listings-stats'] });
      setDeleteDialogOpen(false);
      setSelectedListing(null);
      toast({
        title: lang === 'es' ? 'Listing eliminado' : 'Listing Deleted',
        description: lang === 'es' ? 'El listing ha sido eliminado.' : 'The listing has been deleted.',
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

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  const openEditDialog = async (listing: MarketplaceListing) => {
    setSelectedListing(listing);
    setEditData({
      title: listing.title,
      titleEs: listing.titleEs,
      description: listing.description,
      pricePerUnit: listing.pricePerUnit,
      quantity: listing.quantity,
      quantityAvailable: listing.quantityAvailable,
      priceNegotiable: listing.priceNegotiable,
      city: listing.city,
      state: listing.state,
    });
    setEditDialogOpen(true);
  };

  const openQuickPriceEdit = (listing: MarketplaceListing) => {
    setSelectedListing(listing);
    setNewPrice(listing.pricePerUnit);
    setQuickEditPriceOpen(true);
  };

  const openDeleteDialog = (listing: MarketplaceListing) => {
    setSelectedListing(listing);
    setDeleteDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> {lang === 'es' ? 'Activo' : 'Active'}</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500"><Clock className="w-3 h-3 mr-1" /> {lang === 'es' ? 'Pendiente' : 'Pending'}</Badge>;
      case 'draft':
        return <Badge variant="secondary"><Edit className="w-3 h-3 mr-1" /> {lang === 'es' ? 'Borrador' : 'Draft'}</Badge>;
      case 'sold':
        return <Badge className="bg-blue-500"><DollarSign className="w-3 h-3 mr-1" /> {lang === 'es' ? 'Vendido' : 'Sold'}</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> {lang === 'es' ? 'Rechazado' : 'Rejected'}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!user || !['seller', 'admin', 'super_admin'].includes(user.role)) {
    return null;
  }

  const statusCounts = listingsData?.statusCounts || {
    all: 0, active: 0, pending: 0, draft: 0, sold: 0, rejected: 0
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Package className="w-8 h-8 text-[#0A3161]" />
              {lang === 'es' ? 'Mis Listings' : 'My Listings'}
            </h1>
            <p className="text-gray-600 mt-1">
              {lang === 'es' ? 'Gestiona tu inventario de chassis' : 'Manage your chassis inventory'}
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0 bg-[#0A3161] hover:bg-[#0A3161]/90"
            onClick={() => navigate(`/${lang}/marketplace/seller/create`)}
          >
            <Plus className="w-4 h-4 mr-2" />
            {lang === 'es' ? 'Nuevo Listing' : 'New Listing'}
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: lang === 'es' ? 'Total' : 'All', value: statusCounts.all, color: 'text-gray-600', bgColor: 'bg-gray-100', filter: 'all' },
            { label: lang === 'es' ? 'Activos' : 'Active', value: statusCounts.active, color: 'text-green-600', bgColor: 'bg-green-100', filter: 'active' },
            { label: lang === 'es' ? 'Pendientes' : 'Pending', value: statusCounts.pending, color: 'text-amber-600', bgColor: 'bg-amber-100', filter: 'pending' },
            { label: lang === 'es' ? 'Borradores' : 'Drafts', value: statusCounts.draft, color: 'text-blue-600', bgColor: 'bg-blue-100', filter: 'draft' },
            { label: lang === 'es' ? 'Vendidos' : 'Sold', value: statusCounts.sold, color: 'text-purple-600', bgColor: 'bg-purple-100', filter: 'sold' },
            { label: lang === 'es' ? 'Rechazados' : 'Rejected', value: statusCounts.rejected, color: 'text-red-600', bgColor: 'bg-red-100', filter: 'rejected' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className={`cursor-pointer transition-all ${filters.status === stat.filter ? 'ring-2 ring-[#0A3161]' : 'hover:shadow-md'}`}
                onClick={() => setFilters({ ...filters, status: stat.filter, page: 1 })}
              >
                <CardContent className="p-4 text-center">
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder={lang === 'es' ? 'Buscar por título, número, ciudad...' : 'Search by title, number, city...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleSearch}>
                  <Search className="w-4 h-4" />
                </Button>
              </div>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value, page: 1 })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{lang === 'es' ? 'Todos' : 'All Status'}</SelectItem>
                  <SelectItem value="active">{lang === 'es' ? 'Activos' : 'Active'}</SelectItem>
                  <SelectItem value="pending">{lang === 'es' ? 'Pendientes' : 'Pending'}</SelectItem>
                  <SelectItem value="draft">{lang === 'es' ? 'Borradores' : 'Drafts'}</SelectItem>
                  <SelectItem value="sold">{lang === 'es' ? 'Vendidos' : 'Sold'}</SelectItem>
                  <SelectItem value="rejected">{lang === 'es' ? 'Rechazados' : 'Rejected'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Listings */}
        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : listingsData?.listings && listingsData.listings.length > 0 ? (
              <>
                <div className="space-y-4">
                  {listingsData.listings.map((listing: MarketplaceListing) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {/* Image */}
                      <div 
                        className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer"
                        onClick={() => navigate(`/${lang}/chassis-marketplace/${listing.slug}`)}
                      >
                        {listing.primaryImageUrl ? (
                          <img src={listing.primaryImageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-8 h-8 text-gray-400" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 
                            className="font-semibold truncate cursor-pointer hover:text-[#0A3161]"
                            onClick={() => navigate(`/${lang}/chassis-marketplace/${listing.slug}`)}
                          >
                            {listing.title}
                          </h3>
                          <Badge variant="outline" className="text-xs">{listing.listingNumber}</Badge>
                          {getStatusBadge(listing.status)}
                        </div>
                        <p className="text-sm text-gray-500">
                          {listing.chassisType} {listing.chassisSize} • {listing.condition} • {listing.city}, {listing.state}
                        </p>
                        
                        {/* Stats row */}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {listing.viewsCount || 0} {lang === 'es' ? 'vistas' : 'views'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {listing.favoritesCount || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {listing.offersCount || 0} {lang === 'es' ? 'ofertas' : 'offers'}
                          </span>
                          {listing.rejectionReason && (
                            <span className="flex items-center gap-1 text-red-600">
                              <AlertTriangle className="w-3 h-3" />
                              {lang === 'es' ? 'Ver razón de rechazo' : 'See rejection reason'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price & Quantity */}
                      <div className="text-right">
                        <p 
                          className="text-xl font-bold text-[#0A3161] cursor-pointer hover:underline"
                          onClick={() => openQuickPriceEdit(listing)}
                          title={lang === 'es' ? 'Click para editar precio' : 'Click to edit price'}
                        >
                          {formatPrice(listing.pricePerUnit)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {listing.quantityAvailable}/{listing.quantity} {lang === 'es' ? 'disponibles' : 'available'}
                        </p>
                        {listing.priceNegotiable && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {lang === 'es' ? 'Negociable' : 'Negotiable'}
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/${lang}/chassis-marketplace/${listing.slug}`)}>
                            <Eye className="w-4 h-4 mr-2" />
                            {lang === 'es' ? 'Ver Listing' : 'View Listing'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(listing)}>
                            <Edit className="w-4 h-4 mr-2" />
                            {lang === 'es' ? 'Editar' : 'Edit'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openQuickPriceEdit(listing)}>
                            <DollarSign className="w-4 h-4 mr-2" />
                            {lang === 'es' ? 'Cambiar Precio' : 'Change Price'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/${lang}/marketplace/seller/listings/${listing.id}/images`)}>
                            <ImageIcon className="w-4 h-4 mr-2" />
                            {lang === 'es' ? 'Gestionar Fotos' : 'Manage Photos'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => openDeleteDialog(listing)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {lang === 'es' ? 'Eliminar' : 'Delete'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {listingsData.pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      disabled={filters.page === 1}
                      onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    >
                      {lang === 'es' ? 'Anterior' : 'Previous'}
                    </Button>
                    <span className="flex items-center px-4 text-sm text-gray-500">
                      {lang === 'es' ? 'Página' : 'Page'} {filters.page} {lang === 'es' ? 'de' : 'of'} {listingsData.pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={!listingsData.pagination.hasMore}
                      onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    >
                      {lang === 'es' ? 'Siguiente' : 'Next'}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {lang === 'es' ? 'No hay listings' : 'No listings yet'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {lang === 'es' ? 'Comienza creando tu primer listing' : 'Start by creating your first listing'}
                </p>
                <Button onClick={() => navigate(`/${lang}/marketplace/seller/create`)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {lang === 'es' ? 'Crear Listing' : 'Create Listing'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{lang === 'es' ? 'Editar Listing' : 'Edit Listing'}</DialogTitle>
            <DialogDescription>
              {selectedListing?.listingNumber}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div>
              <Label>{lang === 'es' ? 'Título (Inglés)' : 'Title (English)'}</Label>
              <Input
                value={editData.title || ''}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              />
            </div>
            <div>
              <Label>{lang === 'es' ? 'Título (Español)' : 'Title (Spanish)'}</Label>
              <Input
                value={editData.titleEs || ''}
                onChange={(e) => setEditData({ ...editData, titleEs: e.target.value })}
              />
            </div>
            <div>
              <Label>{lang === 'es' ? 'Descripción' : 'Description'}</Label>
              <Textarea
                value={editData.description || ''}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{lang === 'es' ? 'Precio por Unidad ($)' : 'Price per Unit ($)'}</Label>
                <Input
                  type="number"
                  value={editData.pricePerUnit || ''}
                  onChange={(e) => setEditData({ ...editData, pricePerUnit: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={editData.priceNegotiable || false}
                  onCheckedChange={(checked) => setEditData({ ...editData, priceNegotiable: checked })}
                />
                <Label>{lang === 'es' ? 'Precio Negociable' : 'Price Negotiable'}</Label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{lang === 'es' ? 'Cantidad Total' : 'Total Quantity'}</Label>
                <Input
                  type="number"
                  value={editData.quantity || ''}
                  onChange={(e) => setEditData({ ...editData, quantity: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label>{lang === 'es' ? 'Cantidad Disponible' : 'Available Quantity'}</Label>
                <Input
                  type="number"
                  value={editData.quantityAvailable || ''}
                  onChange={(e) => setEditData({ ...editData, quantityAvailable: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{lang === 'es' ? 'Ciudad' : 'City'}</Label>
                <Input
                  value={editData.city || ''}
                  onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                />
              </div>
              <div>
                <Label>{lang === 'es' ? 'Estado' : 'State'}</Label>
                <Input
                  value={editData.state || ''}
                  onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              {lang === 'es' ? 'Cancelar' : 'Cancel'}
            </Button>
            <Button 
              onClick={() => selectedListing && updateMutation.mutate({ id: selectedListing.id, data: editData })}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending 
                ? (lang === 'es' ? 'Guardando...' : 'Saving...') 
                : (lang === 'es' ? 'Guardar Cambios' : 'Save Changes')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Price Edit Dialog */}
      <Dialog open={quickEditPriceOpen} onOpenChange={setQuickEditPriceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang === 'es' ? 'Cambiar Precio' : 'Change Price'}</DialogTitle>
            <DialogDescription>
              {selectedListing?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label>{lang === 'es' ? 'Nuevo Precio por Unidad ($)' : 'New Price per Unit ($)'}</Label>
            <Input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="mt-2"
              placeholder="0.00"
            />
            <p className="text-sm text-gray-500 mt-2">
              {lang === 'es' ? 'Precio actual' : 'Current price'}: {formatPrice(selectedListing?.pricePerUnit || '0')}
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setQuickEditPriceOpen(false)}>
              {lang === 'es' ? 'Cancelar' : 'Cancel'}
            </Button>
            <Button 
              onClick={() => selectedListing && updateMutation.mutate({ 
                id: selectedListing.id, 
                data: { pricePerUnit: newPrice } 
              })}
              disabled={updateMutation.isPending || !newPrice}
            >
              {updateMutation.isPending 
                ? (lang === 'es' ? 'Actualizando...' : 'Updating...') 
                : (lang === 'es' ? 'Actualizar Precio' : 'Update Price')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {lang === 'es' ? '¿Eliminar este listing?' : 'Delete this listing?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {lang === 'es' 
                ? `Esta acción no se puede deshacer. Se eliminará permanentemente "${selectedListing?.title}".`
                : `This action cannot be undone. This will permanently delete "${selectedListing?.title}".`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{lang === 'es' ? 'Cancelar' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => selectedListing && deleteMutation.mutate(selectedListing.id)}
            >
              {deleteMutation.isPending 
                ? (lang === 'es' ? 'Eliminando...' : 'Deleting...') 
                : (lang === 'es' ? 'Eliminar' : 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
