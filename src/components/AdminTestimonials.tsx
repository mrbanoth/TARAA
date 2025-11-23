import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Star, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface Testimonial {
    id: string;
    name: string;
    role: string;
    college: string;
    image_url: string;
    rating: number;
    content: string;
}

export default function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        college: "",
        image_url: "",
        rating: 5,
        content: "",
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const { data, error } = await supabase
                .from("testimonials")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setTestimonials(data || []);
        } catch (error) {
            console.error("Error fetching testimonials:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (!file) return;

            setUploading(true);
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `testimonials/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("products") // Reusing products bucket for simplicity
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from("products").getPublicUrl(filePath);
            setFormData({ ...formData, image_url: data.publicUrl });
            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from("testimonials").insert([formData]);
            if (error) throw error;

            toast.success("Testimonial added successfully");
            setFormData({
                name: "",
                role: "",
                college: "",
                image_url: "",
                rating: 5,
                content: "",
            });
            fetchTestimonials();
        } catch (error) {
            console.error("Error adding testimonial:", error);
            toast.error("Failed to add testimonial");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase.from("testimonials").delete().eq("id", id);
            if (error) throw error;
            toast.success("Testimonial deleted");
            fetchTestimonials();
        } catch (error) {
            console.error("Error deleting testimonial:", error);
            toast.error("Failed to delete testimonial");
        }
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Add New Testimonial</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                placeholder="Student Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <Input
                                placeholder="Role (e.g. Student)"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                required
                            />
                            <Input
                                placeholder="College Name"
                                value={formData.college}
                                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                required
                            />
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Image URL"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    required
                                />
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        disabled={uploading}
                                    />
                                    <Button type="button" variant="outline" size="icon" disabled={uploading}>
                                        <ImageIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Rating:</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    className={`focus:outline-none ${star <= formData.rating ? "text-yellow-400" : "text-gray-300"
                                        }`}
                                >
                                    <Star className="h-6 w-6 fill-current" />
                                </button>
                            ))}
                        </div>

                        <Textarea
                            placeholder="Testimonial Content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            required
                        />

                        <Button type="submit" className="w-full">
                            <Plus className="h-4 w-4 mr-2" /> Add Testimonial
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonials.map((t) => (
                    <Card key={t.id} className="relative">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={t.image_url}
                                        alt={t.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <h4 className="font-bold text-sm">{t.name}</h4>
                                        <p className="text-xs text-muted-foreground">{t.college}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => handleDelete(t.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-3 w-3 ${i < t.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3">"{t.content}"</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
