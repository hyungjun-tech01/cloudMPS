import MaterialIcon from '@/app/components/materialIcon';


export default function Card({
  title,
  type,
  value
}: {
  title: string;
  type: "monthyUsage" | "sales" | "as" | "monitor";
  value: Record<string, Record<string, number>>;
}) {

  return (
    <div className="flex-1 rounded-xl bg-gray-50 p-2 shadow-sm  border border-gray-300">
      <div className="flex p-4">
        <MaterialIcon name="circle" props={`h-6 w-6 bg-blue`} />
        <h3 className="ml-2 text-base text-sm">{title}</h3>
      </div>
      <div className="flex flex-col bg-white">
        { Object.keys(value).map((item, idx) => {
          return (
            <div key={idx} className="flex-1 flex justify-between truncate rounded-xl px-2 items-center" >
              <div className="font-medium">첫번째</div>
              <div className="text-xl">두번째</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
