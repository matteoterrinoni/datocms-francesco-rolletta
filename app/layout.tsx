import { NavigationMenu } from '@/components/NavigationMenu';
import { graphql } from '@/gql';
import { request } from '@/lib/dato';
import { GoogleTagManager } from '@next/third-parties/google';
import { Playfair_Display, Poppins } from 'next/font/google';
import { CSSProperties } from 'react';
import { renderMetaTags } from 'react-datocms/seo';
import './globals.css';


const query = graphql(/* GraphQL */ `
  query Layout {
    site: _site {
      faviconMetaTags {
        tag
        attributes
        content
      }
    }
    contactPage {
      phoneNumber
    }
    theme {
      accentColor {
        red
        green
        blue
      }
      highlightColor {
        red
        green
        blue
      }
    }
  }
`);

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair-display',
  weight: '700',
  display: 'swap',
  subsets: ['latin'],
});

const poppins = Poppins({
  variable: '--font-poppins',
  display: 'swap',
  weight: ['400', '700'],
  subsets: ['latin'],
});

function colorToRule(color: { red: number; green: number; blue: number }) {
  return `${color.red} ${color.green} ${color.blue}`;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, site, contactPage } = await request(query);

  return (
    <html lang="en">
      {renderMetaTags(site.faviconMetaTags)}
      <body
        className={`${playfairDisplay.variable} ${poppins.variable} font-sans overflow-x-hidden text-gray`}
        style={
          theme
            ? ({
              '--color-accent': colorToRule(theme.accentColor),
              '--color-highlight': colorToRule(theme.highlightColor),
            } as CSSProperties)
            : undefined
        }
      >
        <NavigationMenu phoneNumber={contactPage?.phoneNumber} />
        {children}
      </body>
      <GoogleTagManager gtmId="AW-11472757303" />
    </html>
  );
}
