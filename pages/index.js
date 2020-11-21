import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import useDebounce from "../utils/useDebounce";
import useSWR from "swr";

const KEY = "a656cda44d3b4195aa2e6e492de8c7cb";
const fetcher = (url) => fetch(url).then((response) => response.json());

export default function Home() {
   //  const initialData = initail;

   const [inputValue, setInputValue] = useState(0);
   const value = useDebounce(inputValue, 1000);
   console.log("value : ", value);

   const { data } = useSWR(
      `https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/everything?q=${
         value || "man u"
      }&apiKey=${KEY}`,
      // `http://newsapi.org/v2/top-headlines?country=${
      //    value || "th"
      // }&apiKey=${KEY}`,
      fetcher,
      { revalidateOnFocus: false },
   );
   if (data?.status === "error") return <div>error</div>;
   console.log("data : ", data?.articles);

   return (
      <div className="flex justify-center">
         <Head>
            <title>Min News</title>
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <div className="flex flex-col">
            <div className="text-3xl px-4 mb-4 mt-4">
               <h2>Today NEWS</h2>
            </div>
            <div className="px-4 mb-4 mt-4 mx-auto w-full">
               <div className="relative mr-6 my-2 mx-auto w-full">
                  <input
                     onChange={(event) => setInputValue(event.target.value)}
                     type="search"
                     className="bg-purple-white shadow rounded border-0 p-3 w-full"
                     placeholder="Search by news..."
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
                                 src={article.urlToImage}
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
                                       src={article.urlToImage}
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

// export async function getServerSideProps() {
//    const data = await fetcher(
//       `https://newsapi.org/v2/everything?q=${"premier league"}&apiKey=${KEY}`,
//    );
//    return { props: { data } };
// }
