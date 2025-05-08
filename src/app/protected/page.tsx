"use client";

export default function ProtectedPage() {
  // const validateApiKey = async (apiKey: string) => {
  //   try {
  //     const response = await fetch("/api/validate-key", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${apiKey}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       notify.apiKey.validate.error();
  //       return false;
  //     }

  //     return true;
  //   } catch {
  //     notify.apiKey.validate.error();
  //     return false;
  //   }
  // };

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-2xl font-semibold mb-4'>Protected Route</h1>
      <p className='text-gray-600'>
        This is a protected route that requires a valid API key to access.
      </p>
    </div>
  );
}
