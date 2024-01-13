import Image from "next/image";

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <div className="flex justify-center items-center flex-1">
        <Image src="/main-logo.png" alt="Logo" width={170} height={170} />
      </div>
      <div className="flex flex-col pb-5 -space-y-2">
        <div className="text-center">
          <span className="text-muted-foreground">from</span>
        </div>
        <div className="flex items-center -space-x-2 pr-4">
          <Image className="text-yellow-800" src="/main-logo.png" alt="Logo" width={50} height={50} />
          <p className="bg-gradient-to-r from-amber-400 to-amber-700 bg-clip-text text-transparent font-semibold text-xl">Rati</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
