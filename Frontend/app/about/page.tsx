import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  ArrowLeft,
  Shield,
  Users,
  Activity,
  Globe,
  Award,
  Target,
  Heart,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                DataExchange
              </h1>
              <p className="text-xs text-gray-500">Portal</p>
            </div>
          </Link>
          <Link href="/">
            <Button variant="outline" className="group bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform bg-gradient-to-r from-[#D9A299] to-[#F5CBCB]" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              About DataExchange Portal
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Empowering institutions worldwide with secure, efficient, and
              transparent data exchange solutions
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  To revolutionize inter-institutional data exchange by
                  providing a secure, transparent, and efficient platform that
                  enables seamless collaboration while maintaining the highest
                  standards of data privacy and security.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  To become the global standard for institutional data exchange,
                  fostering innovation and collaboration across educational,
                  research, and governmental organizations worldwide.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Key Features */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Why Choose DataExchange Portal?
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <CardTitle className="text-lg">Enterprise Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Bank-grade encryption and comprehensive audit trails
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <Users className="h-12 w-12 text-green-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <CardTitle className="text-lg">Multi-Role System</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Seamless collaboration between consumers, providers, and
                    admins
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <Globe className="h-12 w-12 text-purple-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <CardTitle className="text-lg">Global Reach</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Trusted by 500+ institutions across 50+ countries
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <Activity className="h-12 w-12 text-orange-600 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <CardTitle className="text-lg">
                    Real-time Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Live tracking and comprehensive analytics dashboard
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How It Works */}
          <Card className="mb-16 shadow-2xl border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold mb-4">
                How DataExchange Portal Works
              </CardTitle>
              <CardDescription className="text-lg">
                A streamlined process designed for efficiency and security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-8">
                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl font-bold text-white">1</span>
                  </div>
                  <h4 className="font-bold mb-2">Register & Verify</h4>
                  <p className="text-sm text-gray-600">
                    Institutions register and undergo admin verification for
                    security
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl font-bold text-white">2</span>
                  </div>
                  <h4 className="font-bold mb-2">Submit Requests</h4>
                  <p className="text-sm text-gray-600">
                    API consumers create detailed requests with specifications
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl font-bold text-white">3</span>
                  </div>
                  <h4 className="font-bold mb-2">Review & Respond</h4>
                  <p className="text-sm text-gray-600">
                    Providers review requests and provide API documentation
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl font-bold text-white">4</span>
                  </div>
                  <h4 className="font-bold mb-2">Secure Exchange</h4>
                  <p className="text-sm text-gray-600">
                    Begin secure data exchange with full administrative
                    oversight
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-16">
            <h3 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Trusted Worldwide
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  500+
                </div>
                <div className="text-gray-600">Registered Institutions</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  10M+
                </div>
                <div className="text-gray-600">API Requests Processed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  99.9%
                </div>
                <div className="text-gray-600">System Uptime</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  50+
                </div>
                <div className="text-gray-600">Countries Served</div>
              </div>
            </div>
          </div>

          {/* Awards & Recognition */}
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Awards & Recognition
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <CardTitle className="text-lg">
                    Best Data Platform 2024
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    EdTech Innovation Awards
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <CardTitle className="text-lg">Security Excellence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Cybersecurity Leadership Awards
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <Globe className="h-12 w-12 text-green-500 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <CardTitle className="text-lg">Global Impact Award</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    International Education Technology
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-12 shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Transform Your Data Exchange?
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join the growing network of institutions revolutionizing how they
              share and access data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  Get Started Today
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-all duration-300 bg-transparent"
                >
                  Contact Our Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
