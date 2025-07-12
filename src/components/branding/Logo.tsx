import Link from 'next/link';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className, width = 32, height = 32 }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center space-x-2 ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        width={width}
        height={height}
        className="fill-current"
      >
        <rect width="256" height="256" fill="none" />
        <path
          d="M139.1,213.4l-24.5,24.5a14,14,0,0,1-19.8,0l-50-50a14,14,0,0,1,0-19.8L69.3,143.6Z"
          opacity="0.2"
        />
        <path
          d="M208.2,142.6,113.4,47.8a14,14,0,0,0-19.8,0l-50,50a14,14,0,0,0,0,19.8l24.5,24.5,74.5-74.5L208.2,133A14,14,0,0,0,208.2,142.6Z"
          fill="currentColor" // Or use Tailwind classes like text-primary
        />
        <path
          d="M186.7,168.4,161,194.1l-24.5-24.5,25.7-25.7Z"
          opacity="0.2"
        />
        <path
          d="M161,194.1,136.5,218.6a14,14,0,0,1-19.8,0l-50-50a14,14,0,0,1,0-19.8L91.2,124.3l70.5,70.5Z"
          fill="currentColor" // Or use Tailwind classes like text-primary
        />
      </svg>
      <span className="font-bold text-lg">{siteConfig.name.split(" ")[0]}</span>
    </Link>
  );
}

// Need to import siteConfig if using its name directly in the span
// For simplicity, let's assume the span will be static or passed as a prop if needed
// Or, import it:
import { siteConfig } from '@/config/site';
