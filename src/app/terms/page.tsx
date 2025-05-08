import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import NavBar from "@/components/nav-bar";

export default function TermsPage() {
  return (
    <>
      <NavBar />
      <div className='container mx-auto py-8 space-y-8'>
        <div className='flex items-center gap-4'>
          <Link href='/'>
            <Button variant='ghost' size='sm'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className='prose prose-gray dark:prose-invert max-w-none'>
          <h1 className='text-4xl font-bold mb-8'>Terms of Service</h1>

          <Card className='mb-8'>
            <CardHeader>
              <CardTitle>1. Service Usage</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>By using Muz GitHub Analyzer, you agree to:</p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>Use the service in compliance with all applicable laws</li>
                <li>Not exceed your plan&apos;s usage limits</li>
                <li>Not attempt to circumvent any service limitations</li>
                <li>Maintain the security of your account credentials</li>
              </ul>
            </CardContent>
          </Card>

          <Card className='mb-8'>
            <CardHeader>
              <CardTitle>2. API Usage and Rate Limits</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>Our service includes the following usage restrictions:</p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>Free tier: 5 repository analyses per month</li>
                <li>Pro tier: 50 repository analyses per month</li>
                <li>Team tier: Unlimited repository analyses</li>
                <li>Rate limiting applies to prevent abuse</li>
              </ul>
            </CardContent>
          </Card>

          <Card className='mb-8'>
            <CardHeader>
              <CardTitle>3. Data Usage Rights</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>Regarding data usage and rights:</p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>We do not claim ownership of analyzed repositories</li>
                <li>
                  Analysis results are provided for informational purposes only
                </li>
                <li>You maintain responsibility for repository content</li>
                <li>We may use anonymized data for service improvement</li>
              </ul>
            </CardContent>
          </Card>

          <Card className='mb-8'>
            <CardHeader>
              <CardTitle>4. Service Availability</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>We strive to maintain high service availability, however:</p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>We do not guarantee 100% uptime</li>
                <li>Maintenance windows may affect service availability</li>
                <li>Force majeure events may impact service delivery</li>
                <li>We provide no warranty for service interruptions</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Termination</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>We reserve the right to terminate service:</p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>For violation of these terms</li>
                <li>For abuse of service resources</li>
                <li>For non-payment of fees</li>
                <li>At our discretion with reasonable notice</li>
              </ul>
              <p className='mt-4'>
                For questions about these terms, please visit our{" "}
                <Link href='/contact' className='text-primary hover:underline'>
                  contact page
                </Link>
                .
              </p>
            </CardContent>
          </Card>

          <p className='text-sm text-muted-foreground mt-8'>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </>
  );
}
