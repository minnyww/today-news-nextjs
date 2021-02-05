import "../styles/tailwind.css";
import { IntlProvider } from "react-intl";
import { useRouter } from "next/router";

const messages = {
   en: { search: "Search by news" },
   th: { search: "ค้นหาข่าวใหม่ๆ" },
};

function MyApp({ Component, pageProps }) {
   const { locale } = useRouter();
   return (
      <IntlProvider locale={locale} messages={messages[locale]}>
         <Component {...pageProps} />
      </IntlProvider>
   );
}

export default MyApp;
