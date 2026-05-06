import { DesignStyle } from './types';

export const BEDROOM_STYLES: DesignStyle[] = [
  { id: 'minimalist', name: 'Minimalist', prompt: 'minimalist design, clean lines, monochromatic color palette, decluttered space, functional furniture', color: 'bg-stone-200 text-stone-800' },
  { id: 'scandinavian', name: 'Scandinavian', prompt: 'Scandinavian design, hygge atmosphere, light wood, white walls, cozy textures, natural light', color: 'bg-orange-100 text-orange-900' },
  { id: 'cozy', name: 'Cozy', prompt: 'cozy atmosphere, warm lighting, soft blankets, plush rugs, inviting textures, warm earth tones', color: 'bg-amber-700 text-white' },
  { id: 'modern', name: 'Modern', prompt: 'modern contemporary design, platform bed, sleek surfaces, bold geometric shapes, neutral colors with bold accents', color: 'bg-gray-800 text-white' },
  { id: 'bohemian', name: 'Bohemian', prompt: 'bohemian chic, canopy bed or low bed, plants, macrame, eclectic patterns, warm colors, relaxed vibe', color: 'bg-emerald-700 text-white' },
  { id: 'industrial', name: 'Industrial', prompt: 'industrial loft style, exposed brick, metal accents, raw wood, leather furniture, edison bulbs', color: 'bg-zinc-600 text-white' },
  { id: 'luxury', name: 'Luxury', prompt: 'high-end luxury hotel style, velvet textures, gold or brass accents, large headboard, elegant lighting, sophisticated', color: 'bg-purple-900 text-white' },
  { id: 'vintage', name: 'Vintage', prompt: 'vintage retro aesthetic, mid-century modern furniture, nostalgic decor, patterned wallpaper, antique touches', color: 'bg-yellow-600 text-white' },
  { id: 'gamer', name: 'Gamer Setup', prompt: 'ultimate gamer bedroom, RGB lighting strips, neon signs, gaming chair, multiple monitors, futuristic tech vibe', color: 'bg-indigo-600 text-white' },
  { id: 'futuristic', name: 'Futuristic', prompt: 'futuristic sci-fi design, sleek curves, white and neon blue lighting, high-tech surfaces, spaceship aesthetic', color: 'bg-cyan-500 text-black' },
];

export const MODEL_NAME = 'gemini-2.5-flash-image';
