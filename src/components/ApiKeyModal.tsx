import { useState } from "react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: {
    name: string;
    type: "production" | "development";
    monthlyLimit?: number;
  }) => void;
  editingKey?: {
    name: string;
    type: "production" | "development";
    monthlyLimit?: number;
  } | null;
}

export function ApiKeyModal({
  isOpen,
  onClose,
  onSubmit,
  editingKey,
}: ApiKeyModalProps) {
  const [form, setForm] = useState({
    name: editingKey?.name || "",
    type: editingKey?.type || ("development" as "production" | "development"),
    monthlyLimit: editingKey?.monthlyLimit || 1000,
    limitEnabled: editingKey?.monthlyLimit !== undefined,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: form.name,
      type: form.type,
      monthlyLimit: form.limitEnabled ? form.monthlyLimit : undefined,
    });
  };

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto'>
        <div className='p-6 space-y-6'>
          <div>
            <h2 className='text-xl font-semibold'>
              {editingKey ? "Edit API Key" : "Create a new API key"}
            </h2>
            <p className='text-gray-600 text-sm mt-1'>
              Enter a name and limit for the new API key.
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Key Name
                <span className='text-gray-500 font-normal'>
                  {" "}
                  — A unique name to identify this key
                </span>
              </label>
              <input
                type='text'
                name='name'
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow'
                placeholder='Key Name'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-3'>
                Key Type
                <span className='text-gray-500 font-normal'>
                  {" "}
                  — Choose the environment for this key
                </span>
              </label>
              <div className='space-y-3'>
                <label className='flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors'>
                  <input
                    type='radio'
                    name='type'
                    value='production'
                    checked={form.type === "production"}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        type: e.target.value as "production" | "development",
                      })
                    }
                    className='text-blue-500 focus:ring-blue-500'
                  />
                  <div>
                    <div className='font-medium'>Production</div>
                    <div className='text-sm text-gray-500'>
                      Rate limited to 1,000 requests/minute
                    </div>
                  </div>
                </label>
                <label className='flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors'>
                  <input
                    type='radio'
                    name='type'
                    value='development'
                    checked={form.type === "development"}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        type: e.target.value as "production" | "development",
                      })
                    }
                    className='text-blue-500 focus:ring-blue-500'
                  />
                  <div>
                    <div className='font-medium'>Development</div>
                    <div className='text-sm text-gray-500'>
                      Rate limited to 100 requests/minute
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                <input
                  type='checkbox'
                  checked={form.limitEnabled}
                  onChange={(e) =>
                    setForm({ ...form, limitEnabled: e.target.checked })
                  }
                  className='rounded text-blue-500 focus:ring-blue-500'
                />
                Limit monthly usage*
              </label>
              {form.limitEnabled && (
                <input
                  type='number'
                  value={form.monthlyLimit}
                  onChange={(e) =>
                    setForm({ ...form, monthlyLimit: parseInt(e.target.value) })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow'
                  placeholder='Monthly limit'
                  min='1'
                />
              )}
              <p className='text-xs text-gray-500 mt-2'>
                * If the combined usage of all your keys exceeds your
                plan&apos;s limit, all requests will be rejected.
              </p>
            </div>

            <div className='flex justify-end gap-3 pt-4 border-t'>
              <button
                type='button'
                onClick={onClose}
                className='px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium'
              >
                {editingKey ? "Save Changes" : "Create Key"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
