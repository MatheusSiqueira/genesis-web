import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";

type Props = {
  value: number;
  onChange: (v: number) => void;
  options?: number[];
};

export default function PageSizeSelect({
  value,
  onChange,
  options = [5, 8, 10, 20, 50],
}: Props) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button
          className="inline-flex w-[7.5rem] items-center justify-between gap-2 rounded-xl
                     bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm
                     ring-1 ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <span>{value} / pág</span>
          <ChevronUpDownIcon className="h-5 w-5 text-gray-500" />
        </Listbox.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-150"
          enterFrom="opacity-0 -translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-1"
        >
          <Listbox.Options
            className="absolute z-50 mt-2 w-[10rem] origin-top-right rounded-xl border border-gray-200
                       bg-white p-1 shadow-2xl focus:outline-none"
          >
            {options.map((opt) => (
              <Listbox.Option
                key={opt}
                value={opt}
                className={({ active }) =>
                  `flex cursor-pointer select-none items-center justify-between rounded-lg px-3 py-2 text-sm
                   ${active ? "bg-emerald-50 text-emerald-700" : "text-gray-800"}`
                }
              >
                {({ selected }) => (
                  <>
                    <span>{opt} / pág</span>
                    {selected && <CheckIcon className="h-5 w-5 text-emerald-600" />}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
