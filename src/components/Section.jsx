import React from 'react'
import { toTitleCase } from '../assets/utils';

const Section = ({title, items, handler, buttonTitle}) => {
  return (
    <div className="border p-4 mt-4 rounded-xl bg-white">
      <h2 className="text-lg font-semibold text-yellow-500 mb-2">
        {title} ({items.length})
      </h2>
      <ul className="list-decimal list-inside h-48 overflow-auto text-gray-700">
        {items.map((p) => (
          <li key={p.id}>
            {toTitleCase(p.name)} : {p.contact}
          </li>
        ))}
      </ul>
      {handler && (
        <button
          onClick={handler}
          className="mt-3 bg-yellow-400 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
        >
          {buttonTitle}
        </button>
      )}
    </div>
  );
}

export default Section