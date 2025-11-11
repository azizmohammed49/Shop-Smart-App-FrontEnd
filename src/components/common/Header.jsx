import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Header() {
  const user = useSelector((state) => state.user.data);
  console.log(user);
  return (
    <header className="bg-white">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link
            to={user?._id ? "/dashboard" : "/login"}
            className="-m-1.5 p-1.5"
          >
            <span className="sr-only">Your Company</span>
            <img
              alt=""
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              className="h-8 w-auto"
            />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <Link
            to="/products"
            className="text-sm/6 font-semibold text-gray-900"
          >
            Products
          </Link>
          <Link
            to="/suppliers"
            className="text-sm/6 font-semibold text-gray-900"
          >
            Suppliers
          </Link>
          <Link to="#" className="text-sm/6 font-semibold text-gray-900">
            Sales
          </Link>
          <Link to="#" className="text-sm/6 font-semibold text-gray-900">
            Purchases
          </Link>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {user?._id ? (
            user?.name
          ) : (
            <Link
              to={user?._id ? "" : "/login"}
              className="text-sm/6 font-semibold text-gray-900"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
