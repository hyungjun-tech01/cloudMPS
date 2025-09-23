import MaterialIcon from '@/app/components/materialIcon';

export type IValueObject = {
  title: string;
  value: string | number;
}

export default function Card({
  title,
  value,
  icon
}: {
  title: string;
  value: number | string | IValueObject[];
  icon?: { name: string, type: string, color?: string };
}) {

  return (
    <div className="flex-1 rounded-xl bg-gray-50 p-2 shadow-sm  border border-gray-300">
      <div className="flex p-4">
        {!!icon && <MaterialIcon name={icon.name} type={icon.type} props={`h-6 w-6 ${icon.color}`} />}
        <h3 className="ml-2 text-base text-sm">{title}</h3>
      </div>
      {typeof value !== 'object' &&
        <p className={`truncate rounded-xl bg-white px-4 py-6 text-center text-2xl`} >
          {value}
        </p>
      }
      {typeof value === 'object' &&
        <div className="flex flex-col bg-white">
          {
            value.map((item, idx) => {
              if (idx === value.length - 1) {
                return (
                  <div key={idx} className="flex-1 flex justify-between truncate rounded-xl px-2 items-center" >
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xl">{item.value}</div>
                  </div>
                );
              } else {
                return (
                  <div key={idx} className="flex-1 flex justify-between truncate rounded-xl bg-white px-2 mb-2 items-center" >
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xl">{item.value}</div>
                  </div>
                )
              }
            })
          }
        </div>
      }
    </div>
  );
}
