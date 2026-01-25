import { useEffect, useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useParams } from 'wouter';
import { motion, Reorder } from 'framer-motion';
import { 
  Image as ImageIcon, 
  Upload,
  Trash2,
  Star,
  GripVertical,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Link as LinkIcon,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  getStoredUser, 
  isAuthenticated,
  getListingForEdit,
  getListingImages,
  addListingImage,
  deleteListingImage,
  setListingPrimaryImage,
  reorderListingImages,
  checkUploadStatus,
  uploadImage,
  uploadImageFromUrl,
  fileToBase64,
  type ListingImage,
  type MarketplaceListing,
} from '@/lib/marketplace-api';
import { getCurrentLanguage } from '@/lib/i18n-simple';

// Image compression constants
const MAX_FILE_SIZE = 500 * 1024; // 500KB
const MAX_DIMENSION = 1920; // Max width/height
const COMPRESSION_QUALITY = 0.85;

// Compress image function
async function compressImage(file: File): Promise<{ blob: Blob; wasCompressed: boolean }> {
  return new Promise((resolve, reject) => {
    // If file is already small enough and is JPEG/WebP, return as-is
    if (file.size <= MAX_FILE_SIZE && (file.type === 'image/jpeg' || file.type === 'image/webp')) {
      resolve({ blob: file, wasCompressed: false });
      return;
    }

    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw with white background (for PNGs with transparency)
      ctx!.fillStyle = '#FFFFFF';
      ctx!.fillRect(0, 0, width, height);
      ctx!.drawImage(img, 0, 0, width, height);

      // Try to compress to target size
      let quality = COMPRESSION_QUALITY;
      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            // If still too large and quality can be reduced
            if (blob.size > MAX_FILE_SIZE && quality > 0.5) {
              quality -= 0.1;
              tryCompress();
              return;
            }

            resolve({ blob, wasCompressed: true });
          },
          'image/jpeg',
          quality
        );
      };

      tryCompress();
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

// Format file size for display
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ListingImagesPage() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const listingId = Number(params.id);
  const lang = getCurrentLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const user = getStoredUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [images, setImages] = useState<ListingImage[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [urlUploadOpen, setUrlUploadOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ListingImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus2, setUploadStatus2] = useState('');
  const [dragOver, setDragOver] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(`/${lang}/marketplace/login`);
    }
  }, []);

  // Fetch listing info
  const { data: listing, isLoading: listingLoading } = useQuery({
    queryKey: ['listing-edit', listingId],
    queryFn: () => getListingForEdit(listingId),
    enabled: !!listingId && !!user,
  });

  // Fetch images
  const { data: listingImages, isLoading: imagesLoading, refetch: refetchImages } = useQuery({
    queryKey: ['listing-images', listingId],
    queryFn: () => getListingImages(listingId),
    enabled: !!listingId && !!user,
  });

  // Check upload status
  const { data: uploadStatus } = useQuery({
    queryKey: ['upload-status'],
    queryFn: checkUploadStatus,
    enabled: !!user,
  });

  // Update local images when fetched
  useEffect(() => {
    if (listingImages) {
      setImages(listingImages);
    }
  }, [listingImages]);

  // Set primary mutation
  const setPrimaryMutation = useMutation({
    mutationFn: (imageId: number) => setListingPrimaryImage(listingId, imageId),
    onSuccess: () => {
      refetchImages();
      toast({ title: lang === 'es' ? 'Imagen principal actualizada' : 'Primary image updated' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Delete image mutation
  const deleteImageMutation = useMutation({
    mutationFn: (imageId: number) => deleteListingImage(listingId, imageId),
    onSuccess: () => {
      refetchImages();
      setDeleteDialogOpen(false);
      setSelectedImage(null);
      toast({ title: lang === 'es' ? 'Imagen eliminada' : 'Image deleted' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Reorder images mutation
  const reorderMutation = useMutation({
    mutationFn: (imageIds: number[]) => reorderListingImages(listingId, imageIds),
    onSuccess: () => {
      toast({ title: lang === 'es' ? 'Orden actualizado' : 'Order updated' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // Handle file upload
  const handleFileUpload = async (files: FileList | File[]) => {
    if (!uploadStatus?.configured) {
      toast({ 
        title: 'Error', 
        description: lang === 'es' ? 'Subida de imágenes no disponible' : 'Image upload not available',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    setUploadStatus2('');
    const fileArray = Array.from(files);
    let completed = 0;
    let compressed = 0;

    try {
      for (const file of fileArray) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          toast({ 
            title: lang === 'es' ? 'Formato no válido' : 'Invalid format', 
            description: lang === 'es' 
              ? `${file.name} debe ser JPG, PNG, WebP o GIF` 
              : `${file.name} must be JPG, PNG, WebP or GIF`,
            variant: 'destructive'
          });
          continue;
        }

        // Validate initial file size (max 10MB before compression)
        if (file.size > 10 * 1024 * 1024) {
          toast({ 
            title: lang === 'es' ? 'Imagen muy grande' : 'Image too large', 
            description: lang === 'es' 
              ? `${file.name} supera los 10MB. Por favor usa una imagen más pequeña.` 
              : `${file.name} exceeds 10MB. Please use a smaller image.`,
            variant: 'destructive'
          });
          continue;
        }

        // Update status for user
        setUploadStatus2(
          lang === 'es' 
            ? `Procesando ${file.name}...` 
            : `Processing ${file.name}...`
        );

        // Compress image if needed
        let imageBlob: Blob = file;
        try {
          const originalSize = file.size;
          
          if (originalSize > MAX_FILE_SIZE) {
            setUploadStatus2(
              lang === 'es' 
                ? `Optimizando ${file.name} (${formatFileSize(originalSize)})...` 
                : `Optimizing ${file.name} (${formatFileSize(originalSize)})...`
            );
          }
          
          const { blob, wasCompressed } = await compressImage(file);
          imageBlob = blob;
          
          if (wasCompressed) {
            compressed++;
            console.log(`Compressed ${file.name}: ${formatFileSize(originalSize)} → ${formatFileSize(blob.size)}`);
          }
        } catch (compressError) {
          console.error('Compression failed, using original:', compressError);
          // Continue with original file if compression fails
        }

        // Convert to base64 and upload
        setUploadStatus2(
          lang === 'es' 
            ? `Subiendo ${file.name}...` 
            : `Uploading ${file.name}...`
        );
        
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageBlob);
        });

        await uploadImage({
          image: base64,
          listingId,
          isPrimary: images.length === 0 && completed === 0,
        });

        completed++;
        setUploadProgress(Math.round((completed / fileArray.length) * 100));
      }

      refetchImages();
      setUploadDialogOpen(false);
      
      // Success message
      const successMsg = lang === 'es' 
        ? `${completed} ${completed === 1 ? 'imagen subida' : 'imágenes subidas'}${compressed > 0 ? ` (${compressed} optimizadas automáticamente)` : ''}`
        : `${completed} ${completed === 1 ? 'image uploaded' : 'images uploaded'}${compressed > 0 ? ` (${compressed} auto-optimized)` : ''}`;
      
      toast({ 
        title: lang === 'es' ? 'Listo' : 'Done',
        description: successMsg
      });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setUploadStatus2('');
    }
  };

  // Handle URL upload
  const handleUrlUpload = async () => {
    if (!imageUrl.trim()) return;

    setUploading(true);
    try {
      await uploadImageFromUrl({
        url: imageUrl,
        listingId,
        isPrimary: images.length === 0,
      });

      refetchImages();
      setUrlUploadOpen(false);
      setImageUrl('');
      toast({ title: lang === 'es' ? 'Imagen subida' : 'Image uploaded' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  }, [images.length]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  // Handle reorder
  const handleReorder = (newOrder: ListingImage[]) => {
    setImages(newOrder);
    reorderMutation.mutate(newOrder.map(img => img.id));
  };

  if (!user) return null;

  const isLoading = listingLoading || imagesLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate(`/${lang}/marketplace/seller/listings`)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {lang === 'es' ? 'Volver a Mis Listings' : 'Back to My Listings'}
        </Button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Camera className="w-7 h-7 text-[#0A3161]" />
            {lang === 'es' ? 'Gestionar Fotos' : 'Manage Photos'}
          </h1>
          {listing && (
            <p className="text-gray-600 mt-1">
              {listing.title} ({listing.listingNumber})
            </p>
          )}
        </motion.div>

        {/* Upload Status Warning */}
        {uploadStatus && !uploadStatus.configured && (
          <Card className="mb-6 border-amber-300 bg-amber-50">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <p className="text-amber-800">
                {lang === 'es' 
                  ? 'La subida de imágenes no está configurada. Contacta al administrador.'
                  : 'Image upload is not configured. Contact the administrator.'}
              </p>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#0A3161]" />
          </div>
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>
                  {lang === 'es' ? 'Fotos del Listing' : 'Listing Photos'}
                  <Badge variant="outline" className="ml-2">{images.length}</Badge>
                </CardTitle>
                <CardDescription>
                  {lang === 'es' 
                    ? 'Arrastra para reordenar. La primera imagen es la principal.'
                    : 'Drag to reorder. First image is the primary.'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setUrlUploadOpen(true)} disabled={!uploadStatus?.configured}>
                  <LinkIcon className="w-4 h-4 mr-2" />
                  URL
                </Button>
                <Button onClick={() => setUploadDialogOpen(true)} disabled={!uploadStatus?.configured}>
                  <Upload className="w-4 h-4 mr-2" />
                  {lang === 'es' ? 'Subir' : 'Upload'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Info banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">
                      {lang === 'es' ? 'Optimización automática' : 'Auto-optimization'}
                    </p>
                    <p>
                      {lang === 'es' 
                        ? 'Las imágenes grandes se optimizan automáticamente para cargar rápido. Formatos: JPG, PNG, WebP, GIF.'
                        : 'Large images are automatically optimized for fast loading. Formats: JPG, PNG, WebP, GIF.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-8 mb-6 transition-colors ${
                  dragOver 
                    ? 'border-[#0A3161] bg-[#0A3161]/5' 
                    : uploading
                    ? 'border-[#0A3161] bg-[#0A3161]/5'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {uploading ? (
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#0A3161] mx-auto mb-3 animate-spin" />
                    <p className="text-[#0A3161] font-medium mb-1">
                      {uploadStatus2 || (lang === 'es' ? 'Procesando...' : 'Processing...')}
                    </p>
                    {uploadProgress > 0 && (
                      <div className="w-48 mx-auto bg-gray-200 rounded-full h-2 mt-3">
                        <div 
                          className="bg-[#0A3161] h-2 rounded-full transition-all" 
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ) : images.length === 0 ? (
                  <div className="text-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-1">
                      {lang === 'es' 
                        ? 'Arrastra imágenes aquí o haz click para subir'
                        : 'Drag images here or click to upload'}
                    </p>
                    <p className="text-gray-400 text-sm mb-3">
                      {lang === 'es' 
                        ? 'JPG, PNG, WebP o GIF • Se optimizan automáticamente'
                        : 'JPG, PNG, WebP or GIF • Auto-optimized'}
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={!uploadStatus?.configured}
                    >
                      {lang === 'es' ? 'Seleccionar archivos' : 'Select files'}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                    />
                  </div>
                ) : (
                  <Reorder.Group 
                    axis="y" 
                    values={images} 
                    onReorder={handleReorder}
                    className="space-y-3"
                  >
                    {images.map((image, index) => (
                      <Reorder.Item
                        key={image.id}
                        value={image}
                        className="bg-white border rounded-lg p-3 flex items-center gap-4 cursor-grab active:cursor-grabbing"
                      >
                        <GripVertical className="w-5 h-5 text-gray-400" />
                        
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img 
                            src={image.thumbnailUrl || image.url} 
                            alt={image.altText || `Image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">#{index + 1}</span>
                            {image.isPrimary && (
                              <Badge className="bg-[#0A3161]">
                                <Star className="w-3 h-3 mr-1" />
                                {lang === 'es' ? 'Principal' : 'Primary'}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 truncate mt-1">
                            {image.url}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {!image.isPrimary && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setPrimaryMutation.mutate(image.id)}
                              disabled={setPrimaryMutation.isPending}
                              title={lang === 'es' ? 'Hacer principal' : 'Make primary'}
                            >
                              <Star className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedImage(image);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title={lang === 'es' ? 'Eliminar' : 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                )}
              </div>

              {/* Tips */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  {lang === 'es' ? 'Consejos para mejores fotos' : 'Tips for better photos'}
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• {lang === 'es' ? 'Usa fotos de alta resolución' : 'Use high resolution photos'}</li>
                  <li>• {lang === 'es' ? 'Muestra el chassis desde múltiples ángulos' : 'Show the chassis from multiple angles'}</li>
                  <li>• {lang === 'es' ? 'Incluye detalles importantes (ruedas, frenos, etc.)' : 'Include important details (wheels, brakes, etc.)'}</li>
                  <li>• {lang === 'es' ? 'Asegúrate de que las fotos estén bien iluminadas' : 'Make sure photos are well-lit'}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang === 'es' ? 'Subir Imágenes' : 'Upload Images'}</DialogTitle>
            <DialogDescription>
              {lang === 'es' 
                ? 'Selecciona una o más imágenes para subir. Máximo 10MB por imagen.'
                : 'Select one or more images to upload. Maximum 10MB per image.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {uploading ? (
              <div className="text-center py-8">
                <Loader2 className="w-12 h-12 animate-spin text-[#0A3161] mx-auto mb-4" />
                <p className="text-gray-600">
                  {lang === 'es' ? 'Subiendo...' : 'Uploading...'} {uploadProgress}%
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-[#0A3161] h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#0A3161] cursor-pointer transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  {lang === 'es' ? 'Click para seleccionar imágenes' : 'Click to select images'}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  JPG, PNG, WebP • Max 10MB
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
              {lang === 'es' ? 'Cancelar' : 'Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* URL Upload Dialog */}
      <Dialog open={urlUploadOpen} onOpenChange={setUrlUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{lang === 'es' ? 'Subir desde URL' : 'Upload from URL'}</DialogTitle>
            <DialogDescription>
              {lang === 'es' 
                ? 'Pega la URL de una imagen para subirla'
                : 'Paste an image URL to upload it'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label>{lang === 'es' ? 'URL de la imagen' : 'Image URL'}</Label>
            <Input
              className="mt-2"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={uploading}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUrlUploadOpen(false)} disabled={uploading}>
              {lang === 'es' ? 'Cancelar' : 'Cancel'}
            </Button>
            <Button onClick={handleUrlUpload} disabled={uploading || !imageUrl.trim()}>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {lang === 'es' ? 'Subiendo...' : 'Uploading...'}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {lang === 'es' ? 'Subir' : 'Upload'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {lang === 'es' ? '¿Eliminar esta imagen?' : 'Delete this image?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {lang === 'es' 
                ? 'Esta acción no se puede deshacer.'
                : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{lang === 'es' ? 'Cancelar' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => selectedImage && deleteImageMutation.mutate(selectedImage.id)}
            >
              {deleteImageMutation.isPending 
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
