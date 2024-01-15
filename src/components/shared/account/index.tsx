import "./style.css";
const Account = () => {
  return (
    <div className="flex items-center sm:justify-between gap-1 pr-3">
      <div className="flex flex-col account-info">
        <span className="account-name">ALEX PHAM</span>
        <span className="account-balance flex gap-1">
          20,000,000 <img src="/images/icon-coin.svg" alt="arrow-bg" />
        </span>
      </div>
      <img
        className="user-img"
        src="/images/user.png"
        width={32}
        alt="arrow-bg"
      />
    </div>
  );
};

export default Account;
