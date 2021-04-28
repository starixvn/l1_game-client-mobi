import React from "react";
import { GameGuide } from "../../../shared/game-base/type";
import { numberWithCommas } from "../../../../helpers/NumberHelper";

const BigSmallGuideVI: React.FC<GameGuide> = (props) => {
    const { gameConfigs, userStakeLevel, gameName } = props;
    const { odds, minbet, maxbet } = gameConfigs;
    const maxBetRound = numberWithCommas(Math.min(userStakeLevel.maxBet, maxbet));
    return (
        <div>
            <ul className="game-guide">
                <li className="guide-item">
                    <h2>Giới thiệu</h2>
                    <p className="content">
                        {gameName} là trò chơi đổ xúc xắc đơn giản, được Saba.club triển khai cho tất cả thị trường trên thế giới. Trò chơi
                        sử dụng 3 viên xúc xắc (xí ngầu) 6 mặt và người chơi sẽ dự đoán xem kết quả là Tài hay Xỉu.
                    </p>
                </li>
                <li className="guide-item">
                    <h2>Cách chơi</h2>
                    <ul className="desc">
                        <li>Người chơi dự đoán tổng điểm xúc xắc bằng cách chọn cửa Tài hoặc Xỉu cùng với mức cược mong muốn.</li>
                        <ul className="detail">
                            <li>Tài: tổng điểm 3 viên xúc xắc &gt;= 11</li>
                            <li>Xỉu: tổng điểm 3 viên xúc xắc &lt;= 10</li>
                        </ul>
                        <li>
                            Người chơi có thể tăng lượng tiền đặt cược bằng cách đặt thêm vào cùng 1 lựa chọn trước khi thời gian đặt cược
                            kết thúc.
                        </li>
                        <li>
                            Số tiền cược phải nằm trong khoảng từ {numberWithCommas(minbet)} đến {numberWithCommas(maxbet)} cho một lần đặt
                            cược và tổng tiền cược tối đa cho 1 phiên là {maxBetRound}
                        </li>
                        <li>
                            Thời gian đặt cược cho mỗi phiên sẽ được hiển thị đếm ngược trên bàn chơi. Khi hết thời gian đặt cược, xúc xắc
                            sẽ bắt đầu lắc và tổng điểm xúc xắc sẽ được hiển thị.
                        </li>
                        <li>
                            Nhà cái cân cửa: trong trường hợp tiền đặt cược giữa 2 cửa chênh lệch nhau, số tiền chênh lệch sẽ được hoàn trả
                            vào tài khoản người chơi đặt cược sau.
                            <p>
                                <strong>Ví dụ:</strong> Người chơi A đặt 100 vào cửa Tài, người chơi B đặt 40 vào cửa Xỉu, người chơi C đặt
                                80 vào cửa Xỉu. Hệ thống sẽ tính toán cân bằng lượng tiền giữa 2 cửa và sẽ trả lại cho C (người chơi đặt
                                cược sau) 20
                            </p>
                        </li>
                    </ul>
                </li>
                <li className="guide-item">
                    <h2>Trả thưởng</h2>
                    <ul className="desc">
                        <li>Hệ thống sẽ tiến hành trả thưởng ngay khi phiên chơi có kết quả.</li>
                        <li>Tỷ lệ trả thưởng khi đặt vào Tài, Xỉu là 1 ăn {odds.big}</li>
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
export default BigSmallGuideVI;
