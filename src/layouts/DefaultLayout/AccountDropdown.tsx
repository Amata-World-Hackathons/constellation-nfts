import { useTronLinkAccount } from "@src/context/TronLink";
import classNames from "classnames";
import Link from "next/link";

const AccountDropdown: React.FC<{ className?: string }> = ({ className }) => {
  const account = useTronLinkAccount();

  if (!account.isLoggedIn) {
    return (
      <button
        className={classNames("btn btn-sm btn-primary gap-2", className)}
        onClick={account.connect}
      >
        Connect
      </button>
    );
  }

  return (
    <div className={classNames("dropdown dropdown-end", className)}>
      <label htmlFor="" tabIndex={0} className="btn btn-sm btn-primary">
        {formatShortName(account.name)}
      </label>

      <ul tabIndex={0} className="dropdown-content menu p-2">
        <li>
          <Link href="/events/new">
            <a>My profile</a>
          </Link>
        </li>
        <li className="divider"></li>
        <li>
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              account.disconnect();
            }}
          >
            Disconnect
          </a>
        </li>
      </ul>
    </div>
  );
};

const SHORT_NAME_LENGTH = 12;
function formatShortName(name: string) {
  return name.length > SHORT_NAME_LENGTH
    ? name.substring(0, SHORT_NAME_LENGTH - 3) + "..."
    : name;
}

export default AccountDropdown;
