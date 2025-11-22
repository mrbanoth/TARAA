import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Shield } from "lucide-react";

export default function Disclaimer() {
  const sections = [
    {
      title: "About TARAA",
      content: "TARAA is an affiliate marketing and deals discovery platform. We curate and showcase budget-friendly products from trusted third-party e-commerce platforms."
    },
    {
      title: "Our Role",
      content: "We act solely as an intermediary between you and our partner platforms (such as Meesho, Extrape, etc.). We display product information and provide affiliate links to help you discover deals."
    },
    {
      title: "No Direct Transactions",
      content: "TARAA does not sell any products directly. We do not process payments, handle inventory, ship products, or manage order fulfillment. All purchases are completed on the partner platform's website."
    },
    {
      title: "Customer Service & Returns",
      content: "All customer service inquiries, returns, refunds, cancellations, and shipping issues must be directed to the platform where you made your purchase. TARAA is not responsible for these services."
    },
    {
      title: "Product Information",
      content: "While we strive to provide accurate product information, descriptions, prices, and availability are subject to change and are ultimately controlled by our partner platforms. Always verify details on the seller's website."
    },
    {
      title: "Affiliate Disclosure",
      content: "TARAA earns commissions through affiliate partnerships when you make purchases through our links. This does not affect the price you pay. We are transparent about our business model."
    },
    {
      title: "No Warranties",
      content: "We make no warranties or guarantees about product quality, fitness for purpose, or merchant reliability. All transactions are between you and the third-party seller."
    },
    {
      title: "Limitation of Liability",
      content: "TARAA is not liable for any damages, losses, or issues arising from purchases made through partner platforms. Your use of external websites is at your own risk."
    }
  ];

  return (
    <Layout>
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-background py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-yellow-100 mb-4 md:mb-6">
            <AlertTriangle className="h-8 w-8 md:h-10 md:w-10 text-yellow-600" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
            Legal Disclaimer
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Important information about how TARAA operates
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Important Notice */}
        <Card className="border-2 border-yellow-200 bg-yellow-50/50 mb-8 md:mb-12">
          <CardContent className="p-6 md:p-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 md:h-8 md:w-8 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-2">Please Read Carefully</h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  By using TARAA, you acknowledge and agree to the following terms. We are a deals showcase platform only and do not directly sell products or handle transactions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer Sections */}
        <div className="max-w-4xl mx-auto space-y-6">
          {sections.map((section, idx) => (
            <Card key={idx} className="border-2">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  {section.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Final Note */}
        <Card className="max-w-4xl mx-auto mt-8 md:mt-12 bg-gradient-to-br from-primary/5 to-accent/5 border-0">
          <CardContent className="p-6 md:p-8 text-center">
            <h3 className="text-lg md:text-xl font-bold mb-3">Questions?</h3>
            <p className="text-muted-foreground text-sm md:text-base">
              If you have any questions about this disclaimer or how TARAA operates,
              please contact us at <span className="font-semibold text-primary">support@taraa.in</span>
            </p>
            <p className="text-xs md:text-sm text-muted-foreground mt-4">
              Last updated: November 2025
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
