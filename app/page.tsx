import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/shared/Navigation';
import { CheckCircle, Users, Zap, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Citizen Complaints Made Simple
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Project Zero Point is a modern governance platform that empowers citizens to report issues and helps authorities respond efficiently with AI-powered categorization and tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-slate-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-200">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Submission</h3>
                <p className="text-gray-600">
                  Citizens can quickly report complaints with images, descriptions, and locations in just a few clicks.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-200">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Categorization</h3>
                <p className="text-gray-600">
                  Complaints are automatically categorized and prioritized using AI to ensure urgent issues are handled first.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-200">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Tracking</h3>
                <p className="text-gray-600">
                  Track your complaints from submission to resolution with status updates and authority notes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Two Powerful Roles
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Citizen Role */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8">
              <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Citizens</h3>
              <ul className="space-y-3 text-gray-700 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Report complaints about infrastructure, utilities, healthcare, and more</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Upload photos and provide detailed descriptions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Track complaint status in real-time</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Receive updates and resolution details</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/signup">Create Citizen Account</Link>
              </Button>
            </div>

            {/* Authority Role */}
            <div className="bg-slate-50 border-2 border-slate-300 rounded-lg p-8">
              <div className="bg-slate-700 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Authorities</h3>
              <ul className="space-y-3 text-gray-700 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                  <span>View all complaints with intelligent filtering</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                  <span>Update complaint status and provide feedback</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                  <span>Access analytics and complaint statistics</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
                  <span>Assign complaints to team members</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full">
                <Link href="/signup">Create Authority Account</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of citizens and authorities already using Project Zero Point to improve governance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">Get Started Today</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-blue-700" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-300 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-white mb-4">Project Zero Point</h3>
                <p className="text-sm">Empowering citizens and authorities to work together for better governance.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Platform</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/signup" className="hover:text-white">Sign Up</Link></li>
                  <li><Link href="/login" className="hover:text-white">Log In</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Features</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">Complaint Submission</a></li>
                  <li><a href="#" className="hover:text-white">AI Categorization</a></li>
                  <li><a href="#" className="hover:text-white">Real-time Tracking</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">Help Center</a></li>
                  <li><a href="#" className="hover:text-white">Contact Us</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-8 text-center text-sm">
              <p>&copy; 2026 Project Zero Point. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
