import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';

const LoginPage = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock login
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Welcome back!",
        description: "You've been signed into ThriftHub successfully.",
      });
      // Redirect to home page
      window.location.href = '/';
    }, 1500);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords don't match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Mock registration
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account Created!",
        description: "Welcome to ThriftHub. Start discovering amazing thrift finds!",
      });
      // Redirect to home page
      window.location.href = '/';
    }, 1500);
  };

  const handleSocialLogin = (provider) => {
    toast({
      title: `${provider} Login`,
      description: `Signing in with ${provider}...`,
    });
    // Implement social login
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-8 text-gray-600 hover:text-gray-900"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to ThriftHub
        </Button>

        <Card className="p-8 shadow-sm border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light text-gray-900 mb-2">Thrift<span className="font-medium">Hub</span></h1>
            <p className="text-gray-600">Join the sustainable shopping community</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100">
              <TabsTrigger value="login" className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900">Login</TabsTrigger>
              <TabsTrigger value="register" className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900">Register</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <Label htmlFor="login-email" className="text-gray-700">Email</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="login-password" className="text-gray-700">Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <button type="button" className="text-gray-600 hover:text-gray-900 text-sm">
                    Forgot Password?
                  </button>
                </div>

                <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white" size="lg" disabled={isLoading}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-name" className="text-gray-700">Full Name</Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="register-name"
                      placeholder="Enter your full name"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                      className="pl-10 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-email" className="text-gray-700">Email</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="Enter your email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-phone" className="text-gray-700">Phone Number</Label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="register-phone"
                      placeholder="+91 98765 43210"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-10 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-password" className="text-gray-700">Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-confirm-password" className="text-gray-700">Confirm Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="register-confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="pl-10 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white" size="lg" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Social Login */}
          <div className="mt-8">
            <Separator className="my-6" />
            <p className="text-center text-sm text-gray-500 mb-6">Or continue with</p>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => handleSocialLogin('Google')}
                className="w-full border-gray-200 hover:bg-gray-50"
              >
                <img 
                  src="https://developers.google.com/identity/images/g-logo.png" 
                  alt="Google" 
                  className="w-4 h-4 mr-2"
                />
                Google
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => handleSocialLogin('Facebook')}
                className="w-full border-gray-200 hover:bg-gray-50"
              >
                <div className="w-4 h-4 mr-2 bg-gray-800 rounded-sm flex items-center justify-center text-white text-xs font-bold">
                  f
                </div>
                Facebook
              </Button>
            </div>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-400 text-center mt-8">
            By continuing, you agree to our{' '}
            <a href="#" className="text-gray-600 hover:text-gray-900">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;