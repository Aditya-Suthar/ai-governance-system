"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/shared/Navigation';
import { CheckCircle, Users, Zap, Shield } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
  if (!isLoading && user) {
    router.push("/dashboard");
  }
}, [isLoading, user, router]);

if (isLoading) {
  return <div className="p-10">Loading...</div>;
}

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-slate-950 text-slate-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 md:pt-32 pb-20 md:pb-24">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-800/20 rounded-full blur-3xl -z-10" />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center space-y-8">
              <div className="inline-block">
                <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase">Civic Governance Platform</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight text-balance">
                Transform How Citizens Report Issues
              </h1>
              <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Project Zero Point uses AI-powered categorization to connect citizen concerns with government authorities, creating faster solutions for civic problems.
              </p>
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-8 transition-all hover:shadow-lg hover:shadow-blue-600/50">
                <Link href="/signup">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section - How It Works */}
        <section className="py-20 md:py-24 border-t border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">Streamlined process from complaint to resolution</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="group bg-slate-900/50 border border-slate-800 rounded-xl p-8 hover:border-blue-600/50 hover:bg-slate-900/80 transition-all duration-300">
                <div className="bg-blue-600/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600/30 transition-colors">
                  <CheckCircle className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-50 mb-3">Quick Reporting</h3>
                <p className="text-slate-400 leading-relaxed">
                  Citizens submit complaints with images, location, and detailed descriptions in minutes. Simple, intuitive interface for everyone.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-slate-900/50 border border-slate-800 rounded-xl p-8 hover:border-blue-600/50 hover:bg-slate-900/80 transition-all duration-300">
                <div className="bg-blue-600/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600/30 transition-colors">
                  <Zap className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-50 mb-3">AI Prioritization</h3>
                <p className="text-slate-400 leading-relaxed">
                  Complaints are automatically categorized and ranked by urgency. Critical issues get immediate attention from authorities.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-slate-900/50 border border-slate-800 rounded-xl p-8 hover:border-blue-600/50 hover:bg-slate-900/80 transition-all duration-300">
                <div className="bg-blue-600/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600/30 transition-colors">
                  <Shield className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-50 mb-3">Live Tracking</h3>
                <p className="text-slate-400 leading-relaxed">
                  Monitor every complaint from submission to resolution. Real-time status updates and authority feedback keep you informed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section className="py-20 md:py-24 border-t border-slate-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Built for Two Roles</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">Tailored experiences for citizens and government authorities</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Citizen Role */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
                <div className="relative bg-slate-900/50 border border-blue-600/30 rounded-xl p-8 hover:border-blue-600/60 transition-colors">
                  <div className="bg-blue-600/20 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                    <Users className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-50 mb-6">For Citizens</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">Report infrastructure, utilities, and service issues</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">Attach photos and location details</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">Track status with real-time updates</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">Receive resolution feedback</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Authority Role */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
                <div className="relative bg-slate-900/50 border border-slate-700/50 rounded-xl p-8 hover:border-slate-600 transition-colors">
                  <div className="bg-slate-700/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                    <Shield className="w-7 h-7 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-50 mb-6">For Authorities</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">View all complaints with smart filtering</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">Update status and add resolution notes</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">Access analytics and performance metrics</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">Manage team assignments</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 md:py-24 border-t border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10" />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Start Improving Governance Today</h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Join thousands of citizens and authorities transforming civic engagement with Project Zero Point.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800 bg-slate-950/50 text-slate-400 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div>
                <h3 className="font-bold text-slate-50 mb-4">Project Zero Point</h3>
                <p className="text-sm text-slate-500">Empowering citizens and authorities to collaborate for better civic governance.</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-50 mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/signup" className="text-slate-400 hover:text-slate-200 transition-colors">Create Account</Link></li>
                  <li><Link href="/login" className="text-slate-400 hover:text-slate-200 transition-colors">Sign In</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-50 mb-4">Features</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-slate-400 hover:text-slate-200 transition-colors">Complaint System</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-slate-200 transition-colors">AI Analytics</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-slate-200 transition-colors">Real-time Tracking</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-50 mb-4">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-slate-400 hover:text-slate-200 transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-slate-400 hover:text-slate-200 transition-colors">Contact Support</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
              <p>&copy; 2026 Project Zero Point. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
