import React from "react";
import { Backdrop, BrowserShot, Headline, Highlight, Shot } from "../lib/ui";
import { BUYERS as B } from "../lib/timing";

export const SceneBuyers: React.FC = () => (
  <Backdrop>
    <Headline
      text="Xem ai thật sự đang nhập khẩu sản phẩm của bạn."
      sub="Dữ liệu vận đơn nhập khẩu Mỹ và tờ khai hải quan Việt Nam."
      subDelay={30}
      size={56}
    />
    <BrowserShot
      top={235}
      url="openbtob.com/search?q=0901"
      focus={[
        { f: 0, x: 960, y: 300, z: 1.0 },
        { f: 40, x: 900, y: 420, z: 1.03 },
        { f: 110, x: 900, y: 520, z: 1.03 },
        { f: 130, x: 900, y: 520, z: 1.03 },
        { f: 150, x: 780, y: 330, z: 1.0 },
        { f: 220, x: 780, y: 520, z: 1.03 },
        { f: 255, x: 780, y: 640, z: 1.0 },
      ]}
    >
      <Shot file="search-0901.png" to={B.swapCompany + 3} fade={3} />
      <Shot file="company.png" from={B.swapCompany} fade={3} />
      <Highlight x={408} y={374} w={302} h={22} from={B.popCount} to={B.popRows + 20} label="135 người mua cho 0901" labelSide="bottom" />
      <Highlight x={412} y={462} w={1096} h={90} from={B.popRows} to={B.swapCompany - 2} label="Doanh nghiệp nhập khẩu thật" labelSide="bottom" />
      <Highlight x={408} y={147} w={388} h={22} from={B.popMeta} to={225} label="Có nguồn và ngày dữ liệu" labelSide="bottom" />
      <Highlight x={428} y={500} w={500} h={140} from={B.popTop} to={255} />
      <Highlight x={428} y={745} w={500} h={170} from={B.popSuppliers} to={255} />
    </BrowserShot>
  </Backdrop>
);
