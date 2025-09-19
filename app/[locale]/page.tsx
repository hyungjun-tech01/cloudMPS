import Image from 'next/image';
import { Button,Switch } from 'antd';
import mainImage from '@/app/images/mainImage.png';
import 'material-icons/iconfont/material-icons.css';

import getDictionary from '@/app/libs/dictionaries';

export default async function Page(
  props: {
    params: Promise<{ locale: "ko" | "en" }>;
}) {
  const params = await props.params;
  const trans = await getDictionary(params.locale);
  
  return (
    <main className="flex min-h-screen flex-col">
      <div id="header" className="static flex flex-col flex-0 bg-[#142131] text-lime-50 p-[1rem] justify-center items-center">
        <div id="logo" className='justify-center items-center mt-5 mb-3'>
          <Image 
            src="/cloudMpsLogo.png"
            width={100}
            height={70}
            alt='Cloud MPS Logo'
          />
        </div>
        <div id="title" className='text-4xl font-semibold'>Cloud MPS</div>
        <div id="subItems" className='w-full flex mx-10 my-5 flex-row justify-between items-center'>
          <div id="selectUserType">
            <div>
              {trans.login.company_user} <Switch /> {trans.login.personal_user}
            </div>
          </div>
          <div id="selectInfo" className='flex text-xl flex-row justify-between items-center gap-4'>
            <div id="intro">{trans.login.intro}</div>
            <div id="doc">{trans.login.doc}</div>
          </div>
          <div id="select_process" className='flex gap-2'>
            <Button className='border-2 border-lime-100 rounded-sm'>{trans.login.login}</Button>
            <Button className='border-2 border-lime-100 rounded-sm'>{trans.login.register}</Button>
          </div>
        </div>
      </div>
      <div className="flex grow flex-col md:flex-row justify-center items-center bg-[#142131]">
        <div id="mainImage" className='w-full'>
          <Image 
            src={mainImage}
            alt='Improve your business with Cloud MPS'
          />
        </div>
      </div>
    </main>
  );
}
