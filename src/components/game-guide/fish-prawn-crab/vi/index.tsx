import React from "react";
import { GameGuide } from "../../../shared/game-base/type";
import { numberWithCommas } from "../../../../helpers/number-helper";

const FishPrawnCrabGuideVI: React.FC<GameGuide> = (props) => {
    const { gameConfigs, userStakeLevel, gameName } = props;
    const { odds, minbet, maxbet, choices_maxbet } = gameConfigs;
    const maxBetRound = numberWithCommas(userStakeLevel ? Math.min(userStakeLevel.maxBet, maxbet) : maxbet);
    const maxChoiceRound = numberWithCommas(choices_maxbet.crab);
    return (
        <div>
            <ul className="game-guide">
                <li className="guide-item">
                    <h2>Giới thiệu</h2>
                    <p className="content">
                        {gameName} hay còn gọi là bầu cua tôm cá, là trò chơi dân gian rất phổ biến ở Châu Á. Trò chơi sử dụng 3 viên xúc
                        xắc (xí ngầu) 6 mặt, mỗi mặt sẽ có một biểu tượng (linh vật) ứng với một cửa trên bàn chơi.
                    </p>
                    <div className="icon-wrapper">
                        <div className="symbol-size icon-nai"></div>
                        <div className="symbol-size icon-bau"></div>
                        <div className="symbol-size icon-ga"></div>
                        <div className="symbol-size icon-ca"></div>
                        <div className="symbol-size icon-cua"></div>
                        <div className="symbol-size icon-tom"></div>
                    </div>
                </li>
                <li className="guide-item">
                    <h2>Cách chơi</h2>
                    <ul className="desc">
                        <li>
                            Người chơi có thể đặt cược vào 1 hoặc nhiều linh vật cùng lúc trong cùng 1 lượt chơi và không bị giới hạn số lần
                            đặt cược. Lưu ý, không thể hủy cược sau khi đặt.
                        </li>
                        <li>
                            Số tiền cược phải nằm trong khoảng từ {numberWithCommas(minbet)} đến {maxChoiceRound} cho một lần đặt cược và
                            tổng tiền cược tối đa cho 1 phiên là {maxBetRound}
                        </li>
                        <li>
                            Thời gian đặt cược cho mỗi phiên sẽ được hiển thị đếm ngược trên bàn chơi. Khi hết thời gian đặt cược, xúc xắc
                            sẽ bắt đầu lắc và kết quả sẽ được hiển thị.
                        </li>
                        <li>
                            Người chơi sẽ thắng nếu trong ba viên xúc xắc xuất hiện linh vật mà người chơi đã đặt cược.
                            <ul className="detail">
                                <li>Nếu linh vật được chọn xuất hiện 1 lần &#8658; Tỷ lệ trả thưởng 1 ăn {odds.single}</li>
                                <li>Nếu linh vật được chọn xuất hiện 2 lần &#8658; Tỷ lệ trả thưởng 1 ăn {odds.double}</li>
                                <li>Nếu linh vật được chọn xuất hiện 3 lần &#8658; Tỷ lệ trả thưởng 1 ăn {odds.triple}</li>
                            </ul>
                        </li>
                        <div>
                            <strong>Lưu ý</strong>: Tỷ lệ trả thưởng đã bao gồm tiền cược.
                        </div>
                        <li>
                            Nếu linh vật người chơi chọn không xuất hiện, đồng nghĩa với việc người chơi thua và mất số tiền cược.
                            <div>
                                <strong>Ví dụ:</strong>
                                <ul className="detail">
                                    <li>
                                        Cược 10 vào “Cá” và có một biểu tượng Cá trong kết quả. Tiền thắng{" "}
                                        <strong>{10 * odds.single}</strong>
                                    </li>
                                    <li>
                                        Cược 10 vào “Cua” và có hai biểu tượng Cua trong kết quả. Tiền thắng{" "}
                                        <strong>{10 * odds.double}</strong>
                                    </li>
                                </ul>
                            </div>
                        </li>
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
