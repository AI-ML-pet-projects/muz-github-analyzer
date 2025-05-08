import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Phone } from "lucide-react";
import NavBar from "@/components/nav-bar";

export default function ContactPage() {
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

        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl font-bold mb-8'>Contact Us</h1>

          <div className='grid md:grid-cols-2 gap-8'>
            {/* Contact Information */}
            <div className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <p className='text-muted-foreground'>
                    Have questions about our service? We&apos;re here to help!
                  </p>

                  <div className='space-y-4'>
                    <div className='flex items-center gap-3'>
                      <Mail className='h-5 w-5 text-primary' />
                      <a
                        href='mailto:support@muzanalyzer.com'
                        className='hover:text-primary'
                      >
                        support@muzanalyzer.com
                      </a>
                    </div>

                    <div className='flex items-center gap-3'>
                      <Phone className='h-5 w-5 text-primary' />
                      <a href='tel:+1234567890' className='hover:text-primary'>
                        +1 (234) 567-890
                      </a>
                    </div>

                    <div className='flex items-center gap-3'>
                      <MessageSquare className='h-5 w-5 text-primary' />
                      <span>Response time: Within 24 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>FAQ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground mb-4'>
                    Before reaching out, you might find answers in our
                    documentation:
                  </p>
                  <ul className='space-y-2'>
                    <li>
                      <Link
                        href='/docs/getting-started'
                        className='text-primary hover:underline'
                      >
                        Getting Started Guide
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/docs/api'
                        className='text-primary hover:underline'
                      >
                        API Documentation
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/docs/troubleshooting'
                        className='text-primary hover:underline'
                      >
                        Troubleshooting Guide
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className='space-y-6'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium' htmlFor='name'>
                      Name
                    </label>
                    <Input id='name' placeholder='Your name' required />
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium' htmlFor='email'>
                      Email
                    </label>
                    <Input
                      id='email'
                      type='email'
                      placeholder='your@email.com'
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium' htmlFor='subject'>
                      Subject
                    </label>
                    <Input
                      id='subject'
                      placeholder="What's this about?"
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <label className='text-sm font-medium' htmlFor='message'>
                      Message
                    </label>
                    <Textarea
                      id='message'
                      placeholder='Your message...'
                      rows={5}
                      required
                    />
                  </div>

                  <Button type='submit' className='w-full'>
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
