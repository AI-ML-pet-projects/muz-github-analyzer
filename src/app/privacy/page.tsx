import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import NavBar from "@/components/nav-bar";

export default function PrivacyPage() {
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
          <h1 className='text-4xl font-bold mb-8'>Privacy Policy</h1>

          <Card className='mb-8'>
            <CardHeader>
              <CardTitle>Data Collection and Usage</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                We collect and process the following information when you use
                Muz GitHub Analyzer:
              </p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>GitHub repository URLs you analyze</li>
                <li>API usage statistics</li>
                <li>Account information (if you create an account)</li>
                <li>
                  Payment information (handled securely by our payment
                  processor)
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className='mb-8'>
            <CardHeader>
              <CardTitle>Data Protection</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                We implement various security measures to protect your personal
                information:
              </p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>Encryption of sensitive data</li>
                <li>Regular security audits</li>
                <li>Secure data storage practices</li>
                <li>Limited employee access to user data</li>
              </ul>
            </CardContent>
          </Card>

          <Card className='mb-8'>
            <CardHeader>
              <CardTitle>Cookie Policy</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>
                We use cookies to improve your experience on our website. These
                include:
              </p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>Essential cookies for site functionality</li>
                <li>Analytics cookies to understand usage patterns</li>
                <li>Preference cookies to remember your settings</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <p>You have the following rights regarding your personal data:</p>
              <ul className='list-disc pl-6 space-y-2'>
                <li>Right to access your data</li>
                <li>Right to rectification</li>
                <li>Right to erasure</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
              </ul>
              <p className='mt-4'>
                To exercise any of these rights, please contact us through our{" "}
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
