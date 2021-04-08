import React from "react";
import Styles from "./se-die.module.scss";

const SeDieGuideEN = () => {
    return (
        <div>
            <ul className="game-guide">
                <li className="guide-item">
                    <h2>Giới thiệu</h2>
                    <p className="content">
                        SeDie là trò chơi có nguồn gốc dân gian từ lâu đời, được Saba.club triển khai cho tất cả thị trường trên thế giới.
                        Trò chơi có luật và cách chơi rất đơn giản, chỉ gồm 1 bát úp, 1 đĩa và 4 đồng xu. Trong đó, 4 đồng xu được thiết kế
                        2 mặt đỏ và trắng. Người chơi sẽ đặt cược vào các lựa chọn (cửa) có sẵn. Kết quả thắng thua sẽ phụ thuộc vào số mặt
                        đỏ hoặc trắng được lật của đồng xu sau khi xóc.
                    </p>
                </li>
                <li className="guide-item">
                    <h2>Cách chơi</h2>
                    <ul className="desc">
                        <li>
                            Người chơi chọn mệnh giá và nhấp vào lựa chọn bạn muốn đặt cược trước khi bát được mở. Nếu kết quả mở ra trùng
                            với lựa chọn của bạn, người chơi sẽ thắng và ngược lại sẽ thua toàn bộ tiền cược nếu lựa chọn sai.{" "}
                        </li>
                        <li>
                            Người chơi có thể đặt cược vào nhiều lựa chọn cùng lúc và không bị giới hạn số lần đặt cược. Tổng tiền cược tối
                            đa cho 1 phiên là 2,000. Lưu ý, không thể hủy cược sau khi đặt.
                        </li>
                        <li>
                            Giới hạn cược:
                            <div className="table-container">
                                <table className="table text-center">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Lựa Chọn</th>
                                            <th>Giới Hạn Cược (Min - Max)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td rowSpan={2}>2 cửa chính</td>
                                            <td>Chẵn</td>
                                            <td rowSpan={2}>1 - 2,000</td>
                                        </tr>
                                        <tr>
                                            <td>Lẻ</td>
                                        </tr>
                                        <tr>
                                            <td rowSpan={5}>5 cửa phụ</td>
                                            <td>4 đỏ</td>
                                            <td rowSpan={2}>1 - 500</td>
                                        </tr>
                                        <tr>
                                            <td>4 trắng</td>
                                        </tr>
                                        <tr>
                                            <td>3 đỏ, 1 trắng</td>
                                            <td rowSpan={2}>1 - 2,000</td>
                                        </tr>
                                        <tr>
                                            <td>1 đỏ, 3 trắng</td>
                                        </tr>
                                        <tr>
                                            <td>2 đỏ, 2 trắng</td>
                                            <td>1 - 2,000</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </li>
                        <li>
                            Xu sẽ được xóc và kết quả cửa thắng sẽ được hiển thị khi hết thời gian đặt cược.Thời gian đặt cược cho mỗi phiên
                            sẽ được hiển thị đếm ngược trên bàn chơi.
                        </li>
                    </ul>
                </li>
                <li className="guide-item">
                    <h2>Trả thưởng</h2>
                    <ul className="desc">
                        <li>Hệ thống sẽ tiến hành trả thưởng ngay khi phiên chơi có kết quả.</li>
                        <li>
                            Tỷ lệ trả thưởng đã bao gồm tiền cược.
                            <div className="table-container">
                                <table className="table align-center">
                                    <thead>
                                        <tr>
                                            <th>Lựa Chọn</th>
                                            <th>Điều Kiện Thắng</th>
                                            <th>Mô Tả</th>
                                            <th>Tỷ Lệ Trả Thưởng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td rowSpan={2}>Lẻ</td>
                                            <td>3 đỏ, 1 trắng</td>
                                            <td>
                                                <div className="d-flex justify-content-center">
                                                    <span className="dot-red"></span>
                                                    <span className="dot-red"></span>
                                                    <span className="dot-red"></span>
                                                    <span className="dot-white"></span>
                                                </div>
                                            </td>
                                            <td rowSpan={5}>1:1.96</td>
                                        </tr>
                                        <tr>
                                            <td>1 đỏ, 3 trắng</td>
                                            <td>
                                                <div className="d-flex justify-content-center">
                                                    <span className="dot-red"></span>
                                                    <span className="dot-white"></span>
                                                    <span className="dot-white"></span>
                                                    <span className="dot-white"></span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td rowSpan={3}>Chẵn</td>
                                            <td>4 đỏ</td>
                                            <td>
                                                <div className="d-flex justify-content-center">
                                                    <span className="dot-red"></span>
                                                    <span className="dot-red"></span>
                                                    <span className="dot-red"></span>
                                                    <span className="dot-red"></span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>4 trắng</td>
                                            <td>
                                                <div className="d-flex justify-content-center">
                                                    <span className="dot-white"></span>
                                                    <span className="dot-white"></span>
                                                    <span className="dot-white"></span>
                                                    <span className="dot-white"></span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>2 đỏ, 2 trắng</td>
                                            <td>
                                                <div className="d-flex justify-content-center">
                                                    <span className="dot-red"></span>
                                                    <span className="dot-red"></span>
                                                    <span className="dot-white"></span>
                                                    <span className="dot-white"></span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>4 đỏ</td>
                                            <td>4 đỏ</td>
                                            <td>
                                                <div className="d-flex justify-content-center">
                                                    <span className="dot-red"></span>
                                                    <span className="dot-red"></span>
                                                    <span className="dot-red"></span>
                                                    <span className="dot-red"></span>
                                                </div>
                                            </td>
                                            <td rowSpan={2}>1:1.96</td>
                                        </tr>
                                        <tr>
                                            <td>4 trắng</td>
                                            <td>4 trắng</td>
                                            <td>
                                                <div className="d-flex justify-content-center">
                                                    <span className="dot-white"></span>
                                                    <span className="dot-white"></span>
                                                    <span className="dot-white"></span>
                                                    <span className="dot-white"></span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>3 đỏ, 1 trắng</td>
                                            <td>3 đỏ, 1 trắng</td>
                                            <td>
                                                <div className="d-flex justify-content-center">
                                                    <span className="dot-red"></span>
                                                    <span className="dot-red"></span>
                                                    <span className="dot-red"></span>
                                                    <span className="dot-white"></span>
                                                </div>
                                            </td>
                                            <td rowSpan={2}>1:1.96</td>
                                        </tr>
                                        <tr>
                                            <td>1 đỏ, 3 trắng</td>
                                            <td>1 đỏ, 3 trắng</td>
                                            <td>
                                                <div className="d-flex justify-content-center">
                                                    <span className="dot-red"></span>
                                                    <span className="dot-white"></span>
                                                    <span className="dot-white"></span>
                                                    <span className="dot-white"></span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>2 đỏ, 2 trắng</td>
                                            <td>2 đỏ, 2 trắng</td>
                                            <td>
                                                <div className="d-flex justify-content-center">
                                                    <span className="dot-red"></span>
                                                    <span className="dot-red"></span>
                                                    <span className="dot-white"></span>
                                                    <span className="dot-white"></span>
                                                </div>
                                            </td>
                                            <td>1:1.96</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </li>
                    </ul>
                </li>
                <li className="guide-item">
                    <h2>Bảng thống kê kết quả</h2>
                    <div className="table-container">
                        <table className="table align-center">
                            <thead>
                                <tr>
                                    <th>Kết Quả</th>
                                    <th>Mô Tả</th>
                                    <th>Ký Hiệu</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>4 đỏ</td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            <span className="dot-red"></span>
                                            <span className="dot-red"></span>
                                            <span className="dot-red"></span>
                                            <span className="dot-red"></span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            <span className="dot-white">4</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>4 trắng</td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            <span className="dot-white"></span>
                                            <span className="dot-white"></span>
                                            <span className="dot-white"></span>
                                            <span className="dot-white"></span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            <span className="dot-white">0</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>2 đỏ, 2 trắng</td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            <span className="dot-red"></span>
                                            <span className="dot-red"></span>
                                            <span className="dot-white"></span>
                                            <span className="dot-white"></span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            <span className="dot-white">2</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>3 đỏ, 1 trắng</td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            <span className="dot-red"></span>
                                            <span className="dot-red"></span>
                                            <span className="dot-red"></span>
                                            <span className="dot-white"></span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            <span className="dot-red">3</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>1 đỏ, 3 trắng</td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            <span className="dot-red"></span>
                                            <span className="dot-white"></span>
                                            <span className="dot-white"></span>
                                            <span className="dot-white"></span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            <span className="dot-red">1</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
export default SeDieGuideEN;
