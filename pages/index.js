import Head from "next/head";
import { useState } from "react";
import useDebounce from "../utils/useDebounce";
import useSWR from "swr";
import { useRouter } from "next/router";

import Link from "next/link";
import { useIntl } from "react-intl";

const KEY = "07253f8fb74c8a5e470a4c59c5c150e0";
const fetcher = (url) => fetch(url).then((response) => response.json());

export default function Home({ data: initialData }) {
   //  const initialData = initail;

   const { locale, locales } = useRouter();
   const { formatMessage: f } = useIntl();
   console.log("locale : ", locale);
   const [inputValue, setInputValue] = useState("");
   const value = useDebounce(inputValue, 400);

   const { data } = useSWR(
      `https://gnews.io/api/v4/search?q=${value || "covid"}&token=${KEY}`,
      fetcher,
      {
         revalidateOnFocus: false,
         initialData: value ? undefined : initialData,
      },
   );
   if (data?.status === "error") return <div>error</div>;

   return (
      <div className="flex justify-center">
         <ul>
            {locales.map((loc) => (
               <li key={loc}>
                  <Link href="/" locale={loc}>
                     <a>{loc}</a>
                  </Link>
               </li>
            ))}
         </ul>
         <Head>
            <title>Min News</title>
            <link rel="icon" href="/favicon.ico" />
            <script
               data-ad-client="ca-pub-9048050181020642"
               async
               src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            ></script>
         </Head>
         <div className="flex flex-col">
            <div className="text-3xl px-4 mb-4 mt-4">
               <h2>Today NEWS</h2>
            </div>
            <div className="px-4 mb-4 mt-4  w-full">
               <div className="relative mr-6 my-2  w-full">
                  <input
                     onChange={(event) => setInputValue(event.target.value)}
                     type="search"
                     className="bg-purple-white shadow rounded border-0 p-3 w-full"
                     placeholder={f({ id: "search" })}
                  />
                  <div className="absolute pin-r pin-t mt-3 mr-4 text-purple-lighter"></div>
               </div>
            </div>
            {!data && "loading..."}
            {data?.articles.length > 0 &&
               data?.articles.map((article, index) => {
                  return (
                     <div
                        className="mx-auto px-4 max-w-xl my-2"
                        key={index}
                        onClick={() => (window.location.href = article?.url)}
                     >
                        <div className="bg-white shadow-2xl rounded-lg mb-6 tracking-wide">
                           <div className="md:flex-shrink-0">
                              <img
                                 // width="120"
                                 // height="120"
                                 src={article.image}
                                 alt="mountains"
                                 className="w-full h-64 rounded-lg rounded-b-none"
                              />
                           </div>
                           <div className="px-4 py-2 mt-2">
                              <h2 className="font-bold text-2xl text-gray-800 tracking-normal">
                                 {article?.title}
                              </h2>
                              <p className="text-sm text-gray-700 px-2 mr-1">
                                 {article?.description}
                              </p>

                              <div className="author flex items-center -ml-3 my-3">
                                 <div className="user-logo">
                                    <img
                                       className="w-12 h-12 object-cover rounded-full mx-4  shadow"
                                       src={article.image}
                                       alt="avatar"
                                    />
                                 </div>
                                 <h2 className="text-sm tracking-tighter text-gray-900">
                                    <a href="#">By {article?.source?.name}</a>{" "}
                                    <span className="text-gray-600">
                                       {new Date(
                                          article?.publishedAt,
                                       ).toLocaleString()}
                                    </span>
                                 </h2>
                              </div>
                           </div>
                        </div>
                     </div>
                  );
               })}{" "}
         </div>
      </div>
   );
}

export async function getServerSideProps() {
   const data = await fetcher(
      `https://gnews.io/api/v4/search?q=${"covid"}&token=${KEY}`,
   );
   return { props: { data } };
}
