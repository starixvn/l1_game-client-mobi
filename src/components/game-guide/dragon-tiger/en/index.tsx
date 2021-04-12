import React from "react";
import Styles from "./dragon-tiger.module.scss";

const DragonTigerGuideEN = () => {
    return (
        <div>
            <ul className="game-guide">
                <li className="guide-item">
                    <h2>Giới thiệu</h2>
                    <p className="content">
                        Rồng Hổ hấp dẫn người chơi với lối chơi khá đơn giản, được Saba.club triển khai cho tất cả thị trường trên thế giới.
                        Trò chơi sử dụng bộ bài tây 52 lá (không bao gồm lá Joker) và sẽ có 3 lựa chọn (cửa) trên bàn chơi: cửa Rồng, cửa Hổ
                        và cửa Hòa. Người chơi sẽ dự đoán kết quả và đặt cược vào lựa chọn mà bạn mong muốn.
                    </p>
                </li>
                <li className="guide-item">
                    <h2>Cách chơi</h2>
                    <ul className="desc">
                        <li>
                            Hai cửa Rồng và Hổ, mỗi cửa sẽ được chia 1 lá bài trong bộ bài 52 lá. Người chơi đặt cược và dự đoán lá bài ở
                            cửa nào sẽ có điểm số cao hơn, hoặc có thể đặt cược vào lựa chọn Hòa nếu dự đoán 2 cửa có kết quả bằng nhau.
                            <div className="table-container">
                                <table className="table text-center">
                                    <thead>
                                        <tr>
                                            <th>Lựa Chọn</th>
                                            <th>Thắng</th>
                                            <th>Thua</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Rồng</td>
                                            <td>Điểm số cửa Rồng lớn hơn cửa Hổ.</td>
                                            <td>Điểm số cửa Hổ lớn hơn cửa Rồng.</td>
                                        </tr>
                                        <tr>
                                            <td>Hổ</td>
                                            <td>Điểm số cửa Hổ lớn hơn cửa Rồng.</td>
                                            <td>Điểm số cửa Rồng lớn hơn cửa Hổ.</td>
                                        </tr>
                                        <tr>
                                            <td>Hoà</td>
                                            <td>Điểm số cửa Rồng bằng cửa Hổ.</td>
                                            <td>Điểm số cửa Rồng khác cửa Hổ.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </li>
                        <li>
                            Thang sức mạnh các lá bài trong Rồng Hổ sẽ được tính dựa trên điểm số của lá bài, không so sánh chất của lá bài.
                        </li>
                        <li>
                            Điểm số các lá bài trong Rồng Hổ sẽ được tính như sau:
                            <div className="table-container">
                                <table className="table text-center">
                                    <thead>
                                        <tr>
                                            <th>Bài</th>
                                            <th>A</th>
                                            <th>2</th>
                                            <th>3</th>
                                            <th>4</th>
                                            <th>5</th>
                                            <th>6</th>
                                            <th>7</th>
                                            <th>8</th>
                                            <th>9</th>
                                            <th>10</th>
                                            <th>J</th>
                                            <th>Q</th>
                                            <th>K</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Điểm</td>
                                            <td>1</td>
                                            <td>2</td>
                                            <td>3</td>
                                            <td>4</td>
                                            <td>5</td>
                                            <td>6</td>
                                            <td>7</td>
                                            <td>8</td>
                                            <td>9</td>
                                            <td>10</td>
                                            <td>11</td>
                                            <td>12</td>
                                            <td>13</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </li>
                        <li>
                            Người chơi có thể đặt cược vào nhiều lựa chọn cùng lúc và không bị giới hạn số lần đặt cược. Tổng tiền cược tối
                            đa cho 1 phiên là 2,000. <strong>Lưu ý</strong>, không thể hủy cược sau khi đặt.
                        </li>
                        <li>
                            Thời gian đặt cược cho mỗi phiên sẽ được hiển thị đếm ngược trên bàn chơi. Khi hết thời gian đặt cược, các lá
                            bài sẽ được lật và kết quả sẽ được hiển thị.
                        </li>
                        <li>Bộ bài 52 lá (không bao gồm lá Joker) sẽ được sử dụng khi bắt đầu phiên mới.</li>
                    </ul>
                </li>
                <li className="guide-item">
                    <h2>Trả thưởng</h2>
                    <ul className="desc">
                        <li>Hệ thống sẽ tiến hành trả thưởng ngay khi phiên chơi có kết quả.</li>
                        <li>
                            Giới hạn cược và tỷ lệ trả thưởng khi đặt vào Rồng, Hổ hoặc Hòa như sau:
                            <div className="table-container">
                                <table className="table text-center">
                                    <thead>
                                        <tr>
                                            <th>Lựa Chọn</th>
                                            <th>
                                                Giới Hạn Cược <br /> (Min - Max)
                                            </th>
                                            <th>Tỷ Lệ Trả Thưởng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Rồng</td>
                                            <td rowSpan={2}>1 - 2,000</td>
                                            <td rowSpan={2}>1:2</td>
                                        </tr>
                                        <tr>
                                            <td>Hổ</td>
                                        </tr>
                                        <tr>
                                            <td>Hoà</td>
                                            <td>1 - 500</td>
                                            <td>1:11</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </li>
                        <li>Trong trường hợp kết quả Hòa, người chơi sẽ mất 50% số tiền cược đặt vào 2 cửa Rồng, Hổ.</li>
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
export default DragonTigerGuideEN;
