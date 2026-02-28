/**
 * Component barrel exports
 *
 * Usage patterns:
 *   // Import specific component categories
 *   import { Paginator, SearchFilter } from "@/components/common";
 *   import { Navbar, Logo } from "@/components/layout";
 *   import { TargetModal, TagOptions } from "@/components/common/modals";
 *
 *   // Import UI components (shadcn/ui)
 *   import { Button, Input } from "@/components/ui/button";
 *
 *   // Import feature-specific components
 *   import { VisibilityPlot } from "@/components/observations";
 */

// Re-export organized component groups
export * from "./common";
export * from "./layout";

// Note: UI components should be imported directly from @/components/ui/[component]
// Feature-specific components should be imported from @/components/[feature]/
