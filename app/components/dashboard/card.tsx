import { ICardSubItem } from '@/app/libs/types';
import CardSubItem from './cardSubItem';
import MaterialIcon from '@/app/components/materialIcon';


export default function Card({
  title,
  value
}: {
  title: string;
  value: ICardSubItem[];
}) {

  return (
    <div className="flex-col justify-start rounded-xl bg-slate-100 p-2 shadow-sm border border-slate-300">
      <div className="flex-none flex p-2 border-b border-slate-300">
        <MaterialIcon name="circle" props={`h-4 w-4 text-sky-600`} />
        <h3 className="ml-8 text-base font-medium">{title}</h3>
      </div>
      <div className="grow flex-col justify-between gap-2 mt-2">
        {value.map((item, idx) => 
          <CardSubItem key={idx} data={item} />
        )}
      </div>
    </div>
  );
}
