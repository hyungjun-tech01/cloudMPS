import clsx from "clsx";
import { ICardSubItem } from "@/app/libs/types";


export default function CardSubItem({data}:{data:ICardSubItem}) {
    const {first, second} = data;

    return (
    <div className='grid grid-cols-2 text-sm gap-4 p-2'>
        <div className='flex flex-col'>
            <div className="mb-2 font-medium">{first.title}</div>
            <div className="text-xl font-semibold text-blue-600">{first.value}</div>
            {!!first.sub && first.sub.map((item, idx) => 
                <div key={idx} className='flex'>
                    <div>{item.title}</div>
                    <div className={clsx("ml-6 font-semibold", item.color?? "")}>{item.value}</div>
                </div>
            )}
        </div>
        <div className='flex flex-col'>
            <div className='mb-2 font-medium'>{second.title}</div>
            {second.value.map((item, idx) => 
                <div key={idx} className='flex justify-between'>
                    <div>{item.title}</div>
                    <div className={clsx('font-semibold', item.color?? "")}>{item.value}</div>
                </div>
            )}
        </div>
    </div>
    );
}