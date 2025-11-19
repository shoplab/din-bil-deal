import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Check, Search } from 'lucide-react';
import {
  Briefcase, Users, Mountain, Building2, Car, Heart, Star, Zap,
  DollarSign, Leaf, Armchair, Home, MapPin, Phone, Mail, Calendar,
  Clock, Shield, Award, TrendingUp, Activity, BarChart, PieChart,
  Settings, Tool, Wrench, Package, ShoppingCart, CreditCard, Wallet,
  Gauge, Route, Navigation, Compass, Map, Globe, Wifi,
  Battery, BatteryCharging, Plug, Sun, Moon, CloudRain, Wind,
  Thermometer, Droplets, Flame, Snowflake, Umbrella, Coffee, Pizza,
  Music, Camera, Film, Headphones, Mic, Video, Radio, Tv,
  Gamepad2, Dumbbell, Bike, Bus, Plane, Ship, Rocket, Truck,
  Baby, Dog, Cat, Bird, Fish, Trees, Flower2, Sprout, Apple,
  Citrus, Cherry, Banana, Carrot, Cake,
  CheckCircle, XCircle, AlertCircle, Info, HelpCircle, Plus,
  Minus, X, ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Send, Download, Upload,
  Trash2, Edit, Copy, Save, Share2, Bookmark, Flag, Tag,
  Folder, File, FileText, Image, Paperclip, Link, ExternalLink,
  Eye, EyeOff, Lock, Unlock, Key, UserCircle, UserPlus, UserMinus,
  Bell, BellOff, MessageCircle, MessageSquare, Inbox, Archive,
  Repeat, RotateCw, RefreshCw, Loader, Loader2, Pause, Play,
  Square, Circle, Triangle, Hexagon, Octagon, Diamond, Sparkles,
} from 'lucide-react';

// Icon mapping object
const iconComponents = {
  Briefcase, Users, Mountain, Building2, Car, Heart, Star, Zap,
  DollarSign, Leaf, Armchair, Home, MapPin, Phone, Mail, Calendar,
  Clock, Shield, Award, TrendingUp, Activity, BarChart, PieChart,
  Settings, Tool, Wrench, Package, ShoppingCart, CreditCard, Wallet,
  Gauge, Route, Navigation, Compass, Map, Globe, Wifi,
  Battery, BatteryCharging, Plug, Sun, Moon, CloudRain, Wind,
  Thermometer, Droplets, Flame, Snowflake, Umbrella, Coffee, Pizza,
  Music, Camera, Film, Headphones, Mic, Video, Radio, Tv,
  Gamepad2, Dumbbell, Bike, Bus, Plane, Ship, Rocket, Truck,
  Baby, Dog, Cat, Bird, Fish, Trees, Flower2, Sprout, Apple,
  Citrus, Cherry, Banana, Carrot, Cake,
  CheckCircle, XCircle, AlertCircle, Info, HelpCircle, Plus,
  Minus, X, ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Send, Download, Upload,
  Trash2, Edit, Copy, Save, Share2, Bookmark, Flag, Tag,
  Folder, File, FileText, Image, Paperclip, Link, ExternalLink,
  Eye, EyeOff, Lock, Unlock, Key, UserCircle, UserPlus, UserMinus,
  Bell, BellOff, MessageCircle, MessageSquare, Inbox, Archive,
  Repeat, RotateCw, RefreshCw, Loader, Loader2, Pause, Play,
  Square, Circle, Triangle, Hexagon, Octagon, Diamond, Sparkles,
};

const iconList = Object.keys(iconComponents);

export default function IconSelector({ value, onChange, label = 'Ikon' }) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const filteredIcons = iconList.filter(icon =>
    icon.toLowerCase().includes(search.toLowerCase())
  );

  const SelectedIcon = value && iconComponents[value] ? iconComponents[value] : null;

  return (
    <div>
      <Label>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            className="w-full justify-start mt-1"
          >
            {SelectedIcon ? (
              <div className="flex items-center gap-2">
                <SelectedIcon className="h-4 w-4" />
                <span>{value}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Välj ikon...</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="start">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Sök ikoner..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="p-2 max-h-[300px] overflow-y-auto">
            <div className="grid grid-cols-6 gap-1">
              {filteredIcons.map((iconName) => {
                const IconComponent = iconComponents[iconName];
                const isSelected = value === iconName;

                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => {
                      onChange(iconName);
                      setOpen(false);
                      setSearch('');
                    }}
                    className={`
                      relative p-3 rounded-md hover:bg-accent transition-colors
                      ${isSelected ? 'bg-accent' : ''}
                    `}
                    title={iconName}
                  >
                    <IconComponent className="h-5 w-5" />
                    {isSelected && (
                      <Check className="absolute top-0.5 right-0.5 h-3 w-3 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
            {filteredIcons.length === 0 && (
              <div className="text-center py-6 text-sm text-muted-foreground">
                Inga ikoner hittades
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
