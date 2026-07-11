import { 
  ArrowRight, Github, Star, Cloud, CloudUpload, Copy, Check, Heart, Link, Send, Play, Pause, 
  Settings, Trash2, Bell, BellRing, Search, X, Moon, Sun, Mic, MicOff, Video, VideoOff,
  Volume2, VolumeX, Lock, Unlock, Folder, FolderOpen, Eye, EyeOff, Bookmark, ThumbsUp,
  Download, Upload, User, UserCheck, Pen, Wifi, WifiOff, Battery, BatteryCharging,
  Maximize, Minimize, RefreshCw
} from 'lucide-react';
import React from 'react';

export type InteractionType = 
  | 'slide-arrow' 
  | 'sparkle' 
  | 'morph' 
  | 'pulse' 
  | 'rotate' 
  | 'shake' 
  | 'ring' 
  | 'color-morph';

export interface ButtonConfig {
  id: string;
  label: string;
  icon1: React.ElementType | string; // SVG string or Lucide Component
  icon2?: React.ElementType;
  interactionType: InteractionType;
  hoverBg?: string;
  icon1Color?: string;
  icon2Color?: string;
}

export const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 384 512" fill="currentColor" {...props}>
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

export const buttonsData: ButtonConfig[] = [
  { id: '1', label: 'Download for Mac', icon1: AppleIcon, icon2: ArrowRight, interactionType: 'slide-arrow', hoverBg: '#0a0a0a' },
  { id: '2', label: 'Star on GitHub', icon1: Github, icon2: Star, interactionType: 'sparkle', hoverBg: '#1f1f1f', icon2Color: 'text-yellow-400' },
  { id: '3', label: 'Deploy App', icon1: Cloud, icon2: CloudUpload, interactionType: 'morph', hoverBg: '#1f1f1f', icon2Color: 'text-blue-400' },
  { id: '4', label: 'Copy Hash', icon1: Copy, icon2: Check, interactionType: 'morph', hoverBg: '#1f1f1f', icon2Color: 'text-emerald-400' },
  { id: '5', label: 'Sponsor', icon1: Heart, interactionType: 'pulse', hoverBg: '#1f1f1f', icon1Color: 'text-pink-500' },
  { id: '6', label: 'Share', icon1: Link, icon2: Send, interactionType: 'morph', hoverBg: '#1f1f1f', icon2Color: 'text-blue-400' },
  { id: '7', label: 'Preview', icon1: Play, icon2: Pause, interactionType: 'morph', hoverBg: '#1f1f1f', icon2Color: 'text-green-400' },
  { id: '8', label: 'Settings', icon1: Settings, interactionType: 'rotate', hoverBg: '#1f1f1f' },
  { id: '9', label: 'Delete', icon1: Trash2, interactionType: 'shake', hoverBg: '#1f1f1f', icon1Color: 'text-red-400' },
  { id: '10', label: 'Subscribe', icon1: Bell, icon2: BellRing, interactionType: 'ring', hoverBg: '#1f1f1f', icon2Color: 'text-orange-400' },
  { id: '11', label: 'Search', icon1: Search, icon2: X, interactionType: 'morph', hoverBg: '#1f1f1f', icon2Color: 'text-white' },
  { id: '12', label: 'Theme', icon1: Moon, icon2: Sun, interactionType: 'morph', hoverBg: '#1f1f1f', icon2Color: 'text-yellow-400' },
  { id: '13', label: 'Microphone', icon1: Mic, icon2: MicOff, interactionType: 'morph', hoverBg: '#1f1f1f', icon2Color: 'text-red-400' },
  { id: '14', label: 'Camera', icon1: Video, icon2: VideoOff, interactionType: 'morph', hoverBg: '#1f1f1f', icon2Color: 'text-red-400' },
  { id: '15', label: 'Volume', icon1: Volume2, icon2: VolumeX, interactionType: 'morph', hoverBg: '#1f1f1f', icon2Color: 'text-neutral-500' },
  { id: '16', label: 'Lock', icon1: Lock, icon2: Unlock, interactionType: 'morph', hoverBg: '#1f1f1f', icon2Color: 'text-emerald-400' },
  { id: '17', label: 'Directory', icon1: Folder, icon2: FolderOpen, interactionType: 'morph', hoverBg: '#1f1f1f', icon2Color: 'text-blue-400' },
  { id: '18', label: 'Visibility', icon1: Eye, icon2: EyeOff, interactionType: 'morph', hoverBg: '#1f1f1f', icon2Color: 'text-neutral-500' },
  { id: '19', label: 'Save Later', icon1: Bookmark, icon2: Bookmark, interactionType: 'color-morph', hoverBg: '#1f1f1f', icon2Color: 'text-blue-400 fill-blue-400' },
  { id: '20', label: 'Like', icon1: ThumbsUp, icon2: ThumbsUp, interactionType: 'color-morph', hoverBg: '#1f1f1f', icon2Color: 'text-blue-500 fill-blue-500' },
  { id: '21', label: 'Download', icon1: Download, icon2: Check, interactionType: 'morph', hoverBg: '#1f1f1f', icon2Color: 'text-emerald-400' },
  { id: '22', label: 'Upload', icon1: Upload, icon2: Check, interactionType: 'morph', hoverBg: '#1f1f1f', icon2Color: 'text-blue-400' },
  { id: '23', label: 'Account', icon1: User, icon2: UserCheck, interactionType: 'morph', hoverBg: '#1f1f1f', icon2Color: 'text-emerald-400' },
  { id: '24', label: 'Submit', icon1: Send, icon2: Check, interactionType: 'morph', hoverBg: '#1f1f1f', icon2Color: 'text-emerald-400' },
  { id: '25', label: 'Edit', icon1: Pen, icon2: Check, interactionType: 'morph', hoverBg: '#1f1f1f', icon2Color: 'text-emerald-400' },
  { id: '26', label: 'Network', icon1: Wifi, icon2: WifiOff, interactionType: 'morph', hoverBg: '#1f1f1f', icon2Color: 'text-red-400' },
  { id: '27', label: 'Power', icon1: Battery, icon2: BatteryCharging, interactionType: 'morph', hoverBg: '#1f1f1f', icon2Color: 'text-emerald-400' },
  { id: '28', label: 'Expand', icon1: Maximize, icon2: Minimize, interactionType: 'morph', hoverBg: '#1f1f1f', icon2Color: 'text-white' },
  { id: '29', label: 'Reload', icon1: RefreshCw, interactionType: 'rotate', hoverBg: '#1f1f1f' },
  { id: '30', label: 'Favorite', icon1: Star, icon2: Star, interactionType: 'color-morph', hoverBg: '#1f1f1f', icon2Color: 'text-yellow-400 fill-yellow-400' },
];
