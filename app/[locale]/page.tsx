import Image from 'next/image';
import mainImage from '@/app/images/mainImage.png';
import getDictionary from '@/app/libs/dictionaries';
import 'material-icons/iconfont/material-icons.css';
import HomeForm from '@/app/components/home-form';

export default async function Page(
  props: {
    params: Promise<{ locale: "ko" | "en" }>;
}) {
  const params = await props.params;
  const trans = await getDictionary(params.locale);
  
  return (
    <main className="flex min-h-screen flex-col">
      <div id="header" className="static flex flex-col flex-0 bg-[#142131] text-lime-50 p-[1rem] justify-center items-center pb-16">
        <div id="logo" className='justify-center items-center mt-16 mb-3'>
          <Image 
            src="/cloudMpsLogo.png"
            width={100}
            height={70}
            alt='Cloud MPS Logo'
          />
        </div>
        <div id="title" className='text-5xl font-semibold mb-10'>Cloud MPS</div>
        <div id="sub_title" className='text-xl flex flex-row justify-center items-center gap-8'>
          <div id="sub_title_intro">{trans.home.intro}</div>
          <div id="sub_title_doc">{trans.home.doc}</div>
        </div>
        <HomeForm trans={trans.home}/>
      </div>
      <div className="flex grow flex-col md:flex-row justify-center items-center bg-[#142131]">
        <div id="mainImage" className='w-full'>
          <Image 
            src={mainImage}
            alt='Improve your business with Cloud MPS'
          />
        </div>
      </div>
      <div className="h-64 flex grow flex-col justify-center items-center bg-white">
        <div className='w-full text-center text-2xl font-semibold mb-4'>
          {trans.home.message_1}
        </div>
        <div className='w-full text-center text-xl'>
          {trans.home.message_2}
        </div>
        <div className='w-full text-center text-xl'>
          {trans.home.message_3}
        </div>
      </div>
    </main>
  );
}
