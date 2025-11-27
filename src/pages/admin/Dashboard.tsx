import { useState, useRef } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
    LogOut, Plus, Image as ImageIcon, Sparkles,
    Save, Copy, Check, Package, Loader2, Upload, X, Trash2, Menu,
    Shirt, ShirtIcon, Shirt as UnisexIcon, Shirt as WomenIcon, Shirt as MenIcon
} from "lucide-react";
import { CATEGORIES } from "@/data/config";
import { useProducts } from "@/hooks/useProducts";
import { useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";
import AdminTestimonials from "@/components/AdminTestimonials";

export default function AdminDashboard() {
    const { logout } = useAdmin();
    const { products, refreshProducts } = useProducts();
    const [activeTab, setActiveTab] = useState("add");
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Form State
    const [extrapeText, setExtrapeText] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "tshirt",
        gender: "unisex" as "men" | "women" | "unisex",
        description: "",
        affiliateUrl: "",
        imageUrl: "",
        images: [] as string[],
        platform: "meesho"
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-fill from Extrape Text
    const handleParseText = () => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = extrapeText.match(urlRegex);
        const affiliateUrl = urls ? urls[0] : "";
        const description = extrapeText.replace(urlRegex, "").trim();

        let platform = "other";
        if (affiliateUrl.includes("meesho") || affiliateUrl.includes("msho")) platform = "meesho";
        if (affiliateUrl.includes("amazon") || affiliateUrl.includes("amzn")) platform = "amazon";
        if (affiliateUrl.includes("flipkart") || affiliateUrl.includes("fkrt")) platform = "flipkart";
        if (affiliateUrl.includes("myntra")) platform = "myntra";
        if (affiliateUrl.includes("ajio")) platform = "ajio";
        if (affiliateUrl.includes("shopsy")) platform = "shopsy";

        setFormData(prev => ({
            ...prev,
            description: description,
            affiliateUrl: affiliateUrl,
            platform: platform
        }));

        toast.success("Text parsed! Please review details.");
    };

    // Handle Image Upload to Supabase
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const newImages: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                // Check file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    throw new Error(`File ${file.name} is too large. Max size is 5MB.`);
                }
                
                const fileExt = file.name.split('.').pop();
                // unique filename to avoid collisions
                const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
                const filePath = fileName; // store at bucket root

                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(filePath, file);
                    
                if (uploadError) {
                    // Check for file size error (413) in a type-safe way
                    if (uploadError.message && uploadError.message.includes('file size')) {
                        throw new Error('File is too large. Maximum size is 5MB.');
                    }
                    throw uploadError instanceof Error ? uploadError : new Error(String(uploadError));
                }

                // Get the public URL
                const { data: urlData } = supabase.storage
                    .from('products')
                    .getPublicUrl(filePath);
                if (urlData?.publicUrl) {
                    newImages.push(urlData.publicUrl);
                }
            }

            // Update form data with the newly uploaded images
            setFormData(prev => {
                const updatedImages = [...prev.images, ...newImages];
                return {
                    ...prev,
                    images: updatedImages,
                    imageUrl: prev.imageUrl || updatedImages[0], // set first as main if none selected
                };
            });

            toast.success(`${newImages.length} images uploaded!`);
        } catch (error: unknown) {
            console.error('Image upload error:', error);
            toast.error('Upload failed: ' + (error instanceof Error ? error.message : 'Please try again'));
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => {
            const newImages = prev.images.filter((_, i) => i !== index);
            return {
                ...prev,
                images: newImages,
                imageUrl: index === 0 && newImages.length > 0 ? newImages[0] : (newImages.length === 0 ? "" : prev.imageUrl)
            };
        });
    };

    const setMainImage = (url: string) => {
        setFormData(prev => ({ ...prev, imageUrl: url }));
    };

    // Save to Supabase
    const handleSave = async () => {
        if (!isSupabaseConfigured()) {
            toast.error("Supabase is not configured.");
            return;
        }

        if (!formData.name || !formData.price) {
            toast.error("Please fill in Name and Price");
            return;
        }

        if (formData.images.length === 0) {
            toast.error("Please upload at least one image (Main Image)");
            return;
        }

        setSaving(true);
        try {
            const id = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "new-product";
            const finalId = `${id}-${Math.floor(Math.random() * 10000)}`;

            // Ensure imageUrl is set to the first image if empty
            const mainImage = formData.imageUrl || formData.images[0];

            // Auto-generate description if empty
            const finalDescription = formData.description.trim() ||
                `Check out the ${formData.name}! This premium quality item is perfect for your collection. \n\n✨ Best Price\n✨ High Quality\n✨ Fast Shipping\n\nOrder now before it goes out of stock!`;

            const { error } = await supabase
                .from('products')
                .insert([
                    {
                        id: finalId,
                        name: formData.name,
                        description: finalDescription,
                        price: parseFloat(formData.price) || 0,
                        category: formData.category,
                        gender: formData.gender || 'unisex', // Ensure gender is always set
                        imageUrl: mainImage,
                        images: formData.images, // Save array of images
                        affiliateUrl: formData.affiliateUrl,
                        platform: formData.platform,
                        clicks: 0,
                        rating: 5,
                        sizes: ["S", "M", "L", "XL"],
                        tag: "New Arrival",
                        isFeatured: true,
                        created_at: new Date().toISOString()
                    }
                ]);

            if (error) {
                // Handle specific Supabase errors without logging out
                if (error.code === '23505') { // Unique violation
                    throw new Error('A product with this name already exists');
                }
                throw error;
            }

            toast.success("Product saved successfully!");
            // Reset form
            setFormData({
                name: "",
                price: "",
                category: "tshirt",
                gender: "unisex",
                description: "",
                affiliateUrl: "",
                imageUrl: "",
                images: [],
                platform: "meesho"
            });
            setExtrapeText("");
            // Reset form and switch to list tab
            setActiveTab("list");
            
            // Refresh products list without full page reload
            refreshProducts();

        } catch (error: unknown) {
            console.error('Save product error:', error);
            toast.error("Failed to save product: " + (error instanceof Error ? error.message : 'Please try again'));
        } finally {
            setSaving(false);
        }
    };

    // Delete Product
    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) {
                if (error.code === '42501') { // Insufficient permissions
                    throw new Error('You do not have permission to delete this product');
                }
                throw error;
            }

            toast.success("Product deleted successfully");
            // Use refreshProducts instead of page reload to maintain session
            refreshProducts();
        } catch (error: unknown) {
            console.error('Delete product error:', error);
            toast.error("Failed to delete: " + (error instanceof Error ? error.message : 'Please try again'));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 overflow-x-hidden">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
                <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        {/* Mobile Hamburger Menu */}
                        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="ghost" size="icon" className="flex-shrink-0">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[280px] sm:w-[320px]" aria-describedby="admin-menu-description">
                                <SheetHeader>
                                    <SheetTitle className="text-left">Admin Menu</SheetTitle>
                                    <p id="admin-menu-description" className="sr-only">Navigate between admin sections</p>
                                </SheetHeader>
                                <nav className="flex flex-col gap-2 mt-6">
                                    <Button
                                        variant={activeTab === "add" ? "default" : "ghost"}
                                        className="justify-start h-12 text-base"
                                        onClick={() => {
                                            setActiveTab("add");
                                            setMobileMenuOpen(false);
                                        }}
                                    >
                                        <Plus className="h-5 w-5 mr-3" />
                                        Add Product
                                    </Button>
                                    <Button
                                        variant={activeTab === "list" ? "default" : "ghost"}
                                        className="justify-start h-12 text-base"
                                        onClick={() => {
                                            setActiveTab("list");
                                            setMobileMenuOpen(false);
                                        }}
                                    >
                                        <Package className="h-5 w-5 mr-3" />
                                        All Products
                                    </Button>
                                    <Button
                                        variant={activeTab === "ads" ? "default" : "ghost"}
                                        className="justify-start h-12 text-base"
                                        onClick={() => {
                                            setActiveTab("ads");
                                            setMobileMenuOpen(false);
                                        }}
                                    >
                                        <Sparkles className="h-5 w-5 mr-3" />
                                        Manage Ads
                                    </Button>
                                    <Button
                                        variant={activeTab === "testimonials" ? "default" : "ghost"}
                                        className="justify-start h-12 text-base"
                                        onClick={() => {
                                            setActiveTab("testimonials");
                                            setMobileMenuOpen(false);
                                        }}
                                    >
                                        <Check className="h-5 w-5 mr-3" />
                                        Testimonials
                                    </Button>

                                    <div className="border-t my-4" />

                                    <Button
                                        variant="ghost"
                                        className="justify-start h-12 text-base text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={logout}
                                    >
                                        <LogOut className="h-5 w-5 mr-3" />
                                        Logout
                                    </Button>
                                </nav>
                            </SheetContent>
                        </Sheet>

                        <img
                            src="/logo.svg"
                            alt="TARAA Logo"
                            className="h-7 sm:h-8 w-auto flex-shrink-0"
                        />
                        <div className="h-6 w-px bg-border hidden sm:block" />
                        <span className="text-xs sm:text-sm font-medium text-muted-foreground hidden sm:block truncate">Admin Dashboard</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={logout} className="hidden md:flex text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </header>

            <main className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4 lg:py-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3 sm:space-y-4 lg:space-y-8">
                    {/* Desktop Tabs */}
                    {/* Mobile Tabs */}
                    <TabsList className="md:hidden grid grid-cols-4 w-full p-0.5 bg-slate-200/50 rounded-lg mb-3 sticky top-14 sm:top-16 z-10">
                        <TabsTrigger value="add" className="flex flex-col items-center justify-center h-14 sm:h-16 text-xs sm:text-sm p-1 sm:p-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                            <span>Add</span>
                        </TabsTrigger>
                        <TabsTrigger value="list" className="flex flex-col items-center justify-center h-14 sm:h-16 text-xs sm:text-sm p-1 sm:p-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            <Package className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                            <span>Products</span>
                        </TabsTrigger>
                        <TabsTrigger value="ads" className="flex flex-col items-center justify-center h-14 sm:h-16 text-xs sm:text-sm p-1 sm:p-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                            <span>Ads</span>
                        </TabsTrigger>
                        <TabsTrigger value="testimonials" className="flex flex-col items-center justify-center h-14 sm:h-16 text-xs sm:text-sm p-1 sm:p-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                            <Check className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                            <span>Reviews</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Desktop Tabs */}
                    <TabsList className="hidden md:grid w-full grid-cols-4 max-w-2xl mx-auto p-0.5 sm:p-1 bg-slate-200/50 rounded-lg">
                        <TabsTrigger value="add" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Add Product</TabsTrigger>
                        <TabsTrigger value="list" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">All Products</TabsTrigger>
                        <TabsTrigger value="ads" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Manage Ads</TabsTrigger>
                        <TabsTrigger value="testimonials" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Testimonials</TabsTrigger>
                    </TabsList>

                    {/* ADD PRODUCT TAB */}
                    <TabsContent value="add" className="max-w-4xl mx-auto">
                        <div className="space-y-4 sm:space-y-6">
                                <Card className="border-0 shadow-sm sm:shadow-md overflow-hidden">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-3 sm:pb-4 px-4 sm:px-6">
                                        <CardTitle className="text-base sm:text-lg">Product Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 sm:space-y-6 pt-4 sm:pt-6 px-4 sm:px-6 pb-4 sm:pb-6">
                                        {/* Image Upload Section */}
                                        <div className="space-y-2 sm:space-y-3">
                                            <Label className="text-sm sm:text-base">Product Images</Label>
                                            <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                                                {formData.images.map((url, idx) => (
                                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border bg-slate-100 group">
                                                        <img src={url} alt="Product" className="w-full h-full object-cover" />
                                                        <button
                                                            onClick={() => removeImage(idx)}
                                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                        {formData.imageUrl === url && (
                                                            <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-[10px] text-center py-1">
                                                                Main Image
                                                            </div>
                                                        )}
                                                        {formData.imageUrl !== url && (
                                                            <button
                                                                onClick={() => setMainImage(url)}
                                                                className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] text-center py-1 opacity-0 group-hover:opacity-100 hover:bg-primary/80 transition-all"
                                                            >
                                                                Set as Main
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}

                                                <div
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors group"
                                                >
                                                    {uploading ? (
                                                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Upload className="h-6 w-6 text-slate-400 group-hover:text-primary mb-2" />
                                                            <span className="text-xs text-slate-500 font-medium">Upload</span>
                                                        </>
                                                    )}
                                                </div>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    className="hidden"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                First image will be the main display image. Upload multiple images at once.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Name</Label>
                                                <Input
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="Product Name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Price (₹)</Label>
                                                <Input
                                                    type="number"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                    placeholder="299"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Category</Label>
                                                <select
                                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                    value={formData.category}
                                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                >
                                                    {CATEGORIES.map(cat => (
                                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                                    ))}
                                                </select>
                                            </div>
<div className="space-y-2">
                                                <Label>Gender</Label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <Button
                                                        type="button"
                                                        variant={formData.gender === 'men' ? 'default' : 'outline'}
                                                        className="flex flex-col items-center justify-center h-16 gap-1 text-xs"
                                                        onClick={() => setFormData({ ...formData, gender: 'men' })}
                                                    >
                                                        <Shirt className="h-5 w-5" />
                                                        <span>Men</span>
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant={formData.gender === 'women' ? 'default' : 'outline'}
                                                        className="flex flex-col items-center justify-center h-16 gap-1 text-xs"
                                                        onClick={() => setFormData({ ...formData, gender: 'women' })}
                                                    >
                                                        <ShirtIcon className="h-5 w-5" />
                                                        <span>Women</span>
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant={formData.gender === 'unisex' ? 'default' : 'outline'}
                                                        className="flex flex-col items-center justify-center h-16 gap-1 text-xs"
                                                        onClick={() => setFormData({ ...formData, gender: 'unisex' })}
                                                    >
                                                        <UnisexIcon className="h-5 w-5" />
                                                        <span>Unisex</span>
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Platform</Label>
                                                <select
                                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm capitalize"
                                                    value={formData.platform}
                                                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                                >
                                                    <option value="meesho">Meesho</option>
                                                    <option value="amazon">Amazon</option>
                                                    <option value="flipkart">Flipkart</option>
                                                    <option value="myntra">Myntra</option>
                                                    <option value="ajio">Ajio</option>
                                                    <option value="shopsy">Shopsy</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                rows={4}
                                                placeholder="Leave empty to auto-generate"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Affiliate Link</Label>
                                            <Input
                                                value={formData.affiliateUrl}
                                                onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                                                placeholder="https://msho.in/..."
                                            />
                                        </div>

                                        <Button onClick={handleSave} className="w-full h-12 text-sm sm:text-base" size="lg" disabled={saving}>
                                            {saving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                                            {saving ? "Saving Product..." : "Save Product"}
                                        </Button>
                                    </CardContent>
                                </Card>
                        </div>
                    </TabsContent>

                    {/* ADS TAB */}
                    <TabsContent value="ads" className="max-w-4xl mx-auto">
                        <div className="mb-4 sm:mb-6">
                            <h2 className="text-lg sm:text-xl font-bold">Manage Advertisements</h2>
                        </div>
                        <div className="grid gap-8">
                            <Card className="border-0 shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-primary" />
                                        Create New Ad
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <Label>Ad Image</Label>
                                            <div className="aspect-video rounded-lg overflow-hidden border bg-slate-100 relative group">
                                                {formData.imageUrl ? (
                                                    <img src={formData.imageUrl} alt="Ad Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                        <ImageIcon className="h-8 w-8" />
                                                    </div>
                                                )}
                                                <div
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                >
                                                    <span className="text-white font-medium">Change Image</span>
                                                </div>
                                            </div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label>Ad Name (Internal)</Label>
                                                <Input
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="e.g., Summer Sale Banner"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Target Link</Label>
                                                <Input
                                                    value={formData.affiliateUrl}
                                                    onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                                                    placeholder="https://..."
                                                />
                                            </div>
                                            <Button
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, category: 'ad_banner', price: "0", description: "Ad Banner" }));
                                                    setTimeout(handleSave, 100);
                                                }}
                                                className="w-full mt-4"
                                                disabled={saving}
                                            >
                                                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                                Publish Ad
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-md">
                                <CardHeader>
                                    <CardTitle>Active Ads</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-3 sm:gap-4">
                                        {products.filter(p => p.category === 'ad_banner').length === 0 ? (
                                            <p className="text-center text-muted-foreground py-8">No active ads found.</p>
                                        ) : (
                                            products.filter(p => p.category === 'ad_banner').map(ad => (
                                                <div key={ad.id} className="flex items-center gap-4 p-4 border rounded-lg bg-white">
                                                    <div className="w-24 h-16 rounded bg-slate-100 overflow-hidden flex-shrink-0">
                                                        <img src={ad.imageUrl} alt={ad.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-medium truncate">{ad.name}</h4>
                                                        <p className="text-xs text-muted-foreground truncate">{ad.affiliateUrl}</p>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(ad.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* TESTIMONIALS TAB */}
                    <TabsContent value="testimonials">
                        <div className="mb-4 sm:mb-6">
                            <h2 className="text-lg sm:text-xl font-bold">Manage Testimonials</h2>
                        </div>
                        <AdminTestimonials />
                    </TabsContent>

                    {/* LIST TAB */}
                    <TabsContent value="list" className="max-w-3xl mx-auto">
                        <div className="mb-4 sm:mb-6">
                            <h2 className="text-lg sm:text-xl font-bold">Current Products ({products.length})</h2>
                        </div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold">Current Products ({products.length})</h2>
                        </div>

                        {products.length === 0 ? (
                            <Card className="border-0 shadow-sm">
                                <CardContent className="text-center py-12">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Package className="h-8 w-8 text-slate-400" />
                                    </div>
                                    <p className="text-muted-foreground">No products found. Start adding some!</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-4">
                                {products.map(p => (
                                    <Card key={p.id} className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden bg-slate-100 flex-shrink-0 border">
                                                    {p.imageUrl ? (
                                                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "https://placehold.co/100?text=Error")} />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                            <ImageIcon className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-base sm:text-lg truncate">{p.name}</h4>
                                                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                                                        <span className="font-semibold text-slate-900">₹{p.price}</span>
                                                        <span className="hidden sm:inline">•</span>
                                                        <span className="capitalize text-xs sm:text-sm">{p.category}</span>
                                                        <span className="hidden sm:inline">•</span>
                                                        <span className="capitalize px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">{p.platform || "meesho"}</span>
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(p.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
