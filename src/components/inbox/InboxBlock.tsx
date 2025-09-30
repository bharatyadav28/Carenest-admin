import { useState } from "react";

import MessageList from "./MessageList";
import Messages from "./Messages";
import CustomSheet from "@/components/common/CustomSheet";

function InboxBlock() {
  const [openMessages, setOpenMessages] = useState(false);
  const myMessages = <Messages />;

  const handleOpenMessages = () => {
    setOpenMessages((prev) => !prev);
  };

  return (
    <div className="  grid grid-cols-12 gap-6 overflow-hidden bg-[#0f0f0f] ">
      <div className="col-start-1 md:col-end-6 col-end-13 card  mr-1 bg-[#000]">
        <MessageList handleOpenMessages={handleOpenMessages} />
      </div>
      <div className="col-start-6 col-end-13 card md:flex flex-grow overflow-y-auto hidden bg-[#000] ml-1">
        {myMessages}
      </div>

      <div>
        <CustomSheet
          open={openMessages}
          handleOpen={handleOpenMessages}
          className="py-10"
        >
          {myMessages}
        </CustomSheet>
      </div>
    </div>
  );
}

export default InboxBlock;
