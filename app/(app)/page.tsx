


export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-10 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>WELCOME TO SHADOW TALKS</h1>
      <div className="text-center max-w-md space-y-4">
        <h2 className="text-xl font-semibold">How It Works</h2>
        <ol className="list-decimal list-inside text-left space-y-2">
          <li>Create an account to get started.</li>
          <li>Share your unique URL with your friends.</li>
          <li>Receive anonymous messages from your friends.</li>
        </ol>
        <p className="mt-10">Created by Ayman :{')'}</p>
        <p>https://github.com/ayman2109</p>

      </div>
      
    </div>
  );
}
