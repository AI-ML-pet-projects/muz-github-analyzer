import Link from "next/link";
import {
  Github,
  Star,
  GitPullRequest,
  BarChart3,
  Code2,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DemoSection from "@/components/demo-section";
import FeatureCard from "@/components/feature-card";
import HeroAnimation from "@/components/hero-animation";
import PricingCard from "@/components/pricing-card";
import NavBar from "@/components/nav-bar";

// Constants for reusability
const ROUTES = {
  PLAYGROUND: "/dashboard/playground",
  DEMO: "#demo",
  FEATURES: "#features",
  PRICING: "#pricing",
} as const;

interface SectionHeaderProps {
  title: string;
  description: string;
}

const SectionHeader = ({ title, description }: SectionHeaderProps) => (
  <div className='text-center mb-16'>
    <h2 className='text-3xl md:text-4xl font-bold mb-4'>{title}</h2>
    <p className='text-muted-foreground max-w-2xl mx-auto'>{description}</p>
  </div>
);

const FAQ_ITEMS = [
  {
    question: "How accurate are the repository insights?",
    answer:
      "Our AI model is trained on millions of repositories and achieves over 95% accuracy in its analyses. We continuously improve our models based on user feedback.",
  },
  {
    question: "Can I analyze private repositories?",
    answer:
      "Yes, with our Pro and Team plans, you can analyze private repositories by connecting your GitHub account with the necessary permissions.",
  },
  {
    question: "How is the star prediction calculated?",
    answer:
      "Our star prediction algorithm analyzes repository metrics, code quality, documentation, and compares it with similar repositories to predict potential growth.",
  },
  {
    question: "Can I integrate Muz GitHub Analyzer with my CI/CD pipeline?",
    answer:
      "Yes, our Team plan includes API access that allows you to integrate our analyzer with your CI/CD pipeline or other development tools.",
  },
] as const;

export default function Home() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <NavBar />

      {/* Hero Section */}
      <section className='container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12'>
        <div className='flex-1 space-y-6'>
          <div className='inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2'>
            Powered by AI
          </div>
          <h1 className='text-4xl md:text-6xl font-bold leading-tight'>
            Muz GitHub <span className='text-primary'>Analyzer</span>
          </h1>
          <p className='text-lg text-muted-foreground max-w-xl'>
            Get instant insights on any GitHub repository. Summaries, star
            predictions, cool facts, important pull requests, and version
            updates - all in one place.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 pt-4'>
            <Link href={ROUTES.PLAYGROUND}>
              <Button className='text-lg px-8 py-6 w-full sm:w-auto'>
                Analyze Your Repo
              </Button>
            </Link>
            <Link href={ROUTES.DEMO}>
              <Button
                variant='outline'
                className='text-lg px-8 py-6 w-full sm:w-auto'
              >
                View Demo
              </Button>
            </Link>
          </div>
        </div>
        <div className='flex-1 relative'>
          <HeroAnimation />
        </div>
      </section>

      {/* Stats Section */}
      <section className='bg-muted py-16'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
            <div className='space-y-2'>
              <p className='text-4xl font-bold text-primary'>10k+</p>
              <p className='text-muted-foreground'>Repos Analyzed</p>
            </div>
            <div className='space-y-2'>
              <p className='text-4xl font-bold text-primary'>98%</p>
              <p className='text-muted-foreground'>Accuracy Rate</p>
            </div>
            <div className='space-y-2'>
              <p className='text-4xl font-bold text-primary'>5M+</p>
              <p className='text-muted-foreground'>Lines Processed</p>
            </div>
            <div className='space-y-2'>
              <p className='text-4xl font-bold text-primary'>3k+</p>
              <p className='text-muted-foreground'>Happy Developers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='container mx-auto px-4 py-20'>
        <SectionHeader
          title='Powerful AI-Driven Features'
          description='Our advanced AI analyzes repositories to provide insights that would take hours to gather manually.'
        />

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          <FeatureCard
            icon={<Code2 className='h-10 w-10 text-primary' />}
            title='Repository Summary'
            description='Get concise summaries of repository structure, purpose, and architecture in seconds.'
          />
          <FeatureCard
            icon={<Star className='h-10 w-10 text-primary' />}
            title='Star Prediction'
            description='Predict potential popularity based on similar repositories and current trends.'
          />
          <FeatureCard
            icon={<GitPullRequest className='h-10 w-10 text-primary' />}
            title='Important PRs'
            description='Automatically identify and summarize the most impactful pull requests.'
          />
          <FeatureCard
            icon={<BarChart3 className='h-10 w-10 text-primary' />}
            title='Cool Facts'
            description='Discover interesting facts and statistics about the repository and its contributors.'
          />
          <FeatureCard
            icon={<Zap className='h-10 w-10 text-primary' />}
            title='Version Updates'
            description='Track major version updates and understand what changed between releases.'
          />
          <FeatureCard
            icon={<Github className='h-10 w-10 text-primary' />}
            title='Contributor Analysis'
            description='Understand contribution patterns and identify key maintainers.'
          />
        </div>
      </section>

      {/* Demo Section */}
      <section id='demo' className='bg-muted py-20'>
        <div className='container mx-auto px-4'>
          <SectionHeader
            title='See Muz GitHub Analyzer in Action'
            description='Watch how our AI analyzes a popular open-source repository in real-time.'
          />
          <DemoSection />
        </div>
      </section>

      {/* Pricing Section */}
      <section id='pricing' className='container mx-auto px-4 py-20'>
        <SectionHeader
          title='Simple, Transparent Pricing'
          description='Choose the plan that fits your needs. Start with our free tier and upgrade as you grow.'
        />

        <div className='grid md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
          <PricingCard
            title='Free'
            price='$0'
            description='Perfect for individual developers and open-source enthusiasts.'
            features={[
              "5 repository analyses per month",
              "Basic repository summaries",
              "7-day data retention",
            ]}
            buttonText='Get Started'
            buttonVariant='outline'
            href={ROUTES.PLAYGROUND}
          />

          <PricingCard
            title='Pro'
            price='$19'
            period='per month'
            description='Ideal for professional developers and small teams.'
            features={[
              "50 repository analyses per month",
              "Advanced repository insights",
              "30-day data retention",
            ]}
            buttonText='Start Free Trial'
            buttonVariant='default'
            comingSoon={true}
          />

          <PricingCard
            title='Team'
            price='$49'
            period='per month'
            description='For development teams and organizations.'
            features={[
              "Unlimited repository analyses",
              "All Pro features",
              "Priority support",
            ]}
            buttonText='Contact Sales'
            buttonVariant='outline'
            comingSoon={true}
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className='bg-muted py-20'>
        <div className='container mx-auto px-4'>
          <SectionHeader
            title='Frequently Asked Questions'
            description="Got questions? We've got answers."
          />

          <div className='max-w-3xl mx-auto space-y-6'>
            {FAQ_ITEMS.map((item, index) => (
              <div key={index} className='bg-card rounded-lg p-6 shadow-sm'>
                <h3 className='text-xl font-semibold mb-2'>{item.question}</h3>
                <p className='text-muted-foreground'>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='container mx-auto px-4 py-20'>
        <div className='bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl p-8 md:p-12'>
          <div className='max-w-3xl mx-auto text-center space-y-6'>
            <h2 className='text-3xl md:text-4xl font-bold'>
              Ready to Understand Any GitHub Repo?
            </h2>
            <p className='text-lg text-muted-foreground'>
              Start analyzing repositories today and gain insights that would
              take hours to gather manually.
            </p>
            <Link href={ROUTES.PLAYGROUND}>
              <Button className='text-lg px-8 py-6 mt-4 group'>
                Try Muz GitHub Analyzer{" "}
                <ArrowRight className='ml-2 group-hover:translate-x-1 transition-transform' />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-muted py-12 border-t'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex items-center gap-2 mb-6 md:mb-0'>
              <Github className='h-8 w-8 text-primary' />
              <span className='text-xl font-bold'>Muz GitHub Analyzer</span>
            </div>
            <div className='flex gap-8'>
              <Link
                href='/privacy'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                Privacy
              </Link>
              <Link
                href='/terms'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                Terms
              </Link>
              <Link
                href='/contact'
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                Contact
              </Link>
            </div>
          </div>
          <div className='mt-8 text-center text-muted-foreground text-sm'>
            © {new Date().getFullYear()} Muz GitHub Analyzer. All rights
            reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
