import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Check, Briefcase } from "lucide-react";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // These will be replaced with your actual EmailJS keys from .env
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const autoReplyTemplateId = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error("EmailJS not configured. Please check .env file.");
      }

      // 1. Send Email to Admin (You)
      const adminPromise = emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_name: "Sandeep",
        },
        publicKey
      );

      // 2. Send Auto-Reply to User (if configured)
      const replyPromise = autoReplyTemplateId ? emailjs.send(
        serviceId,
        autoReplyTemplateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_name: formData.name,
        },
        publicKey
      ) : Promise.resolve();

      await Promise.all([adminPromise, replyPromise]);

      setSubmitted(true);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => setSubmitted(false), 5000);
    } catch (error: unknown) {
      console.error("Email Error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };



  return (
    <Layout>
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-background py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary px-4 py-1.5 text-sm font-semibold">
            Get In Touch
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions or want to collaborate? We'd love to hear from you!
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">



        {/* Main Content - Two Column */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">

          {/* Left - Contact Form */}
          <div>
            {submitted ? (
              <Card className="bg-primary/5 border-2 border-primary/20">
                <CardContent className="p-8 md:p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
                    Message Sent!
                  </h2>
                  <p className="text-muted-foreground text-base md:text-lg">
                    Thanks for reaching out! We typically respond within 24-48 hours.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2">
                <CardContent className="p-6 md:p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Send a Message</h2>
                    <p className="text-muted-foreground">
                      Fill out the form and we'll get back to you soon
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-base font-semibold">Your Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="h-12 text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base font-semibold">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="h-12 text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-base font-semibold">Your Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us what's on your mind..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={6}
                        required
                        className="text-base resize-none"
                      />
                    </div>

                    <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={loading}>
                      {loading ? (
                        <>Sending...</>
                      ) : (
                        <>
                          Send Message
                          <Send className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right - Additional Info */}
          <div className="space-y-6">
            {/* FAQ Card */}
            <Card className="border-2">
              <CardContent className="p-6 md:p-8">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Quick Questions?</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-foreground mb-1">Response Time</p>
                    <p className="text-muted-foreground">We typically respond within 24-48 hours during business days.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Support Hours</p>
                    <p className="text-muted-foreground">Monday - Friday, 9:00 AM - 6:00 PM IST</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">For Product Issues</p>
                    <p className="text-muted-foreground">Please contact the partner platform (Meesho/Extrape) directly for order-related queries.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
