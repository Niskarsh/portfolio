import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";

const wrapGtm = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    let gtmId = process.env.NEXT_PUBLIC_GTM_ID;
    let gaId = process.env.NEXT_PUBLIC_GA_ID;
    return (
        <>  
        {gtmId ? <GoogleTagManager gtmId={gtmId} />: null}
            {children}
        {gaId ? <GoogleAnalytics gaId={gaId} />: null}        
        </>
    );
};

export default function AnalyticsProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let Gtm = wrapGtm({ children });
    return (
        <>
            {Gtm}
            {/* Clarity script for user behavior analytics */}
            <Script id="clarity-script" strategy="afterInteractive">
                {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
        `}
            </Script>
        </>
    );
}
