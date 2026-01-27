// import { useState } from "react";

import ProfilePic from "@/assets/profilepic1.png";
import DP from "../common/DP";
import { cdnURL } from "@/lib/resuable-data";
// import ActionDialog from "@/components/common/ActionDialog";

interface Props {
  name?: string;
  avatar?: string;
}
function NameHeader({ name, avatar }: Props) {
  // const [openDeleteDialog, setOpenDialog] = useState(false);



  return (
    <>
      <div className="flex justify-between items-center border-b border-dashed border-[#EEEEEE] pb-4">
        <div className="flex gap-3 items-center">
          <DP url={avatar ? `${cdnURL}${avatar}` : ProfilePic} alt="Me" />
          <div className="text-lg font-medium">
            {name ? name : "William James"}
          </div>
        </div>
    
      </div>

      {/* <ActionDialog
        open={openDeleteDialog}
        handleOpen={handleOpen}
        icon={binIconTheme}
        confirmText="Delete"
        handleConfirm={() => {}}
        heading="Chat Deletion"
        subheading="Are you sure you want to delete your chat?"
      /> */}
    </>
  );
}

export default NameHeader;
