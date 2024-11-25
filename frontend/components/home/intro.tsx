import Link from "next/link";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/utils";
import { TerminalTyping } from "../TerminalTypingEffect";

const codeBlocks = [
  `Initializing connection to NCU TOM...`,

  `// Checking system status
const systemStatus = await getSystemStatus();
try {
  if (systemStatus === 'online') {
    console.log('System is online');
  } else {
    console.error('System is offline');
  }
} catch (error) {
  console.error('System status check failed:', error);
}
`,

  `// Fetching Weather Data
async function fetchWeatherData() {
  try {
    const response = await fetch('https://api.windy.com');
    const starMap = await response.json();
    console.log('Stellar Map:', starMap);
  } catch (error) {
    console.error('Distortion Detected:', error);
  }
}

fetchGalacticData();`,
];

interface IntroProps {
  className?: string;
}

export default async function Intro({ className }: IntroProps) {
  return (
    <section className={cn("relative w-full px-12", className)}>
      <div className="container relative mx-auto grid gap-4 px-32 md:grid-cols-5 md:gap-2">
        {/* Left column - 2/5 width */}
        <div className="col-span-2 flex flex-col justify-center space-y-8">
          <div className="space-y-6">
            <h1 className="text-6xl font-bold tracking-tighter text-white sm:text-7xl">
              NCU TOM
            </h1>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Target <br />
              Observation <br />
              Manager
            </h2>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/auth/signin">
              <Button
                size="lg"
                className="bg-[#7C3AED] text-white hover:bg-[#7C3AED]/90"
              >
                Get Started
              </Button>
            </Link>
            <Link target="_blank" href="https://github.com/Tylerastro/NCU_TOM">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-700 bg-transparent text-white hover:bg-gray-800"
              >
                <Github className="mr-2 h-5 w-5" />
                Source
              </Button>
            </Link>
          </div>
        </div>
        <TerminalTyping
          className="col-span-3 flex flex-col justify-center"
          codeBlocks={codeBlocks}
          speed={30}
        />
      </div>
    </section>
  );
}
