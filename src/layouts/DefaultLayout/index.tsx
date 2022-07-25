import Link from "next/link";
import AccountDropdown from "./AccountDropdown";
// import AccountDropdown from "./AccountDropdown";

export function applyDefaultLayout(page: React.ReactNode) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="navbar px-6">
        <div className="flex-1">
          <ul className="menu menu-horizontal">
            <li>
              <Link href="/">
                <a className="uppercase">Constellation NFTs</a>
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex-none ml-8">
          <ul className="menu menu-horizontal mr-4">
            <li>
              <Link href="/nfts">
                <a>Explore</a>
              </Link>
            </li>
            <li>
              <Link href="/collabs">
                <a>Collaborations</a>
              </Link>
            </li>
            <li>
              <Link href="/collections/create">
                <a>Create</a>
              </Link>
            </li>
          </ul>

          <AccountDropdown />
        </div>
      </header>

      <main className="flex-1">{page}</main>

      <footer className="mt-16 text-sm">
        <div className="pt-12 pb-4 flex flex-row items-center justify-between w-full max-w-6xl m-auto">
          <div>Constellation NFTs</div>
        </div>
      </footer>
    </div>
  );
}
