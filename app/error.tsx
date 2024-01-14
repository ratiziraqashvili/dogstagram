"use client";

import Link from "next/link";

const Error = () => {
  return (
    <div className="flex items-center justify-center h-[90%] flex-col gap-5">
      <div>
        <h1 className="font-semibold text-2xl">
          Sorry, this page isn&apos;t available.
        </h1>
      </div>
      <div>
        <p>
          The link you followed may be broken, or the page may removed.
          <Link href="/">
            <span className="text-amber-500 cursor-pointer">
              {" "}
              Go back to Instagram.
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Error;
