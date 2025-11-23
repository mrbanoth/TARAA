import { useState, useRef } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    LogOut, Plus, Image as ImageIcon, Sparkles,
    Save, Copy, Check, Package, Loader2, Upload, X, Trash2
} from "lucide-react";
import { CATEGORIES } from "@/data/config";
import { useProducts } from "@/hooks/useProducts";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "sonner";

export default function AdminDashboard() {
    const { logout } = useAdmin();
    const { products } = useProducts();
    const [activeTab, setActiveTab] = useState("add");
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [extrapeText, setExtrapeText] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "tshirt",
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
                const fileExt = file.name.split('.').pop();
                // unique filename to avoid collisions
                const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
                const filePath = fileName; // store at bucket root

                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(filePath, file);
                if (uploadError) throw uploadError;

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
        } catch (error: any) {
            toast.error('Upload failed: ' + error.message);
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
                        price: Number(formData.price) || 0,
                        category: formData.category,
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

            if (error) throw error;

            toast.success("Product saved successfully!");
            // Reset form
            setFormData({
                name: "",
                price: "",
                category: "tshirt",
                description: "",
                affiliateUrl: "",
                imageUrl: "",
                images: [],
                platform: "meesho"
            });
            setExtrapeText("");
            setActiveTab("list");

            setTimeout(() => window.location.reload(), 1000);

        } catch (err: any) {
            toast.error("Failed to save product: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    // Delete Product
    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;

            toast.success("Product deleted successfully");
            // Optimistic update or reload
            setTimeout(() => window.location.reload(), 500);
        } catch (err: any) {
            toast.error("Failed to delete: " + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src="/logo.svg"
                            alt="TARAA Logo"
                            className="h-8 w-auto"
                        />
                        <div className="h-6 w-px bg-border" />
                        <span className="text-sm font-medium text-muted-foreground">Admin Dashboard</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={logout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto p-1 bg-slate-200/50">
                        <TabsTrigger value="add" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Add Product</TabsTrigger>
                        <TabsTrigger value="ads" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Manage Ads</TabsTrigger>
                        <TabsTrigger value="list" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">All Products</TabsTrigger>
                    </TabsList>

                    {/* ADD PRODUCT TAB */}
                    <TabsContent value="add" className="max-w-5xl mx-auto">
                        <div className="grid lg:grid-cols-12 gap-8">
                            {/* Left: Extrape Input */}
                            <div className="lg:col-span-4 space-y-6">
                                <Card className="border-0 shadow-md">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Copy className="h-5 w-5 text-primary" />
                                            Quick Add
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Textarea
                                            placeholder="Paste text from Extrape/WhatsApp here..."
                                            className="h-48 resize-none bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                            value={extrapeText}
                                            onChange={(e) => setExtrapeText(e.target.value)}
                                        />
                                        <Button onClick={handleParseText} className="w-full" variant="secondary">
                                            Auto-Fill Details
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right: Main Form */}
                            <div className="lg:col-span-8 space-y-6">
                                <Card className="border-0 shadow-md overflow-hidden">
                                    <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                                        <CardTitle className="text-lg">Product Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6 pt-6">

                                        {/* Image Upload Section */}
                                        <div className="space-y-3">
                                            <Label>Product Images</Label>
                                            <div className="grid grid-cols-4 gap-4">
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

                                        <Button onClick={handleSave} className="w-full h-12 text-base" size="lg" disabled={saving}>
                                            {saving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                                            {saving ? "Saving Product..." : "Save Product"}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* ADS TAB */}
                    <TabsContent value="ads" className="max-w-4xl mx-auto">
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
                                    <div className="grid gap-4">
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

                    {/* LIST TAB */}
                    <TabsContent value="list">
                        <Card className="border-0 shadow-md">
                            <CardHeader>
                                <CardTitle>Current Products ({products.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    {products.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Package className="h-8 w-8 text-slate-400" />
                                            </div>
                                            <p className="text-muted-foreground">No products found. Start adding some!</p>
                                        </div>
                                    ) : (
                                        products.map(p => (
                                            <div key={p.id} className="flex items-center gap-4 p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow">
                                                <div className="w-16 h-16 rounded-md overflow-hidden bg-slate-100 flex-shrink-0 border">
                                                    {p.imageUrl ? (
                                                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "https://placehold.co/100?text=Error")} />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                            <ImageIcon className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-lg">{p.name}</h4>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                        <span className="font-medium text-slate-900">₹{p.price}</span>
                                                        <span>•</span>
                                                        <span className="capitalize">{p.category}</span>
                                                        <span>•</span>
                                                        <span className="capitalize px-2 py-0.5 bg-slate-100 rounded text-xs">{p.platform || "meesho"}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(p.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
