import { icons } from "lucide-react";

export type Status = "active" | "pending" | "complete";
export type Feature = {
  title: string;
  description: string;
  status: Status;
  icon: keyof typeof icons;
};
export type Phase = {
  id: string;
  title: string;
  description: string;
  features: Feature[];
};

export const phases: Phase[] = [
  {
    id: "phase0",
    title: "Phase 0: Core Foundations",
    description: "Establishing a barebones product.",
    features: [
      {
        title: "Landing pages",
        description:
          "Create an intial set of landing pages and login screen for users to interact with.",
        status: "complete",
        icon: "StickyNote",
      },
      {
        title: "User sign up",
        description:
          "Allow new users to sign up for the platform with an email address and password.",
        status: "pending",
        icon: "Clipboard",
      },
      {
        title: "Recipe creation",
        description:
          "Allow users to be able to store and view their own recipes.",
        status: "active",
        icon: "ChefHat",
      },
    ],
  },
  {
    id: "phase1",
    title: "Phase 1: Core Features & User Experience",
    description:
      "Establishing the foundation with essential recipe management tools.",
    features: [
      {
        title: "Recipe Discovery & Search",
        status: "pending",
        description:
          "Ingredient, Cuisine, and Effort-Based Search: Users can search for recipes based on available ingredients, preferred cuisine, and the effort they want to invest.",
        icon: "Search",
      },
      {
        title: "Recipe Saving & Organization",
        status: "pending",
        description:
          "Create collections, tag recipes, and mark favorites for easy access.",
        icon: "BookMarked",
      },
      {
        title: "Social Sharing & Collaboration",
        status: "pending",
        description:
          "Share recipes with friends and create collaborative collections.",
        icon: "Share2",
      },
      {
        title: "Shopping List & Meal Planning",
        status: "pending",
        description:
          "Generate shopping lists from recipes and plan meals efficiently.",
        icon: "ShoppingCart",
      },
    ],
  },
  {
    id: "phase2",
    title: "Phase 2: Enhanced User Interaction & Personalization",
    description:
      "Improving user engagement with personalized features and content creation.",
    features: [
      {
        title: "User-Generated Content",
        status: "pending",
        description:
          "Upload recipe photos to create a more personal and interactive experience.",
        icon: "Upload",
      },
      {
        title: "Dietary Preferences & Customization",
        status: "pending",
        description:
          "Personalize recipes with dietary filters, adjustable serving sizes, and nutrition information.",
        icon: "SlidersHorizontal",
      },
      {
        title: "User Profile & Activity Tracking",
        status: "pending",
        description:
          "Track cooking history and recently viewed recipes for a smoother browsing experience.",
        icon: "User",
      },
    ],
  },
  {
    id: "phase3",
    title: "Phase 3: Engagement, Notifications & Mobile Optimization",
    description:
      "Enhancing user engagement through notifications and mobile-friendly features.",
    features: [
      {
        title: "Notifications & Updates",
        status: "pending",
        description:
          "Receive notifications for recipe sharing, collection updates, and cooking reminders.",
        icon: "Bell",
      },
      {
        title: "Mobile Optimization",
        status: "pending",
        description:
          "Enjoy a seamless experience across devices with offline access and a dedicated mobile app.",
        icon: "Smartphone",
      },
    ],
  },
  {
    id: "phase4",
    title: "Phase 4: AI, Gamification & Book Integration",
    description:
      "Introducing advanced features to enhance user experience and engagement.",
    features: [
      {
        title: "AI-Driven Features",
        status: "pending",
        description:
          "Get personalized recipe suggestions and ingredient substitutions powered by AI.",
        icon: "Cpu",
      },
      {
        title: "Gamification & Engagement",
        status: "pending",
        description:
          "Earn badges for cooking streaks and participate in community recipe challenges.",
        icon: "Trophy",
      },
      {
        title: "Engagement with Book Publishers",
        status: "pending",
        description:
          "Sync purchased cookbooks and access sample recipes from various publishers.",
        icon: "BookOpen",
      },
    ],
  },
  {
    id: "phase5",
    title: "Phase 5: Community Building & Continuous Improvements",
    description:
      "Expanding social features and incorporating user feedback for ongoing enhancements.",
    features: [
      {
        title: "Expand Sharing Options",
        status: "pending",
        description:
          "Introduce more sharing options with social media integration.",
        icon: "Share2",
      },
      {
        title: "User Feedback & Surveys",
        status: "pending",
        description:
          "Collect ongoing feedback to continually refine features based on user needs.",
        icon: "User",
      },
      {
        title: "Expand AI Capabilities",
        status: "pending",
        description:
          "Incorporate more advanced AI features, such as meal plan generation and voice-powered search.",
        icon: "Cpu",
      },
    ],
  },
];

const mapStatusToValue = (status: Status): number => {
  switch (status) {
    case "active":
      return 1;
    case "pending":
      return 0;
    case "complete":
      return 2;
  }
};
const compareFeatures = (
  { status: a }: Feature,
  { status: b }: Feature
): number => {
  return mapStatusToValue(b) - mapStatusToValue(a);
};

phases.forEach(({ features }) => features.sort(compareFeatures));
