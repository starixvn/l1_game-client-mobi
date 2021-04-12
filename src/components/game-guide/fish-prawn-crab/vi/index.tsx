import React from "react";
import Styles from "./fish-prawn-crab.module.scss";

const FishPrawnCrabGuideVI = () => {
    return (
        <div>
            <ul className="game-guide">
                <li className="guide-item">
                    <h2>Giới thiệu</h2>
                    <p className="content">
                        Bầu Cua hay còn gọi là bầu cua tôm cá, là trò chơi dân gian rất phổ biến ở Châu Á, được Saba.club triển khai cho tất
                        cả thị trường trên thế giới. Trò chơi sử dụng 3 viên xúc xắc (xí ngầu) 6 mặt, mỗi mặt sẽ có một biểu tượng (linh
                        vật) ứng với một cửa trên bàn chơi.
                    </p>
                </li>
                <li className="guide-item">
                    <h2>Cách chơi</h2>
                    <ul className="desc">
                        <li>
                            Người chơi có thể đặt cược vào 1 hoặc nhiều linh vật cùng lúc trong cùng 1 lượt chơi và không bị giới hạn số lần
                            đặt cược. Lưu ý, không thể hủy cược sau khi đặt.
                        </li>
                        <li>
                            Số tiền cược phải nằm trong khoảng từ 1 đến 2,000 cho một lần đặt cược và tổng tiền cược tối đa cho 1 phiên là
                            2,000
                        </li>
                        <li>
                            Thời gian đặt cược cho mỗi phiên sẽ được hiển thị đếm ngược trên bàn chơi. Khi hết thời gian đặt cược, xúc xắc
                            sẽ bắt đầu lắc và kết quả sẽ được hiển thị.
                        </li>
                        <li>
                            Người chơi sẽ thắng nếu trong ba viên xúc xắc xuất hiện linh vật mà người chơi đã đặt cược.
                            <ul className="detail">
                                <li>Nếu linh vật được chọn xuất hiện 1 lần &#8658; Tỷ lệ trả thưởng 1 ăn 2</li>
                                <li>Nếu linh vật được chọn xuất hiện 2 lần &#8658; Tỷ lệ trả thưởng 1 ăn 3.5</li>
                                <li>Nếu linh vật được chọn xuất hiện 3 lần &#8658; Tỷ lệ trả thưởng 1 ăn 6</li>
                            </ul>
                        </li>
                        <li>Nếu linh vật người chơi chọn không xuất hiện, đồng nghĩa với việc người chơi thua và mất số tiền cược.</li>
                    </ul>
                </li>
                <li className="guide-item">
                    <h2>Trả thưởng</h2>
                    <ul className="desc">
                        <li>Hệ thống sẽ tiến hành trả thưởng ngay khi phiên chơi có kết quả.</li>
                        <li>Tỷ lệ trả thưởng đã bao gồm tiền cược.</li>
                    </ul>
                </li>
                <li className="guide-item">
                    <h2>Các quy định trong game</h2>
                    <ul className="game-rules">
                        <li className="rule">
                            Công ty có quyền hủy hoặc làm mất hiệu lực đối với mọi lượt cược trong trường hợp hệ thống xảy ra bất kỳ lỗi kỹ
                            thuật nào, bao gồm nhưng không hạn chế bởi các lỗi về phần mềm, phần cứng hoặc mạng kết nối.
                        </li>
                        <li className="rule">
                            Công ty có quyền hủy hoặc làm mất hiệu lực đối với mọi lượt cược khi nghi ngờ khách hàng có những hoạt động gian
                            lận, tham gia lừa đảo, câu kết, rửa tiền hay các hoạt động bất hợp pháp khác.
                        </li>
                        <li className="rule">
                            Công ty có quyền hủy hoặc làm mất hiệu lực mọi lượt cược khi có lỗi (thuộc về con người hay yếu tố khác) hoặc sự
                            cố hệ thống dẫn đến việc sử dụng sai tỷ lệ trả thưởng.
                        </li>
                        <li className="rule">
                            Tất cả các lượt cược vào các phiên cược đã được chấp nhận vẫn sẽ có hiệu lực ngay cả khi sau đó thành viên đăng
                            xuất hoặc bị ngắt kết nối khỏi hệ thống game vì bất kỳ lý do gì.
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    );
};
export default FishPrawnCrabGuideVI;
