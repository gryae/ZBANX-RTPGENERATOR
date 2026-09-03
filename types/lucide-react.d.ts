declare module "lucide-react" {
  import type { ComponentType, SVGProps } from "react";

  export type LucideProps = SVGProps<SVGSVGElement> & {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
    className?: string;
  };
  export type LucideIcon = ComponentType<LucideProps>;

  export const Sparkles: LucideIcon;
  export const Zap: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const Mail: LucideIcon;
  export const LayoutGrid: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const User: LucideIcon;
  export const Table2: LucideIcon;
  export const Settings: LucideIcon;
  export const Eye: LucideIcon;
  export const EyeOff: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const CheckCheck: LucideIcon;
  export const FileText: LucideIcon;
  export const Code2: LucideIcon;
  export const Moon: LucideIcon;
  export const Sun: LucideIcon;
  export const Download: LucideIcon;
  export const ClipboardList: LucideIcon;
  export const X: LucideIcon;
  export const XIcon: LucideIcon;
  export const CalendarDays: LucideIcon;
  export const Hotel: LucideIcon;
  export const Link2: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const Hash: LucideIcon;
  export const MapPin: LucideIcon;
  export const Video: LucideIcon;
  export const Loader2: LucideIcon;

  export const icons: Record<string, LucideIcon>;
  const Lucide: Record<string, LucideIcon>;
  export default Lucide;
}
