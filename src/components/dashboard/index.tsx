import { Trans, withTranslation } from "next-i18next";
import Head from "next/head";
import { withRouter } from "next/router";
import React from "react";
import { isMobileOnly } from "react-device-detect";
import { AuthorizeResponse, ReCheckInResponse, SSOResponse, UMInfo, Response } from "sc-user-service-client/dist/auth";

import { Props, State } from "./type";
import appSettings from "../../common/app-settings";
import { getLocalStorageItem, localStorageKeys, storeLocalStorageItem } from "../../common/local-storage";
import LandscapeMode from "../../components/landscape-mode";
import { AuthContextProvider } from "../../contexts/auth";
import { GetLocalizedErrorMessage } from "../../helpers/notice-helper";
import { authorize, reCheckIn } from "../../services/auth-service";
import { updateSignInSMStatus, updateThemeSetting } from "../../services/user-setting-service";
import BetSettings from "../bet-settings";
import Games from "../games/games";
import Header from "../header";
import BaseDialog from "../shared/base-dialog";
import { ModalType } from "../shared/base-dialog/type";
import { UserStakeLevel } from "../shared/game-base/type";
import { GameGuideModal } from "./game-guide-modal";
import { HistoryModal } from "./history";
import Register from "./register";
import Welcome from "./welcome";
import Styles from "./dashboard.module.scss";

const orientationType = { portrait: "portrait", landscape: "landscape" };
class Dashboard extends React.PureComponent<Props, State> {
    private mainSocket: WebSocket = null;
    private reCheckInInterval: NodeJS.Timeout;

    constructor(props: Props) {
        super(props);

        this.state = {
            orientation: "",
            enabledWinningStreakNotification: getLocalStorageItem(localStorageKeys.winningStreakNotification) ?? true,
            enabledPlaySound: getLocalStorageItem(localStorageKeys.playSound) ?? false,
            favoriteGames: getLocalStorageItem(localStorageKeys.favoriteGames) ?? [],
            userStakeLevel: { minBet: 0, maxBet: 0 },
            authorizeInfo: null,
            isShowErrorModal: false,
            apiError: null,
            isShowHistory: false,
            isShowGuide: false,
            enabledQuickBet: false,
            betValue: 1,
            isBlockUI: false,
        };

        this.handleFirstLogin = this.handleFirstLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.onSocketConnect = this.onSocketConnect.bind(this);
        this.onSocketData = this.onSocketData.bind(this);
        this.handleKickedOut = this.handleKickedOut.bind(this);
        this.winningStreakNotificationToggle = this.winningStreakNotificationToggle.bind(this);
        this.playSoundToggle = this.playSoundToggle.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.toggleHistoryModal = this.toggleHistoryModal.bind(this);
        this.toggleGuideModal = this.toggleGuideModal.bind(this);
        this.handleUpdateUserStakeLevel = this.handleUpdateUserStakeLevel.bind(this);
        this.updateAuthorizeInfo = this.updateAuthorizeInfo.bind(this);
        this.updateUserBalance = this.updateUserBalance.bind(this);
        this.handleShowApiErrorMessage = this.handleShowApiErrorMessage.bind(this);
        this.toggleHistoryModal = this.toggleHistoryModal.bind(this);
        this.toggleGuideModal = this.toggleGuideModal.bind(this);
        this.updateFavoriteGames = this.updateFavoriteGames.bind(this);
        this.setEnabledQuickBet = this.setEnabledQuickBet.bind(this);
        this.setBetValue = this.setBetValue.bind(this);

        const buildId = process.env.buildVersion;
        const buildVersion = getLocalStorageItem(localStorageKeys.buildVersion) ?? 0;
        if (buildId !== buildVersion) {
            storeLocalStorageItem(localStorageKeys.buildVersion, buildId);
            buildVersion && location.reload();
        }
    }

    updateFavoriteGames(favoriteGames: number[]) {
        this.setState({
            favoriteGames: favoriteGames,
        });
        storeLocalStorageItem(localStorageKeys.favoriteGames, favoriteGames);
    }

    updateAuthorizeInfo(authorizeInfo: AuthorizeResponse) {
        this.setState({ authorizeInfo, enabledQuickBet: authorizeInfo?.user?.settings?.quickBet });
    }

    updateUserBalance(balance: number) {
        const authorizeInfo = { ...this.state.authorizeInfo };
        if (authorizeInfo && authorizeInfo.authorized && authorizeInfo.user.red !== balance) {
            authorizeInfo.user.red = balance;
            this.setState({ authorizeInfo });
        }
    }

    handleShowApiErrorMessage(errorCode: string) {
        this.setState({ isShowErrorModal: true, isBlockUI: false, apiError: { errorCode, message: GetLocalizedErrorMessage(errorCode) } });
    }

    signOut() {
        this.props.router.push("/timeout");
    }

    handleRecheckInResponse(response: ReCheckInResponse) {
        if (!response || !response.isSuccessful) {
            this.signOut();
        } else {
            if (response.apiError) {
                response.isDisableAccount &&
                    setTimeout(() => {
                        this.signOut();
                    }, 10000);

                this.handleShowApiErrorMessage(response.apiError.errorCode);
            } else {
                this.updateUserBalance(response.balance);
            }
        }
    }

    async componentDidMount() {
        this.mainSocket = this.connectMainSocket();
        const authorizeResponse = await authorize(this.props.session);
        const errorResponse = authorizeResponse as Response;

        if (errorResponse && errorResponse.errorCode == "SB0002") {
            this.props.router.push("/timeout");
            return;
        }

        const authorizeInfo = authorizeResponse as AuthorizeResponse;

        this.updateAuthorizeInfo(authorizeInfo);

        if (authorizeInfo?.user?.offerGames && authorizeInfo?.user?.offerGames.length === 0) {
            this.setState({
                apiError: {
                    message: "messages:noGameOffer",
                    errorCode: "",
                },
                isShowErrorModal: true,
                isBlockUI: true,
            });

            return;
        }

        this.updateUserBalance(authorizeInfo?.user?.red);

        this.reCheckInInterval = setInterval(async () => {
            const reCheckInResponse = await reCheckIn(this.props.session);
            this.handleRecheckInResponse(reCheckInResponse);
        }, 60 * 1000);

        const mediaQueryList = window.matchMedia("(orientation: portrait)");
        const handleOrientation = (e) => {
            if (e.matches) {
                this.setState({ orientation: "portrait" });
            } else {
                this.setState({ orientation: "landscape" });
            }
        };

        mediaQueryList?.addEventListener
            ? mediaQueryList.addEventListener("change", handleOrientation)
            : mediaQueryList.addListener(handleOrientation);

        if (authorizeInfo.authorized) {
            this.onSocketConnect();
        }
    }

    componentWillUnmount() {
        this.mainSocket.close();
        clearInterval(this.reCheckInInterval);
    }

    sendMessage(data: any) {
        this.mainSocket.readyState === 1 && this.mainSocket.send(JSON.stringify(data));
    }

    connectMainSocket() {
        const { proxy } = appSettings;
        const socketUri = `${proxy.ssl ? "wss" : "ws"}://${proxy.uri + proxy.path}/main/websocket`;
        const socket = new WebSocket(socketUri);
        socket.onmessage = this.onSocketData;

        return socket;
    }

    onSocketConnect() {
        const { session } = this.props;
        const authentication = { username: session.username, data: session };
        setTimeout(() => {
            this.sendMessage({ authentication });
        }, 500);
    }

    onSocketData(message: any) {
        const data = JSON.parse(message.data);
        if (data.kickedOut) {
            this.handleKickedOut(data.kickedOut);
        }

        if (data.apiError) {
            this.setState({ isShowErrorModal: true, isBlockUI: false, apiError: data.apiError.errorCode });
        }

        if (data.userStakeLevel) {
            this.handleUpdateUserStakeLevel(data.userStakeLevel);
        }
    }

    handleUpdateUserStakeLevel(userStakeLevel: UserStakeLevel) {
        this.setState({ userStakeLevel: userStakeLevel });
    }

    handleKickedOut(data: any) {
        const { umInfo } = data;
        const { router, setIsUm } = this.props;

        if (umInfo) {
            this.reCheckInInterval && clearInterval(this.reCheckInInterval);
            storeLocalStorageItem<UMInfo>(localStorageKeys.umInfo, umInfo);
            setTimeout(() => {
                setIsUm(true);
            }, 500);
        } else {
            router.push("/timeout");
        }
    }

    handleFirstLogin(theme: string) {
        const { session } = this.props;
        const authorizeInfo = { ...this.state.authorizeInfo };
        if (authorizeInfo && authorizeInfo.authorized) {
            updateSignInSMStatus(session);
            updateThemeSetting(session, theme);

            authorizeInfo.user.settings = { theme };
            authorizeInfo.user.isSignedInSM = true;

            this.updateAuthorizeInfo(authorizeInfo);
        }
    }

    handleRegister(authorizeInfo: AuthorizeResponse) {
        const { session } = this.props;

        updateSignInSMStatus(session);
        authorizeInfo.user.isSignedInSM = true;
        updateThemeSetting(session, authorizeInfo.user.settings.theme);

        this.updateAuthorizeInfo(authorizeInfo);
        this.onSocketConnect();
    }

    winningStreakNotificationToggle() {
        const { enabledWinningStreakNotification } = this.state;
        this.setState({ enabledWinningStreakNotification: !enabledWinningStreakNotification });
        storeLocalStorageItem(localStorageKeys.winningStreakNotification, !enabledWinningStreakNotification);
    }

    playSoundToggle() {
        const { enabledPlaySound } = this.state;
        this.setState({ enabledPlaySound: !enabledPlaySound });
        storeLocalStorageItem(localStorageKeys.playSound, !enabledPlaySound);
    }

    setEnabledQuickBet(enabled: boolean) {
        this.setState({ enabledQuickBet: enabled });
    }

    setBetValue(value: number) {
        this.setState({ betValue: value });
    }

    closeDialog() {
        this.setState({ isShowErrorModal: false });
    }

    toggleHistoryModal() {
        this.setState({ isShowHistory: !this.state.isShowHistory });
    }

    toggleGuideModal() {
        this.setState({ isShowGuide: !this.state.isShowGuide });
    }

    renderDashBoard() {
        const {
            enabledWinningStreakNotification,
            enabledPlaySound,
            isShowErrorModal,
            isShowHistory,
            isShowGuide,
            userStakeLevel,
            favoriteGames,
            authorizeInfo,
            enabledQuickBet,
            betValue,
            isBlockUI,
        } = this.state;
        const authContextValue = { session: this.props.session, setBalance: this.updateUserBalance };
        const offerGames: number[] = authorizeInfo.user.offerGames.map((game: any) => game?.gameId);
        return (
            <AuthContextProvider value={authContextValue}>
                <div className={Styles["dashboard"]}>
                    <Header
                        user={authorizeInfo.user}
                        enabledNotification={enabledWinningStreakNotification}
                        enabledSound={enabledPlaySound}
                        onToggleNotification={this.winningStreakNotificationToggle}
                        onToggleSound={this.playSoundToggle}
                        toggleHistoryModal={this.toggleHistoryModal}
                        toggleGuideModal={this.toggleGuideModal}
                        favoriteGames={favoriteGames}
                        offerGames={offerGames}
                        updateFavoriteGames={this.updateFavoriteGames}
                        enabledQuickBet={enabledQuickBet}
                        updateEnabledQuickBet={this.setEnabledQuickBet}
                    />
                    <Games
                        enabledQuickBet={enabledQuickBet}
                        betValue={betValue}
                        enabledWinningStreakNotification={enabledWinningStreakNotification}
                        enabledPlaySound={enabledPlaySound}
                        setApiErrorMessage={this.handleShowApiErrorMessage}
                        userStakeLevel={userStakeLevel}
                        updateUserStakeLevel={this.handleUpdateUserStakeLevel}
                        updateFavoriteGames={this.updateFavoriteGames}
                        favoriteGames={favoriteGames}
                        userOfferGames={offerGames}
                        queryGame={this.props.queryGame}
                    />
                    <BetSettings
                        enabledQuickBet={enabledQuickBet}
                        updateEnabledQuickBet={this.setEnabledQuickBet}
                        updateBetValue={this.setBetValue}
                        enabledSound={enabledPlaySound}
                        user={authorizeInfo.user}
                    />
                    {isShowHistory && <HistoryModal onCloseModal={this.toggleHistoryModal} offerGames={offerGames} />}
                    {isShowGuide && (
                        <GameGuideModal
                            userStakeLevel={userStakeLevel}
                            onCloseModal={this.toggleGuideModal}
                            offerGames={offerGames}
                            user={authorizeInfo.user}
                        />
                    )}
                    {isShowErrorModal && (
                        <div className={Styles["container-modal"]}>
                            <div className={`${Styles["bg-opacity"]} ${isBlockUI ? Styles["block-ui-backdrop"] : ""}`}></div>
                            <BaseDialog
                                type={ModalType.Center}
                                isOpen={isShowErrorModal}
                                onCloseModal={this.closeDialog}
                                isBlockUI={isBlockUI}
                            >
                                <div className={`modal-center ${isBlockUI ? Styles["block-ui-message"] : ""}`}>
                                    <div className={`icon-warning modal-icon-warning`}></div>
                                    {!isBlockUI && <div className={`icon-close modal-icon-close`} onClick={this.closeDialog}></div>}

                                    <Trans t={this.props.t}>
                                        {this.props.t(this.state.apiError?.message, { errorCode: this.state.apiError?.errorCode })}
                                    </Trans>
                                </div>
                            </BaseDialog>
                        </div>
                    )}
                </div>
            </AuthContextProvider>
        );
    }

    renderComponents(authorizeInfo: AuthorizeResponse) {
        const { authorized, user } = authorizeInfo;
        if (authorized) {
            return user.isSignedInSM ? (
                this.renderDashBoard()
            ) : (
                <Welcome userInfo={this.state.authorizeInfo.user} handleFirstLoginSM={this.handleFirstLogin} />
            );
        }

        return <Register session={this.props.session} handleStateLogin={this.handleRegister} />;
    }

    render() {
        const { orientation, authorizeInfo } = this.state;

        if (orientation === orientationType.landscape && isMobileOnly) {
            return <LandscapeMode />;
        }

        return authorizeInfo ? (
            <>
                <Head>
                    <script async src="https://www.googletagmanager.com/gtag/js?id=G-MRWMQHR3Z9"></script>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', 'G-MRWMQHR3Z9', {
                            page_path: window.location.pathname,
                            });
                        `,
                        }}
                    />
                </Head>
                {this.renderComponents(authorizeInfo)}
            </>
        ) : (
            <></>
        );
    }
}

export default withRouter(withTranslation()(Dashboard));
