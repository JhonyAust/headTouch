import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Subheader from "./subheader";
function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* common header */}
      <ShoppingHeader />
      <Subheader/>
      <main className="flex flex-col w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingLayout;
