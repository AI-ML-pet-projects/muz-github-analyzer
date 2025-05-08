import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant?: "default" | "outline";
  comingSoon?: boolean;
  href?: string;
}

export default function PricingCard({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  buttonVariant = "default",
  comingSoon,
  href,
}: PricingCardProps) {
  const ButtonComponent = () => (
    <Button variant={buttonVariant} className='w-full' disabled={comingSoon}>
      {buttonText}
      {comingSoon && (
        <Badge variant='secondary' className='ml-2'>
          Coming Soon
        </Badge>
      )}
    </Button>
  );

  return (
    <Card className='relative'>
      <CardHeader>
        <h3 className='text-2xl font-bold'>{title}</h3>
        <div className='flex items-baseline gap-1'>
          <span className='text-3xl font-bold'>{price}</span>
          {period && <span className='text-muted-foreground'>{period}</span>}
        </div>
        <p className='text-muted-foreground'>{description}</p>
      </CardHeader>
      <CardContent className='space-y-6'>
        <ul className='space-y-3'>
          {features.map((feature, index) => (
            <li key={index} className='flex items-center gap-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
                className='w-5 h-5 text-green-500 shrink-0'
              >
                <path
                  fillRule='evenodd'
                  d='M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z'
                  clipRule='evenodd'
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        {href ? (
          <Link href={href}>
            <ButtonComponent />
          </Link>
        ) : (
          <ButtonComponent />
        )}
      </CardContent>
    </Card>
  );
}
