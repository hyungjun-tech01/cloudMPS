import Link from 'next/link';
import Image from 'next/image';
import { Button,Switch } from 'antd';
import mainImage from '@/app/images/mainImage.png';
import 'material-icons/iconfont/material-icons.css';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col">
      <div id="header" className="static flex flex-col flex-0 bg-[#142131] text-lime-50 p-[1rem] justify-center items-center">
        <div id="logo" className='justify-center items-center mt-5 mb-3'>
          <Image 
            src="/cloudMpsLogo.png"
            width={150}
            height={105}
            alt='Cloud MPS Logo'
          />
        </div>
        <div id="title" className='text-4xl font-semibold'>Cloud MPS</div>
        <div id="subItems" className='w-full flex mx-10 my-5 flex-row justify-between items-center'>
          <div id="selectUserType">
            <div>
              Company <Switch /> Personal
            </div>
          </div>
          <div id="selectInfo" className='flex text-xl flex-row justify-between items-center gap-4'>
            <div id="intro">Introduction</div>
            <div id="doc">Documentation</div>
          </div>
          <div id="select_process" className='flex gap-2'>
            <Button className='border-2 border-lime-100 rounded-sm'>Login</Button>
            <Button className='border-2 border-lime-100 rounded-sm'>Register</Button>
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
