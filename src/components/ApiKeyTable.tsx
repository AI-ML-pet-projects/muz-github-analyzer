"use client";

import { FiEye, FiCopy, FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { Database } from "@/types/database.types";

type ApiKey = Database["public"]["Tables"]["api_keys"]["Row"];

interface ApiKeyTableProps {
  apiKeys: ApiKey[];
  visibleKeys: { [key: string]: boolean };
  copiedKeyId: string | null;
  onToggleView: (id: string) => void;
  onCopy: (id: string, key: string) => void;
  onEdit: (key: ApiKey) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

export function ApiKeyTable({
  apiKeys,
  visibleKeys,
  copiedKeyId,
  onToggleView,
  onCopy,
  onEdit,
  onDelete,
  onCreateNew,
}: ApiKeyTableProps) {
  const ActionButtons = ({ apiKey }: { apiKey: ApiKey }) => (
    <div className='flex items-center gap-1'>
      <button
        title={visibleKeys[apiKey.id] ? "Hide" : "Show"}
        className='p-1.5 hover:text-blue-500 transition-colors rounded-full hover:bg-blue-50'
        onClick={() => onToggleView(apiKey.id)}
      >
        <FiEye className='w-4 h-4' />
      </button>
      <button
        title='Copy'
        className={`p-1.5 transition-colors rounded-full hover:bg-blue-50 ${
          copiedKeyId === apiKey.id ? "text-green-600" : "hover:text-blue-500"
        }`}
        onClick={() => onCopy(apiKey.id, apiKey.key)}
      >
        <FiCopy className='w-4 h-4' />
      </button>
      <button
        title='Edit'
        className='p-1.5 hover:text-yellow-500 transition-colors rounded-full hover:bg-yellow-50'
        onClick={() => onEdit(apiKey)}
      >
        <FiEdit2 className='w-4 h-4' />
      </button>
      <button
        title='Delete'
        className='p-1.5 hover:text-red-500 transition-colors rounded-full hover:bg-red-50'
        onClick={() => onDelete(apiKey.id)}
      >
        <FiTrash2 className='w-4 h-4' />
      </button>
    </div>
  );

  return (
    <div className='bg-white rounded-xl shadow-md p-4 sm:p-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
        <div>
          <div className='font-semibold text-lg'>API Keys</div>
          <p className='text-gray-500 text-sm mt-1'>
            Manage your API keys for different environments
          </p>
        </div>
        <button
          onClick={onCreateNew}
          className='bg-blue-100 text-blue-700 rounded-full p-2 hover:bg-blue-200 transition-colors duration-200 flex items-center justify-center sm:self-start'
        >
          <FiPlus className='w-5 h-5' />
        </button>
      </div>

      <div className='text-gray-500 text-sm mb-6'>
        The key is used to authenticate your requests to the Research API. To
        learn more, see the{" "}
        <a href='#' className='underline hover:text-blue-600 transition-colors'>
          documentation
        </a>
        .
      </div>

      {/* Mobile View - Card Layout */}
      <div className='space-y-4 md:hidden'>
        {apiKeys.map((key) => (
          <div
            key={key.id}
            className='bg-white border border-gray-200 rounded-lg p-4 space-y-3'
          >
            <div className='flex items-center justify-between'>
              <h3 className='font-medium text-gray-900'>{key.name}</h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  key.type === "production"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {key.type}
              </span>
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-500'>Usage</span>
                <span className='font-medium'>{key.usage || 0}</span>
              </div>

              <div className='flex items-center justify-between'>
                <div className='font-mono text-sm truncate max-w-[180px]'>
                  {!visibleKeys[key.id]
                    ? key.key.slice(0, 7) +
                      "*".repeat(Math.max(0, key.key.length - 7))
                    : key.key}
                </div>
                <ActionButtons apiKey={key} />
              </div>
            </div>
          </div>
        ))}
        {apiKeys.length === 0 && (
          <div className='text-center py-6 text-gray-500 text-sm'>
            No API keys found. Create one to get started.
          </div>
        )}
      </div>

      {/* Desktop View - Table Layout */}
      <div className='hidden md:block overflow-x-auto -mx-6'>
        <div className='inline-block min-w-full align-middle'>
          <div className='overflow-hidden'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead>
                <tr className='text-gray-500'>
                  <th className='px-6 py-3 text-left text-sm font-medium'>
                    Name
                  </th>
                  <th className='px-6 py-3 text-left text-sm font-medium'>
                    Type
                  </th>
                  <th className='px-6 py-3 text-left text-sm font-medium'>
                    Usage
                  </th>
                  <th className='px-6 py-3 text-left text-sm font-medium'>
                    Key
                  </th>
                  <th className='px-6 py-3 text-right text-sm font-medium'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white'>
                {apiKeys.map((key) => (
                  <tr
                    key={key.id}
                    className='hover:bg-gray-50 transition-colors'
                  >
                    <td className='px-6 py-4 text-sm font-medium text-gray-900'>
                      {key.name}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-900'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          key.type === "production"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {key.type}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-900'>
                      {key.usage || 0}
                    </td>
                    <td className='px-6 py-4 text-sm font-mono'>
                      <div className='flex items-center gap-2 max-w-[300px]'>
                        <code className='truncate'>
                          {!visibleKeys[key.id]
                            ? key.key.slice(0, 7) +
                              "*".repeat(Math.max(0, key.key.length - 7))
                            : key.key}
                        </code>
                      </div>
                    </td>
                    <td className='px-6 py-4 text-sm text-right'>
                      <ActionButtons apiKey={key} />
                    </td>
                  </tr>
                ))}
                {apiKeys.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className='px-6 py-8 text-center text-gray-500 text-sm'
                    >
                      No API keys found. Create one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
