
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-xl font-bold text-scout-900">ScoutAI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/players" className="text-foreground/80 hover:text-primary transition-colors">
              Players
            </Link>
            <Link to="/clubs" className="text-foreground/80 hover:text-primary transition-colors">
              Clubs
            </Link>
            <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link to="/pricing" className="text-foreground/80 hover:text-primary transition-colors">
              Pricing
            </Link>
          </nav>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <Link to="/dashboard">
                <Button variant="outline" className="flex items-center gap-2">
                  <User size={18} />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-border">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link 
              to="/players" 
              className="block py-2 text-foreground/80 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Players
            </Link>
            <Link 
              to="/clubs" 
              className="block py-2 text-foreground/80 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Clubs
            </Link>
            <Link 
              to="/about" 
              className="block py-2 text-foreground/80 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              to="/pricing" 
              className="block py-2 text-foreground/80 hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            
            <div className="pt-4 border-t border-border">
              {isLoggedIn ? (
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Dashboard</Button>
                </Link>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Log In</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
