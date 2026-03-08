import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Mail, Phone, MessageSquare } from "lucide-react"

const faqs = [
  {
    question: "How do I submit a complaint?",
    answer: "To submit a complaint, navigate to the Complaints section in your dashboard. Click the 'New Complaint' button and fill out the form with relevant details about your issue. Include as much information as possible to help us resolve it faster."
  },
  {
    question: "How do I track my complaint?",
    answer: "Once you've submitted a complaint, you can track its progress in the 'My Complaints' section of your dashboard. Each complaint has a unique ID and status indicator showing whether it's pending, in progress, or resolved. You'll also receive email updates as your complaint progresses."
  },
  {
    question: "Who can resolve complaints?",
    answer: "Your complaints are handled by our dedicated support team and specialized resolution specialists. Depending on the nature of your complaint, it may be escalated to the appropriate department. You can see the assigned specialist's details on your complaint page."
  },
  {
    question: "How long does it take to resolve a complaint?",
    answer: "Resolution times vary depending on the complexity of your complaint. Simple issues are typically resolved within 24-48 hours, while more complex matters may take 5-10 business days. You'll receive regular updates on your complaint's progress."
  },
  {
    question: "Can I update my complaint after submission?",
    answer: "Yes, you can add additional information or documents to your complaint through the dashboard. However, you cannot modify the original complaint details. If you need significant changes, contact our support team directly."
  }
]

const supportChannels = [
  {
    icon: Mail,
    title: "Email Support",
    description: "125103053@nitkkr.ac.in",
    action: "Send Email"
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "+91 7011053051",
    action: "Call Now"
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Available 9 AM - 6 PM IST",
    action: "Start Chat"
  }
]

export default function HelpCenterPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground">Help Center</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Find answers to common questions about Project Zero Point
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Collapsible key={index}>
                <Card>
                  <CollapsibleTrigger asChild>
                    <button className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors">
                      <CardTitle className="text-base font-semibold">{faq.question}</CardTitle>
                      <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t border-border px-6 py-4">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>

        {/* Contact Support Section */}
        <div>
          <h2 className="mb-6 text-2xl font-bold text-foreground">Contact Support</h2>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
            {supportChannels.map((channel, index) => {
              const IconComponent = channel.icon
              return (
                <Card key={index} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{channel.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col">
                    <p className="mb-4 text-sm text-muted-foreground">{channel.description}</p>
                    <Button variant="outline" className="mt-auto w-full">
                      {channel.action}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
