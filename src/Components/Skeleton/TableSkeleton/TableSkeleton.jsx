import React from "react";

function TableSkeleton({colSpan}) {
  return (
    <>
   <tr className="h-9 w-full ">
  <td colSpan={colSpan}>
    <div className="animate-pulse bg-gray-600 h-7 rounded-md  mx-2 " />
  </td>
</tr>

    </>
  );
}

export default TableSkeleton;
