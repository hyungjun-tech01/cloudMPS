import Link from 'next/link';
import MaterialIcon from './materialIcon';
import clsx from 'clsx';


export function CreateButton({ link, title }: { link: string, title: string }) {
  return (
    <Link
      href={link}
      className="flex h-10 items-center rounded-lg bg-lime-600 px-4 text-base font-medium text-white transition-colors hover:bg-lime-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-500"
    >
      <span className="hidden md:block md:">{title}</span>{' '}
      <MaterialIcon name="add" props="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateButton({ link, disabled }: { link: string, disabled?: boolean }) {
  return (
    <Link
      href={disabled ? "" : link}
      className={clsx("rounded-md px-1 pt-1 border",
        { "text-gray-200 cursor-default": disabled },
        { "hover:bg-gray-100": !disabled },
      )}
    >
      <MaterialIcon name="edit" props="w-6" />
    </Link>
  );
}
