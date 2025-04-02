
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Import Supabase client
import { supabaseClient } from "@/lib/supabase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "signup";
}

const AuthModal = ({ isOpen, onClose, initialView = "login" }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialView);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignIn = async () => {
    try {
      setIsLoading(true);
      
      if (!email || !password) {
        toast.error("Please enter both email and password");
        return;
      }
      
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success("Logged in successfully");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    try {
      setIsLoading(true);
      
      if (!email || !password) {
        toast.error("Please enter both email and password");
        return;
      }
      
      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      
      if (error) throw error;
      
      toast.success("Registration successful! Please check your email to verify your account.");
      setActiveTab("login");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      
      if (error) throw error;
      // Auth is handled by redirect
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  const handleSendOTP = () => {
    if (!phone) {
      toast.error("Please enter your mobile number");
      return;
    }
    
    // In a real app, this would connect to Supabase to send an OTP
    toast.success(`OTP sent to ${phone}`);
    setShowOtp(true);
  };

  const handleVerifyOTP = () => {
    if (!otp) {
      toast.error("Please enter the verification code");
      return;
    }
    
    // In a real app, this would verify the OTP with Supabase
    toast.success("OTP verified successfully");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden bg-white rounded-lg">
        <div className="h-1 bg-gradient-to-r from-primary to-accent" />
        
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-center text-2xl font-playfair text-primary">
            {activeTab === "login" ? "Access Your Account" : "Join EduLux"}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 rounded-none border-b">
            <TabsTrigger value="login" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-gold">Login</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-gold">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="p-6 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-xs text-accent hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full bg-primary hover:bg-secondary text-white" 
                onClick={handleEmailSignIn}
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2" 
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.5453 8.12828C15.5453 7.54094 15.4986 6.98594 15.4053 6.44883H8.16504V9.35953H12.3111C12.1361 10.3076 11.5939 11.0987 10.7692 11.6436V13.5449H13.2537C14.7423 12.1903 15.5453 10.3311 15.5453 8.12828Z" fill="#4285F4"/>
                  <path d="M8.16504 15.8683C10.2471 15.8683 11.9898 15.1713 13.2538 13.5449L10.7694 11.6436C10.0733 12.1177 9.19976 12.4064 8.16504 12.4064C6.11108 12.4064 4.37012 11.0401 3.76342 9.19922H1.19995V11.159C2.45825 13.9373 5.09496 15.8683 8.16504 15.8683Z" fill="#34A853"/>
                  <path d="M3.76341 9.19916C3.43341 8.24392 3.43341 7.21332 3.76341 6.25807V4.29834H1.19994C0.123073 6.46926 0.123073 8.98797 1.19994 11.1589L3.76341 9.19916Z" fill="#FBBC04"/>
                  <path d="M8.16504 3.3719C9.2817 3.35502 10.3633 3.76697 11.1817 4.52633L13.3766 2.33144C11.9349 0.972563 10.082 0.238867 8.16504 0.261891C5.09496 0.261891 2.45825 2.19282 1.19995 4.97118L3.76342 6.93091C4.37012 5.08998 6.11108 3.3719 8.16504 3.3719Z" fill="#EA4335"/>
                </svg>
                Google
              </Button>
              
              <div className="mt-4">
                <div className="text-center text-sm">
                  <span className="text-gray-500">Don't have an account? </span>
                  <button
                    className="text-accent hover:underline cursor-pointer"
                    onClick={() => setActiveTab("signup")}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="signup" className="p-6 pt-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input 
                  id="signup-email" 
                  type="email" 
                  placeholder="your@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input 
                  id="signup-password" 
                  type="password" 
                  placeholder="Create a password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters
                </p>
              </div>
              
              <Button 
                className="w-full bg-primary hover:bg-secondary text-white" 
                onClick={handleEmailSignUp}
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2" 
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.5453 8.12828C15.5453 7.54094 15.4986 6.98594 15.4053 6.44883H8.16504V9.35953H12.3111C12.1361 10.3076 11.5939 11.0987 10.7692 11.6436V13.5449H13.2537C14.7423 12.1903 15.5453 10.3311 15.5453 8.12828Z" fill="#4285F4"/>
                  <path d="M8.16504 15.8683C10.2471 15.8683 11.9898 15.1713 13.2538 13.5449L10.7694 11.6436C10.0733 12.1177 9.19976 12.4064 8.16504 12.4064C6.11108 12.4064 4.37012 11.0401 3.76342 9.19922H1.19995V11.159C2.45825 13.9373 5.09496 15.8683 8.16504 15.8683Z" fill="#34A853"/>
                  <path d="M3.76341 9.19916C3.43341 8.24392 3.43341 7.21332 3.76341 6.25807V4.29834H1.19994C0.123073 6.46926 0.123073 8.98797 1.19994 11.1589L3.76341 9.19916Z" fill="#FBBC04"/>
                  <path d="M8.16504 3.3719C9.2817 3.35502 10.3633 3.76697 11.1817 4.52633L13.3766 2.33144C11.9349 0.972563 10.082 0.238867 8.16504 0.261891C5.09496 0.261891 2.45825 2.19282 1.19995 4.97118L3.76342 6.93091C4.37012 5.08998 6.11108 3.3719 8.16504 3.3719Z" fill="#EA4335"/>
                </svg>
                Google
              </Button>
              
              <div className="mt-4">
                <div className="text-center text-sm">
                  <span className="text-gray-500">Already have an account? </span>
                  <button
                    className="text-accent hover:underline cursor-pointer"
                    onClick={() => setActiveTab("login")}
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Phone authentication option */}
        <div className="p-6 pt-0 border-t border-gray-100">
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or use phone</span>
            </div>
          </div>
          
          {!showOtp ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="+91 98765 43210" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleSendOTP}
              >
                Send OTP
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input 
                  id="otp" 
                  type="text" 
                  placeholder="Enter 6-digit code" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleVerifyOTP}
              >
                Verify & Proceed
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
